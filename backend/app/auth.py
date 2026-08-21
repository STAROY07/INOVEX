import os
import logging
from datetime import datetime, timedelta
from typing import Optional
import bcrypt
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .database import get_db
from . import models

logger = logging.getLogger("inovex.auth")

SECRET_KEY = os.getenv("SECRET_KEY") or "inovex_super_secret_jwt_key_startup_2026_india"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a password against a hash.
    First attempts native bcrypt check for optimal performance and compatibility,
    with a graceful fallback to passlib context.
    """
    if not plain_password or not hashed_password:
        return False
    
    # Try native bcrypt verification first
    try:
        if hashed_password.startswith(("$2a$", "$2b$", "$2y$", "$2x$")):
            return bcrypt.checkpw(
                plain_password.encode("utf-8"),
                hashed_password.encode("utf-8")
            )
    except Exception as exc:
        logger.debug(f"Direct bcrypt verification exception: {exc}")
    
    # Fallback to passlib
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as exc:
        logger.error(f"Passlib verification exception: {exc}")
        return False

def get_password_hash(password: str) -> str:
    """
    Generates a bcrypt hash for the password.
    Uses native bcrypt directly to prevent passlib version-inspection deadlocks.
    """
    try:
        pwd_bytes = password.encode("utf-8")
        salt = bcrypt.gensalt(rounds=12)
        return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")
    except Exception as exc:
        logger.warning(f"Native bcrypt hashing failed, falling back to passlib: {exc}")
        return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> models.User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user
