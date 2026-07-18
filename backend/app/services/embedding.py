"""Embedding service using DeepSeek Embedding API (OpenAI-compatible)."""

from openai import AsyncOpenAI
from app.config import get_settings

settings = get_settings()

_client = AsyncOpenAI(
    api_key=settings.deepseek_api_key,
    base_url=f"{settings.deepseek_base_url}/v1",
)

EMBEDDING_MODEL = "deepseek-embedding"


async def get_embedding(text: str) -> list[float]:
    """Get embedding vector for a single text via DeepSeek API."""
    response = await _client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=[text],
    )
    return response.data[0].embedding


async def get_embeddings(texts: list[str]) -> list[list[float]]:
    """Get embedding vectors for multiple texts via DeepSeek API (batched)."""
    if not texts:
        return []
    batch_size = 20
    all_embeddings = []
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        response = await _client.embeddings.create(
            model=EMBEDDING_MODEL,
            input=batch,
        )
        sorted_data = sorted(response.data, key=lambda x: x.index)
        all_embeddings.extend([item.embedding for item in sorted_data])
    return all_embeddings
