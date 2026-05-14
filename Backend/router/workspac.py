from fastapi import APIRouter  , Depends , HTTPException
from database.db import get_db
from sqlalchemy.orm import Session 
from database.Schema.schema import workspace , update_workspace
from database.Schema.schema import Roles , invitemember
from Service.workspacel1 import create_workspace , invite_member , get_all_workspaces , get_members , update ,  delete_workspace
from Service.authl3 import  getcurrentuser
work  = APIRouter(prefix="/workspace")
@work.post("/create_workspace")
def new_workspace(name:workspace , user : dict = Depends(getcurrentuser),db : Session = Depends(get_db)):
    return create_workspace(name , db , user) 
@work.post("/{workspace_id}/new_member")
def new_member(data:invitemember,   workspace_id:int   , current_user:dict= Depends(getcurrentuser)  , db:Session=Depends(get_db) ):
    return invite_member(data.username ,data.role, workspace_id , current_user , db)

@work.get("/allworkspace")
def get_workspaces(
    current_user: dict = Depends(getcurrentuser),
    db: Session = Depends(get_db)
):
    return get_all_workspaces(current_user, db)
@work.get("/{workspace_id}/members")
def get_members_route(
    workspace_id: int,
    current_user: dict = Depends(getcurrentuser),
    db: Session = Depends(get_db)
):
    return get_members(workspace_id, current_user, db)
@work.put("/workspace/{workspace_id}")
def update_route(workspcae_id ,data : update_workspace ,  current_user : Session = Depends(getcurrentuser) , db : Session = Depends(get_db)):
    return update(workspcae_id ,data ,  current_user , db)
@work.delete("/{workspace_id}")
def delete_workspace_route(
    workspace_id: int,
    current_user: dict = Depends(getcurrentuser),
    db: Session = Depends(get_db)
):
    return delete_workspace(
        workspace_id,
        current_user,
        db
    )
