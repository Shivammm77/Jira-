from database.db import Base
from sqlalchemy import Column , Integer  , String , Date
from sqlalchemy.orm import relationship
from datetime import date
from enum import Enum

class User(Base):
    __tablename__ = "user"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    email = Column(String, nullable=False)
    password = Column(String)
    create_at = Column(Date, default=date.today)
    assigned_tasks = relationship("Task", back_populates="assignee")
    workspace_members = relationship("WorkspaceMember", back_populates="user")
    

     