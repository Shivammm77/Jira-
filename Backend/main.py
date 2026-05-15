from fastapi import FastAPI
from router.auth import auth 
from router.workspac import work
from router.project import project1
from router.task import task_router
from contextlib import asynccontextmanager
from database.db import create_db
from fastapi.middleware.cors import CORSMiddleware
import database.Model
@asynccontextmanager
async def lifespan(app : FastAPI):
    create_db()
    yield
    
app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # React frontend
        "http://127.0.0.1:3000",
        "https://jira-sk.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/{user}")
def working(user:str):
    return {"message" : f"working{user}"}

app.include_router(auth )
app.include_router(work )
app.include_router(project1 )
app.include_router(task_router , prefix="/tasks")