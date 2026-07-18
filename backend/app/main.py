from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.routers import chat, ingest

settings = get_settings()

app = FastAPI(
    title="蒋毅 AI 数字分身",
    description="基于 RAG 的个人 AI 网站后端",
    version="1.0.0",
)

import os

allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
extra_origin = os.getenv("FRONTEND_URL")
if extra_origin:
    allowed_origins.append(extra_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api")
app.include_router(ingest.router, prefix="/api")


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "jiangyi-ai-backend",
        "model": settings.deepseek_chat_model,
    }
