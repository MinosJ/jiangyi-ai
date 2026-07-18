const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Source {
  source: string;
  category: string;
}

export async function* streamChat(
  messages: ChatMessage[]
): AsyncGenerator<{ type: string; data?: string | Source[] }> {
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, stream: true }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No reader available");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const parsed = JSON.parse(line.slice(6));
          yield parsed;
        } catch {
          // skip malformed JSON
        }
      }
    }
  }
}

export async function fetchKnowledgeStats(): Promise<{
  total_chunks: number;
  collection_name: string;
}> {
  const response = await fetch(`${API_BASE}/api/knowledge/stats`);
  if (!response.ok) throw new Error("Failed to fetch stats");
  return response.json();
}

export async function triggerIngest(): Promise<{
  message: string;
  chunks_added: number;
}> {
  const response = await fetch(`${API_BASE}/api/ingest`, { method: "POST" });
  if (!response.ok) throw new Error("Ingest failed");
  return response.json();
}
