from fastapi import APIRouter, BackgroundTasks, Depends, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from config.database import get_db

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/upload", status_code=202)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    # Uploads file, saves record, queues background parsing/vectorizing job
    ...