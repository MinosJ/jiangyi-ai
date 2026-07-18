"use client";
import { useEffect, useRef } from "react";

export function BackgroundBeams() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      time += 0.003;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < 5; i++) {
        const x = canvas.width * (0.1 + i * 0.2);
        const gradient = ctx.createLinearGradient(x, 0, x, canvas.height);
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(
          0.5,
          `rgba(99, 102, 241, ${0.03 + Math.sin(time + i) * 0.02})`
        );
        gradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.moveTo(x + Math.sin(time + i * 0.5) * 100, 0);
        ctx.bezierCurveTo(
          x + Math.cos(time + i) * 150,
          canvas.height * 0.3,
          x + Math.sin(time + i * 0.7) * 150,
          canvas.height * 0.7,
          x + Math.cos(time + i * 0.3) * 100,
          canvas.height
        );
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
