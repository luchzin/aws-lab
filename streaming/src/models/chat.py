from datetime import datetime
from pydantic import BaseModel, Field


class Chat(BaseModel):
    id: str
    user_id: str
    title: str
    created_at: datetime
    updated_at: datetime


class ChatCreate(BaseModel):
    title: str = Field(default="New Chat")


class ChatResponse(Chat):
    pass