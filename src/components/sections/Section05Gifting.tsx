import React, { useState } from 'react';
import { HAMPER_BOX_OPTIONS } from '../../data/shopify-data';
import { useCart } from '../../context/CartContext';
import { Gift, Sparkles, Image as ImageIcon, Heart } from 'lucide-react';
import { RevealOnScroll } from '../motion/RevealOnScroll';
import { ProductTiltCard } from '../motion/ProductTiltCard';

export const Section05Gifting: React.FC = () => {
  const {
    selectedHamperBox,
    setSelectedHamperBox,
    cart,
    addToCart,
    polaroidNote,
    setPolaroidNote,
    setIsCartOpen,
  } = useCart();

  const [polaroidImageUrl] = useState<string>(
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop'
  );

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
        polaroidPhotoUrl: polaroidImageUrl,
        ribbonColor: 'Champagne Double Satin'
      });
    }

    setIsCartOpen(true);
  };

  return (
    <section
      id="section-gifting"
      className="relative w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 lg:px-14 bg-blush-50/60 overflow-hidden border-t border-champagne-300/30"
    >
      {/* Soft Ambient Glow */}
      <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-blush-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-champagne-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        
        {/* Section Header */}
        <RevealOnScroll direction="up" delay={0}>
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pearl-100 border border-blush-200 text-[11px] uppercase font-mono tracking-widest text-gold-dark font-bold shadow-sm">
              <Gift className="w-3.5 h-3.5" />
              <span>Act 05 — The Gifting Atelier</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl text-obsidian font-bold leading-[1.05]">
              For someone <span className="font-zapfino text-champagne-400 font-normal tracking-normal lowercase inline-block text-[34px] sm:text-[50px] md:text-[60px] leading-[0.9] px-1">special.</span>
            </h2>

            <p className="text-xs sm:text-sm text-obsidian/75 leading-relaxed">
              Craft a custom celebration gift box. Select your keepsake velvet packaging, choose signature adornments, and include a personalized printed retro Polaroid.
            </p>
          </div>
        </RevealOnScroll>

        {/* 2-Column Workshop Studio with Layered Unboxing Motion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-start">
          
          {/* Left Column: Hamper Builder Controls (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 bg-white/90 p-5 sm:p-8 rounded-3xl border border-champagne-300/60 shadow-luxury-soft">
            
            {/* Step 1: Select Box Casing */}
            <RevealOnScroll direction="up" delay={100} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase font-mono tracking-widest text-obsidian font-bold flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-obsidian text-pearl-100 flex items-center justify-center text-[10px] font-mono">1</span>
                  Select Keepsake Velvet Box
                </h4>
                <span className="text-xs font-mono text-gold-dark font-bold">₹{selectedHamperBox.price}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {HAMPER_BOX_OPTIONS.map((box, bIdx) => (
                  <button
                    key={box.id}
                    onClick={() => setSelectedHamperBox(box)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-300 ${
                      selectedHamperBox.id === box.id
                        ? 'border-gold-dark bg-champagne-100/60 shadow-md ring-2 ring-gold-dark/30 scale-[1.02]'
                        : 'border-champagne-300/60 bg-pearl-50 hover:bg-white'
                    }`}
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden mb-2 bg-sand luxury-sheen">
                      <img src={box.imageUrl} alt={box.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    </div>
                    <p className="text-xs font-bold text-obsidian truncate">{box.name}</p>
                    <p className="text-[11px] text-gold-dark font-mono font-bold mt-0.5">₹{box.price}</p>
                  </button>
                ))}
              </div>
            </RevealOnScroll>

            {/* Step 2: Personalised Note & Polaroid */}
            <RevealOnScroll direction="up" delay={200} className="space-y-3 pt-4 border-t border-champagne-300/50">
              <h4 className="text-xs uppercase font-mono tracking-widest text-obsidian font-bold flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-obsidian text-pearl-100 flex items-center justify-center text-[10px] font-mono">2</span>
                Handwritten Note & Custom Polaroid
              </h4>

              <textarea
                value={polaroidNote}
                onChange={(e) => setPolaroidNote(e.target.value)}
                placeholder="Write your personal message here (will be hand-calligraphed onto textured archival cardstock with gold wax seal)..."
                rows={3}
                className="w-full p-3.5 rounded-2xl bg-pearl-50 border border-champagne-300/70 text-xs sm:text-sm text-obsidian placeholder:text-obsidian-muted focus:outline-none focus:border-gold-dark resize-none font-sans transition-all"
              />
            </RevealOnScroll>

            {/* Step 3: Add to Bag Action */}
            <RevealOnScroll direction="up" delay={300} className="pt-2">
              <button
                onClick={handleAddHamperToBag}
                className="btn-primary w-full h-12 flex items-center justify-center gap-2 text-xs sm:text-sm uppercase font-bold tracking-widest shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Add Custom Hamper to Bag • ₹{selectedHamperBox.price}</span>
              </button>
            </RevealOnScroll>

          </div>

          {/* Right Column: Live Hamper Preview (5 Cols) with Tilt */}
          <RevealOnScroll direction="up" delay={200} className="lg:col-span-5">
            <ProductTiltCard className="bg-white/95 p-5 sm:p-7 rounded-3xl border border-champagne-300/60 shadow-luxury-soft space-y-4 jewellery-spotlight">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono tracking-widest text-gold-dark font-bold">
                  Live Hamper Assembly
                </span>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                  Mumbai Atelier
                </span>
              </div>

              <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-sand border border-champagne-300/40 relative luxury-sheen">
                <img
                  src={selectedHamperBox.imageUrl}
                  alt={selectedHamperBox.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-pearl-50 border border-champagne-300/60 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-obsidian">
                  <Gift className="w-4 h-4 text-gold-dark" />
                  <span>Includes Custom Retro Polaroid Print</span>
                </div>
                <p className="text-xs text-obsidian-soft font-serif font-medium line-clamp-2">
                  "{polaroidNote || 'To my favourite person, shining always ✨'}"
                </p>
              </div>

              <div className="pt-2 border-t border-champagne-300/50 flex items-center justify-between text-xs">
                <span className="font-medium text-obsidian-soft">Packaging Total:</span>
                <span className="text-base font-bold text-obsidian font-mono">₹{selectedHamperBox.price}</span>
              </div>
            </ProductTiltCard>
          </RevealOnScroll>

        </div>

      </div>
    </section>
  );
};

export default Section05Gifting;
