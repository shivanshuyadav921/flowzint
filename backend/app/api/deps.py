from typing import Generator

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.db.session import get_db as get_db_session
from app.models.user import User
from app.utils.security import decode_access_token

reuseable_oauth = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(token: str = Depends(reuseable_oauth), db: Session = Depends(get_db_session)) -> User:
    try:
        payload = decode_access_token(token)
        user_id = int(payload.get("sub"))
    except (JWTError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive.")
    return user


def get_db() -> Generator[Session, None, None]:
    yield from get_db_session()
