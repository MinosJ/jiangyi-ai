from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from app.services.rag import get_knowledge_stats
from app.services.ingest import ingest_all_data

router = APIRouter(tags=["ingest"])


class IngestResponse(BaseModel):
    message: str
    chunks_added: int = 0


@router.post("/ingest", response_model=IngestResponse)
async def ingest_data():
    """Trigger knowledge base ingestion from local data files."""
    count = await ingest_all_data()
    return IngestResponse(
        message=f"成功摄入 {count} 个文档片段到知识库",
        chunks_added=count,
    )


@router.get("/knowledge/stats")
async def knowledge_stats():
    """Get knowledge base statistics."""
    return get_knowledge_stats()
