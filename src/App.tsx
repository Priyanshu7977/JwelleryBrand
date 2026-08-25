import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Navigation } from './components/layout/Navigation';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/layout/CartDrawer';
import { QuickViewModal } from './components/layout/QuickViewModal';
import { SearchModal } from './components/layout/SearchModal';
import { ConciergeModal } from './components/layout/ConciergeModal';
import { CelestiaEntranceModal } from './components/layout/CelestiaEntranceModal';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { CinematicAtelierOpening } from './components/ui/CinematicAtelierOpening';
import { RouteTransition } from './components/layout/RouteTransition';
import { FlyToCartAnimation } from './components/ui/FlyToCartAnimation';
import { DynamicTabTitle } from './components/ui/DynamicTabTitle';
import { LiveShopperActivityToast } from './components/ui/LiveShopperActivityToast';
import { CheckCircle2 } from 'lucide-react';
import Lenis from 'lenis';

// Eager HomePage for immediate first paint
import { HomePage } from './pages/HomePage';

// Lazy-loaded routes for ultra-fast initial bundle & mobile loading
const ShopPage = lazy(() => import('./pages/ShopPage').then(m => ({ default: m.ShopPage })));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage').then(m => ({ default: m.CollectionsPage })));
const CollectionDetailPage = lazy(() => import('./pages/CollectionDetailPage').then(m => ({ default: m.CollectionDetailPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const GiftingPage = lazy(() => import('./pages/GiftingPage').then(m => ({ default: m.GiftingPage })));
const TheWorldPage = lazy(() => import('./pages/TheWorldPage').then(m => ({ default: m.TheWorldPage })));
const CommunityPage = lazy(() => import('./pages/CommunityPage').then(m => ({ default: m.CommunityPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const SearchPage = lazy(() => import('./pages/SearchPage').then(m => ({ default: m.SearchPage })));
const CartPage = lazy(() => import('./pages/CartPage').then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage').then(m => ({ default: m.OrderSuccessPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const WishlistPage = lazy(() => import('./pages/WishlistPage').then(m => ({ default: m.WishlistPage })));
const AccountPage = lazy(() => import('./pages/AccountPage').then(m => ({ default: m.AccountPage })));
const OrdersPage = lazy(() => import('./pages/OrdersPage').then(m => ({ default: m.OrdersPage })));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage').then(m => ({ default: m.OrderDetailPage })));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage').then(m => ({ default: m.OrderTrackingPage })));
const BlogPage = lazy(() => import('./pages/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogPostDetailPage = lazy(() => import('./pages/BlogPostDetailPage').then(m => ({ default: m.BlogPostDetailPage })));
const ShippingReturnsPage = lazy(() => import('./pages/ShippingReturnsPage').then(m => ({ default: m.ShippingReturnsPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));

const PageFallback: React.FC = () => (
  <div className="w-full min-h-[60vh] flex items-center justify-center bg-pearl-100">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-gold-dark border-t-transparent animate-spin" />
      <span className="text-[11px] uppercase font-mono tracking-widest text-gold-dark font-semibold">
        Loading Atelier...
      </span>
    </div>
  </div>
);

const ToastNotification: React.FC = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[150] flex items-center gap-3 px-5 py-3.5 bg-obsidian text-pearl-100 rounded-2xl shadow-2xl border border-champagne-400/40 backdrop-blur-md animate-bounce-short">
      <CheckCircle2 className="w-4 h-4 text-champagne-300 shrink-0" />
      <span className="text-xs font-sans tracking-wide font-medium">{toastMessage}</span>
    </div>
  );
};

const AppShell: React.FC = () => {
  useEffect(() => {
    // Lenis Smooth Scrolling Engine (Optimized for smooth 60fps)
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      {/* Route Transition Page Wipe */}
      <RouteTransition />

      {/* Product-to-Bag Golden Particle Fly Animation */}
      <FlyToCartAnimation />

      <div className="relative min-h-screen bg-pearl-100 text-obsidian selection:bg-champagne-300 selection:text-obsidian flex flex-col justify-between">
        {/* One-Shot Atelier Opening Doors Overlay (Isolated ceremony - unmounts after 3.6s) */}
        <CinematicAtelierOpening />

        {/* Global Floating Navigation */}
        <Navigation />

        {/* Multi-Page Routes */}
        <main className="w-full flex-1">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/collections/:handle" element={<CollectionDetailPage />} />
              <Route path="/product/:handle" element={<ProductDetailPage />} />
              <Route path="/products/:handle" element={<ProductDetailPage />} />
              <Route path="/gifting" element={<GiftingPage />} />
              <Route path="/the-world" element={<TheWorldPage />} />
              <Route path="/about" element={<TheWorldPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/signup" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ForgotPasswordPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/account/profile" element={<AccountPage />} />
              <Route path="/account/addresses" element={<AccountPage />} />
              <Route path="/account/wishlist" element={<WishlistPage />} />
              <Route path="/account/orders" element={<OrdersPage />} />
              <Route path="/account/orders/:orderId" element={<OrderDetailPage />} />
              <Route path="/order/:orderId" element={<OrderDetailPage />} />
              <Route path="/orders/:orderId" element={<OrderDetailPage />} />
              <Route path="/tracking" element={<OrderTrackingPage />} />
              <Route path="/tracking/:trackingId" element={<OrderTrackingPage />} />
              <Route path="/track" element={<OrderTrackingPage />} />
              <Route path="/order-tracking" element={<OrderTrackingPage />} />
              <Route path="/order-tracking/:trackingId" element={<OrderTrackingPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blogs" element={<BlogPage />} />
              <Route path="/blogs/news" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostDetailPage />} />
              <Route path="/blogs/:slug" element={<BlogPostDetailPage />} />
              <Route path="/shipping-returns" element={<ShippingReturnsPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/privacy-policy" element={<PrivacyPage />} />
              <Route path="*" element={<ShopPage />} />
            </Routes>
          </Suspense>
        </main>

        {/* Global Drawers & Modals */}
        <CartDrawer />
        <QuickViewModal />
        <SearchModal />
        <ConciergeModal />
        <CelestiaEntranceModal />
        <ToastNotification />

        {/* Bonkers-Style Signature Interactive Animations & Delights */}
        <DynamicTabTitle />
        <LiveShopperActivityToast />

        {/* Global Progressive Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppShell />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
