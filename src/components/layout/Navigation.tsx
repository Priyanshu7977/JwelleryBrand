import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Sparkles, User, ArrowRight, Compass, Gift, Heart, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { BRAND_INFO, CELESTIA_COLLECTIONS, FEATURED_PRODUCTS } from '../../data/shopify-data';
import { BehindCelestiaModal } from '../layout/BehindCelestiaModal';

export const Navigation: React.FC = () => {
  const { totalItems, setIsCartOpen, setIsSearchOpen, setIsConciergeOpen } = useCart();
  const { wishlistCount } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<'shop' | 'collections' | null>(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
  const [logoClicks, setLogoClicks] = useState<number>(0);
  const [isEasterEggOpen, setIsEasterEggOpen] = useState<boolean>(false);
  const location = useLocation();

  const handleLogoClick = (e: React.MouseEvent) => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    if (newCount >= 3) {
      setIsEasterEggOpen(true);
      setLogoClicks(0);
    }
  };

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      setIsScrolled(y > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus upon route transition
  useEffect(() => {
    setMobileMenuOpen(false);
    setHoveredMenu(null);
  }, [location.pathname]);

  const isHomePage = location.pathname === '/';
  // On homepage, keep navigation hidden during the pure film scrub until user completes the film
  const isFilmOpening = isHomePage && scrollY < (window.innerHeight * 1.1);

  const megaCategories = [
    {
      title: 'New Arrivals',
      categorySlug: 'all',
      description: 'The latest handcrafted bangles, anti-tarnish rings & bespoke hampers.',
      product: FEATURED_PRODUCTS[0], // pink and blue bangle set
      url: '/shop'
    },
    {
      title: 'Artisanal Bangles',
      categorySlug: 'bangles',
      description: 'Dual-tone pink and blue enamel pairs, white pearl finish, Kashmiri filigree.',
      product: FEATURED_PRODUCTS[2], // white bangles
      url: '/collections/bangles'
    },
    {
      title: 'Fine Jewellery & Sets',
      categorySlug: 'jewellery',
      description: 'Exclusive red emerald pendant sets and anti-tarnish stackable gold rings.',
      product: FEATURED_PRODUCTS[4], // red emerald set
      url: '/collections/jewellery'
    },
    {
      title: 'Bespoke Hampers & Gifting',
      categorySlug: 'gifting',
      description: 'Desi Barbie keepsake gift boxes, Purple Tulip hampers with satin ribbons.',
      product: FEATURED_PRODUCTS[1], // Desi Barbie Hamper
      url: '/gifting'
    },
    {
      title: 'Polaroids & Personalised',
      categorySlug: 'personalised',
      description: 'Custom printed 20-pack retro glossy polaroids with wax-sealed notes.',
      product: FEATURED_PRODUCTS[3], // polaroids 20
      url: '/collections/polaroids-personalised'
    },
    {
      title: 'Charms & Accessories',
      categorySlug: 'accessories',
      description: 'Cute gold honeybee keychains, crochet charms, and everyday magic.',
      product: FEATURED_PRODUCTS[6], // honeybee keychain
      url: '/collections/accessories'
    }
  ];

  const currentMegaProduct = megaCategories[activeCategoryIndex].product;

  return (
    <>
      {/* Top Mumbai Studio Announcement Bar */}
      <div
        className={`w-full bg-champagne-200 text-obsidian py-1.5 px-4 text-center text-[10px] tracking-widest uppercase font-mono font-semibold flex items-center justify-center gap-3 border-b border-champagne-300 transition-all duration-700 ${
          isFilmOpening ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
      >
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-gold-dark" />
          <span>MUMBAI ATELIER • SAME-DAY HAND DELIVERY DISPATCH AVAILABLE</span>
        </span>
        <span className="hidden md:inline text-obsidian/40">•</span>
        <span className="hidden md:inline text-obsidian font-bold">PAN-INDIA FREE EXPRESS DELIVERY &gt; ₹999</span>
      </div>

      {/* Floating Main Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isFilmOpening
            ? '-translate-y-28 opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100'
        } mt-7 ${
          isScrolled ? 'py-2.5 px-4 md:px-8' : 'py-5 px-6 md:px-12'
        }`}
        onMouseLeave={() => setHoveredMenu(null)}
      >
        <div
          className={`max-w-7xl mx-auto flex items-center justify-between transition-all duration-500 rounded-full px-6 py-2.5 ${
            isScrolled
              ? 'glass-pearl shadow-luxury-soft border border-champagne-300/70'
              : 'bg-pearl-50/95 backdrop-blur-md border border-champagne-300/60 shadow-sm'
          }`}
        >
          {/* LEFT: SHOP, COLLECTIONS, GIFTING (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8">
            {/* SHOP with Mega Menu */}
            <div
              className="relative py-2"
              onMouseEnter={() => setHoveredMenu('shop')}
            >
              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  `text-[11px] uppercase tracking-widest-luxury transition-colors font-semibold ${
                    isActive ? 'text-gold-dark font-bold' : 'text-obsidian hover:text-gold-dark'
                  }`
                }
              >
                Shop
              </NavLink>
            </div>

            {/* COLLECTIONS with Preview */}
            <div
              className="relative py-2"
              onMouseEnter={() => setHoveredMenu('collections')}
            >
              <NavLink
                to="/collections"
                className={({ isActive }) =>
                  `text-[11px] uppercase tracking-widest-luxury transition-colors font-semibold ${
                    isActive ? 'text-gold-dark font-bold' : 'text-obsidian hover:text-gold-dark'
                  }`
                }
              >
                Collections
              </NavLink>
            </div>

            {/* GIFTING */}
            <NavLink
              to="/gifting"
              className={({ isActive }) =>
                `text-[11px] uppercase tracking-widest-luxury transition-colors font-semibold ${
                  isActive ? 'text-gold-dark font-bold' : 'text-obsidian hover:text-gold-dark'
                }`
              }
            >
              Gifting
            </NavLink>
          </nav>

          {/* CENTER: CELESTIA Wordmark & Tagline (Links to Home) */}
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex flex-col items-center group transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
            aria-label="Celestia Homepage"
          >
            <div className="flex items-center gap-2">
              <span
                className={`font-serif-luxury tracking-[0.14em] font-normal text-obsidian uppercase transition-all duration-300 ${
                  isScrolled ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'
                }`}
              >
                CEL<span className="italic font-light lowercase">estia</span>
              </span>
            </div>
            <span className="text-[8px] sm:text-[9px] tracking-[0.34em] text-obsidian-soft uppercase font-sans font-medium -mt-0.5">
              redefined for all.
            </span>
          </Link>

          {/* RIGHT: THE WORLD, COMMUNITY, UTILITY (Desktop) */}
          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex items-center gap-8">
              <NavLink
                to="/the-world"
                className={({ isActive }) =>
                  `text-[11px] uppercase tracking-widest-luxury transition-colors font-medium ${
                    isActive ? 'text-gold-dark font-semibold' : 'text-obsidian/85 hover:text-obsidian'
                  }`
                }
              >
                The World
              </NavLink>

              <NavLink
                to="/community"
                className={({ isActive }) =>
                  `text-[11px] uppercase tracking-widest-luxury transition-colors font-medium ${
                    isActive ? 'text-gold-dark font-semibold' : 'text-obsidian/85 hover:text-obsidian'
                  }`
                }
              >
                Community
              </NavLink>
            </nav>

            {/* Utility Icons */}
            <div className="flex items-center gap-3">
              {/* Search Icon */}
              <Link
                to="/search"
                className="p-2 text-obsidian/80 hover:text-obsidian hover:bg-champagne-100/60 rounded-full transition-all"
                aria-label="Search Collections"
              >
                <Search className="w-4 h-4" />
              </Link>

              {/* Wishlist Icon */}
              <Link
                to="/wishlist"
                className="relative p-2 text-obsidian/80 hover:text-obsidian hover:bg-champagne-100/60 rounded-full transition-all"
                aria-label={`Private Wishlist (${wishlistCount} items)`}
                title="Private Wishlist"
              >
                <Heart className="w-4 h-4 text-obsidian/80 hover:text-rose-600 transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account Icon */}
              <Link
                to="/account"
                className="p-2 text-obsidian/80 hover:text-obsidian hover:bg-champagne-100/60 rounded-full transition-all"
                aria-label="Customer Account Portal"
              >
                <User className="w-4 h-4" />
              </Link>

              {/* Concierge / WhatsApp */}
              <button
                onClick={() => setIsConciergeOpen(true)}
                className="p-2 text-emerald-800 hover:text-emerald-900 hover:bg-emerald-50 rounded-full transition-all"
                aria-label="Atelier Concierge Desk"
                title="Atelier Concierge"
              >
                <MessageCircle className="w-4 h-4" />
              </button>

              {/* Bag Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 bg-obsidian text-pearl-100 px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-widest-luxury hover:bg-obsidian-200 transition-all shadow-sm"
                aria-label={`Open Bag (${totalItems} items)`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bag</span>
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-champagne-300 text-obsidian text-[10px] font-bold">
                  {totalItems}
                </span>
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-obsidian hover:bg-champagne-100/50 rounded-full transition-colors"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-obsidian" />}
              </button>
            </div>
          </div>
        </div>

        {/* SHOP MEGA EXPERIENCE PANEL */}
        {hoveredMenu === 'shop' && (
          <div
            className="hidden lg:block max-w-5xl mx-auto mt-2 p-8 bg-pearl-50/98 backdrop-blur-xl rounded-3xl border border-champagne-300/80 shadow-2xl animate-fade-in"
            onMouseEnter={() => setHoveredMenu('shop')}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <div className="grid grid-cols-12 gap-8 items-center">
              
              {/* Categories Column (7 Cols) */}
              <div className="col-span-7 space-y-3">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-monumental text-gold-dark font-semibold border-b border-champagne-300/30 pb-2">
                  <Compass className="w-3.5 h-3.5" />
                  <span>The Real Celestia Catalogue</span>
                </div>

                <div className="space-y-1">
                  {megaCategories.map((cat, idx) => (
                    <Link
                      key={cat.title}
                      to={cat.url}
                      onMouseEnter={() => setActiveCategoryIndex(idx)}
                      className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                        activeCategoryIndex === idx
                          ? 'bg-champagne-100/80 text-obsidian font-semibold shadow-sm translate-x-1'
                          : 'text-obsidian/70 hover:text-obsidian hover:bg-white/60'
                      }`}
                    >
                      <div>
                        <p className="font-serif-luxury text-lg leading-tight">{cat.title}</p>
                        <p className="text-[11px] text-obsidian/60 font-sans font-normal">{cat.description}</p>
                      </div>
                      <ArrowRight className={`w-4 h-4 transition-opacity ${activeCategoryIndex === idx ? 'opacity-100 text-gold-dark' : 'opacity-0'}`} />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Dynamic Real Product Visual Preview (5 Cols) */}
              <div className="col-span-5 bg-white p-5 rounded-3xl border border-champagne-300/50 shadow-luxury-soft space-y-4">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-sand shadow-inner relative">
                  <img
                    src={currentMegaProduct.images.hero}
                    alt={currentMegaProduct.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[9px] uppercase tracking-wider bg-pearl-100/90 text-obsidian px-2.5 py-0.5 rounded-full font-mono">
                      {megaCategories[activeCategoryIndex].title}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-serif-luxury text-base text-obsidian line-clamp-1">
                    {currentMegaProduct.title}
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-lg font-bold text-gold-dark">
                      ₹{currentMegaProduct.price}
                    </span>
                    <Link
                      to={`/product/${currentMegaProduct.handle}`}
                      className="text-xs uppercase tracking-widest text-obsidian hover:text-gold-dark font-medium underline"
                    >
                      Inspect Piece →
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* COLLECTIONS PREVIEW PANEL */}
        {hoveredMenu === 'collections' && (
          <div
            className="hidden lg:block max-w-5xl mx-auto mt-2 p-8 bg-pearl-50/98 backdrop-blur-xl rounded-3xl border border-champagne-300/80 shadow-2xl animate-fade-in"
            onMouseEnter={() => setHoveredMenu('collections')}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-champagne-300/30 pb-2">
                <span className="text-[10px] uppercase tracking-monumental text-gold-dark font-semibold">
                  Five Curated Realms
                </span>
                <Link to="/collections" className="text-xs uppercase tracking-widest text-obsidian hover:text-gold-dark font-medium">
                  View All Collections Index →
                </Link>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {CELESTIA_COLLECTIONS.map((col, i) => (
                  <Link
                    key={col.id}
                    to={`/collections/${col.handle}`}
                    className="p-3 bg-white rounded-2xl border border-champagne-300/40 hover:border-gold-dark transition-all space-y-2.5 group"
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-sand">
                      <img src={col.featuredImage} alt={col.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-gold-dark font-mono block">
                        Realm 0{i + 1}
                      </span>
                      <h4 className="font-serif-luxury text-sm text-obsidian group-hover:text-gold-dark transition-colors line-clamp-1">
                        {col.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

      </header>

      {/* FULLSCREEN REDESIGNED MOBILE CURTAIN DRAWER */}
      <div
        className={`fixed inset-0 z-40 bg-pearl-100/98 backdrop-blur-2xl transition-all duration-500 lg:hidden flex flex-col justify-between p-8 pt-24 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-8'
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-champagne-300/40 pb-3">
            <span className="text-[10px] uppercase tracking-ethereal text-gold-dark font-semibold">
              Atelier Directory
            </span>
            <span className="text-xs font-serif italic text-obsidian/60">Mumbai Studio</span>
          </div>

          <nav className="flex flex-col gap-3">
            {[
              { label: 'Shop', href: '/shop', count: '400+ Pieces' },
              { label: 'Collections', href: '/collections', count: '5 Realms' },
              { label: 'Gifting Atelier', href: '/gifting', count: 'Bespoke Hampers' },
              { label: 'Private Wishlist', href: '/wishlist', count: `${wishlistCount} Saved` },
              { label: 'The World', href: '/the-world', count: 'Brand Story' },
              { label: 'Community', href: '/community', count: 'Seen On You' },
              { label: 'My Celestia', href: '/account', count: 'Orders & Profile' },
              { label: 'Search Catalogue', href: '/search', count: 'Live Search' },
            ].map((link, idx) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif-luxury text-2xl text-obsidian hover:text-gold-dark transition-colors flex items-center justify-between border-b border-champagne-300/20 pb-2"
              >
                <span>{link.label}</span>
                <span className="text-[10px] font-mono text-obsidian/40 font-normal uppercase">{link.count}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Drawer Bottom Concierge */}
        <div className="space-y-4 pt-4 border-t border-champagne-300/40">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setIsConciergeOpen(true);
            }}
            className="w-full py-3.5 px-6 rounded-full bg-emerald-800 text-pearl-50 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-md"
          >
            <span>Ask Concierge Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex justify-between items-center text-[11px] text-obsidian/60 tracking-wider">
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-obsidian underline">
              Contact Desk
            </Link>
            <a href={BRAND_INFO.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-obsidian">
              @celestiaamor.in
            </a>
          </div>
        </div>
      </div>

      {/* Behind Celestia Easter Egg Modal */}
      <BehindCelestiaModal
        isOpen={isEasterEggOpen}
        onClose={() => setIsEasterEggOpen(false)}
      />
    </>
  );
};
