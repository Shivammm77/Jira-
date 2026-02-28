from database.db import Base
from sqlalchemy import Column , String , Integer , ForeignKey  
from sqlalchemy.orm import relationship
from datetime import date
class Project(Base):
    __tablename__ = "project"

    project_id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String, nullable=False)
    workspace_id = Column(ForeignKey("workspace.work_id" , ondelete="CASCADE")  )
    tasks = relationship("Task", back_populates="project")
    workspace = relationship("Workspace", back_populates="projects")
   

   