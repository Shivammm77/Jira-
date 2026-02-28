from database.db import Base
from sqlalchemy import Column , String , Integer , ForeignKey  , Date
from datetime import date

from sqlalchemy import Enum as SQLEnum 
from sqlalchemy.orm import relationship
from enum import Enum
from database.Schema.schema import Roles
class Workspace(Base):
    __tablename__ = "workspace"

    work_id = Column(Integer, primary_key=True, index=True)
    workspacename = Column(String, nullable=False, unique=True)
    created_by = Column(ForeignKey("user.user_id"))
    created_at = Column(Date, default=date.today)

    projects = relationship("Project", back_populates="workspace")
    members = relationship("WorkspaceMember", back_populates="workspace")


class WorkspaceMember(Base):
    __tablename__ = "workspace_member"

    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(ForeignKey("workspace.work_id" , ondelete="CASCADE"))
    user_id = Column(ForeignKey("user.user_id" , ondelete="CASCADE"))
    role = Column(SQLEnum(Roles), nullable=False)

    workspace = relationship("Workspace", back_populates="members")
    user = relationship("User", back_populates="workspace_members")
