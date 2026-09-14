from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class InterviewRequest(BaseModel):
    role: str = Field(..., example="Frontend Engineer")
    difficulty: str = Field(..., example="Intermediate")
    categories: list[str] = Field(..., example=["Technical", "Behavioral"])
    resume_id: Optional[int] = None


class InterviewAnswer(BaseModel):
    session_id: int
    answer_text: str
    question_index: int


class InterviewRead(BaseModel):
    id: int
    title: str
    role: Optional[str]
    difficulty: Optional[str]
    category: Optional[str]
    questions: Optional[str]
    answers: Optional[str]
    feedback: Optional[str]
    score: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True
