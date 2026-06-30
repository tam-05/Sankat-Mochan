from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db
from database.task_models import Task
from datetime import datetime
from database.task_schemas import (
    TaskCreate,
    TaskUpdate,
    TaskResponse
)

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)

@router.post("/", response_model=TaskResponse)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db)
):

    new_task = Task(
        title=task.title,
        description=task.description,
        priority=task.priority,
        due_date=task.due_date,
        roadmap_id=task.roadmap_id,
        goal=task.goal,
        # Temporary
        user_id=1
       
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task

@router.get("/", response_model=list[TaskResponse])
def get_tasks(db: Session = Depends(get_db)):

    tasks = db.query(Task).all()

    return tasks

@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task: TaskUpdate,
    db: Session = Depends(get_db)
):

    db_task = db.query(Task).filter(Task.id == task_id).first()

    if not db_task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    update_data = task.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_task, key, value)

    if task.status == "Completed":
        db_task.completed_at = datetime.utcnow()

    elif task.status == "Pending":
        db_task.completed_at = None

    db.commit()
    db.refresh(db_task)

    return db_task


@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db)
):

    db_task = db.query(Task).filter(Task.id == task_id).first()

    if not db_task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    db.delete(db_task)
    db.commit()

    return {
        "message": "Task deleted successfully"
    }

@router.post("/touch")
def touch_tasks(db: Session = Depends(get_db)):

    tasks = db.query(Task).all()

    for task in tasks:
        task.updated_at = datetime.utcnow()

    db.commit()

    return {"success": True}