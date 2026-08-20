from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas, auth
from ..services.ai_service import AIService

router = APIRouter(prefix="/api/startups/{startup_id}/mentor", tags=["AI Mentor"])

@router.get("/history", response_model=List[schemas.ChatMessageOut])
def get_chat_history(
    startup_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    startup = db.query(models.Startup).filter(
        models.Startup.id == startup_id,
        models.Startup.user_id == current_user.id
    ).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")

    return db.query(models.MentorChatMessage).filter(
        models.MentorChatMessage.startup_id == startup.id
    ).order_by(models.MentorChatMessage.timestamp.asc()).all()

@router.post("/chat", response_model=schemas.ChatMessageOut)
def send_chat_message(
    startup_id: int,
    msg_in: schemas.ChatMessageCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    startup = db.query(models.Startup).filter(
        models.Startup.id == startup_id,
        models.Startup.user_id == current_user.id
    ).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")

    # 1. Save user query
    user_msg = models.MentorChatMessage(
        startup_id=startup.id,
        user_id=current_user.id,
        role="user",
        content=msg_in.content
    )
    db.add(user_msg)
    db.commit()

    # 2. Retrieve history for context
    history_records = db.query(models.MentorChatMessage).filter(
        models.MentorChatMessage.startup_id == startup.id
    ).order_by(models.MentorChatMessage.timestamp.asc()).all()
    
    history_payload = [{"role": m.role, "content": m.content} for m in history_records]

    # 3. Call AI Service
    startup_dict = {
        "name": startup.name,
        "business_idea": startup.business_idea,
        "problem_being_solved": startup.problem_being_solved,
        "product_description": startup.product_description,
        "target_customer": startup.target_customer,
        "business_type": startup.business_type,
        "industry": startup.industry,
        "business_model": startup.business_model,
        "expected_pricing": startup.expected_pricing,
        "stage": startup.stage,
        "available_budget": startup.available_budget,
        "goals": startup.goals
    }

    ai_reply = AIService.answer_mentor_query(startup_dict, history_payload, msg_in.content)

    # 4. Save assistant response
    assistant_msg = models.MentorChatMessage(
        startup_id=startup.id,
        user_id=current_user.id,
        role="assistant",
        content=ai_reply["answer"],
        recommended_action=ai_reply.get("recommended_action")
    )
    db.add(assistant_msg)
    db.commit()
    db.refresh(assistant_msg)

    return assistant_msg
