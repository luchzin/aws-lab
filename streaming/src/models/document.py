from datetime import datetime
from pydantic import BaseModel


class Document(BaseModel):
    id: str
    user_id: str
    filename: str
    mime_type: str
    file_url: str
    status: str
    created_at: datetime