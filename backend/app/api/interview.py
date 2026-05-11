from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.interview import InterviewSession
from app.models.resume import Resume
from app.schemas.interview import InterviewRequest, InterviewRead, InterviewAnswer
from app.services.ai_service import generate_interview_questions, evaluate_answer
from app.models.user import User

router = APIRouter(prefix="/interview", tags=["interview"])


@router.post("/generate", response_model=InterviewRead)
async def generate_interview(
    payload: InterviewRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume_summary = None
    if payload.resume_id:
        resume = db.query(Resume).filter(Resume.id == payload.resume_id, Resume.owner_id == current_user.id).first()
        if not resume:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found.")
        resume_summary = resume.summary

    questions = await generate_interview_questions(payload.role, payload.difficulty, payload.categories, resume_summary)
    title = f"{payload.role} practice — {payload.difficulty}"
    interview = InterviewSession(
        owner_id=current_user.id,
        title=title,
        role=payload.role,
        difficulty=payload.difficulty,
        category=", ".join(payload.categories),
        questions=questions,
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)
    return interview


@router.post("/evaluate")
async def evaluate_interview_answer(
    payload: InterviewAnswer,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = db.query(InterviewSession).filter(InterviewSession.id == payload.session_id, InterviewSession.owner_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview session not found.")
    feedback = await evaluate_answer(session.questions or "", payload.answer_text)
    session.answers = (session.answers or "") + f"\n\nQ{payload.question_index}: {payload.answer_text}"
    session.feedback = (session.feedback or "") + f"\n\nFeedback for Q{payload.question_index}: {feedback}"
    session.score = min(100, (session.score or 0) + 8)
    db.commit()
    db.refresh(session)
    return {"feedback": feedback}


@router.get("/history", response_model=list[InterviewRead])
def get_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(InterviewSession).filter(InterviewSession.owner_id == current_user.id).order_by(InterviewSession.created_at.desc()).all()
