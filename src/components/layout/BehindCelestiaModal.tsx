import React from 'react';
import { X, Sparkles, Heart, Film } from 'lucide-react';

export const BehindCelestiaModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const processSteps = [
    {
      title: '01. Studio Selection',
      desc: 'Inspecting enamel and gemstone clarity under soft natural coastal daylight.',
      img: '/assets/products/pink-blue-bangles.jpg'
    },
    {
      title: '02. Anti-Tarnish Seal',
      desc: 'Double-dip sealant application for waterproof, shower-safe everyday life.',
      img: '/assets/products/anti-tarnish-rings.jpg'
    },
    {
      title: '03. Fuji Polaroid Emulsion',
      desc: 'Printing your submitted personal memory photos within 2 hours of order.',
      img: '/assets/products/polaroids-20.jpg'
    },
    {
      title: '04. Gold Wax Seal & Ribbon',
      desc: 'Hand-pouring warm metallic wax with our signature hallmark seal.',
      img: '/assets/products/desi-barbie-hamper.jpg'
    }
  ];

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-obsidian/70 backdrop-blur-md animate-fade-in" />
      <div className="relative w-full max-w-2xl bg-pearl-50/98 rounded-3xl p-6 sm:p-10 border border-champagne-300/80 shadow-2xl space-y-6 z-10 animate-scale-up max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-obsidian/60 hover:text-obsidian rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gold-dark font-mono text-[10px] uppercase tracking-widest font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Secret Archive Unlocked</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-obsidian uppercase">
            BEHIND <span className="italic font-light text-gold-dark">CELestia</span>.
          </h2>
          <p className="text-xs text-obsidian/65 font-sans">
            A glimpse into the tactile craftsmanship inside our Mumbai atelier.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {processSteps.map((p, i) => (
            <div key={i} className="p-4 bg-white rounded-2xl border border-champagne-300/50 space-y-3">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-sand">
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-serif-luxury text-base text-obsidian">{p.title}</h4>
                <p className="text-xs text-obsidian/65 font-sans mt-0.5 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-obsidian text-pearl-100 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-obsidian-200"
          >
            Close Private Archive
          </button>
        </div>
      </div>
    </div>
  );
};
