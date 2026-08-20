from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas, auth
from ..services.ai_service import AIService

router = APIRouter(prefix="/api/startups/{startup_id}/documents", tags=["Business Document Generator"])

@router.get("", response_model=List[schemas.BusinessDocumentOut])
def get_startup_documents(
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

    return db.query(models.BusinessDocument).filter(
        models.BusinessDocument.startup_id == startup.id
    ).order_by(models.BusinessDocument.created_at.desc()).all()

@router.post("/generate", response_model=schemas.BusinessDocumentOut)
def generate_document(
    startup_id: int,
    req: schemas.BusinessDocumentCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    startup = db.query(models.Startup).filter(
        models.Startup.id == startup_id,
        models.Startup.user_id == current_user.id
    ).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")

    startup_dict = {
        "name": startup.name,
        "business_idea": startup.business_idea,
        "problem_being_solved": startup.problem_being_solved,
        "product_description": startup.product_description,
        "target_customer": startup.target_customer,
        "industry": startup.industry,
        "business_model": startup.business_model,
        "expected_pricing": startup.expected_pricing,
        "business_type": startup.business_type,
        "stage": startup.stage,
        "available_budget": startup.available_budget
    }

    doc_data = AIService.generate_document(startup_dict, req.doc_type, req.custom_instructions)

    doc = models.BusinessDocument(
        startup_id=startup.id,
        doc_type=req.doc_type,
        title=doc_data["title"],
        content=doc_data["content"],
        format="markdown"
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc

@router.put("/{doc_id}", response_model=schemas.BusinessDocumentOut)
def update_document(
    startup_id: int,
    doc_id: int,
    doc_in: schemas.BusinessDocumentUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    startup = db.query(models.Startup).filter(
        models.Startup.id == startup_id,
        models.Startup.user_id == current_user.id
    ).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")

    doc = db.query(models.BusinessDocument).filter(
        models.BusinessDocument.id == doc_id,
        models.BusinessDocument.startup_id == startup.id
    ).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if doc_in.title is not None:
        doc.title = doc_in.title
    if doc_in.content is not None:
        doc.content = doc_in.content

    db.commit()
    db.refresh(doc)
    return doc

@router.delete("/{doc_id}")
def delete_document(
    startup_id: int,
    doc_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    startup = db.query(models.Startup).filter(
        models.Startup.id == startup_id,
        models.Startup.user_id == current_user.id
    ).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")

    doc = db.query(models.BusinessDocument).filter(
        models.BusinessDocument.id == doc_id,
        models.BusinessDocument.startup_id == startup.id
    ).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    db.delete(doc)
    db.commit()
    return {"message": "Document deleted successfully"}
