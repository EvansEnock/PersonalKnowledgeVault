import os
import shutil

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.config import UPLOAD_DIR
from app.core.logger import logger
from app.core.security import get_current_user
from app.database.db import get_db
from app.database import models
from app.services import note_service
from app.schemas.note import NoteCreate
from app.utils.validators import validate_file_extension, validate_file_size
from app.utils.helpers import generate_unique_filename

router = APIRouter(prefix="/uploads", tags=["Uploads"])

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/", status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Upload a file and create an associated note.
    Supported types: .pdf, .txt, .md, .png, .jpg, .jpeg (max 10 MB).
    """
    validate_file_extension(file.filename)

    # Read content to check size
    content = await file.read()
    validate_file_size(len(content))

    # Save to disk with a unique name
    safe_name = generate_unique_filename(file.filename)
    dest_path = os.path.join(UPLOAD_DIR, safe_name)
    with open(dest_path, "wb") as f:
        f.write(content)

    logger.info(f"User {current_user.username} uploaded '{file.filename}' → '{safe_name}'")

    # Extract text from .txt / .md for note content; otherwise store a placeholder
    text_content = ""
    ext = os.path.splitext(file.filename)[-1].lower()
    if ext in (".txt", ".md"):
        try:
            text_content = content.decode("utf-8", errors="replace")
        except Exception:
            text_content = ""

    note_data = NoteCreate(
        title=file.filename,
        content=text_content or f"[Uploaded file: {file.filename}]",
    )
    note = note_service.create_note(db, note_data, current_user.id, file_path=dest_path)

    return {
        "message": "File uploaded successfully",
        "filename": safe_name,
        "original_filename": file.filename,
        "note_id": note.id,
        "size_bytes": len(content),
    }


@router.get("/{filename}")
def download_file(
    filename: str,
    current_user: models.User = Depends(get_current_user),
):
    """Download a previously uploaded file by its stored filename."""
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
    return FileResponse(file_path, filename=filename)
