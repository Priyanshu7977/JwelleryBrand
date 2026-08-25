import React, { useState } from 'react';
import { HAMPER_BOX_OPTIONS } from '../data/shopify-data';
import { useCart } from '../context/CartContext';
import { Gift, Sparkles } from 'lucide-react';

export const GiftingPage: React.FC = () => {
  const {
    selectedHamperBox,
    setSelectedHamperBox,
    cart,
    addToCart,
    polaroidNote,
    setPolaroidNote,
    setIsCartOpen,
  } = useCart();

  const [selectedOccasion, setSelectedOccasion] = useState('all');

  const occasions = [
    { id: 'all', label: 'All Celebrations' },
    { id: 'birthday', label: 'Birthdays & Milestones' },
    { id: 'bestie', label: 'Bestie & Sister Gifting' },
    { id: 'anniversary', label: 'Anniversary Moments' },
    { id: 'festive', label: 'Festive & Weddings' },
  ];

  const handleAddHamperToBag = () => {
    const boxProductId = `box-${selectedHamperBox.id}`;
    const boxInCart = cart.some(i => i.product.id === boxProductId);

    if (!boxInCart) {
      const boxProduct = {
        id: boxProductId,
        handle: selectedHamperBox.id,
        title: selectedHamperBox.name,
        category: 'gifting' as const,
        price: selectedHamperBox.price,
        description: selectedHamperBox.description,
        editorialNote: 'A bespoke emotional keepsake packaging assembled with love in Mumbai.',
        material: `${selectedHamperBox.name}, Handcrafted Satin Ribbon, Glossy Fuji Film`,
        craftsmanship: 'Hand-packed in Mumbai atelier with custom wax seal.',
        sameDayMumbaiAvailable: true,
        images: {
          hero: selectedHamperBox.imageUrl,
          alt: `Custom ${selectedHamperBox.name} with personalised memories`
        },
        tags: ['Custom Hamper', 'Personalised', 'Bespoke']
      };

      addToCart(boxProduct, 1, {
        boxType: selectedHamperBox.name,
        customNote: polaroidNote,
        ribbonColor: 'Champagne Double Satin'
      });
    }

    setIsCartOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-28 sm:pt-30 md:pt-32 pb-12 px-4 sm:px-6 md:px-10 lg:px-14 selection:bg-champagne-300">
      <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
        
        {/* Compact Editorial Gifting Header */}
        <div className="text-center space-y-1 max-w-2xl mx-auto border-b border-champagne-300/40 pb-3 sm:pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pearl-50 border border-blush-200 text-[10px] uppercase font-mono tracking-widest text-gold-dark font-bold shadow-sm">
            <Gift className="w-3 h-3" />
            <span>The Gifting Atelier</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl text-obsidian font-bold uppercase leading-tight">
            FOR SOMEONE <span className="font-zapfino text-champagne-400 font-normal tracking-normal capitalize inline-block text-[32px] sm:text-[46px] md:text-[54px] leading-[0.9] px-1">Special.</span>
          </h1>

          <p className="text-xs text-obsidian/75 leading-relaxed">
            Curate your custom celebration gift box. Choose your velvet box, assemble jewellery, and include a personalized retro Polaroid note.
          </p>

          {/* Occasion Filter Tabs - Stretched in One Clean Horizontal Line */}
          <div className="flex items-center justify-start sm:justify-center gap-2 pt-2.5 overflow-x-auto scrollbar-none w-full max-w-4xl mx-auto px-1">
            {occasions.map((occ) => (
              <button
                key={occ.id}
                onClick={() => setSelectedOccasion(occ.id)}
                className={`px-4 py-1.5 rounded-full text-[11px] sm:text-xs uppercase font-mono tracking-wider font-bold shrink-0 whitespace-nowrap transition-all cursor-pointer ${
                  selectedOccasion === occ.id
                    ? 'bg-obsidian text-pearl-100 shadow-md'
                    : 'bg-white text-obsidian-soft border border-champagne-300/80 hover:border-gold-dark hover:text-obsidian'
                }`}
              >
                {occ.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Workshop Studio (Fitted on Screen) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          
          {/* Left Column: Hamper Builder Controls (7 Cols) */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4 bg-white/95 p-4 sm:p-5 rounded-3xl border border-champagne-300/60 shadow-luxury-soft">
            
            {/* Step 1: Select Box Casing */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] uppercase font-mono tracking-widest text-obsidian font-bold flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-obsidian text-pearl-100 flex items-center justify-center text-[10px] font-mono">1</span>
                  Select Keepsake Velvet Box
                </h4>
                <span className="text-xs font-mono text-gold-dark font-bold">₹{selectedHamperBox.price}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {HAMPER_BOX_OPTIONS.map((box) => (
                  <button
                    key={box.id}
                    onClick={() => setSelectedHamperBox(box)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      selectedHamperBox.id === box.id
                        ? 'border-gold-dark bg-champagne-100/60 shadow-md ring-1 ring-gold-dark/40'
                        : 'border-champagne-300/60 bg-pearl-50 hover:bg-white'
                    }`}
                  >
                    <div className="aspect-[16/10] max-h-[80px] rounded-lg overflow-hidden mb-1 bg-sand">
                      <img src={box.imageUrl} alt={box.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-xs font-bold text-obsidian truncate">{box.name}</p>
                    <p className="text-[10px] text-gold-dark font-mono font-bold">₹{box.price}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Personalised Note & Polaroid */}
            <div className="space-y-1.5 pt-2.5 border-t border-champagne-300/50">
              <h4 className="text-[11px] uppercase font-mono tracking-widest text-obsidian font-bold flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-obsidian text-pearl-100 flex items-center justify-center text-[10px] font-mono">2</span>
                Handwritten Note & Custom Polaroid
              </h4>

              <textarea
                value={polaroidNote}
                onChange={(e) => setPolaroidNote(e.target.value)}
                placeholder="Write your personal message here (will be hand-calligraphed with gold wax seal)..."
                rows={2}
                className="w-full p-2.5 rounded-xl bg-pearl-50 border border-champagne-300/70 text-xs text-obsidian placeholder:text-obsidian-muted focus:outline-none focus:border-gold-dark resize-none font-sans"
              />
            </div>

            {/* Step 3: Add to Bag Action */}
            <div className="pt-0.5">
              <button
                onClick={handleAddHamperToBag}
                className="btn-primary w-full h-10 flex items-center justify-center gap-2 text-xs uppercase font-bold tracking-widest shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Add Custom Hamper to Bag • ₹{selectedHamperBox.price}</span>
              </button>
            </div>

          </div>

          {/* Right Column: Live Hamper Preview (5 Cols) */}
          <div className="lg:col-span-5 bg-white/95 p-4 sm:p-5 rounded-3xl border border-champagne-300/60 shadow-luxury-soft space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-widest text-gold-dark font-bold">
                Live Hamper Assembly
              </span>
              <span className="text-[9px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                Mumbai Atelier
              </span>
            </div>

            <div className="aspect-[16/10] max-h-[145px] rounded-xl overflow-hidden bg-sand border border-champagne-300/40">
              <img
                src={selectedHamperBox.imageUrl}
                alt={selectedHamperBox.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-pearl-50 border border-champagne-300/60 space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-obsidian">
                <Gift className="w-3 h-3 text-gold-dark" />
                <span>Includes Custom Retro Polaroid Print</span>
              </div>
              <p className="text-[11px] text-obsidian-soft font-serif font-medium line-clamp-1">
                "{polaroidNote || 'To my favourite person, shining always ✨'}"
              </p>
            </div>

            <div className="pt-1 border-t border-champagne-300/50 flex items-center justify-between text-xs">
              <span className="font-medium text-obsidian-soft">Packaging Total:</span>
              <span className="text-sm font-bold text-obsidian font-mono">₹{selectedHamperBox.price}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default GiftingPage;
