import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Sparkles, ArrowRight, Lock, Mail, User, Eye, EyeOff, Phone, AlertCircle, ShieldCheck, X, ShoppingBag } from 'lucide-react';

export const CelestiaEntranceModal: React.FC = () => {
  const {
    login,
    register,
    isAuthenticated,
    isAuthModalOpen,
    authModalMode,
    authPromptReason,
    closeAuthModal,
    setAuthModalMode,
    postAuthCallback,
  } = useAuth();
  
  const { showToast } = useCart();
  const location = useLocation();

  // Timed popup state (triggers after 4-5 seconds if unauthenticated & not dismissed)
  const [isTimedOpen, setIsTimedOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Timed automatic popup: Wait 4.5 seconds after initial site load
  useEffect(() => {
    if (isAuthenticated) {
      setIsTimedOpen(false);
      return;
    }

    // Check if visitor has already dismissed the popup in the current session
    const isDismissed = sessionStorage.getItem('celestia_auth_modal_dismissed') === 'true';
    if (isDismissed) return;

    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        setIsTimedOpen(true);
      }
    }, 4500); // 4.5 seconds

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  // Overall visibility: visible if timed popup is active OR explicit auth action triggered (never on checkout)
  const isCheckoutPage = location.pathname === '/checkout' || location.pathname.startsWith('/order-success');
  const isOpen = (isTimedOpen || isAuthModalOpen) && !isAuthenticated && !isCheckoutPage;

  // Lock body scroll only while modal is visibly active
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Listen to Escape key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleDismiss = () => {
    // Save session flag so user can browse without repeated popups
    sessionStorage.setItem('celestia_auth_modal_dismissed', 'true');
    setIsTimedOpen(false);
    closeAuthModal();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password.");
      showToast("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      setIsTimedOpen(false);
      showToast(`Welcome back, ${email.split('@')[0]} ✨`);
      if (postAuthCallback) {
        postAuthCallback();
      }
    } else {
      setErrorMessage(res.error || "Authentication failed. Please verify your credentials.");
      showToast(res.error || "Login failed");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage("Please fill in all required fields.");
      showToast("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    const res = await register(name, email, phone, password);
    setIsLoading(false);

    if (res.success) {
      setIsTimedOpen(false);
      showToast(`Welcome to the Celestia Circle, ${name}! ✨`);
      if (postAuthCallback) {
        postAuthCallback();
      }
    } else {
      setErrorMessage(res.error || "Registration failed. Please try again.");
      showToast(res.error || "Registration failed");
    }
  };

  // If already authenticated or not open, do not render
  if (!isOpen) return null;

  const mode = authModalMode;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in selection:bg-champagne-300 overflow-hidden">
      
      {/* Click backdrop to dismiss */}
      <div className="absolute inset-0" onClick={handleDismiss} />

      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] bg-[#D8C39A]/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main Luxury Modal Card */}
      <div className="relative z-10 w-full max-w-md max-h-[94vh] overflow-y-auto bg-[#181411] border border-[#D8C39A]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 sm:space-y-5 text-center text-[#FAF7F0] overscroll-contain scrollbar-thin">
        
        {/* Top Right Close (X) Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#251F1B] hover:bg-[#D8C39A] text-[#FAF7F0]/80 hover:text-[#181411] transition-all border border-[#D8C39A]/30 shadow-sm cursor-pointer group"
          title="Close and browse catalogue as guest"
          aria-label="Close Login Modal"
        >
          <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Header & Brand Identity */}
        <div className="space-y-1.5 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#251F1B] border border-[#D8C39A]/40 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#D8C39A]">
            <Sparkles className="w-3 h-3 text-[#D8C39A]" />
            <span>Celestia Atelier Circle</span>
          </div>

          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#FAF7F0] tracking-tight leading-none pt-1">
            CEL<span className="italic font-light lowercase text-[#D8C39A]">estia</span>
          </h2>

          <p className="text-[9px] sm:text-[10px] font-sans tracking-[0.3em] uppercase text-[#D8C39A] font-bold">
            redefined for all.
          </p>

          {/* Dynamic Reason Message (e.g. When proceeding to checkout / shopping) */}
          {authPromptReason ? (
            <div className="mt-2 p-2.5 rounded-xl bg-[#D8C39A]/15 border border-[#D8C39A]/40 flex items-center gap-2 text-left text-xs text-[#D8C39A]">
              <ShoppingBag className="w-4 h-4 shrink-0 text-[#D8C39A]" />
              <p className="font-medium">{authPromptReason}</p>
            </div>
          ) : (
            <p className="text-xs text-[#FAF7F0]/75 font-sans max-w-xs mx-auto leading-relaxed pt-1">
              {mode === 'login'
                ? 'Sign in to access your private member bag, exclusive suites, and order dispatches.'
                : 'Join the circle to save your bespoke hampers, polaroid keepsakes, and order tracking.'}
            </p>
          )}
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-2.5 bg-red-950/80 border border-red-500/50 rounded-xl flex items-start gap-2 text-left text-xs text-red-200 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-sans">{errorMessage}</p>
          </div>
        )}

        {/* Mode Switcher Tabs */}
        <div className="flex rounded-full bg-[#251F1B] p-1 border border-[#D8C39A]/30 max-w-xs mx-auto">
          <button
            onClick={() => {
              setAuthModalMode('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 text-xs uppercase font-mono tracking-wider font-bold rounded-full transition-all cursor-pointer ${
              mode === 'login' ? 'bg-[#D8C39A] text-[#181411] shadow-md' : 'text-[#FAF7F0]/70 hover:text-[#FAF7F0]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setAuthModalMode('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 text-xs uppercase font-mono tracking-wider font-bold rounded-full transition-all cursor-pointer ${
              mode === 'register' ? 'bg-[#D8C39A] text-[#181411] shadow-md' : 'text-[#FAF7F0]/70 hover:text-[#FAF7F0]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Login Form */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3 text-left">
            <div className="space-y-1">
              <label className="text-[10px] sm:text-[11px] uppercase font-mono tracking-wider text-[#FAF7F0]/70 font-bold block">
                Email Address *
              </label>
              <div className="flex items-center gap-2 px-3.5 h-11 bg-[#251F1B] rounded-xl border border-[#D8C39A]/30 focus-within:border-[#D8C39A]">
                <Mail className="w-4 h-4 text-[#D8C39A] shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="w-full bg-transparent text-sm font-sans text-[#FAF7F0] focus:outline-none placeholder:text-[#FAF7F0]/40"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] sm:text-[11px] uppercase font-mono tracking-wider text-[#FAF7F0]/70 font-bold block">
                Password *
              </label>
              <div className="flex items-center gap-2 px-3.5 h-11 bg-[#251F1B] rounded-xl border border-[#D8C39A]/30 focus-within:border-[#D8C39A]">
                <Lock className="w-4 h-4 text-[#D8C39A] shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="w-full bg-transparent text-sm font-sans text-[#FAF7F0] focus:outline-none placeholder:text-[#FAF7F0]/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-[#FAF7F0]/50 hover:text-[#FAF7F0] shrink-0"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#D8C39A] hover:bg-[#E5D4B2] text-[#181411] rounded-full text-xs uppercase font-mono tracking-widest font-bold transition-all flex items-center justify-center gap-2 shadow-lg mt-2 cursor-pointer"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-left">
            <div className="space-y-1">
              <label className="text-[10px] sm:text-[11px] uppercase font-mono tracking-wider text-[#FAF7F0]/70 font-bold block">
                Full Name *
              </label>
              <div className="flex items-center gap-2 px-3.5 h-11 bg-[#251F1B] rounded-xl border border-[#D8C39A]/30 focus-within:border-[#D8C39A]">
                <User className="w-4 h-4 text-[#D8C39A] shrink-0" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Sharma"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="w-full bg-transparent text-sm font-sans text-[#FAF7F0] focus:outline-none placeholder:text-[#FAF7F0]/40"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] sm:text-[11px] uppercase font-mono tracking-wider text-[#FAF7F0]/70 font-bold block">
                Email Address *
              </label>
              <div className="flex items-center gap-2 px-3.5 h-11 bg-[#251F1B] rounded-xl border border-[#D8C39A]/30 focus-within:border-[#D8C39A]">
                <Mail className="w-4 h-4 text-[#D8C39A] shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="w-full bg-transparent text-sm font-sans text-[#FAF7F0] focus:outline-none placeholder:text-[#FAF7F0]/40"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] sm:text-[11px] uppercase font-mono tracking-wider text-[#FAF7F0]/70 font-bold block">
                Phone Number
              </label>
              <div className="flex items-center gap-2 px-3.5 h-11 bg-[#251F1B] rounded-xl border border-[#D8C39A]/30 focus-within:border-[#D8C39A]">
                <Phone className="w-4 h-4 text-[#D8C39A] shrink-0" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent text-sm font-sans text-[#FAF7F0] focus:outline-none placeholder:text-[#FAF7F0]/40"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] sm:text-[11px] uppercase font-mono tracking-wider text-[#FAF7F0]/70 font-bold block">
                Create Password *
              </label>
              <div className="flex items-center gap-2 px-3.5 h-11 bg-[#251F1B] rounded-xl border border-[#D8C39A]/30 focus-within:border-[#D8C39A]">
                <Lock className="w-4 h-4 text-[#D8C39A] shrink-0" />
                <input
                  type="password"
                  required
                  placeholder="Minimum 4 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="w-full bg-transparent text-sm font-sans text-[#FAF7F0] focus:outline-none placeholder:text-[#FAF7F0]/40"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#D8C39A] hover:bg-[#E5D4B2] text-[#181411] rounded-full text-xs uppercase font-mono tracking-widest font-bold transition-all flex items-center justify-center gap-2 shadow-lg mt-2 cursor-pointer"
            >
              {isLoading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Dismiss / Browse as Guest Action */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleDismiss}
            className="text-xs text-[#D8C39A]/80 hover:text-[#D8C39A] hover:underline uppercase font-mono tracking-wider transition-colors cursor-pointer"
          >
            Or browse catalogue as guest →
          </button>
        </div>

        {/* Security Trust Assurance */}
        <div className="pt-2 border-t border-[#D8C39A]/20 flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#D8C39A]/70 uppercase tracking-widest">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D8C39A]" />
          <span>Encrypted Atelier Member Vault</span>
        </div>

      </div>
    </div>
  );
};

export default CelestiaEntranceModal;
