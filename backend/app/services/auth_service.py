from datetime import datetime, timedelta
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate, GoogleAuthRequest
from app.utils.security import verify_password, get_password_hash, create_access_token
import secrets


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = db.query(User).filter(User.email == email.lower()).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def create_user(db: Session, user_in: UserCreate) -> User:
    existing = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered.",
        )
    user = User(
        email=user_in.email.lower(),
        full_name=user_in.full_name,
        hashed_password=get_password_hash(user_in.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_or_create_google_user(db: Session, google_in: GoogleAuthRequest) -> User:
    email = google_in.email.lower()
    user = db.query(User).filter(User.email == email).first()
    if not user:
        # Generate random secure password for OAuth user
        random_pw = secrets.token_urlsafe(32)
        user = User(
            email=email,
            full_name=google_in.full_name or email.split("@")[0].capitalize(),
            hashed_password=get_password_hash(random_pw),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    elif google_in.full_name and not user.full_name:
        user.full_name = google_in.full_name
        db.commit()
        db.refresh(user)
    return user


def get_or_create_demo_user(db: Session) -> User:
    demo_email = "demo@flowzint.com"
    user = db.query(User).filter(User.email == demo_email).first()
    if not user:
        user = User(
            email=demo_email,
            full_name="Flowzint Demo Candidate",
            hashed_password=get_password_hash("DemoPass123!"),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


def create_access_token_for_user(user: User) -> dict[str, str]:
    expires_delta = timedelta(days=7)
    token = create_access_token(subject=user.id, expires_delta=expires_delta)
    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_at": datetime.utcnow() + expires_delta,
    }

