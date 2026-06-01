from sqlalchemy.orm import Session

from app.database import models


def search_notes(db: Session, keyword: str, owner_id: int) -> list[models.Note]:
    """Return notes whose title or content contains the keyword (case-insensitive)."""
    pattern = f"%{keyword}%"
    return (
        db.query(models.Note)
        .filter(
            models.Note.owner_id == owner_id,
            (models.Note.title.ilike(pattern) | models.Note.content.ilike(pattern)),
        )
        .all()
    )


def search_tasks(db: Session, keyword: str, owner_id: int) -> list[models.Task]:
    """Return tasks whose title or description contains the keyword."""
    pattern = f"%{keyword}%"
    return (
        db.query(models.Task)
        .filter(
            models.Task.owner_id == owner_id,
            (models.Task.title.ilike(pattern) | models.Task.description.ilike(pattern)),
        )
        .all()
    )
