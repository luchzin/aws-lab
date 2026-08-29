from fastapi import APIRouter, Depends, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from config.database import get_db

router = APIRouter(prefix="/chat", tags=["Chat"])

# --- NEW CHAT ---
@router.post("/newChat", status_code=status.HTTP_201_CREATED)
async def new_chat(
    payload,
    db: AsyncSession = Depends(get_db),
):
    # Initializes a chat session linked to document_id
    ...

# --- SEND MESSAGE (RAG STREAM) ---
@router.post("")
async def chat_query(
    payload,
    db: AsyncSession = Depends(get_db),
):
    # Performs vector search and streams back the LLM answer
    return None