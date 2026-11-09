import math
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
        query = (
            self.db.query(
                User.full_name,
                User.email,
                func.avg(InterviewSession.score).label("avg_score"),
                func.count(InterviewSession.id).label("sessions_completed"),
            )
            .join(InterviewSession, InterviewSession.owner_id == User.id)
            .filter(User.organization_id == organization_id)
        )

        if role:
            query = query.filter(InterviewSession.role == role)

        return query.group_by(User.id).order_by(func.avg(InterviewSession.score).desc()).all()

    def get_benchmark_stats(self, role: str):
        """
        Provides global benchmarks for a specific role to calculate percentiles.
        Safely computes stats in Python to avoid database engine dialect limitations.
        """
        scores = [
            row[0]
            for row in self.db.query(InterviewSession.score)
            .filter(InterviewSession.role == role, InterviewSession.score.isnot(None))
            .all()
        ]

        if not scores:
            return {"average": 82.0, "standard_deviation": 6.5}

        avg = sum(scores) / len(scores)
        variance = sum((s - avg) ** 2 for s in scores) / len(scores) if len(scores) > 1 else 0.0
        std = math.sqrt(variance)

        return {
            "average": round(avg, 2),
            "standard_deviation": round(std, 2),
        }
