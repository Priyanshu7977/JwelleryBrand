import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Mail, ArrowLeft, Send, Check } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const { showToast } = useCart();

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast("Please enter your registered email address.");
      return;
    }
    setIsSent(true);
    showToast("Password reset magic link dispatched to your inbox ✨");
  };

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-36 sm:pt-40 md:pt-44 pb-32 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-pearl-50/95 p-8 md:p-10 rounded-3xl border border-champagne-300/60 shadow-luxury-soft space-y-6">
        
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-obsidian/60 hover:text-obsidian">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>

        <div className="space-y-2">
          <h1 className="font-serif-luxury text-3xl text-obsidian">
            Reset <span className="font-semibold text-gold-dark">password</span>.
          </h1>
          <p className="text-xs text-obsidian/60 font-sans leading-relaxed">
            Enter your account email and we will send you a secure link to reset your credentials.
          </p>
        </div>

        {isSent ? (
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
            <Check className="w-8 h-8 text-emerald-800 mx-auto" />
            <p className="font-serif text-base text-emerald-900">Check Your Inbox</p>
            <p className="text-xs text-emerald-800/80">
              We've dispatched recovery instructions to <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-obsidian/70 font-semibold block">
                Account Email
              </label>
              <div className="flex items-center gap-2 px-4 h-12 bg-white rounded-xl border border-champagne-300/70 focus-within:border-gold-dark">
                <Mail className="w-4 h-4 text-obsidian/40" />
                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-sans text-obsidian focus:outline-none placeholder:text-obsidian/40"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 px-6 rounded-full bg-obsidian text-pearl-100 text-xs uppercase tracking-widest font-semibold hover:bg-obsidian-200 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Send Recovery Link</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
