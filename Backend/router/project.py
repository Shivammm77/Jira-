from fastapi import FastAPI , APIRouter , Depends
from database.db import get_db
from Service.authl3 import getcurrentuser
from Service.projectl4 import create_project , rename_project , get_all_project_task , delete_project
from database.Model.task import Task
from database.Schema.schema import project , update_project
from sqlalchemy.orm import Session
project1 = APIRouter()
@project1.post("/{workspace_id}/create_project")
def create_project2(data: project,workspace_id: int  , current_user : dict = Depends(getcurrentuser) , db : Session= Depends(get_db)):
    return create_project(workspace_id , current_user , data.name , db)
@project1.get("/{workspace_id}/{exist_id}/getall_task")
def get_task(workspace_id : int , exist_id:int ,last_id:int , size:int ,  user : dict = Depends(getcurrentuser), db:Session =Depends(get_db)):
    return get_all_project_task(workspace_id, exist_id , last_id , size , user ,  db)

@project1.put("{workspace_id}/{project_id}/update_name")
def update_name(workspace_id ,update_name:update_project, project_id , current_user :dict = Depends(getcurrentuser) , db :Session = Depends(get_db)):
  return rename_project(workspace_id , current_user , update_name , project_id , db)

@project1.delete("{workspace_id}/{project_id}/delete_name")
def delete_existing_project(workspace_id:int , project_id:int , current_user:dict = Depends(getcurrentuser) , db:Session = Depends(get_db)):
   return delete_project(workspace_id , project_id , current_user , db)