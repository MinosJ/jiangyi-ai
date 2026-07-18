from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    deepseek_api_key: str = "your_deepseek_api_key_here"
    deepseek_base_url: str = "https://api.deepseek.com"
    deepseek_chat_model: str = "deepseek-chat"
    deepseek_embedding_model: str = "deepseek-chat"
    chroma_persist_dir: str = "./chroma_db"
    data_dir: str = "./data"
    chroma_collection_name: str = "jiangyi_knowledge"

    # RAG parameters
    chunk_size: int = 500
    chunk_overlap: int = 100
    retrieval_top_k: int = 5

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
