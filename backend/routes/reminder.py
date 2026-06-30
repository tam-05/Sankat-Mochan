from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from database.database import get_db
from database.task_models import Task

router = APIRouter(
    prefix="/reminder",
    tags=["Reminder"]
)


@router.get("/status")
def reminder_status(
    db: Session = Depends(get_db)
):

    tasks = db.query(Task).all()

    if not tasks:
        return {
            "behind": False,
            "days": 0,
            "message": ""
        }

    pending = [
        task for task in tasks
        if task.status == "Pending"
    ]

    if not pending:
        return {
            "behind": False,
            "days": 0,
            "message": ""
        }

    latest = max(
        task.updated_at
        for task in tasks
        if task.updated_at is not None
    )

    # Convert to timezone-naive
    if latest.tzinfo is not None:
        latest = latest.replace(tzinfo=None)

    now = datetime.utcnow()

    diff = now - latest

    days = diff.days

    if days >= 1:
        return {
            "behind": True,
            "days": days,
            "message": (
                f"You haven't made any progress for {days} "
                f"{'day' if days == 1 else 'days'}. "
                "Complete a task today to stay on track."
            )
        }

    return {
        "behind": False,
        "days": 0,
        "message": ""
    }