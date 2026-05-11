from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.chat import ConversationMessage
from app.schemas.chat import ChatMessageCreate, ChatMessageRead
from app.services.ai_service import generate_chat_response
from app.models.user import User

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/message", response_model=ChatMessageRead)
async def create_message(
    payload: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.role == "assistant":
        raise HTTPException(status_code=400, detail="User can only send user messages directly.")
    message = ConversationMessage(
        owner_id=current_user.id,
        role=payload.role,
        content=payload.content,
        session_id=payload.session_id,
    )
    db.add(message)
    db.commit()
    db.refresh(message)

    history = [
        {"role": m.role, "content": m.content}
        for m in db.query(ConversationMessage)
        .filter(ConversationMessage.owner_id == current_user.id, ConversationMessage.session_id == payload.session_id)
        .order_by(ConversationMessage.created_at)
        .all()
    ]
    assistant_text = await generate_chat_response(history)
    assistant = ConversationMessage(
        owner_id=current_user.id,
        role="assistant",
        content=assistant_text,
        session_id=payload.session_id,
    )
    db.add(assistant)
    db.commit()
    db.refresh(assistant)
    return assistant


@router.get("/session/{session_id}", response_model=list[ChatMessageRead])
def get_session_messages(session_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return (
        db.query(ConversationMessage)
        .filter(ConversationMessage.session_id == session_id, ConversationMessage.owner_id == current_user.id)
        .order_by(ConversationMessage.created_at)
        .all()
    )
