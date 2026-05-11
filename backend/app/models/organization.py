from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    slug = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    members = relationship("User", back_populates="organization")
    candidate_reports = relationship("InterviewSession", back_populates="organization")

    def get_candidate_ranking(self):
        """Ranks candidates within the organization based on interview scores."""
        # Logic to aggregate scores across sessions
        pass

    def export_report_pdf(self, session_id: int):
        """Generates a recruiter-ready PDF report."""
        # Implementation via ReportLab or similar
        pass