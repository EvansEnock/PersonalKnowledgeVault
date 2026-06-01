from sqlalchemy.orm import Session

from app.database import models
from app.schemas.note import NoteCreate, NoteUpdate
from app.services.ai_service import summarize


def get_notes(db: Session, owner_id: int) -> list[models.Note]:
    return db.query(models.Note).filter(models.Note.owner_id == owner_id).all()


def get_note(db: Session, note_id: int, owner_id: int) -> models.Note | None:
    return (
        db.query(models.Note)
        .filter(models.Note.id == note_id, models.Note.owner_id == owner_id)
        .first()
    )


def create_note(
    db: Session,
    data: NoteCreate,
    owner_id: int,
    file_path: str | None = None,
) -> models.Note:
    note = models.Note(
        title=data.title,
        content=data.content,
        summary=summarize(data.content),
        file_path=file_path,
        owner_id=owner_id,
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


def update_note(
    db: Session,
    note: models.Note,
    data: NoteUpdate,
) -> models.Note:
    if data.title is not None:
        note.title = data.title
    if data.content is not None:
        note.content = data.content
        note.summary = summarize(data.content)   # regenerate summary
    db.commit()
    db.refresh(note)
    return note


def delete_note(db: Session, note: models.Note) -> None:
    db.delete(note)
    db.commit()
