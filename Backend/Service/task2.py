# project - > task
# only pm can make task and assign to developer
#pm can see all task
# status check
# how to check current user is project manager or not 
# 
from database.Schema.schema import task , Roles , Status
from database.Model.task import Task
from database.Model.project import Project
from database.Model.workspace import Workspace , WorkspaceMember
from sqlalchemy.orm import Session
from fastapi import HTTPException ,status
def create_task(
    task1,
    current_user,
    workspace_id,
    user_id,
    project_id,
    db
):

    # check project exists
    project = (
        db.query(Project)
        .filter(
            Project.project_id == project_id,
            Project.workspace_id == workspace_id
        )
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    # current user member?
    current_member = (
        db.query(WorkspaceMember)
        .filter(
            WorkspaceMember.user_id == current_user["user_id"],
            WorkspaceMember.workspace_id == workspace_id
        )
        .first()
    )

    if not current_member:
        raise HTTPException(
            status_code=403,
            detail="You are not member of workspace"
        )

    # permission
    if current_member.role != Roles.PM:
        raise HTTPException(
            status_code=403,
            detail="Only PM can create tasks"
        )

    # assignee exists?
    assignee = (
        db.query(WorkspaceMember)
        .filter(
            WorkspaceMember.user_id == user_id,
            WorkspaceMember.workspace_id == workspace_id
        )
        .first()
    )

    if not assignee:
        raise HTTPException(
            status_code=404,
            detail="Invalid assignee"
        )

    new_task = Task(
        title=task1.title,
        description=task1.description,
        status=task1.status,
        project_id=project.project_id,
        assignee_id=user_id,
        created_by=current_user["user_id"]
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return {
        "message": "Task created successfully",
        "task": new_task
    }
def get_task_or_404(task_id,current_user,  db):

    task = (
        db.query(Task)
        .filter(Task.task_id == task_id)
        .first()
    )
    if task.created_by != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="Permission denied"
        )


    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return task

def get_all_tasks(
    project_id,
    current_user,
    db
):

    tasks = (
        db.query(Task)
        .filter(Task.project_id == project_id)
        .all()
    )

    return {
        "total_tasks": len(tasks),
        "tasks": tasks
    }

def get_single_task(
    task_id,
    current_user,
    db
):

    task = get_task_or_404(task_id,current_user, db)

    return task
def update_task(
    task_id,
    data,
    current_user,
    db
):

    task = get_task_or_404(task_id, current_user , db)

    if task.created_by != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="Permission denied"
        )

    if task.status != data.status :
        task.status = data.status

    db.commit()
    db.refresh(task)

    return {
        "message": "Task updated successfully",
        "task": task
    }

def delete_task(
    task_id,
    current_user,
    db
):

    task = get_task_or_404(task_id,current_user , db)

    if task.created_by != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="Permission denied"
        )

    db.delete(task)
    db.commit()

    return {
        "message": "Task deleted successfully"
    }