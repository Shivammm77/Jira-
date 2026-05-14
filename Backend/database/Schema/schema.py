# workspace
# task
# project
# user

from pydantic import BaseModel , Field  , EmailStr
from datetime import datetime
from enum import Enum
from typing import Optional
class Roles(Enum):
    PM = "PROJECT_MANAGER"
    developer = "DEVELOPER"
    viewer = "VIEWER" 
class Status(Enum):
    in_progress = "IN_PROGRESS"
    pending = "PENDING"
    done = "DONE" 

class workspace(BaseModel):
    name : str = Field(max_length=60)
    
class update_workspace(workspace):
     name : Optional[str] = None  

class invitemember(BaseModel):
     username : str
     role : Roles   

class task(BaseModel):
    title: str = Field(max_length=60)

    description: Optional[str] = Field(default=None,max_length=300)
    status: Status = Status.pending

    assignee_id: Optional[int] = None
class UpdateTask(BaseModel):
    

    status: Optional[Status] = None

    
class project(BaseModel):
    name : str = Field(max_length=60)
class update_project(project):
     pass
class user(BaseModel):
    name :  str = Field(max_length=60)
    email : EmailStr
    password :str = Field(max_length=60)
   
    
class Config : 
        from_attribute = True
        
