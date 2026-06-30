from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db
from database.models import User
from database.schemas import UserRegister, UserLogin
from utils.security import hash_password, verify_password
from utils.jwt_handler import (
    create_access_token,
    get_current_email
)
from datetime import datetime


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):

    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered."
        )

    # Create new user
    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully!"
    }

@router.post("/login")
def login(login_data: UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(User.email == login_data.email).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )
    
    print("Email:", login_data.email)
    print("Plain password:", login_data.password)
    print("Stored hash:", db_user.password)
    print("Length of plain password:", len(login_data.password))

    if not verify_password(login_data.password, db_user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )
    db_user.last_active = datetime.utcnow()
    db.commit()
    db.refresh(db_user)

    print("LAST ACTIVE:", db_user.last_active)

    access_token = create_access_token(
        {"sub": db_user.email}
    )

    return {
    "access_token": access_token,
    "token_type": "bearer",
    "name": db_user.name,
    "email": db_user.email
}

from datetime import datetime, timedelta

@router.get("/activity-status")
def activity_status(
    email: str = Depends(get_current_email),
    db: Session = Depends(get_db)
):

    # Temporary (until JWT user lookup)
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.last_active is None:
        return {
            "falling_behind": False
        }

    inactive_time = datetime.utcnow() - user.last_active

    return {
        "falling_behind": inactive_time >= timedelta(days=1)
    }

@router.post("/update-activity")
def update_activity(
    email: str = Depends(get_current_email),
    db: Session = Depends(get_db)
):

    # Temporary: first user
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.last_active = datetime.utcnow()
    db.commit()

    return {
        "message": "Activity updated."
    }

from datetime import timedelta

@router.post("/debug/set-inactive")
def set_inactive(
    db: Session = Depends(get_db)
):
    user = db.query(User).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.last_active = datetime.utcnow() - timedelta(days=2)

    db.commit()

    return {
        "message": "User has been marked inactive for testing.",
        "last_active": user.last_active
    }