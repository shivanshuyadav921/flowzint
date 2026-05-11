from fastapi import APIRouter, Depends

from app.api.deps import get_db, get_current_user
from app.schemas.user import UserRead
from app.models.user import User

router = APIRouter(prefix="/user", tags=["user"])


@router.get("/me", response_model=UserRead)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user
