from fastapi import APIRouter , Depends 
from Service.task2 import create_task
from sqlalchemy.orm import Session
from database.Schema.schema import task
from database.db import get_db
from Service.authl3 import getcurrentuser
task_router = APIRouter()
@task_router.post("/{workspace_id}/{project_id}/create_task")
def create_task_org(task1:task ,workspace_id : int ,  user_id : int ,  project_id:int, current_user :dict= Depends(getcurrentuser) , db:Session = Depends(get_db) ):
 return create_task(task1 , current_user , workspace_id , user_id , project_id  , db )