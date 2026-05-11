from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from app.api.deps import get_db
from app.schemas.user import UserCreate, UserRead
from app.schemas.token import Token
from app.services.auth_service import authenticate_user, create_user, create_access_token_for_user

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
