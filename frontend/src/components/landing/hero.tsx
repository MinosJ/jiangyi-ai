"use client";
import { motion } from "framer-motion";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { SparklesText } from "@/components/ui/sparkles-text";
import { Typewriter } from "@/components/ui/typewriter";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <BackgroundBeams />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10" />

      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-muted mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            AI 数字分身 · 在线
          </div>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          <SparklesText>蒋 毅</SparklesText>
        </h1>

        <motion.p
          className="text-xl md:text-2xl text-muted mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          大前端工程师 · 10 年经验
        </motion.p>

        <motion.div
          className="text-lg md:text-xl text-foreground/70 h-8 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Typewriter
            words={[
              "React / Next.js 全栈开发",
              "iOS / Flutter 跨端工程师",
              "AI Agent & RAG 实践者",
              "前扇贝单词技术主管",
              "工程化与 CI/CD 高级工程师",
            ]}
          />
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <Link
            href="/chat"
            className="px-8 py-3 rounded-xl bg-primary hover:bg-primary-light transition-all duration-300 text-white font-medium glow hover:scale-105"
          >
            与 AI 蒋毅对话
          </Link>
          <a
            href="#skills"
            className="px-8 py-3 rounded-xl glass hover:bg-surface-light/50 transition-all duration-300 text-foreground font-medium"
          >
            了解更多
          </a>
        </motion.div>
      </div>
    </section>
  );
}
