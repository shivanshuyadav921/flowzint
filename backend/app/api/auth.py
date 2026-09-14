from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.user import UserCreate, UserRead, GoogleAuthRequest, AuthResponse
from app.schemas.token import Token
from app.services.auth_service import (
    authenticate_user,
    create_user,
    create_access_token_for_user,
    authenticate_or_create_google_user,
    get_or_create_demo_user,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=UserRead)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    user = create_user(db, user_in)
    return user


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token_for_user(user)
    return {"access_token": token["access_token"], "token_type": token["token_type"], "expires_at": token.get("expires_at")}


@router.post("/google", response_model=AuthResponse)
def google_auth(google_in: GoogleAuthRequest, db: Session = Depends(get_db)):
    user = authenticate_or_create_google_user(db, google_in)
    token = create_access_token_for_user(user)
    return {
        "access_token": token["access_token"],
        "token_type": token["token_type"],
        "expires_at": token.get("expires_at"),
        "user": user,
    }


@router.post("/demo", response_model=AuthResponse)
def demo_login(db: Session = Depends(get_db)):
    user = get_or_create_demo_user(db)
    token = create_access_token_for_user(user)
    return {
        "access_token": token["access_token"],
        "token_type": token["token_type"],
        "expires_at": token.get("expires_at"),
        "user": user,
    }


@router.get("/me", response_model=UserRead)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

