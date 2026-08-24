import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FEATURED_PRODUCTS } from '../../data/shopify-data';
import { useCart } from '../../context/CartContext';
import { Sparkles, Eye, ArrowUpRight, Compass, ShoppingBag } from 'lucide-react';

export const CelestiaConstellation: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<any>(FEATURED_PRODUCTS[0]);
  const { addToCart } = useCart();

  const categories = [
    { id: 'all', label: 'All Stars' },
    { id: 'jewellery', label: 'Jewellery' },
    { id: 'bangles', label: 'Bangles' },
    { id: 'gifting', label: 'Hampers' },
    { id: 'personalised', label: 'Polaroids' },
    { id: 'accessories', label: 'Charms' },
  ];

  const visibleProducts = activeCategory === 'all'
    ? FEATURED_PRODUCTS
    : FEATURED_PRODUCTS.filter(p => p.category.toLowerCase().includes(activeCategory));

  // Constellation coordinate mapping for visual positioning
  const nodePositions = [
    { x: 18, y: 35 },
    { x: 42, y: 20 },
    { x: 70, y: 30 },
    { x: 85, y: 60 },
    { x: 60, y: 78 },
    { x: 30, y: 72 },
    { x: 50, y: 50 },
    { x: 80, y: 22 },
  ];

  return (
    <section className="relative w-full py-20 md:py-28 px-6 md:px-12 lg:px-20 bg-warm-ivory-100 overflow-hidden border-t border-champagne-300/40">
      {/* Soft celestial radial gradients */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-champagne-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1500px] mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-champagne-300/40 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-monumental text-gold-dark font-semibold">
                Interactive Universe
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-dark" />
              <span className="text-xs font-serif text-obsidian/60">
                Spatial Catalogue Map
              </span>
            </div>

            <h2 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl text-obsidian uppercase font-normal leading-[0.95]">
              THE CELESTIA <span className="font-semibold text-gold-dark">CONSTELLATION</span>.
            </h2>

            <p className="text-xs sm:text-sm text-obsidian/75 font-sans leading-relaxed max-w-xl">
              Every handcrafted piece shines in its own celestial orbit. Tap on any star in the constellation map to draw the piece forward into focus.
            </p>
          </div>

          {/* Category constellation filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-medium transition-all ${
                  activeCategory === c.id
                    ? 'bg-obsidian text-pearl-100 shadow-md'
                    : 'bg-white/80 text-obsidian/70 hover:text-obsidian hover:bg-champagne-100/60 border border-champagne-300/50'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Constellation Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Spatial Constellation Canvas Map (7 Cols) */}
          <div className="lg:col-span-7 h-[420px] sm:h-[500px] rounded-3xl bg-pearl-50/90 border border-champagne-300/60 shadow-luxury-soft relative p-6 overflow-hidden">
            {/* SVG Constellation Linking Web */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-champagne-300/60" strokeWidth="1" strokeDasharray="3 3">
              <line x1="18%" y1="35%" x2="42%" y2="20%" />
              <line x1="42%" y1="20%" x2="70%" y2="30%" />
              <line x1="70%" y1="30%" x2="85%" y2="60%" />
              <line x1="85%" y1="60%" x2="60%" y2="78%" />
              <line x1="60%" y1="78%" x2="30%" y2="72%" />
              <line x1="30%" y1="72%" x2="18%" y2="35%" />
              <line x1="50%" y1="50%" x2="42%" y2="20%" />
              <line x1="50%" y1="50%" x2="60%" y2="78%" />
            </svg>

            {/* Product Star Nodes */}
            {visibleProducts.slice(0, 8).map((prod, idx) => {
              const pos = nodePositions[idx % nodePositions.length];
              const isSelected = selectedProduct?.id === prod.id;

              return (
                <button
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod)}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
                  aria-label={`Select ${prod.title}`}
                >
                  <div
                    className={`relative rounded-full transition-all duration-500 flex items-center justify-center ${
                      isSelected
                        ? 'w-14 h-14 bg-gradient-to-tr from-gold to-champagne-300 ring-4 ring-gold-dark/40 shadow-xl scale-110'
                        : 'w-10 h-10 bg-pearl-100 hover:bg-champagne-200 border-2 border-champagne-400/80 shadow-md group-hover:scale-110'
                    }`}
                  >
                    <img
                      src={prod.images.hero}
                      alt={prod.title}
                      className="w-full h-full rounded-full object-cover p-0.5"
                    />
                    
                    {/* Pulsing Starlight Halo */}
                    {isSelected && (
                      <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-40" />
                    )}
                  </div>

                  {/* Tooltip Tag */}
                  <span className={`absolute top-full mt-1.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full text-[9px] font-mono uppercase tracking-wider whitespace-nowrap transition-all shadow-sm ${
                    isSelected
                      ? 'bg-obsidian text-pearl-100 opacity-100 font-bold'
                      : 'bg-pearl-100 text-obsidian/70 opacity-0 group-hover:opacity-100 border border-champagne-300'
                  }`}>
                    {prod.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Focused Star Spotlight Card (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-champagne-300/70 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-champagne-300/30 pb-3">
              <span className="text-[10px] uppercase tracking-monumental text-gold-dark font-mono font-semibold">
                Orbital Focus: {selectedProduct.category}
              </span>
              <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-medium">
                Stock: {selectedProduct.availableStock || 1}
              </span>
            </div>

            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-sand shadow-inner relative group">
              <img
                src={selectedProduct.images.hero}
                alt={selectedProduct.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif-luxury text-2xl text-obsidian leading-tight">
                {selectedProduct.title}
              </h3>
              <p className="text-xs text-obsidian/75 font-sans leading-relaxed">
                {selectedProduct.description}
              </p>
              <div className="flex items-baseline gap-3 pt-2">
                <span className="font-serif-luxury text-2xl font-bold text-obsidian">
                  ₹{selectedProduct.price}
                </span>
                {selectedProduct.compareAtPrice && (
                  <span className="text-sm font-sans text-obsidian/40 line-through">
                    ₹{selectedProduct.compareAtPrice}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => addToCart(selectedProduct, 1)}
                className="flex-1 py-3.5 px-6 rounded-full bg-obsidian text-pearl-100 text-xs uppercase tracking-widest font-semibold hover:bg-obsidian-200 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>

              <Link
                to={`/product/${selectedProduct.handle}`}
                className="p-3.5 border border-champagne-300/80 rounded-full hover:bg-champagne-100 transition-colors text-obsidian"
                title="View full piece details"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
