import { Hero } from "@/components/landing/hero";
import { Skills } from "@/components/landing/skills";
import { Projects } from "@/components/landing/projects";
import { Timeline } from "@/components/landing/timeline";
import { CTA } from "@/components/landing/cta";
import { GridBackground } from "@/components/ui/grid-background";

export default function Home() {
  return (
    <main className="relative">
      <GridBackground />
      <Hero />
      <Skills />
      <Projects />
      <Timeline />
      <CTA />

      <footer className="py-8 text-center text-sm text-muted border-t border-border/30">
        <p>
          Built with Next.js + FastAPI + DeepSeek · Powered by RAG
        </p>
        <p className="mt-1 text-muted/60">
          &copy; {new Date().getFullYear()} 蒋毅 · AI 数字分身
        </p>
      </footer>
    </main>
  );
}
