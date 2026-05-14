from fastapi import APIRouter , Depends 
from Service.task2 import create_task , get_all_tasks , get_single_task  , update_task , delete_task
from sqlalchemy.orm import Session
from database.Schema.schema import task , UpdateTask
from database.db import get_db
from Service.authl3 import getcurrentuser
task_router = APIRouter()
@task_router.post("/{workspace_id}/{project_id}/create_task")
def create_task_org(task1:task ,workspace_id : int ,  user_id : int ,  project_id:int, current_user :dict= Depends(getcurrentuser) , db:Session = Depends(get_db) ):
 return create_task(task1 , current_user , workspace_id , user_id , project_id  , db )

@task_router.get("/{project_id}")
def all_tasks(
    project_id: int,
    current_user: dict = Depends(getcurrentuser),
    db: Session = Depends(get_db)
):
    return get_all_tasks(
        project_id,
        current_user,
        db
    )


# get single task
@task_router.get("/single/{task_id}")
def single_task(
    task_id: int,
    current_user: dict = Depends(getcurrentuser),
    db: Session = Depends(get_db)
):
    return get_single_task(
        task_id,
        current_user,
        db
    )


# update task
@task_router.put("/{task_id}")
def update_task_route(
    task_id: int,
    data: UpdateTask,
    current_user: dict = Depends(getcurrentuser),
    db: Session = Depends(get_db)
):
    return update_task(
        task_id,
        data,
        current_user,
        db
    )


# delete task
@task_router.delete("/{task_id}")
def delete_task_route(
    task_id: int,
    current_user: dict = Depends(getcurrentuser),
    db: Session = Depends(get_db)
):
    return delete_task(
        task_id,
        current_user,
        db
    )