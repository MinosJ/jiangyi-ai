"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />

      <motion.div
        className="max-w-2xl mx-auto text-center relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          想更深入了解我？
        </h2>
        <p className="text-muted text-lg mb-8 leading-relaxed">
          我的 AI 数字分身可以回答关于我的技术能力、项目经历、
          工作方式和兴趣爱好的各种问题。基于真实的简历和项目数据，
          不吹不黑，有什么问什么。
        </p>
        <Link
          href="/chat"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary hover:bg-primary-light transition-all duration-300 text-white font-medium text-lg glow hover:scale-105"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          开始对话
        </Link>
      </motion.div>
    </section>
  );
}
