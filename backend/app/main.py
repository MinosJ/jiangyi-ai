import asyncio
import os

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.routers import chat, ingest

settings = get_settings()


async def _background_ingest():
    """Run ingest in background so the server can pass health checks immediately."""
    await asyncio.sleep(2)
    try:
        from app.services.rag import get_collection
        collection = get_collection()
        if collection.count() == 0:
            print("[startup] Knowledge base empty, auto-ingesting...")
            from app.services.ingest import ingest_all_data
            count = await ingest_all_data()
            print(f"[startup] Ingested {count} chunks")
        else:
            print(f"[startup] Knowledge base has {collection.count()} chunks")
    except Exception as e:
        print(f"[startup] Ingest error: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(_background_ingest())
    yield
    task.cancel()


app = FastAPI(
    title="蒋毅 AI 数字分身",
    description="基于 RAG 的个人 AI 网站后端",
    version="1.0.0",
    lifespan=lifespan,
)

allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
extra_origin = os.getenv("FRONTEND_URL")
if extra_origin:
    allowed_origins.append(extra_origin.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.(vercel\.app|cpolar\.top|cpolar\.cn|vicp\.fun|github\.io)",
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
