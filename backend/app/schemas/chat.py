from datetime import datetime
from typing import Literal
from pydantic import BaseModel


class ChatMessageCreate(BaseModel):
    session_id: str
    role: Literal["user", "assistant"]
    content: str


class ChatMessageRead(BaseModel):
    id: int
    session_id: str
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
