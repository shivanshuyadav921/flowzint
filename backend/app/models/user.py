from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(256), unique=True, nullable=False, index=True)
    full_name = Column(String(128), nullable=True)
    hashed_password = Column(String(256), nullable=False)
    role = Column(String(20), default="candidate")  # candidate, recruiter, admin
    is_active = Column(Boolean, default=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="members")
    resumes = relationship("Resume", back_populates="owner", cascade="all, delete-orphan")
    interviews = relationship("InterviewSession", back_populates="owner", cascade="all, delete-orphan")
    analytics = relationship("AnalyticsRecord", back_populates="owner", cascade="all, delete-orphan")
