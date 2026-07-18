"""Document ingestion service - loads, splits, and stores documents into ChromaDB."""

import hashlib
from pathlib import Path
from bs4 import BeautifulSoup
from PyPDF2 import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.config import get_settings
from app.services.rag import add_documents, get_collection

settings = get_settings()

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=settings.chunk_size,
    chunk_overlap=settings.chunk_overlap,
    separators=["\n\n", "\n", "。", "！", "？", "；", "，", " ", ""],
)


def load_html(file_path: Path) -> str:
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        soup = BeautifulSoup(f.read(), "lxml")
    for tag in soup(["script", "style"]):
        tag.decompose()
    return soup.get_text(separator="\n", strip=True)


def load_pdf(file_path: Path) -> str:
    reader = PdfReader(str(file_path))
    texts = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            texts.append(text)
    return "\n\n".join(texts)


def load_text(file_path: Path) -> str:
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()


def load_code(file_path: Path) -> str:
    """Load code files with file path context."""
    content = load_text(file_path)
    return f"文件路径: {file_path.name}\n\n{content}"


LOADERS = {
    ".html": load_html,
    ".htm": load_html,
    ".pdf": load_pdf,
    ".txt": load_text,
    ".md": load_text,
    ".py": load_code,
    ".js": load_code,
    ".ts": load_code,
    ".tsx": load_code,
    ".jsx": load_code,
    ".swift": load_code,
    ".dart": load_code,
    ".json": load_text,
    ".csv": load_text,
}


def chunk_id(text: str, source: str) -> str:
    return hashlib.md5(f"{source}:{text[:100]}".encode()).hexdigest()


async def ingest_directory(
    dir_path: Path, category: str, extensions: set[str] | None = None
) -> int:
    """Ingest all supported files from a directory."""
    if not dir_path.exists():
        return 0

    all_texts = []
    all_metas = []
    all_ids = []

    for file_path in sorted(dir_path.rglob("*")):
        if not file_path.is_file():
            continue
        if "node_modules" in str(file_path) or ".git" in str(file_path):
            continue
        if "__pycache__" in str(file_path) or ".venv" in str(file_path):
            continue

        suffix = file_path.suffix.lower()
        if extensions and suffix not in extensions:
            continue
        if suffix not in LOADERS:
            continue

        try:
            content = LOADERS[suffix](file_path)
            if not content or len(content.strip()) < 20:
                continue

            chunks = text_splitter.split_text(content)
            for chunk in chunks:
                cid = chunk_id(chunk, str(file_path))
                all_texts.append(chunk)
                all_metas.append({
                    "source": file_path.name,
                    "category": category,
                    "file_path": str(file_path),
                })
                all_ids.append(cid)
        except Exception as e:
            print(f"[ingest] Error loading {file_path}: {e}")
            continue

    if all_texts:
        batch_size = 20
        for i in range(0, len(all_texts), batch_size):
            batch_texts = all_texts[i : i + batch_size]
            batch_metas = all_metas[i : i + batch_size]
            batch_ids = all_ids[i : i + batch_size]
            await add_documents(batch_texts, batch_metas, batch_ids)

    return len(all_texts)


async def ingest_file(file_path: Path, category: str) -> int:
    """Ingest a single file."""
    if not file_path.exists():
        return 0

    suffix = file_path.suffix.lower()
    if suffix not in LOADERS:
        return 0

    try:
        content = LOADERS[suffix](file_path)
        if not content or len(content.strip()) < 20:
            return 0

        chunks = text_splitter.split_text(content)
        texts = []
        metas = []
        ids = []
        for chunk in chunks:
            cid = chunk_id(chunk, str(file_path))
            texts.append(chunk)
            metas.append({
                "source": file_path.name,
                "category": category,
                "file_path": str(file_path),
            })
            ids.append(cid)

        if texts:
            await add_documents(texts, metas, ids)
        return len(texts)
    except Exception as e:
        print(f"[ingest] Error loading {file_path}: {e}")
        return 0


JY_BASE = Path("/Users/suzy/Desktop/Jy")
APP_DATA = Path(__file__).resolve().parent.parent.parent / "data"


async def ingest_all_data() -> int:
    """Ingest all knowledge base data."""
    collection = get_collection()
    existing = collection.count()
    if existing > 0:
        print(f"[ingest] Knowledge base already has {existing} chunks, clearing...")
        try:
            from app.services.rag import chroma_client
            chroma_client.delete_collection(settings.chroma_collection_name)
        except Exception:
            pass

    total = 0

    # Canonical profile (always available, bundled with backend)
    canonical = APP_DATA / "canonical-profile.md"
    total += await ingest_file(canonical, "个人档案")
    print(f"[ingest] Canonical profile: {total} chunks")

    # Interview questions (local only)
    interview_dir = JY_BASE / "面试题"
    if interview_dir.exists():
        interview_count = await ingest_directory(
            interview_dir, "面试题", {".html", ".pdf"}
        )
        total += interview_count
        print(f"[ingest] Interviews: {interview_count} chunks")

    # Code projects (local only)
    code_base = JY_BASE / "代码"
    if code_base.exists():
        for project_dir in sorted(code_base.iterdir()):
            if not project_dir.is_dir():
                continue
            project_name = project_dir.name
            for doc_name in ["README.md", "CLAUDE.md", "INTRODUCTION.md"]:
                doc_path = project_dir / doc_name
                if doc_path.exists():
                    total += await ingest_file(doc_path, f"项目-{project_name}")
        print(f"[ingest] Code projects: {total} chunks (cumulative)")

    # Bundled project docs (for cloud deployment)
    bundled_projects = APP_DATA / "projects"
    if bundled_projects.exists():
        proj_count = await ingest_directory(
            bundled_projects, "项目", {".md", ".txt"}
        )
        total += proj_count
        print(f"[ingest] Bundled projects: {proj_count} chunks")

    # Chat records
    chat_dir = APP_DATA / "chat_records"
    if chat_dir.exists():
        chat_count = await ingest_directory(
            chat_dir, "聊天记录", {".txt", ".json", ".csv"}
        )
        total += chat_count
        print(f"[ingest] Chat records: {chat_count} chunks")

    print(f"[ingest] Total: {total} chunks ingested")
    return total
