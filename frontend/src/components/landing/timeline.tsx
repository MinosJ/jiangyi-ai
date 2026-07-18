"use client";
import { motion } from "framer-motion";

const timelineData = [
  {
    period: "2012 - 2016",
    title: "南京邮电大学",
    subtitle: "本科 · 测绘工程",
    description: "青奥会志愿者，参与社联、青志联等学生组织。",
    type: "education" as const,
  },
  {
    period: "2016 - 2018",
    title: "南京厚建软件",
    subtitle: "客户端开发",
    description:
      "负责 MXU 3.0/4.0 多业务模块开发，搭建 Gitlab-CI/Jenkins CI 系统。模块应用于常州手机台、禾点点、7频道（央7）、吉视通等多款电视台 App。",
    type: "work" as const,
  },
  {
    period: "2018 - 2025",
    title: "南京贝湾信息科技（扇贝）",
    subtitle: "技术主管（已离职）",
    description:
      "负责扇贝单词技术规划与团队管理，主导内嵌 Web / Hybrid 开发、组件化重构、CI/CD 体系建设、AI Agent 开发。连续 3 年绩效优秀(3.75)。",
    type: "work" as const,
  },
  {
    period: "2026 -",
    title: "AI 全栈探索",
    subtitle: "独立开发者",
    description:
      "深入 AI Agent、RAG、MCP、Prompt Engineering 等前沿技术，用 AI 辅助全流程开发，探索技术创业方向。",
    type: "current" as const,
  },
];

export function Timeline() {
  return (
    <section id="timeline" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">经历时间线</span>
          </h2>
          <p className="text-muted text-lg">一路走来的成长轨迹</p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-[21px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-accent/30 to-transparent" />

          {timelineData.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className={`relative flex items-start mb-12 ${
                i % 2 === 0
                  ? "md:flex-row"
                  : "md:flex-row-reverse"
              }`}
            >
              <div className="absolute left-[15px] md:left-1/2 md:-translate-x-1/2 w-3 h-3 rounded-full border-2 border-primary bg-background z-10 mt-2">
                {item.type === "current" && (
                  <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30" />
                )}
              </div>

              <div
                className={`ml-10 md:ml-0 md:w-[45%] ${
                  i % 2 === 0 ? "md:mr-auto md:pr-12" : "md:ml-auto md:pl-12"
                }`}
              >
                <div className="glass rounded-xl p-5 hover:scale-[1.02] transition-transform duration-300">
                  <span className="text-xs text-primary-light font-mono">
                    {item.period}
                  </span>
                  <h3 className="text-lg font-bold text-foreground mt-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-accent mb-2">{item.subtitle}</p>
                  <p className="text-sm text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
