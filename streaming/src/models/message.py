from datetime import datetime
from enum import Enum
from pydantic import BaseModel


class MessageRole(str, Enum):
    user = "user"
    assistant = "assistant"
    system = "system"


class Message(BaseModel):
    id: str
    chat_id: str
    role: MessageRole
    content: str
    created_at: datetime