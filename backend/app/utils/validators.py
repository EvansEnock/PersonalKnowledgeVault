import os
from fastapi import HTTPException, status
from app.core.config import ALLOWED_EXTENSIONS


def validate_file_extension(filename: str) -> str:
    """Raise 400 if the file extension is not in the allow-list."""
    ext = os.path.splitext(filename)[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type '{ext}' not allowed. Allowed: {ALLOWED_EXTENSIONS}",
        )
    return ext


def validate_file_size(size_bytes: int, max_mb: int = 10) -> None:
    """Raise 413 if the file exceeds the maximum allowed size."""
    max_bytes = max_mb * 1024 * 1024
    if size_bytes > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Maximum size is {max_mb} MB.",
        )
