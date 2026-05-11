from sqlalchemy.orm import Session

from app.models.resume import Resume


def summarize_resume_text(raw_text: str) -> str:
    lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
    return " ".join(lines[:8])


def extract_skills(raw_text: str) -> str:
    keywords = [
        "Python", "JavaScript", "TypeScript", "React", "FastAPI",
        "SQL", "PostgreSQL", "AI", "Machine Learning", "Leadership",
        "Communication", "Problem Solving",
    ]
    found = [word for word in keywords if word.lower() in raw_text.lower()]
    return ", ".join(sorted(set(found)))


def create_resume_record(db: Session, owner_id: int, filename: str, raw_text: str) -> Resume:
    return Resume(
        owner_id=owner_id,
        filename=filename,
        raw_text=raw_text,
        summary=summarize_resume_text(raw_text),
        skills=extract_skills(raw_text),
    )


def save_resume(db: Session, resume: Resume) -> Resume:
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume
