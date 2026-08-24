import React, { useState, useEffect, useRef } from 'react';
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

  // Check scroll position and direction for show/hide animation
  const [scrollY, setScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 30);

      // At top of page, always keep header visible
      if (currentScrollY <= 50) {
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY.current + 8) {
        // Scrolling DOWN -> Header HIDES smoothly
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY.current - 8) {
        // Scrolling UP -> Header APPEARS smoothly
        setIsHeaderVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setHoveredMenu(null);
  }, [location.pathname]);

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
  const isShown = isHeaderVisible || mobileMenuOpen || hoveredMenu !== null;

  return (
    <>
      {/* Top Mumbai Studio Announcement Bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-champagne-200 text-obsidian py-1.5 px-3 sm:px-4 text-center text-[10px] sm:text-[11px] tracking-widest uppercase font-mono font-semibold flex items-center justify-center gap-2 sm:gap-3 border-b border-champagne-300 transition-all duration-500 ${
          isShown ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
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
          isShown ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-28 opacity-0 pointer-events-none'
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
          {/* 1. LEFT SECTION: Logo Corner + All Nav Links Aligned One by One   */}
          {/* ================================================================= */}
          <div className="flex items-center gap-4 sm:gap-6 xl:gap-8">
            
            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-champagne-100/70 hover:bg-champagne-200 text-obsidian transition-colors shadow-sm focus:outline-none"
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-obsidian" /> : <Menu className="w-5 h-5 text-obsidian" />}
              </button>
            </div>

            {/* CELestia Brand Logo at the Left Corner */}
            <Link
              to="/"
              onClick={handleLogoClick}
              className="flex flex-col group transition-transform duration-300 hover:scale-[1.02] cursor-pointer shrink-0"
              aria-label="Celestia Homepage"
            >
              <div className="flex items-center gap-1">
                <span
                  className={`font-serif-luxury tracking-[0.14em] font-normal text-obsidian uppercase transition-all duration-300 ${
                    isScrolled ? 'text-lg sm:text-2xl' : 'text-xl sm:text-2xl md:text-3xl'
                  }`}
                >
                  CEL<span className="italic font-light lowercase">estia</span>
                </span>
              </div>
              <span className="text-[7px] sm:text-[8px] tracking-[0.32em] text-obsidian-soft uppercase font-sans font-medium -mt-0.5 whitespace-nowrap">
                redefined for all.
              </span>
            </Link>

            {/* All Navigation Links Aligned Sequentially After Logo */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6 pl-2 xl:pl-4 border-l border-champagne-300/60">
              
              {/* Shop Link with Mega Menu */}
              <div
                className="relative py-2"
                onMouseEnter={() => setHoveredMenu('shop')}
              >
                <NavLink
                  to="/shop"
                  className={({ isActive }) =>
                    `text-[11px] uppercase tracking-widest-luxury transition-colors font-semibold whitespace-nowrap ${
                      isActive ? 'text-gold-dark font-bold' : 'text-obsidian hover:text-gold-dark'
                    }`
                  }
                >
                  Shop
                </NavLink>
              </div>

              {/* Collections Link with Mega Menu */}
              <div
                className="relative py-2"
                onMouseEnter={() => setHoveredMenu('collections')}
              >
                <NavLink
                  to="/collections"
                  className={({ isActive }) =>
                    `text-[11px] uppercase tracking-widest-luxury transition-colors font-semibold whitespace-nowrap ${
                      isActive ? 'text-gold-dark font-bold' : 'text-obsidian hover:text-gold-dark'
                    }`
                  }
                >
                  Collections
                </NavLink>
              </div>

              {/* Gifting */}
              <NavLink
                to="/gifting"
                className={({ isActive }) =>
                  `text-[11px] uppercase tracking-widest-luxury transition-colors font-semibold whitespace-nowrap ${
                    isActive ? 'text-gold-dark font-bold' : 'text-obsidian hover:text-gold-dark'
                  }`
                }
              >
                Gifting
              </NavLink>

              {/* The World */}
              <NavLink
                to="/the-world"
                className={({ isActive }) =>
                  `text-[11px] uppercase tracking-widest-luxury transition-colors font-semibold whitespace-nowrap ${
                    isActive ? 'text-gold-dark font-bold' : 'text-obsidian hover:text-gold-dark'
                  }`
                }
              >
                The World
              </NavLink>

              {/* Community */}
              <NavLink
                to="/community"
                className={({ isActive }) =>
                  `text-[11px] uppercase tracking-widest-luxury transition-colors font-semibold whitespace-nowrap ${
                    isActive ? 'text-gold-dark font-bold' : 'text-obsidian hover:text-gold-dark'
                  }`
                }
              >
                Community
              </NavLink>

              {/* Contact */}
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `text-[11px] uppercase tracking-widest-luxury transition-colors font-semibold whitespace-nowrap ${
                    isActive ? 'text-gold-dark font-bold' : 'text-obsidian hover:text-gold-dark'
                  }`
                }
              >
                Contact
              </NavLink>
            </nav>

          </div>

          {/* ================================================================= */}
          {/* 2. RIGHT SECTION: Compact Utilities & Bag Trigger                 */}
          {/* ================================================================= */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
            
            {/* Search Icon */}
            <Link
              to="/search"
              className="p-1.5 sm:p-2 text-obsidian/80 hover:text-obsidian hover:bg-champagne-100/60 rounded-full transition-all"
              aria-label="Search Catalogue"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-1.5 sm:p-2 text-obsidian/80 hover:text-obsidian hover:bg-champagne-100/60 rounded-full transition-all"
              aria-label={`Private Wishlist (${wishlistCount} items)`}
              title="Private Wishlist"
            >
              <Heart className="w-4 h-4 text-obsidian/80 hover:text-rose-600 transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account Icon */}
            <Link
              to="/account"
              className="relative p-1.5 sm:p-2 text-obsidian/80 hover:text-obsidian hover:bg-champagne-100/60 rounded-full transition-all"
              aria-label="Customer Account Portal"
              title={isAuthenticated ? `Account: ${user?.name}` : 'Sign In / Account'}
            >
              <User className="w-4 h-4" />
              {isAuthenticated && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-pearl-50" />
              )}
            </Link>

            {/* WhatsApp Concierge (Desktop) */}
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
              className="relative flex items-center gap-1.5 bg-obsidian text-pearl-100 px-2.5 sm:px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] uppercase tracking-widest-luxury hover:bg-obsidian-200 transition-all shadow-sm font-bold shrink-0 ml-0.5 sm:ml-1"
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
                    className="group flex flex-col gap-2 p-2.5 rounded-2xl bg-white border border-champagne-300/60 shadow-sm hover:shadow-luxury-soft transition-all"
                  >
                    <div className="aspect-[4/5] rounded-xl overflow-hidden bg-sand">
                      <img
                        src={col.featuredImage}
                        alt={col.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[8px] font-mono uppercase text-gold-dark font-bold">Realm 0{i + 1}</span>
                      <p className="font-serif text-xs font-semibold text-obsidian group-hover:text-gold-dark transition-colors line-clamp-1">
                        {col.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ===================================================================== */}
      {/* MOBILE DRAWER NAVIGATION                                              */}
      {/* ===================================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-obsidian/60 backdrop-blur-sm lg:hidden animate-fade-in">
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-pearl-50 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-r border-champagne-300/60 animate-slide-in">
            <div className="space-y-8 pt-12">
              <div className="flex flex-col border-b border-champagne-300/50 pb-4">
                <span className="font-serif-luxury text-2xl uppercase font-bold text-obsidian">
                  CEL<span className="italic font-light lowercase">estia</span>
                </span>
                <span className="text-[9px] tracking-widest text-obsidian-soft uppercase font-sans">
                  redefined for all.
                </span>
              </div>

              {/* Navigation Items */}
              <div className="space-y-4">
                <NavLink
                  to="/shop"
                  className={({ isActive }) =>
                    `block text-base uppercase tracking-widest font-serif transition-colors ${
                      isActive ? 'text-gold-dark font-bold' : 'text-obsidian hover:text-gold-dark'
                    }`
                  }
                >
                  Shop Pieces
                </NavLink>

                <NavLink
                  to="/collections"
                  className={({ isActive }) =>
                    `block text-base uppercase tracking-widest font-serif transition-colors ${
                      isActive ? 'text-gold-dark font-bold' : 'text-obsidian hover:text-gold-dark'
                    }`
                  }
                >
                  Collections
                </NavLink>

                <NavLink
                  to="/gifting"
                  className={({ isActive }) =>
                    `block text-base uppercase tracking-widest font-serif transition-colors ${
                      isActive ? 'text-gold-dark font-bold' : 'text-obsidian hover:text-gold-dark'
                    }`
                  }
                >
                  Bespoke Gifting
                </NavLink>

                <NavLink
                  to="/the-world"
                  className={({ isActive }) =>
                    `block text-base uppercase tracking-widest font-serif transition-colors ${
                      isActive ? 'text-gold-dark font-bold' : 'text-obsidian hover:text-gold-dark'
                    }`
                  }
                >
                  The World & Atelier
                </NavLink>

                <NavLink
                  to="/community"
                  className={({ isActive }) =>
                    `block text-base uppercase tracking-widest font-serif transition-colors ${
                      isActive ? 'text-gold-dark font-bold' : 'text-obsidian hover:text-gold-dark'
                    }`
                  }
                >
                  Community & Instagram
                </NavLink>

                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `block text-base uppercase tracking-widest font-serif transition-colors ${
                      isActive ? 'text-gold-dark font-bold' : 'text-obsidian hover:text-gold-dark'
                    }`
                  }
                >
                  Contact Us & Map
                </NavLink>
              </div>
            </div>

            {/* Mobile Footer Area */}
            <div className="pt-6 border-t border-champagne-300/60 space-y-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsConciergeOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-full bg-emerald-800 text-pearl-100 text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Atelier Concierge</span>
              </button>

              <div className="text-center text-[10px] text-obsidian/60 font-mono">
                Bandra West Atelier • Mumbai 400050
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Behind Celestia Easter Egg Modal */}
      <BehindCelestiaModal isOpen={isEasterEggOpen} onClose={() => setIsEasterEggOpen(false)} />
    </>
  );
};

export default Navigation;
