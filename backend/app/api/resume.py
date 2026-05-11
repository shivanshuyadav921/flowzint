from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.schemas.resume import ResumeRead
from app.services.resume_service import create_resume_record, save_resume
from app.utils.file_parser import extract_resume_text
from app.models.user import User

router = APIRouter(prefix="/resume", tags=["resume"])


@router.post("/upload", response_model=ResumeRead)
async def upload_resume(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if file.content_type not in ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only PDF and DOCX resume files are supported.")
    content = await file.read()
    raw_text = extract_resume_text(file.filename, content)
    resume = create_resume_record(db, current_user.id, file.filename, raw_text)
    saved = save_resume(db, resume)

    return saved


from app.models.resume import Resume


@router.get("/mine", response_model=list[ResumeRead])
def list_resumes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Resume).filter(Resume.owner_id == current_user.id).order_by(Resume.uploaded_at.desc()).all()
