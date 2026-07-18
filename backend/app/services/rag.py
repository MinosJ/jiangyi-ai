import chromadb
from chromadb.config import Settings as ChromaSettings
from app.config import get_settings
from app.services.embedding import get_embedding, get_embeddings
from pathlib import Path

settings = get_settings()

chroma_client = chromadb.PersistentClient(
    path=settings.chroma_persist_dir,
    settings=ChromaSettings(anonymized_telemetry=False),
)


def get_collection():
    return chroma_client.get_or_create_collection(
        name=settings.chroma_collection_name,
        metadata={"hnsw:space": "cosine"},
    )


async def query_knowledge(question: str, top_k: int = None) -> list[dict]:
    """Query the knowledge base and return relevant document chunks with metadata."""
    if top_k is None:
        top_k = settings.retrieval_top_k

    collection = get_collection()
    if collection.count() == 0:
        return []

    query_vector = await get_embedding(question)

    results = collection.query(
        query_embeddings=[query_vector],
        n_results=min(top_k, collection.count()),
        include=["documents", "metadatas", "distances"],
    )

    docs = []
    if results and results["documents"]:
        for i, doc in enumerate(results["documents"][0]):
            docs.append({
                "content": doc,
                "metadata": results["metadatas"][0][i] if results["metadatas"] else {},
                "distance": results["distances"][0][i] if results["distances"] else 0,
            })
    return docs


def build_context(docs: list[dict]) -> str:
    """Build context string from retrieved documents."""
    if not docs:
        return ""
    parts = []
    for i, doc in enumerate(docs, 1):
        source = doc["metadata"].get("source", "未知来源")
        category = doc["metadata"].get("category", "")
        header = f"[资料{i} - {category}: {source}]" if category else f"[资料{i}: {source}]"
        parts.append(f"{header}\n{doc['content']}")
    return "\n\n---\n\n".join(parts)


async def add_documents(
    texts: list[str],
    metadatas: list[dict],
    ids: list[str],
):
    """Add document chunks to the knowledge base."""
    collection = get_collection()
    embeddings = await get_embeddings(texts)
    collection.add(
        documents=texts,
        embeddings=embeddings,
        metadatas=metadatas,
        ids=ids,
    )
    return len(texts)


def get_knowledge_stats() -> dict:
    """Get statistics about the knowledge base."""
    collection = get_collection()
    count = collection.count()
    return {
        "total_chunks": count,
        "collection_name": settings.chroma_collection_name,
    }
