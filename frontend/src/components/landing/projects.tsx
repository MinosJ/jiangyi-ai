"use client";
import { motion } from "framer-motion";

const projects = [
  {
    title: "扇贝单词 Android",
    role: "技术主管",
    period: "2018 - 2025",
    description:
      "扇贝单词业务侧主仓，涵盖学习主流程、听单词、词书选择、单词检测等核心模块。采用组件化架构，支持源码/AAR 双形态切换。",
    tags: ["Android", "Kotlin", "组件化", "CI/CD"],
    gradient: "from-indigo-500/20 to-blue-500/20",
    borderColor: "border-indigo-500/30",
    size: "col-span-2",
  },
  {
    title: "Word Next",
    role: "Web 前端",
    period: "扇贝单词 H5 端",
    description:
      "扇贝单词 H5 前端项目，包含长难句、AI 学习、学习角、极速刷词、错词本、作文批改等核心功能模块。",
    tags: ["React", "Next.js", "Motion", "Markdown"],
    gradient: "from-violet-500/20 to-purple-500/20",
    borderColor: "border-violet-500/30",
    size: "col-span-1",
  },
  {
    title: "Cairn 自动化测试",
    role: "全栈",
    period: "AI 驱动测试系统",
    description:
      "Claude-Code-as-Brain 移动端自动化测试系统。用自然语言写用例，AI Agent 驱动多端执行与视觉自愈，越用越快。",
    tags: ["Python", "AI Agent", "Claude Code", "自动化测试"],
    gradient: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
    size: "col-span-1",
  },
  {
    title: "AI Dev Kit",
    role: "工具开发",
    period: "AI 编程助手指令集",
    description:
      "扇贝 AI 编程助手技能集合，兼容 Claude Code、Cursor、GitHub Copilot、Gemini CLI 等主流工具，沉淀团队开发流程与规范。",
    tags: ["AI Coding", "Claude Code", "Cursor", "Skill"],
    gradient: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
    size: "col-span-1",
  },
  {
    title: "词汇测试小程序",
    role: "全栈",
    period: "微信小程序",
    description:
      "微信原生小程序，支持阅读/听力两种词汇量测试题型，自适应出题，出分后展示历史曲线与分享功能。",
    tags: ["微信小程序", "glass-easel", "神策埋点"],
    gradient: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/30",
    size: "col-span-1",
  },
  {
    title: "扇贝单词 iOS",
    role: "iOS 开发",
    period: "2018 - 2025",
    description:
      "扇贝单词 iOS 客户端，负责客户端内嵌 Web / Hybrid 页面开发、JSBridge 设计与组件化重构。",
    tags: ["iOS", "Swift", "ObjC", "Hybrid"],
    gradient: "from-orange-500/20 to-amber-500/20",
    borderColor: "border-orange-500/30",
    size: "col-span-1",
  },
];

export function Projects() {
  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">项目经历</span>
          </h2>
          <p className="text-muted text-lg">从移动端到全栈，从工程化到 AI</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`${project.size === "col-span-2" ? "md:col-span-2" : ""}`}
            >
              <div
                className={`group glass rounded-2xl p-6 h-full border ${project.borderColor} hover:scale-[1.01] transition-all duration-300 relative overflow-hidden`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {project.title}
                      </h3>
                      <p className="text-sm text-primary-light">
                        {project.role} · {project.period}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-md bg-surface-light/80 text-muted border border-border/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
