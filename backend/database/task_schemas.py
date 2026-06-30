from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "Medium"
    due_date: Optional[datetime] = None
    roadmap_id: Optional[str] = None
    goal: Optional[str] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[datetime] = None
    roadmap_id: Optional[str] = None
    goal: Optional[str] = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    priority: str
    status: str
    due_date: Optional[datetime]
    roadmap_id: Optional[str]
    created_at: datetime
    updated_at: datetime
    user_id: int
    completed_at: datetime | None = None
    goal: Optional[str] = None

    class Config:
        from_attributes = True