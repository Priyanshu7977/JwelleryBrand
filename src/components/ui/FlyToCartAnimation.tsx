import React, { useEffect, useState } from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';

interface FlyItem {
  id: number;
  startX: number;
  startY: number;
}

export const FlyToCartAnimation: React.FC = () => {
  const [items, setItems] = useState<FlyItem[]>([]);

  useEffect(() => {
    const handleFly = (e: CustomEvent<{ x: number; y: number }>) => {
      const newItem: FlyItem = {
        id: Date.now() + Math.random(),
        startX: e.detail?.x || window.innerWidth / 2,
        startY: e.detail?.y || window.innerHeight / 2,
      };

      setItems((prev) => [...prev, newItem]);

      setTimeout(() => {
        setItems((prev) => prev.filter((item) => item.id !== newItem.id));
      }, 700);
    };

    window.addEventListener('celestia-fly-to-cart' as any, handleFly);
    return () => window.removeEventListener('celestia-fly-to-cart' as any, handleFly);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[160] overflow-hidden">
      {items.map((item) => (
        <div
          key={item.id}
          className="fixed w-8 h-8 rounded-full bg-gradient-to-tr from-gold-dark to-champagne-300 text-obsidian shadow-2xl flex items-center justify-center animate-fly-to-cart border border-white/80"
          style={
            {
              '--start-x': `${item.startX}px`,
              '--start-y': `${item.startY}px`,
            } as React.CSSProperties
          }
        >
          <Sparkles className="w-4 h-4 text-obsidian animate-spin" />
        </div>
      ))}
    </div>
  );
};
