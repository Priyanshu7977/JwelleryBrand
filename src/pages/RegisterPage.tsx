import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Phone, ArrowRight, Check } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useCart();
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      showToast("Please fill all required fields.");
      return;
    }
    if (!agreeTerms) {
      showToast("Please accept the terms and conditions.");
      return;
    }
    setIsLoading(true);
    const res = await register(formData.name, formData.email, formData.phone, formData.password);
    setIsLoading(false);
    if (res.success) {
      showToast("Account created! Please sign in with your password ✨");
      navigate('/login', { state: { email: formData.email } });
    } else {
      showToast(res.error || "Registration failed.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-24 sm:pt-32 pb-20 sm:pb-32 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-pearl-50/95 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-champagne-300/60 shadow-luxury-soft space-y-6 sm:space-y-8">
        
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-monumental text-gold-dark font-semibold">
            Private Circle
          </span>
          <h1 className="font-serif-luxury text-3xl md:text-4xl text-obsidian uppercase">
            CREATE <span className="italic font-light text-gold-dark">Account</span>.
          </h1>
          <p className="text-xs text-obsidian/60 font-sans max-w-xs mx-auto">
            Join the Celestia family for exclusive drops, order tracking, and custom hamper archiving.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-obsidian/70 font-semibold block">
              Full Name *
            </label>
            <div className="flex items-center gap-2 px-3.5 sm:px-4 h-11 sm:h-12 bg-white rounded-xl border border-champagne-300/70 focus-within:border-gold-dark">
              <User className="w-4 h-4 text-obsidian/40 shrink-0" />
              <input
                type="text"
                required
                placeholder="Aanya Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-transparent text-sm font-sans text-obsidian focus:outline-none placeholder:text-obsidian/40"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-obsidian/70 font-semibold block">
              Email Address *
            </label>
            <div className="flex items-center gap-2 px-3.5 sm:px-4 h-11 sm:h-12 bg-white rounded-xl border border-champagne-300/70 focus-within:border-gold-dark">
              <Mail className="w-4 h-4 text-obsidian/40 shrink-0" />
              <input
                type="email"
                required
                placeholder="you@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-transparent text-sm font-sans text-obsidian focus:outline-none placeholder:text-obsidian/40"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-obsidian/70 font-semibold block">
              Phone / WhatsApp Number
            </label>
            <div className="flex items-center gap-2 px-3.5 sm:px-4 h-11 sm:h-12 bg-white rounded-xl border border-champagne-300/70 focus-within:border-gold-dark">
              <Phone className="w-4 h-4 text-obsidian/40 shrink-0" />
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-transparent text-sm font-sans text-obsidian focus:outline-none placeholder:text-obsidian/40"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-obsidian/70 font-semibold block">
              Create Password *
            </label>
            <div className="flex items-center gap-2 px-3.5 sm:px-4 h-11 sm:h-12 bg-white rounded-xl border border-champagne-300/70 focus-within:border-gold-dark">
              <Lock className="w-4 h-4 text-obsidian/40 shrink-0" />
              <input
                type="password"
                required
                placeholder="Minimum 4 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-transparent text-sm font-sans text-obsidian focus:outline-none placeholder:text-obsidian/40"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-obsidian/70 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="rounded accent-gold"
            />
            <label htmlFor="terms">
              I agree to the <Link to="/terms" className="underline hover:text-gold-dark">Terms</Link> and <Link to="/privacy" className="underline hover:text-gold-dark">Privacy Policy</Link>
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 sm:h-12 px-6 rounded-full bg-obsidian text-pearl-100 text-xs uppercase tracking-widest font-semibold hover:bg-obsidian-200 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? <span>Creating Account...</span> : <span>Create Account</span>}
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-obsidian/70 pt-2 border-t border-champagne-300/30">
          <span>Already have an account? </span>
          <Link to="/login" className="font-semibold text-obsidian underline hover:text-gold-dark">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};
