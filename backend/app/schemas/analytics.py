from datetime import datetime
from pydantic import BaseModel


class AnalyticsRecordCreate(BaseModel):
    metric: str
    value: int
    detail: str | None = None


class AnalyticsRecordRead(BaseModel):
    id: int
    metric: str
    value: int
    detail: str | None
    recorded_at: datetime

    class Config:
        from_attributes = True
