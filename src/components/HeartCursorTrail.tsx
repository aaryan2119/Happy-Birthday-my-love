import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  text: string;
}

export const HeartCursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const heartSymbols = ['💖', '💕', '✨', '🌸', '💗'];
    let lastTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      // Throttle spawn rate so it doesn't crowd
      if (now - lastTime < 35) return;
      lastTime = now;

      particles.push({
        x: e.clientX + (Math.random() * 8 - 4),
        y: e.clientY + (Math.random() * 8 - 4),
        size: Math.floor(Math.random() * 6) + 12, // 12px to 18px
        opacity: 0.9,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: -Math.random() * 1.8 - 0.5, // float up
        text: heartSymbols[Math.floor(Math.random() * heartSymbols.length)],
      });

      if (particles.length > 35) {
        particles.shift();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      const now = Date.now();
      if (now - lastTime < 45) return;
      lastTime = now;

      particles.push({
        x: touch.clientX,
        y: touch.clientY - 10,
        size: Math.floor(Math.random() * 6) + 14,
        opacity: 0.9,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: -Math.random() * 2 - 0.5,
        text: heartSymbols[Math.floor(Math.random() * heartSymbols.length)],
      });

      if (particles.length > 25) {
        particles.shift();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity -= 0.022;

        if (p.opacity <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.font = `${p.size}px serif`;
        ctx.fillText(p.text, p.x, p.y);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ pointerEvents: 'none' }}
    />
  );
};
