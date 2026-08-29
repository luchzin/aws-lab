from fastapi import FastAPI
from controller.auth import router as auth_router
from controller.chat import router as chat_router
from controller.documents import router as documents_router

app = FastAPI(title=" RAG API",version="1.0.0")

app.include_router(auth_router)
app.include_router(documents_router)
app.include_router(chat_router)