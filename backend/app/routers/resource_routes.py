from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from .. import models, schemas
from ..services.seed_data import SEED_LEARNING_RESOURCES

router = APIRouter(prefix="/api/resources", tags=["Startup Learning Resources"])

@router.get("", response_model=List[schemas.LearningResourceOut])
def get_learning_resources(
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # Ensure seed resources exist in database
    count = db.query(models.LearningResource).count()
    if count == 0:
        for r in SEED_LEARNING_RESOURCES:
            db.add(models.LearningResource(**r))
        db.commit()

    query = db.query(models.LearningResource)

    if category and category != "All":
        query = query.filter(models.LearningResource.category == category)

    if search:
        search_fmt = f"%{search.lower()}%"
        query = query.filter(
            models.LearningResource.title.ilike(search_fmt) |
            models.LearningResource.description.ilike(search_fmt) |
            models.LearningResource.content.ilike(search_fmt)
        )

    return query.all()
