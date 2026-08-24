import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export const RouteTransition: React.FC = () => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Only animate on subsequent route transitions (not initial mount)
    const isFirstVisit = sessionStorage.getItem('celestia_first_route') === null;
    if (isFirstVisit) {
      sessionStorage.setItem('celestia_first_route', 'done');
      return;
    }

    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isTransitioning) return null;

  return (
    <div className="fixed inset-0 z-[250] pointer-events-none flex items-center justify-center">
      {/* Top and Bottom Pearl Curtains */}
      <div className="absolute inset-0 bg-pearl-200/90 backdrop-blur-md transition-opacity duration-300 animate-fade-in flex flex-col items-center justify-center">
        <div className="space-y-2 text-center animate-scale-up">
          <div className="inline-flex items-center gap-1.5 text-gold-dark font-mono text-[9px] uppercase tracking-monumental font-semibold">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>Entering Atelier</span>
          </div>

          <p className="font-serif-luxury text-2xl sm:text-3xl text-obsidian tracking-[0.14em] uppercase">
            CEL<span className="font-light lowercase text-gold-dark">estia</span>
          </p>
        </div>
      </div>
    </div>
  );
};
