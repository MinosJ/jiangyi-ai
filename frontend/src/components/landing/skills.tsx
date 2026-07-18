"use client";
import { motion } from "framer-motion";

const skillGroups = [
  {
    title: "前端核心",
    color: "from-indigo-500 to-blue-500",
    skills: [
      { name: "React / Next.js", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "Webpack / Vite", level: 85 },
      { name: "Tailwind CSS", level: 90 },
      { name: "Framer Motion", level: 80 },
    ],
  },
  {
    title: "跨端 / 移动端",
    color: "from-violet-500 to-purple-500",
    skills: [
      { name: "iOS (Swift/ObjC)", level: 92 },
      { name: "Flutter / Dart", level: 75 },
      { name: "Android (Kotlin)", level: 70 },
      { name: "React Native", level: 72 },
      { name: "Hybrid / JSBridge", level: 90 },
    ],
  },
  {
    title: "AI & 工程化",
    color: "from-purple-500 to-pink-500",
    skills: [
      { name: "AI Agent / RAG", level: 85 },
      { name: "Prompt Engineering", level: 88 },
      { name: "CI/CD (GitLab/Jenkins)", level: 90 },
      { name: "Python (FastAPI)", level: 78 },
      { name: "MCP / n8n / Coze", level: 80 },
    ],
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function Skills() {
  return (
    <section id="skills" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">技术栈</span>
          </h2>
          <p className="text-muted text-lg">
            十年磨一剑，覆盖前端、移动端、AI 全链路
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {skillGroups.map((group) => (
            <motion.div
              key={group.title}
              variants={itemVariants}
              className="glass rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300"
            >
              <h3
                className={`text-lg font-semibold mb-6 bg-gradient-to-r ${group.color} bg-clip-text text-transparent`}
              >
                {group.title}
              </h3>
              <div className="space-y-4">
                {group.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-foreground/80">{skill.name}</span>
                      <span className="text-muted">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 bg-surface-light rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${group.color}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
