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
      if (dist < 4) return; // throttle small movements

      lastX = e.clientX;
      lastY = e.clientY;

      // Spawn 2-3 stardust sparks
      const count = Math.min(3, Math.floor(dist / 8) + 1);
      for (let i = 0; i < count; i++) {
        const baseColor = GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)];
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          size: Math.random() * 2.5 + 1.2,
          speedX: (Math.random() - 0.5) * 1.2,
          speedY: Math.random() * 0.8 + 0.3, // slow gentle fall
          color: baseColor,
          alpha: 0.9,
          decay: Math.random() * 0.025 + 0.02,
        });
      }

      // Limit particle array size
      if (particles.length > 60) {
        particles = particles.slice(-60);
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

        // Cross sparkle star flare
        if (p.size > 2) {
          ctx.strokeStyle = `${p.color}${p.alpha * 0.6})`;
          ctx.lineWidth = 0.6;
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
