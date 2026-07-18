from sentence_transformers import SentenceTransformer
import numpy as np

_model = None


def _get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer("BAAI/bge-small-zh-v1.5")
    return _model


async def get_embedding(text: str) -> list[float]:
    """Get embedding vector for a single text using local BGE model."""
    model = _get_model()
    embedding = model.encode(text, normalize_embeddings=True)
    return embedding.tolist()


async def get_embeddings(texts: list[str]) -> list[list[float]]:
    """Get embedding vectors for multiple texts."""
    if not texts:
        return []
    model = _get_model()
    embeddings = model.encode(texts, normalize_embeddings=True, batch_size=32)
    return embeddings.tolist()
