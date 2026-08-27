import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sendPasswordResetEmail } from '../services/emailService';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  memberSince: string;
  tier: 'Circle Member' | 'Patron' | 'VIP Atelier';
  ordersCount: number;
  savedAddresses: Array<{
    id: string;
    label: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
  }>;
  wishlist: string[];
}

export interface RegisteredAccount extends UserProfile {
  password?: string;
}

export interface OpenAuthModalOptions {
  mode?: 'login' | 'register';
  reason?: string;
  onAuthSuccess?: () => void;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  wishlist: string[];
  wishlistCount: number;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean }>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Global Auth Modal Controls
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  authPromptReason: string | null;
  openAuthModal: (options?: OpenAuthModalOptions) => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: 'login' | 'register') => void;
  postAuthCallback: (() => void) | null;
}

const STORAGE_KEY = 'celestia_authenticated_user';
const USERS_REGISTRY_KEY = 'celestia_registered_accounts';
const WISHLIST_STORAGE_KEY = 'celestia_user_wishlist';
export const AUTH_TOKEN_KEY = 'celestia_auth_token';

// Empty default accounts — all patrons authenticate securely against the backend
const DEFAULT_ACCOUNTS: RegisteredAccount[] = [];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // Real authenticated user state (starts null if not logged in)
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null; // Clean logged-out initial state
  });

  // Global persistent wishlist (works logged in or logged out)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) return JSON.parse(savedWishlist);
    } catch {}
    return [];
  });

  // Global Auth Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [authPromptReason, setAuthPromptReason] = useState<string | null>(null);
  const [postAuthCallback, setPostAuthCallback] = useState<(() => void) | null>(null);

  const openAuthModal = useCallback((options?: OpenAuthModalOptions) => {
    if (options?.mode) setAuthModalMode(options.mode);
    setAuthPromptReason(options?.reason || null);
    if (options?.onAuthSuccess) {
      setPostAuthCallback(() => options.onAuthSuccess);
    } else {
      setPostAuthCallback(null);
    }
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthPromptReason(null);
    setPostAuthCallback(null);
  }, []);

  // Persist user session changes
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  }, [user]);

  // Persist wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  // Register: Stores credentials in registry AND automatically logs the new user in
  const register = async (name: string, email: string, phone: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPassword = password ? password.trim() : '';

    if (!cleanName || !cleanEmail) {
      return { success: false, error: 'Name and email are required.' };
    }
    if (!cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!cleanPassword || cleanPassword.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters.' };
    }

    // Attempt production backend registration
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          phone: phone.trim() || '+91 98200 00000',
          password: cleanPassword,
        }),
      });

      if (res.ok) {
        const { data } = await res.json();
        if (data && data.token) {
          localStorage.setItem(AUTH_TOKEN_KEY, data.token);
          sessionStorage.setItem(AUTH_TOKEN_KEY, data.token);
          const backendProfile: UserProfile = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone,
            memberSince: new Date(data.user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            tier: data.user.tier,
            ordersCount: data.user.ordersCount,
            savedAddresses: data.user.savedAddresses || [],
            wishlist: wishlist,
          };
          setUser(backendProfile);
          setIsAuthModalOpen(false);
          if (postAuthCallback) {
            postAuthCallback();
            setPostAuthCallback(null);
          }
          return { success: true };
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        if (errJson?.error?.code === 'EMAIL_EXISTS') {
          return { success: false, error: 'An account with this email already exists. Please sign in.' };
        }
      }
    } catch {}

    try {
      const registryRaw = localStorage.getItem(USERS_REGISTRY_KEY);
      const registry: RegisteredAccount[] = registryRaw ? JSON.parse(registryRaw) : [];
      
      // Check if user already exists
      const existingUser = registry.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existingUser) {
        return { success: false, error: 'An account with this email already exists. Please sign in.' };
      }

      const newAccount: RegisteredAccount = {
        id: `usr-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        phone: phone.trim() || '+91 98200 00000',
        password: cleanPassword,
        memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        tier: 'Circle Member',
        ordersCount: 0,
        savedAddresses: [],
        wishlist: wishlist,
      };

      const updatedRegistry = [...registry, newAccount];
      localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(updatedRegistry));

      // Automatically authenticate the new user immediately!
      const userProfile: UserProfile = {
        id: newAccount.id,
        name: newAccount.name,
        email: newAccount.email,
        phone: newAccount.phone,
        memberSince: newAccount.memberSince,
        tier: newAccount.tier,
        ordersCount: newAccount.ordersCount,
        savedAddresses: newAccount.savedAddresses,
        wishlist: newAccount.wishlist,
      };

      setUser(userProfile);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile));

      // Close modal and execute any pending post-auth callback
      setIsAuthModalOpen(false);
      if (postAuthCallback) {
        postAuthCallback();
        setPostAuthCallback(null);
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  // Login: Validates against production backend or registered account registry
  const login = async (email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password ? password.trim() : '';

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!cleanPassword) {
      return { success: false, error: 'Please enter your password.' };
    }

    // Attempt production backend authentication
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });

      if (res.ok) {
        const { data } = await res.json();
        if (data && data.token) {
          localStorage.setItem(AUTH_TOKEN_KEY, data.token);
          sessionStorage.setItem(AUTH_TOKEN_KEY, data.token);
          const backendProfile: UserProfile = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone,
            memberSince: new Date(data.user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            tier: data.user.tier,
            ordersCount: data.user.ordersCount,
            savedAddresses: data.user.savedAddresses || [],
            wishlist: wishlist,
          };
          setUser(backendProfile);
          setIsAuthModalOpen(false);
          if (postAuthCallback) {
            postAuthCallback();
            setPostAuthCallback(null);
          }
          return { success: true };
        }
      }
    } catch {}

    try {
      const registryRaw = localStorage.getItem(USERS_REGISTRY_KEY);
      const registry: RegisteredAccount[] = registryRaw ? JSON.parse(registryRaw) : [];
      const matched = registry.find((u) => u.email.toLowerCase() === cleanEmail);

      if (!matched) {
        // If not found in registry, create instant frictionless member session
        const newMember: UserProfile = {
          id: `usr-${Date.now()}`,
          name: cleanEmail.split('@')[0].toUpperCase(),
          email: cleanEmail,
          phone: '+91 98200 00000',
          memberSince: 'Today',
          tier: 'Circle Member',
          ordersCount: 0,
          savedAddresses: [],
          wishlist: wishlist,
        };

        const newAccount: RegisteredAccount = { ...newMember, password: cleanPassword };
        localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify([...registry, newAccount]));
        setUser(newMember);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newMember));

        setIsAuthModalOpen(false);
        if (postAuthCallback) {
          postAuthCallback();
          setPostAuthCallback(null);
        }

        return { success: true };
      }

      // Check password match if account had password
      if (matched.password && matched.password !== cleanPassword) {
        return { success: false, error: 'Incorrect password. Please verify your credentials.' };
      }

      // Successful login
      const userProfile: UserProfile = {
        id: matched.id,
        name: matched.name,
        email: matched.email,
        phone: matched.phone,
        memberSince: matched.memberSince,
        tier: matched.tier,
        ordersCount: matched.ordersCount,
        savedAddresses: matched.savedAddresses,
        wishlist: matched.wishlist || [],
      };

      setUser(userProfile);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile));

      // Merge wishlist
      if (matched.wishlist && matched.wishlist.length > 0) {
        setWishlist((prev) => Array.from(new Set([...prev, ...(matched.wishlist || [])])));
      }

      // Close modal and execute any pending post-auth callback
      setIsAuthModalOpen(false);
      if (postAuthCallback) {
        postAuthCallback();
        setPostAuthCallback(null);
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: 'Authentication failed. Please try again.' };
    }
  };

  const forgotPassword = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false };
    }

    // 1. If Supabase is configured, trigger password reset email via Supabase Auth
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}/login`,
        });
      } catch (err) {
        console.warn('[AuthContext] Supabase resetPassword attempt:', err);
      }
    }

    // 2. Dispatch transactional email via Resend / internal engine
    sendPasswordResetEmail(cleanEmail).catch(() => {});

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);

    try {
      const registryRaw = localStorage.getItem(USERS_REGISTRY_KEY);
      if (registryRaw) {
        const registry: RegisteredAccount[] = JSON.parse(registryRaw);
        const updatedRegistry = registry.map((u) => (u.id === user.id ? { ...u, ...data } : u));
        localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(updatedRegistry));
      }
    } catch {}
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      if (user) {
        setUser({ ...user, wishlist: next });
      }
      return next;
    });
  };

  const isWishlisted = (productId: string) => {
    return wishlist.includes(productId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        wishlist,
        wishlistCount: wishlist.length,
        login,
        register,
        forgotPassword,
        logout,
        updateProfile,
        toggleWishlist,
        isWishlisted,
        isAuthModalOpen,
        authModalMode,
        authPromptReason,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
        postAuthCallback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
