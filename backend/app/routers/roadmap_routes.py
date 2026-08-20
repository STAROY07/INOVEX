import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas, auth

router = APIRouter(prefix="/api/startups/{startup_id}/roadmap", tags=["Startup Roadmap"])

@router.get("", response_model=List[schemas.RoadmapStageOut])
def get_roadmap(
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

    stages = db.query(models.RoadmapStage).filter(
        models.RoadmapStage.startup_id == startup.id
    ).order_by(models.RoadmapStage.stage_order.asc()).all()

    return stages

@router.put("/tasks/{task_id}", response_model=schemas.RoadmapTaskOut)
def update_task_status(
    startup_id: int,
    task_id: int,
    task_in: schemas.RoadmapTaskUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    startup = db.query(models.Startup).filter(
        models.Startup.id == startup_id,
        models.Startup.user_id == current_user.id
    ).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")

    task = db.query(models.RoadmapTask).filter(
        models.RoadmapTask.id == task_id,
        models.RoadmapTask.startup_id == startup.id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = task_in.status
    if task_in.status == "completed":
        task.completed_at = datetime.datetime.utcnow()
    else:
        task.completed_at = None

    db.commit()
    db.refresh(task)

    # Check if all tasks in stage are completed to update stage status
    stage = db.query(models.RoadmapStage).filter(models.RoadmapStage.id == task.stage_id).first()
    if stage:
        all_tasks = db.query(models.RoadmapTask).filter(models.RoadmapTask.stage_id == stage.id).all()
        if all_tasks and all(t.status == "completed" for t in all_tasks):
            stage.status = "completed"
        elif any(t.status in ["in_progress", "completed"] for t in all_tasks):
            stage.status = "in_progress"
        else:
            stage.status = "not_started"
        db.commit()

    return task
