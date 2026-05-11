from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from app.db.base import Base


class AnalyticsRecord(Base):
    __tablename__ = "analytics_records"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    metric = Column(String(120), nullable=False)
    value = Column(Integer, nullable=False)
    detail = Column(Text, nullable=True)
    recorded_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="analytics")
