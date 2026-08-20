from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas, auth
from ..services.ai_service import AIService

router = APIRouter(prefix="/api/startups", tags=["Startups"])

@router.post("", response_model=schemas.StartupOut)
def create_startup(
    startup_in: schemas.StartupCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    startup_data = startup_in.model_dump()
    startup = models.Startup(
        user_id=current_user.id,
        **startup_data
    )
    db.add(startup)
    db.commit()
    db.refresh(startup)

    # 1. Generate AI Assessment
    assessment_dict = AIService.generate_idea_assessment(startup_data)
    assessment = models.IdeaAssessment(
        startup_id=startup.id,
        overall_score=assessment_dict["overall_score"],
        market_demand_score=assessment_dict["market_demand_score"],
        problem_strength_score=assessment_dict["problem_strength_score"],
        feasibility_score=assessment_dict["feasibility_score"],
        competition_score=assessment_dict["competition_score"],
        business_model_score=assessment_dict["business_model_score"],
        revenue_potential_score=assessment_dict["revenue_potential_score"],
        risk_score=assessment_dict["risk_score"],
        scalability_score=assessment_dict["scalability_score"],
        strengths=assessment_dict["strengths"],
        weaknesses=assessment_dict["weaknesses"],
        risks=assessment_dict["risks"],
        opportunities=assessment_dict["opportunities"],
        missing_information=assessment_dict["missing_information"],
        recommended_next_action=assessment_dict["recommended_next_action"],
        detailed_verdict=assessment_dict.get("detailed_verdict")
    )
    db.add(assessment)

    # 2. Generate 11-Stage Roadmap & Tasks
    stages = AIService.generate_startup_roadmap(startup_data)
    for s in stages:
        stage_record = models.RoadmapStage(
            startup_id=startup.id,
            stage_order=s["stage_order"],
            stage_key=s["stage_key"],
            stage_name=s["stage_name"],
            objective=s["objective"],
            expected_outcome=s["expected_outcome"],
            status="in_progress" if s["stage_order"] == 1 else "not_started"
        )
        db.add(stage_record)
        db.flush()

        for t in s.get("tasks", []):
            task_record = models.RoadmapTask(
                stage_id=stage_record.id,
                startup_id=startup.id,
                title=t["title"],
                description=t.get("description", ""),
                why_it_matters=t.get("why_it_matters", ""),
                priority=t.get("priority", "Medium"),
                estimated_time=t.get("estimated_time", "2-3 days"),
                resources=t.get("resources", []),
                status="not_started"
            )
            db.add(task_record)

    # 3. Generate Daily Prioritized Tasks
    daily_tasks = AIService.generate_daily_tasks(startup_data)
    for dt in daily_tasks:
        dtask = models.DailyTask(
            startup_id=startup.id,
            title=dt["title"],
            why_it_matters=dt["why_it_matters"],
            step_by_step=dt.get("step_by_step", []),
            expected_outcome=dt["expected_outcome"],
            priority=dt.get("priority", "High"),
            estimated_time=dt.get("estimated_time", "1-2 hours"),
            category=dt.get("category", "Validation"),
            status="pending"
        )
        db.add(dtask)

    # 4. Generate 16-Section Business Plan
    bplan_dict = AIService.generate_business_plan(startup_data)
    bplan = models.BusinessPlan(
        startup_id=startup.id,
        **bplan_dict
    )
    db.add(bplan)

    # 5. Generate Starter Business Documents
    exec_summary_doc = AIService.generate_document(startup_data, "executive_summary")
    db.add(models.BusinessDocument(
        startup_id=startup.id,
        doc_type="executive_summary",
        title=exec_summary_doc["title"],
        content=exec_summary_doc["content"]
    ))

    pitch_deck_doc = AIService.generate_document(startup_data, "pitch_deck")
    db.add(models.BusinessDocument(
        startup_id=startup.id,
        doc_type="pitch_deck",
        title=pitch_deck_doc["title"],
        content=pitch_deck_doc["content"]
    ))

    db.commit()
    db.refresh(startup)
    return startup

@router.get("", response_model=List[schemas.StartupOut])
def get_user_startups(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(models.Startup).filter(models.Startup.user_id == current_user.id).order_by(models.Startup.created_at.desc()).all()

@router.get("/{startup_id}", response_model=schemas.StartupOut)
def get_startup_by_id(
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
    return startup

@router.put("/{startup_id}", response_model=schemas.StartupOut)
def update_startup(
    startup_id: int,
    startup_in: schemas.StartupUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    startup = db.query(models.Startup).filter(
        models.Startup.id == startup_id,
        models.Startup.user_id == current_user.id
    ).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")

    update_data = startup_in.model_dump(exclude_unset=True)
    for k, v in update_data.items():
        setattr(startup, k, v)
    
    db.commit()
    db.refresh(startup)
    return startup
