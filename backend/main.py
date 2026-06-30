from fastapi.middleware.cors import CORSMiddleware
from utils.security import hash_password
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
import google.genai as genai
import os
from database.database import Base, engine
from database.models import User
from database.task_models import Task
from routes.auth import router as auth_router
from routes.tasks import router as task_router
from routes.ai import router as ai_router
from routes.reminder import router as reminder_router

# Load environment variables
load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)
app = FastAPI(
    title="Sankat Mochan API",
    description="AI Productivity Companion",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(ai_router)
app.include_router(auth_router)
app.include_router(task_router)
app.include_router(reminder_router)

Base.metadata.create_all(bind=engine)


class TaskRequest(BaseModel):
    task: str
    deadline: str


@app.get("/")
def home():
    return {
        "message": "Welcome to Sankat Mochan 🚀"
    }


@app.post("/generate-plan")
def generate_plan(data: TaskRequest):

    prompt = f"""
You are Sankat Mochan, an AI productivity companion.

The user wants to complete:

Task:
{data.task}

Deadline:
{data.deadline}

Return ONLY valid JSON in this format:

{{
    "priority":"",
    "risk":"",
    "estimated_hours":"",
    "subtasks":[],
    "schedule":[],
    "motivation":""
}}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    return {
        "response": response.text
    }