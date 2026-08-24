from fastapi import FastAPI

from controller.auth import router as auth_router


app = FastAPI(
    title="RAG Chat API",
    version="0.1.0",
)


app.include_router(auth_router)


@app.get("/")
async def root():
    return {
        "message": "RAG Chat API is running"
    }