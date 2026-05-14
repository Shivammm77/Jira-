#  first user will make workspace only pm can delete the workspace 
#  pm can access all projects and task too everything
#  create_workspace , delete workspace  , access projects , task  , invite member toh he can remove add members 
from database.Schema.schema import workspace , Roles 
from fastapi import Depends
from sqlalchemy.orm import Session
from fastapi import HTTPException
from .authl3 import getcurrentuser
from database.Model.user import User
from database.Model.workspace import Workspace , WorkspaceMember
def require_role(role :list[str]):
    def get_role(user:dict = Depends(getcurrentuser)):
        if user["role"] not in require_role :
            raise HTTPException(status_code=403 , detail="You are not allowed")
        return user
    return get_role


def update(workspace_id ,data ,  current_user , db):
    workspace = db.query(Workspace).filter(Workspace.work_id == workspace_id).first()
    if not workspace:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found"
        )
    member = db.query(WorkspaceMember).filter( WorkspaceMember.workspace_id == workspace_id,WorkspaceMember.user_id == current_user["user_id"]).first()
    if not member :
        raise HTTPException(status_code=403 , detail="you are not the part of this workspace")
    if member.role != Roles.PM:
        raise HTTPException(status_code=403 , detail= "permission denied")
    if data.name:
        workspace.workspacename = data.name

    db.commit()
    db.refresh(workspace)

    return {
        "message": "Workspace updated successfully",
        "workspace": {
            "id": workspace.work_id,
            "name": workspace.workspacename
        }
    }


def delete_workspace( workspace_id, current_user,db):
    workspace = db.query(Workspace).filter( Workspace.workspace_id == workspace_id).first()
    if not workspace:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found"
        )
    member = db.query(WorkspaceMember).filter( WorkspaceMember.workspace_id == workspace_id, WorkspaceMember.user_id == current_user["user_id"]).first()
    
    if not member:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )
    if member.role != "PROJECT_MANAGER":
        raise HTTPException(
            status_code=403,
            detail="Only owner can delete workspace"
        )
    db.delete(workspace)
    db.commit()

    return {
        "message": "Workspace deleted successfully"
    }
def get_all_workspaces(current_user, db):

    workspaces = (
        db.query(Workspace)
        .join(
            WorkspaceMember,
            Workspace.work_id == WorkspaceMember.workspace_id 
        )
        .filter(
            WorkspaceMember.user_id == current_user["user_id"]
        )
        .all()
    )

    return workspaces
def get_members(workspace_id, current_user, db):
    member = (
        db.query(WorkspaceMember)
        .filter(
            WorkspaceMember.workspace_id == workspace_id,
            WorkspaceMember.user_id == current_user["user_id"]
        )
        .first()
    )

    if not member:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    members = (
        db.query(WorkspaceMember)
        .filter(
            WorkspaceMember.workspace_id == workspace_id
        )
        .all()
    )

    return members
def create_workspace(space : workspace , db : Session  ,current_user ):
    
   
    new_workspace =  Workspace(
        workspacename = space.name,
       
        created_by = current_user["user_id"]
    )
    db.add(new_workspace)
    db.flush()
    member = WorkspaceMember(

        role = Roles.PM,
        workspace_id = new_workspace.work_id,
        user_id = current_user["user_id"]
    )
    db.add(member)

    db.commit()
    db.refresh(new_workspace)
    return new_workspace

def invite_member(username:str , role1 : Roles , workspace_id:int, current_user:Session, db:Session ):
    # pm can add any member by there username , 
    print("workspace_id:", workspace_id)
    print("current_user:", current_user)
    invite_member = db.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace_id , WorkspaceMember.user_id ==current_user["user_id"]).first()
    print(invite_member)
    if not invite_member:
        raise HTTPException(status_code=403, detail="You are not a member of this workspace")
    if invite_member.role != Roles.PM:
       raise HTTPException(status_code=403, detail="You are not allowed to invite member")
    count = db.query(Workspace).filter(Workspace.work_id == workspace_id).count()
    if count >= 7:
     raise HTTPException(
        status_code=403,
        detail="Workspace member limit reached"
    )
    invite_user  = db.query(User).filter(User.username == username).first()
    if not invite_user : 
        raise HTTPException(status_code=403 , detail="user does not exist") 
    exist_member = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.user_id == invite_user.user_id
    ).first()

    if exist_member :
        raise HTTPException(status_code=403, detail="You are already here")
    if role1 == Roles.PM:
        raise HTTPException(
            status_code=403,
            detail="You cannot assign Project Manager role"
        )
    new_member = WorkspaceMember(
        workspace_id = invite_member.workspace_id,
        user_id = invite_user.user_id,
        role = role1
    )
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return {
        "massag" : "New Member added",
        "workspace_id" : workspace_id,
        "new_member" : invite_user.username,
        "User Role" : role1.value
    }    



def delete_workspace(workspace_id : int , current_user :dict , db:Session):
  
    invite_member = db.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace_id , WorkspaceMember.user_id ==current_user["user_id"]).first()
    if not invite_member:
        raise HTTPException(status_code=403, detail="You are not a member of this workspace")
    if invite_member.role != Roles.PM:
       raise HTTPException(status_code=403, detail="You are not allowed to invite member")
    exist_workspace = db.query(Workspace).filter(Workspace.work_id == workspace_id).first()
    if not exist_workspace :
       raise HTTPException(status_code=404 , detail="workspace does not exist")
    db.delete(exist_workspace)
    db.commit()
    return exist_workspace

    
    
  