from datetime import datetime, UTC
from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    title: str
    description: str | None = None


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    is_done: bool | None = None


class TaskOut(BaseModel):
    id: int
    title: str
    description: str | None
    is_done: bool
    owner_id: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    model_config = {"from_attributes": True}
