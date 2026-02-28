# workspace
# task
# project
# user

from pydantic import BaseModel , Field  , EmailStr
from datetime import datetime
from enum import Enum
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
    created_at : datetime
class update_workspace(workspace):
     pass    

class invitemember(BaseModel):
     username : str
     role : Roles   
class task(BaseModel):
    title : str = Field(max_length=60)
    desc :str = Field(max_length=300)
    status : Status
    created_at : datetime
    updated_at : datetime
class update_task(task):
   status : Status
   updated_at : datetime    
class project(BaseModel):
    name : str = Field(max_length=60)
class update_project(project):
    pass
class user(BaseModel):
    name :  str = Field(max_length=60)
    email : EmailStr
    password :str = Field(max_length=60)
    created_at : datetime
    
class Config : 
        from_attribute = True
        
