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
# def require_role(required_roles: list[str]):
#     def role_checker(current_user: dict = Depends(get_current_user)):
#         if current_user["role"] not in required_roles:
#             raise HTTPException(
#                 status_code=403,
#                 detail="You do not have permission"
#             )
#         return current_user
#     return role_checker
def create_workspace(space : workspace , db : Session  ,current_user ):
    
   
    new_workspace =  Workspace(
        workspacename = space.name,
        created_at = space.created_at,
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
    invite_user  = db.query(User).filter(User.username == username).first()
    exist_member = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.user_id == invite_user.user_id
    ).first()

    if exist_member :
        raise HTTPException(status_code=403, detail="You are already here")
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

def limit_of_member():
    pass
#  ek team me 5 se jyda member
def delete_workspace(workspace_id : int , current_user :dict , db:Session):
  
    invite_member = db.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace_id , WorkspaceMember.user_id ==current_user["user_id"]).first()
    if not invite_member:
        raise HTTPException(status_code=403, detail="You are not a member of this workspace")
    if invite_member.role != Roles.PM:
       raise HTTPException(status_code=403, detail="You are not allowed to invite member")
    exist_workspace = db.query(Workspace)._filter(Workspace.work_id == workspace_id).first()
    if not exist_workspace :
       raise HTTPException(status_code=404 , detail="workspace does not exist")
    db.delete(exist_workspace)
    db.commit()
    return exist_workspace

    
    
  