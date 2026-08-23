import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export const BrandedLoader: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const visited = sessionStorage.getItem('celestia_entered');
      if (visited) {
        setLoading(false);
        return;
      }
    } catch {}

    const timer = setTimeout(() => {
      setLoading(false);
      try {
        sessionStorage.setItem('celestia_entered', 'true');
      } catch {}
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-pearl-100 flex flex-col items-center justify-center p-6 text-center transition-opacity duration-700 animate-fade-out pointer-events-none">
      <div className="space-y-3 animate-scale-up">
        <div className="flex items-center justify-center gap-2 text-gold-dark font-mono text-[10px] uppercase tracking-monumental font-semibold">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Mumbai Atelier MMXXVI</span>
        </div>

        <h1 className="font-serif-luxury text-4xl sm:text-6xl text-obsidian uppercase tracking-[0.16em]">
          CEL<span className="italic font-light lowercase">estia</span>
        </h1>

        <p className="text-[10px] tracking-[0.38em] text-obsidian/60 uppercase font-sans">
          redefined for all.
        </p>
      </div>

      <div className="mt-8 w-36 h-0.5 bg-champagne-200 rounded-full overflow-hidden">
        <div className="h-full bg-gold-dark animate-pulse rounded-full w-full" />
      </div>
    </div>
  );
};
