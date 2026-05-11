from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ResumeCreate(BaseModel):
    filename: str
    raw_text: str


class ResumeRead(BaseModel):
    id: int
    filename: str
    summary: Optional[str]
    skills: Optional[str]
    raw_text: str
    uploaded_at: datetime

    class Config:
        orm_mode = True
