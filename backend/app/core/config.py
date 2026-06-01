
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY: str = os.getenv("SECRET_KEY", "fallback_secret_change_me")
DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./vault.db")
OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
ALGORITHM: str = os.getenv("ALGORITHM", "HS256")

UPLOAD_DIR: str = "uploads"
ALLOWED_EXTENSIONS: list[str] = [".pdf", ".txt", ".md", ".png", ".jpg", ".jpeg"]
