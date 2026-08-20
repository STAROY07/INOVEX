from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas, auth
from ..services.ai_service import AIService

router = APIRouter(prefix="/api/startups/{startup_id}/bizplan", tags=["Business Plan Generator"])

@router.get("", response_model=schemas.BusinessPlanOut)
def get_business_plan(
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

    plan = db.query(models.BusinessPlan).filter(models.BusinessPlan.startup_id == startup.id).first()
    if not plan:
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
            "available_budget": startup.available_budget
        }
        res = AIService.generate_business_plan(startup_dict)
        plan = models.BusinessPlan(startup_id=startup.id, **res)
        db.add(plan)
        db.commit()
        db.refresh(plan)

    return plan

@router.put("", response_model=schemas.BusinessPlanOut)
def update_business_plan(
    startup_id: int,
    plan_in: schemas.BusinessPlanUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    startup = db.query(models.Startup).filter(
        models.Startup.id == startup_id,
        models.Startup.user_id == current_user.id
    ).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")

    plan = db.query(models.BusinessPlan).filter(models.BusinessPlan.startup_id == startup.id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Business plan not found")

    update_data = plan_in.model_dump(exclude_unset=True)
    for k, v in update_data.items():
        setattr(plan, k, v)

    db.commit()
    db.refresh(plan)
    return plan

@router.post("/regenerate-section")
def regenerate_section(
    startup_id: int,
    req: schemas.SectionRegenerateRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    startup = db.query(models.Startup).filter(
        models.Startup.id == startup_id,
        models.Startup.user_id == current_user.id
    ).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")

    plan = db.query(models.BusinessPlan).filter(models.BusinessPlan.startup_id == startup.id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Business plan not found")

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
        "available_budget": startup.available_budget
    }

    current_plan_dict = {c.name: getattr(plan, c.name) for c in plan.__table__.columns}
    new_section_content = AIService.regenerate_business_plan_section(
        startup_dict, current_plan_dict, req.section_name, req.additional_prompt
    )

    if hasattr(plan, req.section_name):
        setattr(plan, req.section_name, new_section_content)
        db.commit()
        db.refresh(plan)

    return {
        "section_name": req.section_name,
        "content": new_section_content
    }
