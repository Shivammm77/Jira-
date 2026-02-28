from database.Model.project import Project
from fastapi import HTTPException , Request , Response
from database.Model.workspace import Workspace , WorkspaceMember
from database.Model.task import Task
from database.Schema.schema import Roles
from database.Schema.schema import update_project
from sqlalchemy.orm import Session
# project - get all task 


def create_project(workspace_id:int,current_user:dict , new_project:str,  db:Session ):
    member = db.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace_id , WorkspaceMember.user_id == current_user["user_id"] ).first()
    if not member or  member.role != Roles.PM:
        raise HTTPException(status_code=403 , detail="You ain't allow man" )
    new_project = Project(
        project_name = new_project ,
        workspace_id = member.workspace_id
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return {
        "messsage" : "Project created successfully",
        "projectname" : new_project.project_name,
        "project_id" : new_project.workspace_id
    }    
def rename_project(workspace_id:int,current_user:dict , update_name:update_project,project_id : int,  db:Session): 
    member = db.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace_id , WorkspaceMember.user_id == current_user["user_id"] ).first()
    if not member or  member.role != Roles.PM:
        raise HTTPException(status_code=403 , detail="You ain't allow man" )
    exist_project = db.query(Project).filter(Project.project_id == project_id , Project.workspace_id == workspace_id).first()
    if not exist_project :
        raise HTTPException(status_code=404 , detail="Project not found")
    exist_project.project_name = update_name.name

    db.add(exist_project)
    db.commit()
    db.refresh(exist_project)
    return {
        "messsage" : "Project updated successfully",
        "projectname" : exist_project.project_name,
        "project_id" : exist_project.workspace_id
    } 
def get_all_project_task(workspace_id:int,project_id : int, last_id , size , current_user:dict ,  db:Session):
    member = db.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace_id , WorkspaceMember.user_id == current_user["user_id"] ).first()
    if not member :
        raise HTTPException(status_code=403 , detail="You ain't allow man" )
    query = db.query(Task).filter(
        Task.project_id == project_id
    )
    if not query :
        raise HTTPException(status_code=404 , detail="Project not found")

    if last_id:
        query = query.filter(Task.task_id <= last_id)

    tasks = query.order_by(Task.task_id.desc()).limit(size).all()

    return tasks

def delete_project(workspace_id:int ,project_id:int ,current_user:dict , db : Session ):
   
   member = db.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace_id , WorkspaceMember.user_id == current_user["user_id"] ).first()
   if not member  :
        raise HTTPException(status_code=404 , detail="You ain't allow man" )
   if  member.role != Roles.PM:
       raise HTTPException(status_code=403 ,detail="only project manager can delete project" )
   exist_project = db.query(Project).filter(Project.project_id == project_id , Project.workspace_id == workspace_id).first()
   db.delete(exist_project)
   db.commit()
   
   return {
       "message" : "Project is deleted Successfully",
       "project" : exist_project
   }