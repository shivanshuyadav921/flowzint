from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from app.db.base import Base


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(180), nullable=False)
    role = Column(String(120), nullable=True)
    difficulty = Column(String(50), nullable=True)
    category = Column(String(50), nullable=True)
    questions = Column(Text, nullable=True)
    answers = Column(Text, nullable=True)  # Detailed transcripts
    feedback = Column(Text, nullable=True) # AI analysis
    video_url = Column(String(512), nullable=True)
    analysis_metadata = Column(Text, nullable=True) # JSON for eye contact, pace, etc.
    score = Column(Integer, nullable=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="interviews")
    organization = relationship("Organization", back_populates="candidate_reports")
