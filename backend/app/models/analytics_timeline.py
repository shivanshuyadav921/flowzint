from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON, DateTime
from app.db.base import Base
from datetime import datetime

class AnalyticsTimeline(Base):
    """Stores time-series data for a specific interview session."""
    __tablename__ = "analytics_timelines"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("interview_sessions.id", ondelete="CASCADE"))
    timestamp = Column(Float)  # Seconds into the interview
    
    # Telemetry Data
    eye_contact = Column(Boolean)
    posture_score = Column(Float)
    engagement_score = Column(Float)
    is_speaking = Column(Boolean)
    
    created_at = Column(DateTime, default=datetime.utcnow)