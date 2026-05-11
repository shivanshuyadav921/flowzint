from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.analytics import AnalyticsRecord
from app.schemas.analytics import AnalyticsRecordRead
from app.models.user import User

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/summary", response_model=list[AnalyticsRecordRead])
def get_analytics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return (
        db.query(AnalyticsRecord)
        .filter(AnalyticsRecord.owner_id == current_user.id)
        .order_by(AnalyticsRecord.recorded_at.desc())
        .limit(20)
        .all()
    )
