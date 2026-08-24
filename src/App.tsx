import React, { useEffect } from 'react';
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
import { CustomCursor } from './components/ui/CustomCursor';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { CinematicAtelierOpening } from './components/ui/CinematicAtelierOpening';
import { RouteTransition } from './components/layout/RouteTransition';
import { FlyToCartAnimation } from './components/ui/FlyToCartAnimation';
import { CheckCircle2 } from 'lucide-react';
import Lenis from 'lenis';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { CollectionDetailPage } from './pages/CollectionDetailPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { GiftingPage } from './pages/GiftingPage';
import { TheWorldPage } from './pages/TheWorldPage';
import { CommunityPage } from './pages/CommunityPage';
import { ContactPage } from './pages/ContactPage';
import { SearchPage } from './pages/SearchPage';
import { CartPage } from './pages/CartPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { AccountPage } from './pages/AccountPage';
import { WishlistPage } from './pages/WishlistPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { ShippingReturnsPage } from './pages/ShippingReturnsPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';

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
    // Initialize fast, responsive Lenis momentum scrolling
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.4,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      {/* Cinematic Route Transition Curtain */}
      <RouteTransition />

      {/* Product-to-Bag Golden Particle Fly Animation */}
      <FlyToCartAnimation />

      <div className="relative min-h-screen bg-pearl-100 text-obsidian selection:bg-champagne-300 selection:text-obsidian flex flex-col justify-between">
        {/* Luxury Custom Cursor (Desktop) */}
        <CustomCursor />

        {/* Global Floating Navigation */}
        <Navigation />

        {/* Multi-Page Routes */}
        <main className="w-full flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/collections/:handle" element={<CollectionDetailPage />} />
            <Route path="/product/:handle" element={<ProductDetailPage />} />
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
            <Route path="/account/preferences" element={<AccountPage />} />
            <Route path="/account/orders" element={<OrdersPage />} />
            <Route path="/account/orders/:orderId" element={<OrderDetailPage />} />
            <Route path="/order-tracking" element={<OrderTrackingPage />} />
            <Route path="/order-tracking/:trackingId" element={<OrderTrackingPage />} />
            <Route path="/shipping-returns" element={<ShippingReturnsPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/privacy-policy" element={<PrivacyPage />} />
          </Routes>
        </main>

        {/* Architectural Atelier Footer */}
        <Footer />

        {/* Global Drawers, Modals & Toast */}
        <CelestiaEntranceModal />
        <CartDrawer />
        <QuickViewModal />
        <SearchModal />
        <ConciergeModal />
        <ToastNotification />
      </div>
    </Router>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <AppShell />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
