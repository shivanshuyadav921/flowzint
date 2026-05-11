from app.core.celery_app import celery_app
from app.services.ats_service import ATSService
from app.db.session import SessionLocal
from app.models.resume import Resume
import asyncio

@celery_app.task(name="analyze_resume_ats")
def analyze_resume_ats_task(resume_id: int, job_description: str):
    db = SessionLocal()
    ats_service = ATSService()
    
    try:
        resume = db.query(Resume).filter(Resume.id == resume_id).first()
        if not resume:
            return "Resume not found"

        # Run the async analysis in the sync worker
        loop = asyncio.get_event_loop()
        results = loop.run_until_complete(
            ats_service.analyze_compatibility(resume.raw_text, job_description)
        )
        
        # Update resume metadata with ATS scores (implementation in models needed)
        return results
    finally:
        db.close()