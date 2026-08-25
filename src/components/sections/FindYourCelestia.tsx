import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FEATURED_PRODUCTS } from '../../data/shopify-data';
import { useCart } from '../../context/CartContext';
import { Sparkles, ArrowRight, RefreshCw, ShoppingBag, Check, Heart } from 'lucide-react';

export const FindYourCelestia: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [feeling, setFeeling] = useState<string>('for-me');
  const [vibe, setVibe] = useState<string>('soft');
  const [budget, setBudget] = useState<string>('under-500');
  const { addToCart, showToast } = useCart();

  const feelings = [
    { id: 'for-me', label: 'For Me', desc: 'Everyday personal adornment' },
    { id: 'special-someone', label: 'For Someone Special', desc: 'Gift for bestie, sister, or love' },
    { id: 'everyday-glow', label: 'Everyday Glow', desc: 'Minimal anti-tarnish stacks' },
    { id: 'statement', label: 'Make a Statement', desc: 'Festive evenings & regal shine' },
  ];

  const vibes = [
    { id: 'soft', label: 'Soft & Airy', moodColor: '#F7F3EE' },
    { id: 'bold', label: 'Bold & Regal', moodColor: '#F5EBE6' },
    { id: 'romantic', label: 'Pastel Romantic', moodColor: '#FCEEF2' },
    { id: 'playful', label: 'Playful Charm', moodColor: '#F0F5ED' },
  ];

  const budgets = [
    { id: 'under-100', label: 'Under ₹100', desc: 'Rings, keychains, polaroids' },
    { id: 'under-500', label: '₹100 — ₹500', desc: 'Artisanal bangles & pendant sets' },
    { id: 'hampers', label: 'Luxury Hampers (₹999+)', desc: 'Full celebration keepsake boxes' },
  ];

  // Matched product logic based on authentic catalogue
  const getRecommendation = () => {
    if (feeling === 'special-someone' || budget === 'hampers') {
      return FEATURED_PRODUCTS[1]; // Desi Barbie Hamper
    }
    if (vibe === 'bold' || feeling === 'statement') {
      return FEATURED_PRODUCTS[4]; // Exclusive Red Emerald set
    }
    if (budget === 'under-100') {
      return FEATURED_PRODUCTS[5]; // Golden anti tarnish rings or polaroids
    }
    if (vibe === 'romantic') {
      return FEATURED_PRODUCTS[0]; // pink and blue bangle set
    }
    return FEATURED_PRODUCTS[2]; // white bangles
  };

  const matchedProduct = getRecommendation();

  return (
    <section className="relative w-full py-20 md:py-28 px-6 md:px-12 lg:px-20 bg-warm-ivory-100 overflow-hidden border-t border-champagne-300/40">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pearl-50 border border-champagne-300/80 text-[11px] uppercase tracking-monumental text-gold-dark font-medium shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Matchmaker</span>
          </div>

          <h2 className="font-serif-luxury text-4xl sm:text-6xl text-obsidian leading-tight">
            Find your <span className="font-zapfino text-champagne-400 font-normal tracking-normal lowercase inline-block text-[34px] sm:text-[50px] md:text-[60px] leading-[0.9] px-1">celestia</span>.
          </h2>

          <p className="text-xs sm:text-sm text-obsidian/70 font-sans max-w-lg mx-auto">
            Answer three quick intuitive questions to reveal the piece meant for your present mood.
          </p>
        </div>

        {/* Multi-Step Matchmaker Panel */}
        <div className="bg-pearl-50/95 p-8 md:p-12 rounded-3xl border border-champagne-300/60 shadow-luxury-soft space-y-8">
          
          {/* Step Indicators */}
          <div className="flex items-center justify-center gap-3 border-b border-champagne-300/30 pb-6">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex items-center gap-2 text-xs font-mono font-semibold transition-all ${
                  step === s
                    ? 'text-gold-dark scale-105'
                    : step > s
                    ? 'text-emerald-800'
                    : 'text-obsidian/30'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                  step === s ? 'bg-obsidian text-pearl-100' : step > s ? 'bg-emerald-100 text-emerald-800' : 'bg-pearl-200 text-obsidian/50'
                }`}>
                  {step > s ? '✓' : s}
                </span>
                <span className="hidden sm:inline">
                  {s === 1 ? 'Feeling' : s === 2 ? 'Vibe' : s === 3 ? 'Budget' : 'Match'}
                </span>
                {s < 4 && <span className="text-champagne-300 mx-1">→</span>}
              </div>
            ))}
          </div>

          {/* Step 1: Feeling */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="font-serif-luxury text-2xl text-obsidian text-center">
                Step 1: What are you feeling today?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {feelings.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setFeeling(f.id);
                      setStep(2);
                    }}
                    className={`p-5 rounded-2xl text-left border transition-all ${
                      feeling === f.id
                        ? 'border-gold-dark bg-champagne-100/70 shadow-sm'
                        : 'border-champagne-300/40 bg-white/70 hover:bg-white'
                    }`}
                  >
                    <p className="font-serif-luxury text-lg text-obsidian">{f.label}</p>
                    <p className="text-xs text-obsidian/60 font-sans mt-1">{f.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Vibe */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="font-serif-luxury text-2xl text-obsidian text-center">
                Step 2: What aesthetic feels right?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {vibes.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setVibe(v.id);
                      setStep(3);
                    }}
                    className={`p-5 rounded-2xl text-left border transition-all ${
                      vibe === v.id
                        ? 'border-gold-dark bg-champagne-100/70 shadow-sm'
                        : 'border-champagne-300/40 bg-white/70 hover:bg-white'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full border border-champagne-300/60 mb-2" style={{ backgroundColor: v.moodColor }} />
                    <p className="font-serif-luxury text-lg text-obsidian">{v.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Budget */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="font-serif-luxury text-2xl text-obsidian text-center">
                Step 3: What is your preferred range?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {budgets.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setBudget(b.id);
                      setStep(4);
                    }}
                    className={`p-5 rounded-2xl text-left border transition-all ${
                      budget === b.id
                        ? 'border-gold-dark bg-champagne-100/70 shadow-sm'
                        : 'border-champagne-300/40 bg-white/70 hover:bg-white'
                    }`}
                  >
                    <p className="font-serif-luxury text-base text-obsidian">{b.label}</p>
                    <p className="text-[11px] text-obsidian/60 font-sans mt-1">{b.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: The Curated Match Reveal */}
          {step === 4 && (
            <div className="space-y-6 text-center animate-fade-in">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-monumental text-gold-dark font-semibold">
                  Your Signature Match
                </span>
                <h3 className="font-serif-luxury text-3xl text-obsidian">
                  {matchedProduct.title}
                </h3>
              </div>

              <div className="max-w-xs mx-auto aspect-square rounded-3xl overflow-hidden bg-sand shadow-2xl border-2 border-gold-dark/60 image-zoom-container">
                <img
                  src={matchedProduct.images.hero}
                  alt={matchedProduct.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="font-serif text-sm text-obsidian/85 max-w-md mx-auto leading-relaxed font-medium">
                "{matchedProduct.editorialNote}"
              </p>

              <div className="flex items-center justify-center gap-3">
                <span className="font-serif text-2xl font-bold text-obsidian">
                  ₹{matchedProduct.price}
                </span>
                {matchedProduct.compareAtPrice && (
                  <span className="text-sm font-sans text-obsidian/40 line-through">
                    ₹{matchedProduct.compareAtPrice}
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => addToCart(matchedProduct, 1)}
                  className="w-full sm:w-auto px-8 py-3.5 bg-obsidian text-pearl-100 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-obsidian-200 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Matched Piece to Bag</span>
                </button>

                <Link
                  to={`/product/${matchedProduct.handle}`}
                  className="w-full sm:w-auto px-6 py-3.5 border border-champagne-300/80 rounded-full text-xs uppercase tracking-widest text-obsidian hover:bg-champagne-100/60 transition-colors"
                >
                  Inspect Full Details
                </Link>

                <button
                  onClick={() => setStep(1)}
                  className="p-3 text-obsidian/50 hover:text-obsidian rounded-full"
                  title="Retake Finder"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
