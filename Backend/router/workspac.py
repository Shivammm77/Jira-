from fastapi import APIRouter  , Depends , HTTPException
from database.db import get_db
from sqlalchemy.orm import Session 
from database.Schema.schema import workspace
from database.Schema.schema import Roles , invitemember
from Service.workspacel1 import create_workspace , invite_member
from Service.authl3 import  getcurrentuser
work  = APIRouter(prefix="/workspace")
@work.post("/create_workspace")
def new_workspace(name:workspace , user : dict = Depends(getcurrentuser),db : Session = Depends(get_db)):
    return create_workspace(name , db , user) 
@work.post("/{workspace_id}/new_member")
def new_member(data:invitemember,   workspace_id:int   , current_user:dict= Depends(getcurrentuser)  , db:Session=Depends(get_db) ):
    return invite_member(data.username ,data.role, workspace_id , current_user , db)