# project - > task
# only pm can make task and assign to developer
#pm can see all task
# status check
# how to check current user is project manager or not 
# 
from database.Schema.schema import task , Roles , Status
from database.Model.task import Task
from database.Model.project import Project
from database.Model.workspace import Workspace , WorkspaceMember
from sqlalchemy.orm import Session
from fastapi import HTTPException ,status
def create_task(task1:task ,current_user :dict  ,workspace_id : int ,  user_id : int , project_id:int , db:Session ):
    project = db.query(Project).filter(Project.project_id == project_id , Project.workspace_id == workspace_id).first()
    
    if not project : 
       raise HTTPException(status_code=404 , detail="Project Not found")
    exist_user = db.query(WorkspaceMember).filter(WorkspaceMember.user_id == current_user.get("user_id"), 
                                                  WorkspaceMember.workspace_id ==workspace_id).first()
    if not exist_user :
        raise HTTPException(status_code=400 , detail="You are not a member of this workspace")
    if not exist_user.role == Roles.PM  : 
        HTTPException(status_code=400 , detail="You are not a project manager of this workspace")

    user = db.query(WorkspaceMember).filter(WorkspaceMember.user_id == user_id, 
                                                  WorkspaceMember.workspace_id ==workspace_id , WorkspaceMember.role == Roles.developer).first()
    if not user :
        raise HTTPException(status_code=403 , detail="its not a member of this workspace")
    new_task = Task(
        title = task1.title,
        description = task1.desc,
        status = task1.status.value,
        project_id = project.project_id,
        assignee_id = user.user_id,
        created_by = exist_user.user_id,
        created_at = task1.created_at,
        updated_at = task1.updated_at
        
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return {
        "message" : "Task is created",
        "Task" : new_task,
        "created_by" : current_user.get("user_id")
    }

