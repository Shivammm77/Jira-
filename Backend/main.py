from fastapi import FastAPI
from router.auth import auth 
from router.workspac import work
from router.project import project1
from router.task import task_router
from contextlib import asynccontextmanager
from database.db import create_db
import database.Model
@asynccontextmanager
async def lifespan(app : FastAPI):
    create_db()
    yield
    
app = FastAPI(lifespan=lifespan)
@app.middleware("http")

@app.get("/{user}")
def working(user:str):
    return {"message" : f"working{user}"}

app.include_router(auth , prefix="/v1/api")
app.include_router(work , prefix="/v2/workspace")
app.include_router(project1 , prefix="/v3/project")
app.include_router(task_router , prefix="/v4/task")