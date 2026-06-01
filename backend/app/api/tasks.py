from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.db import get_db
from app.database import models
from app.schemas.task import TaskCreate, TaskUpdate, TaskOut

router = APIRouter(prefix="/tasks", tags=["Tasks"])


def _get_task_or_404(task_id: int, owner_id: int, db: Session) -> models.Task:
    task = (
        db.query(models.Task)
        .filter(models.Task.id == task_id, models.Task.owner_id == owner_id)
        .first()
    )
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


@router.get("/", response_model=list[TaskOut])
def list_tasks(
    done: bool | None = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """List all tasks. Optionally filter by completion status with ?done=true/false."""
    query = db.query(models.Task).filter(models.Task.owner_id == current_user.id)
    if done is not None:
        query = query.filter(models.Task.is_done == done)
    return query.all()


@router.post("/", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(
    data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Create a new task."""
    task = models.Task(
        title=data.title,
        description=data.description,
        owner_id=current_user.id,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.get("/{task_id}", response_model=TaskOut)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Get a single task by ID."""
    return _get_task_or_404(task_id, current_user.id, db)


@router.patch("/{task_id}", response_model=TaskOut)
def update_task(
    task_id: int,
    data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Update a task's title, description, or completion status."""
    task = _get_task_or_404(task_id, current_user.id, db)
    if data.title is not None:
        task.title = data.title
    if data.description is not None:
        task.description = data.description
    if data.is_done is not None:
        task.is_done = data.is_done
    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Delete a task."""
    task = _get_task_or_404(task_id, current_user.id, db)
    db.delete(task)
    db.commit()
