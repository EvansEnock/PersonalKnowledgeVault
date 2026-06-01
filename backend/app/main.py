from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.logger import logger
from app.database.db import engine
from app.database.models import Base
from app.api import uploads
from app.api import auth, notes, tasks


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    logger.info("PKV API started")
    yield
    logger.info("PKV API stopped")


app = FastAPI(
    title="Personal Knowledge Vault (PKV)",
    description="A personal knowledge management API.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(notes.router)
app.include_router(tasks.router)
app.include_router(uploads.router)


@app.get("/", tags=["Health"])
def health():
    return {"status": "ok", "app": "Personal Knowledge Vault", "docs": "/docs"}
