import React, { createContext, useContext, useState, useEffect } from 'react';

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
}

const STORAGE_KEY = 'celestia_authenticated_user';
const USERS_REGISTRY_KEY = 'celestia_registered_accounts';
const WISHLIST_STORAGE_KEY = 'celestia_user_wishlist';

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

  const login = async (email: string, _password?: string) => {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    try {
      const registryRaw = localStorage.getItem(USERS_REGISTRY_KEY);
      const registry: UserProfile[] = registryRaw ? JSON.parse(registryRaw) : [];
      const matched = registry.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (matched) {
        // Log in existing registered user
        setUser(matched);
        if (matched.wishlist && matched.wishlist.length > 0) {
          setWishlist(Array.from(new Set([...wishlist, ...matched.wishlist])));
        }
        return { success: true };
      }
    } catch {}

    // Dynamic user session creation for newly entered credentials
    const formattedName = email
      .split('@')[0]
      .replace(/[._]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const loggedUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: formattedName || 'Celestia Member',
      email,
      phone: '+91 98200 00000',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      tier: 'Circle Member',
      ordersCount: 0,
      savedAddresses: [],
      wishlist: wishlist,
    };

    setUser(loggedUser);
    return { success: true };
  };

  const register = async (name: string, email: string, phone: string, _password?: string) => {
    if (!name.trim() || !email.trim()) {
      return { success: false, error: 'Name and email are required.' };
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || '+91 98200 00000',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      tier: 'Circle Member',
      ordersCount: 0,
      savedAddresses: [],
      wishlist: wishlist,
    };

    try {
      const registryRaw = localStorage.getItem(USERS_REGISTRY_KEY);
      const registry: UserProfile[] = registryRaw ? JSON.parse(registryRaw) : [];
      const updatedRegistry = [...registry.filter((u) => u.email !== email), newUser];
      localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(updatedRegistry));
    } catch {}

    setUser(newUser);
    return { success: true };
  };

  const forgotPassword = async (email: string) => {
    if (!email || !email.includes('@')) return { success: false };
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);

    try {
      const registryRaw = localStorage.getItem(USERS_REGISTRY_KEY);
      if (registryRaw) {
        const registry: UserProfile[] = JSON.parse(registryRaw);
        const updatedRegistry = registry.map((u) => (u.id === user.id ? updated : u));
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
