from database.db import Base
from sqlalchemy import Column , String , Integer , ForeignKey , Date
from sqlalchemy.orm import relationship
from datetime import date
from database.Schema.schema import Status
from enum import Enum
class Task(Base):
    __tablename__ = "task"

    task_id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    status = Column(String, nullable=False)
    assignee_id = Column(ForeignKey("user.user_id" , ondelete="SET NULL"))
    project_id = Column(ForeignKey("project.project_id" , ondelete="CASCADE") )
    

    project = relationship("Project", back_populates="tasks")
    assignee = relationship("User", back_populates="assigned_tasks")

    created_by = Column(String, nullable=False)
    created_at = Column(Date)
    updated_at = Column(Date)


# 5️⃣ tasks

# id

# title

# description

# status (todo / in_progress / done)

# project_id

# assigned_to (user_id)

# created_by

# created_at

# updated_at    