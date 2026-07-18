from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.services.rag import query_knowledge, build_context
from app.services.llm import chat_stream, chat_complete
import json

router = APIRouter(tags=["chat"])


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    stream: bool = True


class ChatResponse(BaseModel):
    answer: str
    sources: list[dict] = []


@router.post("/chat")
async def chat(request: ChatRequest):
    user_message = request.messages[-1].content if request.messages else ""

    docs = await query_knowledge(user_message)
    context = build_context(docs)
    sources = [
        {"source": d["metadata"].get("source", ""), "category": d["metadata"].get("category", "")}
        for d in docs
    ]

    messages = [{"role": m.role, "content": m.content} for m in request.messages]

    if request.stream:
        async def event_generator():
            yield f"data: {json.dumps({'type': 'sources', 'data': sources}, ensure_ascii=False)}\n\n"
            async for token in chat_stream(messages, context):
                yield f"data: {json.dumps({'type': 'token', 'data': token}, ensure_ascii=False)}\n\n"
            yield f"data: {json.dumps({'type': 'done'})}\n\n"

        return StreamingResponse(
            event_generator(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            },
        )
    else:
        answer = await chat_complete(messages, context)
        return ChatResponse(answer=answer, sources=sources)
