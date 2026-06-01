from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.db import get_db
from app.database import models
from app.schemas.note import NoteCreate, NoteUpdate, NoteOut
from app.services import search_service
from app.services import note_service

router = APIRouter(prefix="/notes", tags=["Notes"])


@router.get("/", response_model=list[NoteOut])
def list_notes(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Return all notes for the authenticated user."""
    return note_service.get_notes(db, current_user.id)


@router.post("/", response_model=NoteOut, status_code=status.HTTP_201_CREATED)
def create_note(
    data: NoteCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Create a new note. An AI summary is generated automatically."""
    return note_service.create_note(db, data, current_user.id)


@router.get("/search", response_model=list[NoteOut])
def search_notes(
    q: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Search notes by keyword in title or content."""
    if not q.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Query cannot be empty")
    return search_service.search_notes(db, q, current_user.id)


@router.get("/{note_id}", response_model=NoteOut)
def get_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Return a single note by ID."""
    note = note_service.get_note(db, note_id, current_user.id)
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return note


@router.patch("/{note_id}", response_model=NoteOut)
def update_note(
    note_id: int,
    data: NoteUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Partially update a note's title or content."""
    note = note_service.get_note(db, note_id, current_user.id)
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return note_service.update_note(db, note, data)


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Delete a note."""
    note = note_service.get_note(db, note_id, current_user.id)
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    note_service.delete_note(db, note)
