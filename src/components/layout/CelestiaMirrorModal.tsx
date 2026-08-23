import React from 'react';
import { X, Sparkles, Camera, ShieldCheck } from 'lucide-react';

export const CelestiaMirrorModal: React.FC<{ isOpen: boolean; onClose: () => void; pieceName?: string }> = ({
  isOpen,
  onClose,
  pieceName = 'Artisanal Bangles'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-obsidian/60 backdrop-blur-md animate-fade-in" />
      <div className="relative w-full max-w-md bg-pearl-50/98 rounded-3xl p-8 border border-champagne-300/80 shadow-2xl space-y-6 z-10 text-center animate-scale-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-obsidian/60 hover:text-obsidian rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-full bg-champagne-200/80 flex items-center justify-center text-gold-dark mx-auto shadow-inner">
          <Camera className="w-8 h-8 stroke-1 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-monumental text-gold-dark font-semibold block">
            AR Atelier Innovation
          </span>
          <h3 className="font-serif-luxury text-3xl text-obsidian uppercase">
            CELESTIA <span className="italic font-light text-gold-dark">Mirror</span>.
          </h3>
          <p className="text-xs text-obsidian/70 font-sans leading-relaxed">
            Real-time Augmented Reality try-on for <strong className="text-obsidian">{pieceName}</strong> is currently being calibrated in our Mumbai lab for mobile safari and chrome.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-champagne-300/50 text-xs font-mono text-obsidian/60 space-y-1">
          <p className="text-gold-dark font-semibold">STATUS: COMING SOON (Q4 2026)</p>
          <p className="text-[10px]">Spatial wrist & finger millimeter measurement engine</p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-obsidian text-pearl-100 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-obsidian-200"
        >
          Return to Atelier
        </button>
      </div>
    </div>
  );
};
