from fastapi import APIRouter

from app.api.auth import router as auth_router
from app.api.user import router as user_router
from app.api.resume import router as resume_router
from app.api.interview import router as interview_router
from app.api.chat import router as chat_router
from app.api.analytics import router as analytics_router

router = APIRouter()
router.include_router(auth_router)
router.include_router(user_router)
router.include_router(resume_router)
router.include_router(interview_router)
router.include_router(chat_router)
router.include_router(analytics_router)
