"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SparklesTextProps {
  children: React.ReactNode;
  className?: string;
}

const SPARKLE_COUNT = 6;

interface SparkleData {
  top: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
}

export function SparklesText({ children, className }: SparklesTextProps) {
  const [sparkles, setSparkles] = useState<SparkleData[]>([]);

  useEffect(() => {
    setSparkles(
      Array.from({ length: SPARKLE_COUNT }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 4 + Math.random() * 8,
        duration: 2 + Math.random() * 2,
        delay: Math.random() * 3,
      }))
    );
  }, []);

  return (
    <motion.span
      className={cn("relative inline-block", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <span className="gradient-text">{children}</span>
      {sparkles.map((s, i) => (
        <motion.span
          key={i}
          className="absolute text-primary-light pointer-events-none"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            fontSize: `${s.size}px`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
          }}
        >
          *
        </motion.span>
      ))}
    </motion.span>
  );
}
