from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from app.db.base import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String(255), nullable=False)
    raw_text = Column(Text, nullable=False)
    summary = Column(Text, nullable=True)
    skills = Column(Text, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="resumes")
