"use client";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Source } from "@/lib/api";
import type { Components } from "react-markdown";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  isStreaming?: boolean;
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-lg font-bold mt-4 mb-2 text-foreground border-b border-border/30 pb-1">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-base font-bold mt-3 mb-1.5 text-foreground">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-semibold mt-2.5 mb-1 text-foreground">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="my-1.5 leading-relaxed text-foreground/90">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="my-1.5 ml-4 space-y-0.5 list-disc marker:text-primary-light/60">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-1.5 ml-4 space-y-0.5 list-decimal marker:text-primary-light/60">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-foreground/90 leading-relaxed">{children}</li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="text-primary-light/90 not-italic font-medium">{children}</em>
  ),
  code: ({ className, children }) => {
    const isBlock = className?.includes("language-") || className?.includes("hljs");
    if (isBlock) {
      return (
        <code className={`${className ?? ""} text-xs`}>{children}</code>
      );
    }
    return (
      <code className="px-1.5 py-0.5 rounded-md bg-surface-light/80 text-primary-light text-xs font-mono border border-border/30">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-2 rounded-xl bg-[#0d1117] border border-border/30 p-3 overflow-x-auto text-xs leading-relaxed">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-2 pl-3 border-l-2 border-primary/40 text-muted italic">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary-light hover:text-primary underline underline-offset-2 decoration-primary/30"
    >
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="my-2 overflow-x-auto rounded-lg border border-border/30">
      <table className="w-full text-xs">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-surface-light/50">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-3 py-1.5 text-left font-semibold text-foreground/80 border-b border-border/30">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-1.5 text-foreground/70 border-b border-border/20">
      {children}
    </td>
  ),
  hr: () => (
    <hr className="my-3 border-border/30" />
  ),
};

export function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
          JY
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? "order-first" : ""}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-primary text-white rounded-br-md"
              : "glass rounded-bl-md"
          }`}
        >
          {isUser ? (
            <p>{content}</p>
          ) : (
            <div className="markdown-body">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={markdownComponents}
              >
                {content}
              </ReactMarkdown>
              {isStreaming && (
                <span className="inline-block w-1.5 h-4 bg-primary-light animate-pulse ml-0.5 align-text-bottom" />
              )}
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-surface-light flex items-center justify-center text-muted text-xs flex-shrink-0 mt-1">
          You
        </div>
      )}
    </motion.div>
  );
}
