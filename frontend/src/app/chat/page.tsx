"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessage } from "@/components/chat/chat-message";
import { PresetQuestions } from "@/components/chat/preset-questions";
import { GridBackground } from "@/components/ui/grid-background";
import { streamChat, type ChatMessage as ApiMessage, type Source } from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  isStreaming?: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = async (content: string) => {
    if (isLoading) return;

    const userMessage: Message = { role: "user", content };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    const assistantMessage: Message = {
      role: "assistant",
      content: "",
      isStreaming: true,
    };
    setMessages([...updatedMessages, assistantMessage]);

    try {
      const apiMessages: ApiMessage[] = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      let fullContent = "";
      let sources: Source[] = [];

      for await (const event of streamChat(apiMessages)) {
        if (event.type === "sources") {
          sources = event.data as Source[];
        } else if (event.type === "token") {
          fullContent += event.data as string;
          setMessages([
            ...updatedMessages,
            { role: "assistant", content: fullContent, sources, isStreaming: true },
          ]);
        } else if (event.type === "done") {
          setMessages([
            ...updatedMessages,
            { role: "assistant", content: fullContent, sources, isStreaming: false },
          ]);
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "抱歉，连接出了点问题。请确保后端服务已启动（`cd backend && uvicorn app.main:app --reload`），然后再试一次。",
          isStreaming: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <GridBackground />
      {/* Header */}
      <header className="glass border-b border-border/30 px-4 py-3 flex items-center gap-4 flex-shrink-0 z-50">
        <Link
          href="/"
          className="text-muted hover:text-foreground transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
            JY
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">AI 蒋毅</h1>
            <p className="text-xs text-muted">
              {isLoading ? "思考中..." : "在线 · 基于 RAG + DeepSeek"}
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="ml-auto text-xs text-muted hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-surface-light"
          >
            清空对话
          </button>
        )}
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <PresetQuestions onSelect={sendMessage} />
          ) : (
            messages.map((msg, i) => (
              <ChatMessage
                key={i}
                role={msg.role}
                content={msg.content}
                sources={msg.sources}
                isStreaming={msg.isStreaming}
              />
            ))
          )}
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 py-4 border-t border-border/20">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={sendMessage} disabled={isLoading} />
          <p className="text-xs text-muted/50 text-center mt-2">
            AI 回答基于真实简历和项目数据，通过 RAG 检索增强生成
          </p>
        </div>
      </div>
    </div>
  );
}
