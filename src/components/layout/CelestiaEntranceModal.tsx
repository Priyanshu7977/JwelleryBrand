import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Sparkles, ArrowRight, Lock, Mail, User, Eye, EyeOff, Film, Phone, AlertCircle, ShieldCheck } from 'lucide-react';

export const CelestiaEntranceModal: React.FC = () => {
  const { login, register, isAuthenticated } = useAuth();
  const { showToast } = useCart();
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  // Modal open state: On subroutes, immediately open if unauthenticated; on homepage, open when film finishes
  const [isOpen, setIsOpen] = useState(() => !isHomePage && !isAuthenticated);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If unauthenticated on any page other than homepage, lock immediately
  useEffect(() => {
    if (!isAuthenticated) {
      if (!isHomePage) {
        setIsOpen(true);
      }
    } else {
      setIsOpen(false);
    }
  }, [location.pathname, isAuthenticated, isHomePage]);

  // On homepage, listen for when video ends or when user scrolls past film
  useEffect(() => {
    if (isAuthenticated) {
      setIsOpen(false);
      return;
    }

    const handleVideoEnded = () => {
      if (!isAuthenticated) {
        setIsOpen(true);
      }
    };

    window.addEventListener('celestia:video-ended', handleVideoEnded);
    return () => window.removeEventListener('celestia:video-ended', handleVideoEnded);
  }, [isAuthenticated]);

  // Lock background body scroll completely while modal is open
  useEffect(() => {
    if (isOpen && !isAuthenticated) {
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalWidth = document.body.style.width;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.position = 'relative';
      document.body.style.touchAction = 'none';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.documentElement.style.overflow = '';
        document.body.style.position = originalPosition;
        document.body.style.width = originalWidth;
        document.body.style.touchAction = '';
      };
    }
  }, [isOpen, isAuthenticated]);

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
      setIsOpen(false);
      showToast(`Welcome to Celestia, ${email.split('@')[0]} ✨`);
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
      // register automatically logs the user in
      setIsOpen(false);
      showToast(`Welcome to the Celestia Family, ${name}! ✨`);
    } else {
      setErrorMessage(res.error || "Registration failed. Please try again.");
      showToast(res.error || "Registration failed");
    }
  };

  // If already authenticated, do not render modal
  if (isAuthenticated || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl animate-fade-in selection:bg-champagne-300 overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[750px] h-[600px] sm:h-[750px] bg-[#D8C39A]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-noise opacity-25" />
      </div>

      {/* Main Glass Card (Mandatory Authentication Gate - No Close / No Guest bypass) */}
      <div className="relative z-10 w-full max-w-lg max-h-[94vh] overflow-y-auto bg-[#16120F]/98 border border-[#D8C39A]/40 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl space-y-5 sm:space-y-6 text-center text-[#FAF7F0] overscroll-contain scrollbar-thin">
        
        {/* Header */}
        <div className="space-y-2 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#251F1B] border border-[#D8C39A]/40 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#D8C39A]">
            <Lock className="w-3 h-3 text-[#D8C39A]" />
            <span>Private Atelier Access • Member Gate</span>
          </div>

          <h1 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl text-[#FAF7F0] tracking-tight uppercase leading-none pt-1">
            CEL<span className="font-light lowercase text-[#D8C39A]">estia</span>
          </h1>

          <p className="text-[10px] sm:text-xs font-sans tracking-[0.34em] uppercase text-[#D8C39A] font-bold">
            redefined for all.
          </p>

          <p className="text-xs sm:text-sm text-[#FAF7F0]/75 font-sans max-w-xs sm:max-w-sm mx-auto leading-relaxed pt-1">
            {mode === 'login'
              ? 'Please sign in with your credentials to access the Celestia universe, custom hampers, and private runway.'
              : 'Create your private account to unlock exclusive collections, personalized polaroids, and member privileges.'}
          </p>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-2xl flex items-start gap-2.5 text-left text-xs text-red-200 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-sans">{errorMessage}</p>
          </div>
        )}

        {/* Mode Switcher Tabs */}
        <div className="flex rounded-full bg-[#251F1B] p-1 border border-[#D8C39A]/30 max-w-xs mx-auto">
          <button
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs uppercase font-mono tracking-wider font-bold rounded-full transition-all ${
              mode === 'login' ? 'bg-[#D8C39A] text-[#181411] shadow-md' : 'text-[#FAF7F0]/70 hover:text-[#FAF7F0]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs uppercase font-mono tracking-wider font-bold rounded-full transition-all ${
              mode === 'register' ? 'bg-[#D8C39A] text-[#181411] shadow-md' : 'text-[#FAF7F0]/70 hover:text-[#FAF7F0]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Login Form */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 sm:space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[10px] sm:text-[11px] uppercase font-mono tracking-wider text-[#FAF7F0]/70 font-bold block">
                Email Address *
              </label>
              <div className="flex items-center gap-2 px-3.5 sm:px-4 h-11 sm:h-12 bg-[#251F1B] rounded-xl border border-[#D8C39A]/30 focus-within:border-[#D8C39A]">
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
              <div className="flex items-center gap-2 px-3.5 sm:px-4 h-11 sm:h-12 bg-[#251F1B] rounded-xl border border-[#D8C39A]/30 focus-within:border-[#D8C39A]">
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
              className="w-full h-11 sm:h-12 bg-[#D8C39A] hover:bg-[#E5D4B2] text-[#181411] rounded-full text-xs uppercase font-mono tracking-widest font-bold transition-all flex items-center justify-center gap-2 shadow-lg mt-3 cursor-pointer"
            >
              {isLoading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Sign In & Enter Celestia</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 sm:space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[10px] sm:text-[11px] uppercase font-mono tracking-wider text-[#FAF7F0]/70 font-bold block">
                Full Name *
              </label>
              <div className="flex items-center gap-2 px-3.5 sm:px-4 h-11 sm:h-12 bg-[#251F1B] rounded-xl border border-[#D8C39A]/30 focus-within:border-[#D8C39A]">
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
              <div className="flex items-center gap-2 px-3.5 sm:px-4 h-11 sm:h-12 bg-[#251F1B] rounded-xl border border-[#D8C39A]/30 focus-within:border-[#D8C39A]">
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
                Phone / WhatsApp Number
              </label>
              <div className="flex items-center gap-2 px-3.5 sm:px-4 h-11 sm:h-12 bg-[#251F1B] rounded-xl border border-[#D8C39A]/30 focus-within:border-[#D8C39A]">
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
              <div className="flex items-center gap-2 px-3.5 sm:px-4 h-11 sm:h-12 bg-[#251F1B] rounded-xl border border-[#D8C39A]/30 focus-within:border-[#D8C39A]">
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
              className="w-full h-11 sm:h-12 bg-[#D8C39A] hover:bg-[#E5D4B2] text-[#181411] rounded-full text-xs uppercase font-mono tracking-widest font-bold transition-all flex items-center justify-center gap-2 shadow-lg mt-3 cursor-pointer"
            >
              {isLoading ? (
                <span>Creating Account & Unlocking...</span>
              ) : (
                <>
                  <span>Create Account & Enter Celestia</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Security & Authenticity Trust Assurance */}
        <div className="pt-2 border-t border-[#D8C39A]/20 flex items-center justify-center gap-2 text-[10px] font-mono text-[#D8C39A]/80 uppercase tracking-widest">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D8C39A]" />
          <span>Encrypted Atelier Member Vault</span>
        </div>

      </div>
    </div>
  );
};
