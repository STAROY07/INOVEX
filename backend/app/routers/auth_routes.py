import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas, auth

logger = logging.getLogger("inovex.auth_routes")

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.get("/test")
def test_auth_route():
    return {"status": "auth_service_operational"}

@router.post("/demo", response_model=schemas.Token)
def demo_login(db: Session = Depends(get_db)):
    demo_email = "founder@inovex.ai"
    demo_pass = "startup123"
    
    logger.info("Executing 1-click demo authentication")
    user = db.query(models.User).filter(models.User.email == demo_email).first()
    
    if not user:
        # Create demo user on the fly if not yet present
        user = models.User(
            email=demo_email,
            hashed_password=auth.get_password_hash(demo_pass),
            full_name="Aarav Sharma"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        profile = models.UserProfile(
            user_id=user.id,
            founder_type="First-time Founder",
            experience_level="Beginner",
            location="India",
            startup_interests=["Tech", "AI", "SaaS"]
        )
        db.add(profile)
        db.commit()
        db.refresh(user)
    else:
        # Guarantee demo password matches startup123
        if not auth.verify_password(demo_pass, user.hashed_password):
            user.hashed_password = auth.get_password_hash(demo_pass)
            db.commit()
            db.refresh(user)
        
        if not user.profile:
            profile = models.UserProfile(
                user_id=user.id,
                founder_type="First-time Founder",
                experience_level="Beginner",
                location="India",
                startup_interests=["Tech", "AI", "SaaS"]
            )
            db.add(profile)
            db.commit()
            db.refresh(user)

    access_token = auth.create_access_token(data={"sub": user.email})
    profile_data = None
    if user.profile:
        profile_data = {
            "phone": user.profile.phone,
            "founder_type": user.profile.founder_type,
            "experience_level": user.profile.experience_level,
            "location": user.profile.location,
            "startup_interests": user.profile.startup_interests or [],
            "current_startup_stage": user.profile.current_startup_stage,
            "bio": user.profile.bio
        }
        
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "profile": profile_data
        }
    }

@router.post("/signup", response_model=schemas.Token)
def signup(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    clean_email = user_in.email.strip().lower()
    clean_name = user_in.full_name.strip()
    
    logger.info(f"Signup attempt for email: {clean_email}")
    
    try:
        existing = db.query(models.User).filter(models.User.email == clean_email).first()
        if existing:
            logger.warning(f"Signup rejected: User already exists for {clean_email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email already exists."
            )
        
        if not clean_name:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Full name is required."
            )

        hashed = auth.get_password_hash(user_in.password)
        user = models.User(
            email=clean_email,
            hashed_password=hashed,
            full_name=clean_name
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Create starter profile
        profile = models.UserProfile(
            user_id=user.id,
            founder_type="First-time Founder",
            experience_level="Beginner",
            location="India",
            startup_interests=["Tech", "AI", "SaaS"]
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

        access_token = auth.create_access_token(data={"sub": user.email})
        logger.info(f"User {clean_email} successfully registered (ID: {user.id})")
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "profile": {
                    "founder_type": profile.founder_type,
                    "experience_level": profile.experience_level,
                    "location": profile.location,
                    "startup_interests": profile.startup_interests,
                    "current_startup_stage": profile.current_startup_stage
                }
            }
        }
    except HTTPException:
        raise
    except Exception as exc:
        db.rollback()
        logger.error(f"Error during signup for {clean_email}: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(exc)}"
        )

@router.post("/login", response_model=schemas.Token)
def login(login_in: schemas.UserLogin, db: Session = Depends(get_db)):
    clean_email = login_in.email.strip().lower()
    logger.info(f"Login attempt for email: {clean_email}")
    
    try:
        user = db.query(models.User).filter(models.User.email == clean_email).first()
        if not user or not auth.verify_password(login_in.password, user.hashed_password):
            logger.warning(f"Invalid login credentials for {clean_email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password."
            )
        
        access_token = auth.create_access_token(data={"sub": user.email})
        profile_data = None
        if user.profile:
            profile_data = {
                "phone": user.profile.phone,
                "founder_type": user.profile.founder_type,
                "experience_level": user.profile.experience_level,
                "location": user.profile.location,
                "startup_interests": user.profile.startup_interests or [],
                "current_startup_stage": user.profile.current_startup_stage,
                "bio": user.profile.bio
            }
            
        logger.info(f"Login successful for user: {clean_email} (ID: {user.id})")
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "profile": profile_data
            }
        }
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error during login for {clean_email}: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during authentication. Please try again."
        )

@router.post("/forgot-password")
def forgot_password(request: schemas.PasswordResetRequest, db: Session = Depends(get_db)):
    clean_email = request.email.strip().lower()
    logger.info(f"Password reset requested for {clean_email}")
    try:
        # Keep response timing identical for known/unknown emails
        db.query(models.User).filter(models.User.email == clean_email).first()
    except Exception as exc:
        logger.warning(f"Error during password reset lookup: {exc}")
    return {"message": "If an account exists for this email, reset instructions have been sent."}

@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@router.put("/profile", response_model=schemas.UserProfileOut)
def update_profile(
    profile_in: schemas.UserProfileUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    try:
        profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == current_user.id).first()
        if not profile:
            profile = models.UserProfile(user_id=current_user.id)
            db.add(profile)

        update_data = profile_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(profile, key, value)

        db.commit()
        db.refresh(profile)
        return profile
    except Exception as exc:
        db.rollback()
        logger.error(f"Error updating profile for user {current_user.id}: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile."
        )
