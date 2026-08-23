import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Search, 
  User, 
  Sparkles, 
  Heart, 
  ArrowRight,
  Compass,
  MessageCircle,
  Film
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { FEATURED_PRODUCTS, CELESTIA_COLLECTIONS, BRAND_INFO } from '../../data/shopify-data';
import { BehindCelestiaModal } from './BehindCelestiaModal';

export const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<'shop' | 'collections' | null>(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);

  const { totalItems, setIsCartOpen, setIsConciergeOpen } = useCart();
  const { wishlistCount, isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Handle Easter Egg trigger
  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      const nextCount = logoClickCount + 1;
      setLogoClickCount(nextCount);
      if (nextCount === 3) {
        setIsEasterEggOpen(true);
        setLogoClickCount(0);
      }
    }
  };

  // Check scroll position
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setHoveredMenu(null);
  }, [location.pathname]);

  // Pure fashion film opening rule: On homepage during film scrubbing (scroll < window.innerHeight * 0.95), hide navigation
  const isHomePage = location.pathname === '/';
  const isFilmOpening = isHomePage && scrollY < window.innerHeight * 0.95;

  const megaCategories = [
    {
      title: 'Artisanal Bangles',
      categorySlug: 'bangles',
      description: 'Hand-painted enamel, 18k gold dipped swirls, and traditional royal motifs.',
      product: FEATURED_PRODUCTS[0], // pink and blue bangle
      url: '/collections/bangles'
    },
    {
      title: 'Fine Jewellery & Suites',
      categorySlug: 'jewellery',
      description: 'Sculptural red emerald suites, anti-tarnish everyday rings, and zircon pendants.',
      product: FEATURED_PRODUCTS[4], // exclusive red emerald
      url: '/collections/jewellery'
    },
    {
      title: 'Bespoke Celebration Hampers',
      categorySlug: 'gifting',
      description: 'Custom velvet keepsake trunks, birthday curations, and wax-sealed retro polaroids.',
      product: FEATURED_PRODUCTS[1], // desi barbie hamper
      url: '/gifting'
    },
    {
      title: 'Polaroids & Personalised',
      categorySlug: 'personalised',
      description: 'Real Fujifilm Instax prints, hand-calligraphed letters, and custom memories.',
      product: FEATURED_PRODUCTS[2], // custom photo polaroid
      url: '/collections/personalised'
    },
    {
      title: 'Charms & Keepsake Accessories',
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
        className={`fixed top-0 left-0 right-0 z-50 bg-champagne-200 text-obsidian py-1.5 px-3 sm:px-4 text-center text-[10px] sm:text-[11px] tracking-widest uppercase font-mono font-semibold flex items-center justify-center gap-2 sm:gap-3 border-b border-champagne-300 transition-transform duration-500 ${
          isFilmOpening ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
      >
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-gold-dark shrink-0" />
          <span className="truncate">MUMBAI ATELIER • SAME-DAY HAND DELIVERY AVAILABLE</span>
        </span>
        <span className="hidden md:inline text-obsidian/40">•</span>
        <span className="hidden md:inline text-obsidian font-bold">PAN-INDIA FREE EXPRESS DELIVERY &gt; ₹999</span>
      </div>

      {/* Floating Main Header */}
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          isFilmOpening
            ? '-translate-y-28 opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100'
        } ${
          isScrolled ? 'top-1 sm:top-2 px-3 sm:px-6' : 'top-7 sm:top-8 px-3 sm:px-6'
        }`}
        onMouseLeave={() => setHoveredMenu(null)}
      >
        <div
          className={`max-w-7xl mx-auto flex items-center justify-between transition-all duration-300 rounded-full px-3.5 sm:px-6 py-2 sm:py-2.5 ${
            isScrolled
              ? 'glass-pearl shadow-luxury-soft border border-champagne-300/80'
              : 'bg-pearl-50/95 backdrop-blur-md border border-champagne-300/70 shadow-sm'
          }`}
        >
          
          {/* ================================================================= */}
          {/* 1. MOBILE/TABLET LEFT: Visible Dedicated Hamburger Button         */}
          {/* ================================================================= */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-champagne-100/70 hover:bg-champagne-200 text-obsidian transition-colors shadow-sm focus:outline-none"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-obsidian" /> : <Menu className="w-5 h-5 text-obsidian" />}
            </button>
          </div>

          {/* ================================================================= */}
          {/* 2. DESKTOP LEFT: Navigation Links (Shop, Collections, Gifting)   */}
          {/* ================================================================= */}
          <nav className="hidden lg:flex items-center gap-7">
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

          {/* ================================================================= */}
          {/* 3. CENTER: CELestia Brand Logo & Tagline                          */}
          {/* ================================================================= */}
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex flex-col items-center group transition-transform duration-300 hover:scale-[1.02] cursor-pointer px-2"
            aria-label="Celestia Homepage"
          >
            <div className="flex items-center gap-1.5">
              <span
                className={`font-serif-luxury tracking-[0.14em] font-normal text-obsidian uppercase transition-all duration-300 ${
                  isScrolled ? 'text-lg sm:text-2xl' : 'text-xl sm:text-2xl md:text-3xl'
                }`}
              >
                CEL<span className="italic font-light lowercase">estia</span>
              </span>
            </div>
            <span className="text-[7.5px] sm:text-[8.5px] tracking-[0.32em] text-obsidian-soft uppercase font-sans font-medium -mt-0.5">
              redefined for all.
            </span>
          </Link>

          {/* ================================================================= */}
          {/* 4. RIGHT SECTION: Desktop Links & Compact Mobile Utilities        */}
          {/* ================================================================= */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            
            {/* Desktop Navigation (The World, Community) */}
            <nav className="hidden lg:flex items-center gap-7">
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

            {/* Utility Icons Group */}
            <div className="flex items-center gap-1 sm:gap-2">
              
              {/* Search Icon */}
              <Link
                to="/search"
                className="p-2 text-obsidian/80 hover:text-obsidian hover:bg-champagne-100/60 rounded-full transition-all"
                aria-label="Search Catalogue"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </Link>

              {/* Wishlist Icon with count badge */}
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

              {/* Account Icon (Visible on all screens) */}
              <Link
                to="/account"
                className="relative p-1.5 sm:p-2 text-obsidian/80 hover:text-obsidian hover:bg-champagne-100/60 rounded-full transition-all"
                aria-label="Customer Account Portal"
                title={isAuthenticated ? `Account: ${user?.name}` : 'Sign In / Account'}
              >
                <User className="w-4 h-4" />
                {isAuthenticated && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-pearl-50" />
                )}
              </Link>

              {/* WhatsApp Concierge (Desktop Only - In mobile drawer on mobile) */}
              <button
                onClick={() => setIsConciergeOpen(true)}
                className="hidden sm:flex p-2 text-emerald-800 hover:text-emerald-900 hover:bg-emerald-50 rounded-full transition-all"
                aria-label="Atelier Concierge Desk"
                title="Atelier Concierge"
              >
                <MessageCircle className="w-4 h-4" />
              </button>

              {/* Shopping Bag Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-1.5 bg-obsidian text-pearl-100 px-3 sm:px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] uppercase tracking-widest-luxury hover:bg-obsidian-200 transition-all shadow-sm font-bold shrink-0"
                aria-label={`Open Bag (${totalItems} items)`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bag</span>
                {totalItems > 0 && (
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-champagne-300 text-obsidian text-[10px] font-bold">
                    {totalItems}
                  </span>
                )}
              </button>

            </div>

          </div>

        </div>

        {/* ================================================================= */}
        {/* SHOP MEGA MENU PANEL (Desktop)                                    */}
        {/* ================================================================= */}
        {hoveredMenu === 'shop' && (
          <div
            className="hidden lg:block max-w-5xl mx-auto mt-2 p-8 bg-pearl-50/98 backdrop-blur-xl rounded-3xl border border-champagne-300/80 shadow-2xl animate-fade-in"
            onMouseEnter={() => setHoveredMenu('shop')}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <div className="grid grid-cols-12 gap-8 items-center">
              
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

              <div className="col-span-5 bg-white p-5 rounded-3xl border border-champagne-300/60 shadow-luxury-soft space-y-4">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-sand">
                  <img
                    src={currentMegaProduct.images.hero}
                    alt={currentMegaProduct.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-gold-dark font-bold">
                    Signature Highlight
                  </span>
                  <h4 className="font-serif-luxury text-lg text-obsidian font-semibold leading-snug">
                    {currentMegaProduct.title}
                  </h4>
                  <p className="text-xs text-obsidian/70 line-clamp-2">
                    {currentMegaProduct.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-champagne-200">
                  <span className="font-serif text-lg text-obsidian font-bold">₹{currentMegaProduct.price}</span>
                  <Link
                    to={`/product/${currentMegaProduct.handle}`}
                    className="text-xs uppercase font-mono tracking-widest text-gold-dark font-bold hover:underline flex items-center gap-1"
                  >
                    <span>View Piece</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* COLLECTIONS PREVIEW PANEL (Desktop)                               */}
        {/* ================================================================= */}
        {hoveredMenu === 'collections' && (
          <div
            className="hidden lg:block max-w-5xl mx-auto mt-2 p-8 bg-pearl-50/98 backdrop-blur-xl rounded-3xl border border-champagne-300/80 shadow-2xl animate-fade-in"
            onMouseEnter={() => setHoveredMenu('collections')}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <div className="space-y-6">
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

      {/* ================================================================= */}
      {/* FULLSCREEN MOBILE/TABLET DRAWER                                   */}
      {/* ================================================================= */}
      <div
        className={`fixed inset-0 z-40 bg-pearl-100/98 backdrop-blur-2xl transition-all duration-500 lg:hidden flex flex-col justify-between p-6 sm:p-8 pt-28 pb-8 overflow-y-auto overscroll-contain ${
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

          <nav className="flex flex-col gap-2 sm:gap-3">
            {[
              { label: 'Shop', href: '/shop', count: '400+ Pieces' },
              { label: 'Collections', href: '/collections', count: '5 Realms' },
              { label: 'Gifting Atelier', href: '/gifting', count: 'Bespoke Hampers' },
              { label: 'Private Wishlist', href: '/wishlist', count: `${wishlistCount} Saved` },
              { label: 'The World', href: '/the-world', count: 'Brand Story' },
              { label: 'Community', href: '/community', count: 'Seen On You' },
              { label: 'My Celestia Account', href: '/account', count: isAuthenticated ? (user?.name || 'Member') : 'Sign In' },
              { label: 'Search Catalogue', href: '/search', count: 'Live Search' },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif-luxury text-xl sm:text-2xl text-obsidian hover:text-gold-dark transition-colors flex items-center justify-between border-b border-champagne-300/20 pb-2.5"
              >
                <span>{link.label}</span>
                <span className="text-[10px] font-mono text-obsidian/40 font-normal uppercase">{link.count}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Drawer Bottom Actions */}
        <div className="space-y-4 pt-6 border-t border-champagne-300/40 mt-6">
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
