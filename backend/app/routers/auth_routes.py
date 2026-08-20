from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas, auth

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/signup", response_model=schemas.Token)
def signup(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )
    
    hashed = auth.get_password_hash(user_in.password)
    user = models.User(
        email=user_in.email,
        hashed_password=hashed,
        full_name=user_in.full_name
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create empty profile
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

@router.post("/login", response_model=schemas.Token)
def login(login_in: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_in.email).first()
    if not user or not auth.verify_password(login_in.password, user.hashed_password):
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

@router.post("/forgot-password")
def forgot_password(request: schemas.PasswordResetRequest, db: Session = Depends(get_db)):
    # Keep the response identical for known and unknown emails.
    db.query(models.User).filter(models.User.email == request.email).first()
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
