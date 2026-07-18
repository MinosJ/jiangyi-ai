"use client";
import { motion } from "framer-motion";

const presets = [
  { text: "你擅长什么技术？", icon: "code" },
  { text: "介绍一下你的项目经历", icon: "folder" },
  { text: "你的工作经历是怎样的？", icon: "briefcase" },
  { text: "你对 AI 开发有什么经验？", icon: "sparkles" },
  { text: "你有什么兴趣爱好？", icon: "heart" },
  { text: "为什么选择做前端？", icon: "question" },
];

interface PresetQuestionsProps {
  onSelect: (question: string) => void;
}

export function PresetQuestions({ onSelect }: PresetQuestionsProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-12">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
          JY
        </div>
        <h2 className="text-xl font-bold text-foreground mb-1">AI 蒋毅</h2>
        <p className="text-sm text-muted">
          我是蒋毅的 AI 数字分身，可以回答关于我的一切
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg">
        {presets.map((preset, i) => (
          <motion.button
            key={preset.text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => onSelect(preset.text)}
            className="glass rounded-xl px-4 py-3 text-sm text-left text-foreground/80 hover:text-foreground hover:bg-surface-light/50 transition-all duration-200 hover:scale-[1.02]"
          >
            {preset.text}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
