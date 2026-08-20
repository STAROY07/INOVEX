import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas, auth
from ..services.ai_service import AIService

router = APIRouter(prefix="/api/startups/{startup_id}/actions", tags=["Prioritised Actions & Daily Tasks"])

@router.get("", response_model=List[schemas.DailyTaskOut])
def get_daily_actions(
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

    tasks = db.query(models.DailyTask).filter(
        models.DailyTask.startup_id == startup.id
    ).order_by(models.DailyTask.id.asc()).all()

    if not tasks:
        # Generate initial tasks if empty
        startup_dict = {
            "name": startup.name,
            "target_customer": startup.target_customer,
            "stage": startup.stage,
            "industry": startup.industry
        }
        new_tasks = AIService.generate_daily_tasks(startup_dict)
        for t in new_tasks:
            dt = models.DailyTask(
                startup_id=startup.id,
                title=t["title"],
                why_it_matters=t["why_it_matters"],
                step_by_step=t.get("step_by_step", []),
                expected_outcome=t["expected_outcome"],
                priority=t.get("priority", "High"),
                estimated_time=t.get("estimated_time", "1-2 hours"),
                category=t.get("category", "Validation"),
                status="pending"
            )
            db.add(dt)
        db.commit()
        tasks = db.query(models.DailyTask).filter(models.DailyTask.startup_id == startup.id).all()

    return tasks

@router.post("", response_model=schemas.DailyTaskOut)
def create_custom_action(
    startup_id: int,
    task_in: schemas.DailyTaskCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    startup = db.query(models.Startup).filter(
        models.Startup.id == startup_id,
        models.Startup.user_id == current_user.id
    ).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")

    dtask = models.DailyTask(
        startup_id=startup.id,
        title=task_in.title,
        why_it_matters=task_in.why_it_matters,
        step_by_step=task_in.step_by_step,
        expected_outcome=task_in.expected_outcome,
        priority=task_in.priority,
        estimated_time=task_in.estimated_time,
        category=task_in.category,
        status="pending"
    )
    db.add(dtask)
    db.commit()
    db.refresh(dtask)
    return dtask

@router.put("/{task_id}", response_model=schemas.DailyTaskOut)
def toggle_action_status(
    startup_id: int,
    task_id: int,
    task_in: schemas.DailyTaskUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    startup = db.query(models.Startup).filter(
        models.Startup.id == startup_id,
        models.Startup.user_id == current_user.id
    ).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")

    task = db.query(models.DailyTask).filter(
        models.DailyTask.id == task_id,
        models.DailyTask.startup_id == startup.id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Action not found")

    if task_in.status:
        task.status = task_in.status
        if task_in.status == "completed":
            task.completed_at = datetime.datetime.utcnow()
        else:
            task.completed_at = None

    db.commit()
    db.refresh(task)
    return task

@router.post("/regenerate", response_model=List[schemas.DailyTaskOut])
def regenerate_daily_actions(
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
        "target_customer": startup.target_customer,
        "stage": startup.stage,
        "industry": startup.industry
    }
    new_tasks = AIService.generate_daily_tasks(startup_dict)
    for t in new_tasks:
        dt = models.DailyTask(
            startup_id=startup.id,
            title=t["title"],
            why_it_matters=t["why_it_matters"],
            step_by_step=t.get("step_by_step", []),
            expected_outcome=t["expected_outcome"],
            priority=t.get("priority", "High"),
            estimated_time=t.get("estimated_time", "1-2 hours"),
            category=t.get("category", "Validation"),
            status="pending"
        )
        db.add(dt)
    db.commit()

    return db.query(models.DailyTask).filter(models.DailyTask.startup_id == startup.id).all()
