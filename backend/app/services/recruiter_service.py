from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.interview import InterviewSession
from app.models.user import User

class RecruiterService:
    def __init__(self, db: Session):
        self.db = db

    def get_candidate_rankings(self, organization_id: int, role: str = None):
        """
        Ranks candidates within an organization based on their average interview scores.
        """
        query = self.db.query(
            User.full_name,
            User.email,
            func.avg(InterviewSession.score).label("avg_score"),
            func.count(InterviewSession.id).label("sessions_completed")
        ).join(InterviewSession).filter(User.organization_id == organization_id)

        if role:
            query = query.filter(InterviewSession.role == role)

        return query.group_by(User.id).order_by(func.avg(InterviewSession.score).desc()).all()

    def get_benchmark_stats(self, role: str):
        """
        Provides global benchmarks for a specific role to calculate percentiles.
        """
        stats = self.db.query(
            func.avg(InterviewSession.score).label("global_avg"),
            func.stddev(InterviewSession.score).label("global_std")
        ).filter(InterviewSession.role == role).first()
        
        return {
            "average": stats.global_avg or 0,
            "standard_deviation": stats.global_std or 0
        }