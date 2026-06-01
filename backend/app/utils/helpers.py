import os
import uuid
from datetime import datetime, timezone


def utcnow() -> datetime:
    """Return the current UTC time as a timezone-aware datetime."""
    return datetime.now(timezone.utc)


def generate_unique_filename(original_filename: str) -> str:
    """Prefix the original filename with a UUID to avoid collisions."""
    ext = os.path.splitext(original_filename)[-1].lower()
    return f"{uuid.uuid4().hex}{ext}"


def safe_read_file(path: str) -> bytes | None:
    """Read a file from disk safely; return None if it doesn't exist."""
    try:
        with open(path, "rb") as f:
            return f.read()
    except FileNotFoundError:
        return None
