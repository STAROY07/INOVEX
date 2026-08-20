from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas, auth

router = APIRouter(prefix="/api/startups/{startup_id}/validation", tags=["Validation Evidence Workspace"])

@router.get("", response_model=List[schemas.ValidationEvidenceOut])
def get_validation_records(
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

    return db.query(models.ValidationEvidence).filter(
        models.ValidationEvidence.startup_id == startup.id
    ).order_by(models.ValidationEvidence.created_at.desc()).all()

@router.post("", response_model=schemas.ValidationEvidenceOut)
def create_validation_record(
    startup_id: int,
    record_in: schemas.ValidationEvidenceCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    startup = db.query(models.Startup).filter(
        models.Startup.id == startup_id,
        models.Startup.user_id == current_user.id
    ).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")

    record_data = record_in.model_dump()
    val_record = models.ValidationEvidence(
        startup_id=startup.id,
        **record_data
    )
    db.add(val_record)
    db.commit()
    db.refresh(val_record)
    return val_record

@router.delete("/{record_id}")
def delete_validation_record(
    startup_id: int,
    record_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    startup = db.query(models.Startup).filter(
        models.Startup.id == startup_id,
        models.Startup.user_id == current_user.id
    ).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")

    record = db.query(models.ValidationEvidence).filter(
        models.ValidationEvidence.id == record_id,
        models.ValidationEvidence.startup_id == startup.id
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Validation record not found")

    db.delete(record)
    db.commit()
    return {"message": "Record deleted successfully"}
