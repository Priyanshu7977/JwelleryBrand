import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Sparkles, ArrowRight, Lock, Mail, User, Eye, EyeOff, X, Film } from 'lucide-react';

export const CelestiaEntranceModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, register, isAuthenticated } = useAuth();
  const { showToast } = useCart();

  useEffect(() => {
    // Listen for when video ends
    const handleVideoEnded = () => {
      const hasDismissed = sessionStorage.getItem('celestia_post_video_login_shown');
      if (!hasDismissed && !isAuthenticated) {
        setIsOpen(true);
      }
    };

    window.addEventListener('celestia:video-ended', handleVideoEnded);
    return () => window.removeEventListener('celestia:video-ended', handleVideoEnded);
  }, [isAuthenticated]);

  const handleCloseAndExplore = () => {
    sessionStorage.setItem('celestia_post_video_login_shown', 'true');
    setIsOpen(false);
    showToast("Welcome to Celestia Atelier ✨");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please enter your email and password.");
      return;
    }
    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);
    if (res.success) {
      sessionStorage.setItem('celestia_post_video_login_shown', 'true');
      setIsOpen(false);
      showToast(`Welcome back, ${email.split('@')[0]} ✨`);
    } else {
      showToast(res.error || "Login failed");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast("Please fill in required fields.");
      return;
    }
    setIsLoading(true);
    const res = await register(name, email, phone, password);
    setIsLoading(false);
    if (res.success) {
      sessionStorage.setItem('celestia_post_video_login_shown', 'true');
      setIsOpen(false);
      showToast(`Welcome to Celestia Circle, ${name} ✨`);
    } else {
      showToast(res.error || "Registration failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in selection:bg-champagne-300">
      
      {/* Ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#D8C39A]/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-noise opacity-20" />
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-lg bg-[#181411]/95 border border-[#D8C39A]/40 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8 text-center text-[#FAF7F0]">
        
        {/* Close / Skip button */}
        <button
          onClick={handleCloseAndExplore}
          className="absolute top-5 right-5 p-2 text-[#FAF7F0]/60 hover:text-[#FAF7F0] hover:bg-[#28231F] rounded-full transition-colors"
          title="Continue to Homepage"
          aria-label="Close and continue"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#28231F] border border-[#D8C39A]/40 text-xs font-mono uppercase tracking-widest text-[#D8C39A]">
            <Film className="w-3.5 h-3.5 text-[#D8C39A]" />
            <span>Film Complete • Atelier Unveiled</span>
          </div>

          <h1 className="font-serif-luxury text-5xl sm:text-6xl text-[#FAF7F0] tracking-tight uppercase leading-none">
            CEL<span className="italic font-light lowercase text-[#D8C39A]">estia</span>
          </h1>

          <p className="text-xs font-sans tracking-[0.34em] uppercase text-[#D8C39A] font-bold">
            redefined for all.
          </p>

          <p className="text-xs sm:text-sm text-[#FAF7F0]/70 font-sans max-w-sm mx-auto">
            {mode === 'login'
              ? 'Sign in to access your private vault, custom polaroid archives, and express checkout.'
              : 'Create an account for early collection drops, member privileges, and order tracking.'}
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex rounded-full bg-[#28231F] p-1 border border-[#D8C39A]/30 max-w-xs mx-auto">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs uppercase font-mono tracking-wider font-bold rounded-full transition-all ${
              mode === 'login' ? 'bg-[#D8C39A] text-[#181411] shadow-md' : 'text-[#FAF7F0]/70 hover:text-[#FAF7F0]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-xs uppercase font-mono tracking-wider font-bold rounded-full transition-all ${
              mode === 'register' ? 'bg-[#D8C39A] text-[#181411] shadow-md' : 'text-[#FAF7F0]/70 hover:text-[#FAF7F0]'
            }`}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase font-mono tracking-wider text-[#FAF7F0]/70 font-bold block">
                Email Address
              </label>
              <div className="flex items-center gap-2 px-4 h-12 bg-[#28231F] rounded-xl border border-[#D8C39A]/30 focus-within:border-[#D8C39A]">
                <Mail className="w-4 h-4 text-[#D8C39A]" />
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-sans text-[#FAF7F0] focus:outline-none placeholder:text-[#FAF7F0]/40"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase font-mono tracking-wider text-[#FAF7F0]/70 font-bold block">
                Password
              </label>
              <div className="flex items-center gap-2 px-4 h-12 bg-[#28231F] rounded-xl border border-[#D8C39A]/30 focus-within:border-[#D8C39A]">
                <Lock className="w-4 h-4 text-[#D8C39A]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-sans text-[#FAF7F0] focus:outline-none placeholder:text-[#FAF7F0]/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#FAF7F0]/50 hover:text-[#FAF7F0]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#D8C39A] text-[#181411] rounded-full text-xs uppercase font-mono tracking-widest font-bold hover:bg-[#E5D4B2] transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In & Enter Homepage'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase font-mono tracking-wider text-[#FAF7F0]/70 font-bold block">
                Full Name
              </label>
              <div className="flex items-center gap-2 px-4 h-12 bg-[#28231F] rounded-xl border border-[#D8C39A]/30 focus-within:border-[#D8C39A]">
                <User className="w-4 h-4 text-[#D8C39A]" />
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-sans text-[#FAF7F0] focus:outline-none placeholder:text-[#FAF7F0]/40"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase font-mono tracking-wider text-[#FAF7F0]/70 font-bold block">
                Email Address
              </label>
              <div className="flex items-center gap-2 px-4 h-12 bg-[#28231F] rounded-xl border border-[#D8C39A]/30 focus-within:border-[#D8C39A]">
                <Mail className="w-4 h-4 text-[#D8C39A]" />
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-sans text-[#FAF7F0] focus:outline-none placeholder:text-[#FAF7F0]/40"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase font-mono tracking-wider text-[#FAF7F0]/70 font-bold block">
                Password
              </label>
              <div className="flex items-center gap-2 px-4 h-12 bg-[#28231F] rounded-xl border border-[#D8C39A]/30 focus-within:border-[#D8C39A]">
                <Lock className="w-4 h-4 text-[#D8C39A]" />
                <input
                  type="password"
                  required
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-sans text-[#FAF7F0] focus:outline-none placeholder:text-[#FAF7F0]/40"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#D8C39A] text-[#181411] rounded-full text-xs uppercase font-mono tracking-widest font-bold hover:bg-[#E5D4B2] transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <span>{isLoading ? 'Creating Account...' : 'Create Account & Enter'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Continue to Homepage as Guest */}
        <div className="pt-2 border-t border-[#D8C39A]/20">
          <button
            onClick={handleCloseAndExplore}
            className="text-xs uppercase font-mono tracking-widest text-[#FAF7F0]/80 hover:text-[#D8C39A] transition-colors underline font-bold"
          >
            Or Continue to Explore Homepage as Guest →
          </button>
        </div>

      </div>
    </div>
  );
};
