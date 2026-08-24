import React, { useState } from 'react';
import { HAMPER_BOX_OPTIONS, FEATURED_PRODUCTS } from '../data/shopify-data';
import { useCart } from '../context/CartContext';
import { MagneticButton } from '../components/ui/MagneticButton';
import { Gift, Sparkles, Check, Plus, Trash2, ArrowRight, Heart, Video } from 'lucide-react';

export const GiftingPage: React.FC = () => {
  const {
    selectedHamperBox,
    setSelectedHamperBox,
    cart,
    addToCart,
    removeFromCart,
    polaroidNote,
    setPolaroidNote,
    totalItems,
    subtotal,
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
    // Add the keepsake box to the cart with the custom note and ribbon specifications
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
    <div className="w-full min-h-screen bg-pearl-100 pt-36 sm:pt-40 md:pt-44 pb-32 px-4 sm:px-8 md:px-12 lg:px-20 selection:bg-champagne-300">
      {/* Background Decor */}
      <div className="absolute top-20 right-1/4 w-[600px] h-[600px] bg-blush-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1500px] mx-auto space-y-12">
        
        {/* Editorial Gifting Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto border-b border-champagne-300/40 pb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pearl-50 border border-blush-200 text-[11px] uppercase tracking-widest text-gold-dark font-medium shadow-sm">
            <Gift className="w-3.5 h-3.5" />
            <span>The Gifting Atelier</span>
          </div>

          <h1 className="font-serif-luxury text-5xl sm:text-7xl md:text-8xl text-obsidian uppercase font-normal leading-[0.92]">
            FOR SOMEONE <span className="italic font-light text-gold-dark lowercase">special.</span>
          </h1>

          <p className="text-xs sm:text-sm text-obsidian/75 font-sans leading-relaxed">
            Curate bespoke memories. Choose your velvet gift box, assemble hand-finished jewellery, and include a custom printed retro Polaroid note with gold wax seal.
          </p>

          {/* Occasion Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {occasions.map((occ) => (
              <button
                key={occ.id}
                onClick={() => setSelectedOccasion(occ.id)}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-medium transition-all ${
                  selectedOccasion === occ.id
                    ? 'bg-obsidian text-pearl-100 shadow-sm'
                    : 'bg-white/80 text-obsidian/70 hover:bg-champagne-100/60 border border-champagne-300/40'
                }`}
              >
                {occ.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive 2-Column Hamper Workshop Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* Left Column: Interactive Hamper Builder Controls (7 Cols) */}
          <div className="lg:col-span-7 space-y-8 bg-pearl-50/90 p-6 md:p-10 rounded-3xl border border-champagne-300/50 shadow-luxury-soft backdrop-blur-sm">
            
            {/* Step 1: Select Box Casing */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-widest text-obsidian font-semibold flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-obsidian text-pearl-100 flex items-center justify-center text-[10px] font-mono">1</span>
                  Select Keepsake Velvet Box
                </h3>
                <span className="text-xs font-mono text-gold-dark font-medium">₹{selectedHamperBox.price}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {HAMPER_BOX_OPTIONS.map((box) => (
                  <button
                    key={box.id}
                    onClick={() => setSelectedHamperBox(box)}
                    className={`p-3.5 rounded-2xl text-left border transition-all ${
                      selectedHamperBox.id === box.id
                        ? 'border-gold-dark bg-champagne-100/70 shadow-sm'
                        : 'border-champagne-300/40 bg-white/60 hover:bg-white'
                    }`}
                  >
                    <div
                      className="w-full h-12 rounded-xl mb-2 flex items-center justify-center text-xs font-serif shadow-inner"
                      style={{ backgroundColor: box.color }}
                    >
                      {selectedHamperBox.id === box.id && <Check className="w-4 h-4 text-obsidian" />}
                    </div>
                    <p className="font-serif-luxury text-sm text-obsidian font-medium line-clamp-1">
                      {box.name}
                    </p>
                    <p className="text-[10px] text-obsidian/60 mt-0.5">₹{box.price}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Choose Adornments */}
            <div className="space-y-4 pt-4 border-t border-champagne-300/30">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-widest text-obsidian font-semibold flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-obsidian text-pearl-100 flex items-center justify-center text-[10px] font-mono">2</span>
                  Add Adornments & Jewellery {totalItems > 0 ? `(${totalItems} in bag)` : ''}
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {FEATURED_PRODUCTS.slice(0, 6).map((prod) => {
                  const cartItem = cart.find((i) => i.product.id === prod.id);
                  const isInside = Boolean(cartItem);
                  return (
                    <div
                      key={prod.id}
                      className={`p-2.5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isInside
                          ? 'border-gold-dark bg-champagne-100/50 shadow-sm'
                          : 'border-champagne-300/30 bg-white/50 hover:bg-white'
                      }`}
                    >
                      <div className="aspect-square rounded-xl overflow-hidden bg-sand mb-2">
                        <img src={prod.images.hero} alt={prod.title} className="w-full h-full object-cover" />
                      </div>
                      <p className="font-serif text-xs text-obsidian line-clamp-1">{prod.title}</p>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-champagne-200/50">
                        <span className="text-[11px] font-mono text-gold-dark font-medium">₹{prod.price}</span>
                        {isInside ? (
                          <div className="flex items-center gap-1.5">
                            {cartItem && cartItem.quantity > 1 && (
                              <span className="text-[10px] font-mono text-gold-dark font-semibold">x{cartItem.quantity}</span>
                            )}
                            <button
                              onClick={() => removeFromCart(prod.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                              title="Remove from bag"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(prod, 1, { boxType: selectedHamperBox.name, customNote: polaroidNote })}
                            className="p-1.5 bg-obsidian text-pearl-100 hover:bg-obsidian-200 rounded-full transition-colors"
                            title="Add to curated bag"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Custom Polaroid Memory & Note */}
            <div className="space-y-4 pt-4 border-t border-champagne-300/30">
              <h3 className="text-xs uppercase tracking-widest text-obsidian font-semibold flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-obsidian text-pearl-100 flex items-center justify-center text-[10px] font-mono">3</span>
                Personalised Polaroid Card & Message
              </h3>

              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-wider text-obsidian/60 block">
                  Message Handwritten in Gold Wax-Sealed Envelope
                </label>
                <textarea
                  value={polaroidNote}
                  onChange={(e) => setPolaroidNote(e.target.value)}
                  rows={2}
                  maxLength={120}
                  className="w-full p-3 rounded-2xl bg-white/80 border border-champagne-300/60 font-serif text-sm text-obsidian focus:outline-none focus:border-gold-dark"
                  placeholder="Enter personal note for recipient..."
                />
                <span className="text-[10px] text-obsidian/50 font-mono text-right block">
                  {polaroidNote.length}/120 characters
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Live Polaroid & Velvet Box Presentation Preview (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-champagne-300/60 shadow-luxury-soft space-y-6">
              
              <div className="flex items-center justify-between border-b border-champagne-300/30 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold-dark" />
                  <span className="font-serif-luxury text-lg text-obsidian">Hamper Live Assembly</span>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-sans">
                  Same-Day Mumbai Ready
                </span>
              </div>

              {/* Realistic Polaroid Mockup */}
              <div className="relative mx-auto w-48 sm:w-56 p-3 pb-8 bg-pearl-50 shadow-2xl rounded-sm border border-stone-200 rotate-[-2deg] transition-transform hover:rotate-0">
                <div className="aspect-[4/4.5] overflow-hidden bg-sand mb-2">
                  <img
                    src={selectedHamperBox.imageUrl}
                    alt="Custom Polaroid preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-serif italic text-xs text-obsidian/85 text-center leading-snug line-clamp-2 px-1">
                  "{polaroidNote || 'Moments in gold.'}"
                </p>
                <div className="absolute bottom-2 right-3">
                  <span className="text-[8px] tracking-widest uppercase font-mono text-obsidian/40">CELestia</span>
                </div>
              </div>

              {/* Box Summary Specs */}
              <div className="space-y-2 pt-2 border-t border-champagne-300/30 text-xs">
                <div className="flex justify-between text-obsidian/70">
                  <span>Box Casing:</span>
                  <span className="font-serif font-medium text-obsidian">{selectedHamperBox.name}</span>
                </div>
                <div className="flex justify-between text-obsidian/70">
                  <span>Curated Pieces:</span>
                  <span className="font-serif font-medium text-obsidian">{totalItems} {totalItems === 1 ? 'piece' : 'pieces'} in bag</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-obsidian pt-2 border-t border-champagne-300/40">
                  <span className="font-serif text-base">Bag Total</span>
                  <span className="font-mono text-lg font-bold text-gold-dark">₹{subtotal}</span>
                </div>
              </div>

              {/* Add Hamper to Bag CTA */}
              <MagneticButton
                variant="secondary"
                size="lg"
                onClick={handleAddHamperToBag}
                className="w-full"
              >
                <span>{totalItems > 0 ? 'View in Bag & Checkout' : 'Curate & Add Hamper to Bag'}</span>
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
