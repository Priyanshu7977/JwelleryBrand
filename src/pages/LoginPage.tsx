import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck, Gem } from 'lucide-react';
import { sanitizeEmail, sanitizePassword } from '../utils/sanitize';
import { SEOHead } from '../components/seo/SEOHead';

export const LoginPage: React.FC = () => {
  const location = useLocation();
  const [email, setEmail] = useState<string>(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useCart();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please enter both email and password.");
      return;
    }
    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);
    if (res.success) {
      showToast("Welcome back to Celestia Atelier ✨");
      navigate('/account');
    } else {
      showToast(res.error || "Login failed.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-24 sm:pt-32 pb-20 sm:pb-32 px-4 sm:px-6 flex items-center justify-center">
      <SEOHead
        title="Sign In | CELESTIA Luxury Atelier"
        description="Sign in to your Celestia account to manage orders, track parcels, and view your saved items."
        canonical="https://jwellery-brand.vercel.app/login"
        noIndex={true}
      />
      <div className="w-full max-w-md bg-pearl-50/95 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-champagne-300/60 shadow-luxury-soft space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-monumental text-gold-dark font-semibold">
            Atelier Portal
          </span>
          <h1 className="site-main-title text-obsidian">
            Sign <span className="font-semibold text-gold-dark">in</span>
          </h1>
          <p className="text-xs text-obsidian/60 font-sans max-w-xs mx-auto">
            Access your order tracking, custom polaroid history, and saved address.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-obsidian/70 font-semibold block">
              Email Address
            </label>
            <div className="flex items-center gap-2 px-3.5 sm:px-4 h-11 sm:h-12 bg-white rounded-xl border border-champagne-300/70 focus-within:border-gold-dark">
              <Mail className="w-4 h-4 text-obsidian/40 shrink-0" />
              <input
                type="email"
                required
                placeholder="you@email.com"
                value={email}
                onBeforeInput={(e: any) => {
                  if (e.data && /[<>]/.test(e.data)) {
                    e.preventDefault();
                    showToast("HTML, script and iframe tags are not permitted.");
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === '<' || e.key === '>') {
                    e.preventDefault();
                    showToast("HTML, script and iframe tags are not permitted.");
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const paste = e.clipboardData.getData('text');
                  const clean = sanitizeEmail(paste);
                  if (paste.includes('<') || paste.toLowerCase().includes('script') || paste.toLowerCase().includes('iframe')) {
                    showToast("HTML, script and iframe tags are not permitted.");
                  }
                  setEmail(sanitizeEmail(email + clean));
                }}
                onChange={(e) => setEmail(sanitizeEmail(e.target.value))}
                className="w-full bg-transparent text-sm font-sans text-obsidian focus:outline-none placeholder:text-obsidian/40"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] uppercase tracking-wider text-obsidian/70 font-semibold block">
                Password
              </label>
              <Link to="/forgot-password" className="text-[11px] text-gold-dark hover:underline font-sans">
                Forgot?
              </Link>
            </div>
            <div className="flex items-center gap-2 px-3.5 sm:px-4 h-11 sm:h-12 bg-white rounded-xl border border-champagne-300/70 focus-within:border-gold-dark">
              <Lock className="w-4 h-4 text-obsidian/40 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onBeforeInput={(e: any) => {
                  if (e.data && /[<>]/.test(e.data)) {
                    e.preventDefault();
                    showToast("HTML, script and iframe tags are not permitted.");
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === '<' || e.key === '>') {
                    e.preventDefault();
                    showToast("HTML, script and iframe tags are not permitted.");
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const paste = e.clipboardData.getData('text');
                  const clean = sanitizePassword(paste);
                  if (paste.includes('<') || paste.toLowerCase().includes('script') || paste.toLowerCase().includes('iframe')) {
                    showToast("HTML, script and iframe tags are not permitted.");
                  }
                  setPassword(sanitizePassword(password + clean));
                }}
                onChange={(e) => setPassword(sanitizePassword(e.target.value))}
                className="w-full bg-transparent text-sm font-sans text-obsidian focus:outline-none placeholder:text-obsidian/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-obsidian/40 hover:text-obsidian p-1 shrink-0"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 sm:h-12 px-6 rounded-full bg-obsidian text-pearl-100 text-xs uppercase tracking-widest font-semibold hover:bg-obsidian-200 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-obsidian/70 pt-2 border-t border-champagne-300/30">
          <span>New to Celestia? </span>
          <Link to="/register" className="font-semibold text-obsidian underline hover:text-gold-dark">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
};
