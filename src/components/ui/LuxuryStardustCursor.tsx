import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  decay: number;
}

const GOLD_COLORS = [
  'rgba(216, 195, 154, ',  // Champagne gold
  'rgba(197, 168, 128, ',  // Deep gold
  'rgba(240, 230, 210, ',  // Luminous cream
  'rgba(230, 190, 100, ',  // Bright gold
];

export const LuxuryStardustCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Only run on desktop devices with hover support
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles: Particle[] = [];
    let animationFrameId: number;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      // High distance threshold to prevent clustering and ropes
      if (dist < 38) return;

      lastX = e.clientX;
      lastY = e.clientY;

      // Spawn only 1 tiny micro-glint
      const baseColor = GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)];
      particles.push({
        x: e.clientX + (Math.random() - 0.5) * 2,
        y: e.clientY + (Math.random() - 0.5) * 2,
        size: Math.random() * 0.8 + 0.8, // subtle 0.8 - 1.6px diamond speck
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        color: baseColor,
        alpha: 0.85,
        decay: 0.065, // flashes and dissolves in ~0.25 seconds (15 frames)
      });

      // Strict limit: at most 6 particles across the entire screen
      if (particles.length > 6) {
        particles = particles.slice(-6);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Tiny elegant 4-point cross glint
        if (p.size > 1.2 && p.alpha > 0.4) {
          ctx.strokeStyle = `${p.color}${p.alpha * 0.5})`;
          ctx.lineWidth = 0.4;
          ctx.beginPath();
          ctx.moveTo(p.x - p.size * 1.5, p.y);
          ctx.lineTo(p.x + p.size * 1.5, p.y);
          ctx.moveTo(p.x, p.y - p.size * 1.5);
          ctx.lineTo(p.x, p.y + p.size * 1.5);
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[999] opacity-90 transition-opacity duration-300"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default LuxuryStardustCursor;
