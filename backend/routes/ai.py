from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.genai as genai
import os
import json
from sqlalchemy.orm import Session
from fastapi import Depends
from database.database import get_db
from database.task_models import Task
from database.models import User
from utils.jwt_handler import get_current_user
from datetime import datetime, date
router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


class AIRequest(BaseModel):
    prompt: str


@router.post("/plan")
def generate_plan(data: AIRequest):
    today = date.today().strftime("%Y-%m-%d")
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"""
You are Sankat Mochan AI.

The user's goal is:

{data.prompt}

Your job is to convert the goal into actionable tasks.

IMPORTANT RULES:

1. Return ONLY JSON.
2. DO NOT return markdown.
3. DO NOT use ```json.
4. DO NOT create nested objects like weeks, days, roadmap or topics.
5. Return ONE flat array named "tasks".
6. Every task must contain:
   - title
   - description
   - priority (High, Medium or Low)
   - due_date

7. due_date MUST be in YYYY-MM-DD format.

Today's date is:

{today}

Rules for due dates:

- Every due_date must be after today's date.
- Use YYYY-MM-DD format only.
- Schedule tasks over the next 1–30 days.
- Never generate dates in the past.


8. Generate between 5 and 20 tasks depending on the goal.

Return EXACTLY this format:

{{
  "tasks": [
    {{
      "title": "Task title",
      "description": "Task description",
      "priority": "High",
      "due_date": "2026-07-15"
    }}
  ]
}}

Return ONLY JSON.
""",
        config={
            "response_mime_type": "application/json",
            "temperature": 0.2
        }
    )

    return {
        "roadmap": response.text
    }

   
@router.post("/regenerate-roadmap")
async def regenerate_roadmap(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    today = date.today().strftime("%Y-%m-%d")
    latest_task = (
        db.query(Task)
        .filter(Task.roadmap_id != None, Task.user_id == user.id)
        .order_by(Task.id.desc())
        .first()
    )

    if not latest_task:
        return {
            "message": "No roadmap found."
        }

    tasks = (
        db.query(Task)
        .filter(Task.roadmap_id == latest_task.roadmap_id, Task.user_id == user.id)
        .all()
    )

    completed = [
        task.title
        for task in tasks
        if task.status == "Completed"
    ]

    pending = [
        task.title
        for task in tasks
        if task.status == "Pending"
    ]

    print("COMPLETED:", completed)
    print("PENDING:", pending)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"""
The user's original goal is:

{latest_task.goal}

Completed tasks:

{completed}

Remaining tasks:

{pending}

The completed tasks MUST NOT be included again.

Create a completely new study roadmap ONLY for the remaining work.

If there are remaining tasks, you MUST always generate between 5 and 15 NEW tasks that continue from where the user stopped.

Do NOT return an empty array.

Return ONLY JSON.

Example:

{{
  "tasks":[
    {{
      "title":"...",
      "description":"...",
      "priority":"High",
      "due_date":"2026-07-15"
    }}
  ]
}}

4. due_date MUST be in YYYY-MM-DD format.

Today's date is:

{today}

Rules for due dates:

- Every due_date must be after today's date.
- Use YYYY-MM-DD format only.
- Schedule tasks over the next 1–30 days.
- Never generate dates in the past. 
5. Use realistic future dates.
""",
        config={
            "response_mime_type": "application/json",
            "temperature": 0.2
        }
    )

    print("\n========== RAW GEMINI RESPONSE ==========")
    print(response.text)
    print("=========================================\n")

    parsed = json.loads(response.text)

    print("\n========== PARSED ==========")
    print(parsed)
    print("============================\n")

    new_tasks = parsed["tasks"]

    print("\n========== NEW TASKS ==========")
    print(new_tasks)
    print("===============================\n")

    # Delete only pending tasks
    for task in tasks:
        if task.status == "Pending":
            db.delete(task)

    db.commit()

    print("Pending tasks deleted.")

    # Insert regenerated tasks
    for task in new_tasks:

        print("INSERTING:", task)

        try:
            db.add(
                Task(
                    title=task["title"],
                    description=task["description"],
                    priority=task["priority"],
                    due_date=datetime.strptime(
                        task["due_date"],
                        "%Y-%m-%d"
                    ),
                    status="Pending",
                    user_id=user.id,
                    roadmap_id=latest_task.roadmap_id,
                    goal=latest_task.goal
                )
            )

        except Exception as e:
            print("FAILED TO BUILD TASK:", e)

    try:
        db.commit()
        print("COMMIT SUCCESS")

    except Exception as e:
        db.rollback()
        print("COMMIT FAILED:", e)
        raise

    return {
        "message": "Roadmap regenerated successfully."
    }