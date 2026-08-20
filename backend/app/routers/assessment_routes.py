from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas, auth
from ..services.ai_service import AIService

router = APIRouter(prefix="/api/startups/{startup_id}/assessment", tags=["Idea Assessment"])

@router.get("", response_model=schemas.IdeaAssessmentOut)
def get_assessment(
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

    assessment = db.query(models.IdeaAssessment).filter(models.IdeaAssessment.startup_id == startup.id).first()
    if not assessment:
        # Generate on the fly if missing
        startup_dict = {
            "name": startup.name,
            "business_idea": startup.business_idea,
            "problem_being_solved": startup.problem_being_solved,
            "product_description": startup.product_description,
            "target_customer": startup.target_customer,
            "customer_age_group": startup.customer_age_group,
            "customer_location": startup.customer_location,
            "business_type": startup.business_type,
            "industry": startup.industry,
            "business_model": startup.business_model,
            "expected_pricing": startup.expected_pricing,
            "current_competitors": startup.current_competitors,
            "founder_experience": startup.founder_experience,
            "team_size": startup.team_size,
            "available_budget": startup.available_budget,
            "time_commitment": startup.time_commitment,
            "stage": startup.stage,
            "goals": startup.goals
        }
        res = AIService.generate_idea_assessment(startup_dict)
        assessment = models.IdeaAssessment(startup_id=startup.id, **res)
        db.add(assessment)
        db.commit()
        db.refresh(assessment)

    return assessment

@router.post("/re-evaluate", response_model=schemas.IdeaAssessmentOut)
def reevaluate_assessment(
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

    startup_dict = {
        "name": startup.name,
        "business_idea": startup.business_idea,
        "problem_being_solved": startup.problem_being_solved,
        "product_description": startup.product_description,
        "target_customer": startup.target_customer,
        "customer_age_group": startup.customer_age_group,
        "customer_location": startup.customer_location,
        "business_type": startup.business_type,
        "industry": startup.industry,
        "business_model": startup.business_model,
        "expected_pricing": startup.expected_pricing,
        "current_competitors": startup.current_competitors,
        "founder_experience": startup.founder_experience,
        "team_size": startup.team_size,
        "available_budget": startup.available_budget,
        "time_commitment": startup.time_commitment,
        "stage": startup.stage,
        "goals": startup.goals
    }
    res = AIService.generate_idea_assessment(startup_dict)
    
    assessment = db.query(models.IdeaAssessment).filter(models.IdeaAssessment.startup_id == startup.id).first()
    if assessment:
        for k, v in res.items():
            setattr(assessment, k, v)
    else:
        assessment = models.IdeaAssessment(startup_id=startup.id, **res)
        db.add(assessment)

    db.commit()
    db.refresh(assessment)
    return assessment
