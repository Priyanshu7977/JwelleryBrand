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

export interface RegisteredAccount extends UserProfile {
  password?: string;
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

  // Register: Stores credentials in registry, BUT DOES NOT LOG IN (User must log in separately)
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

      // Strictly DO NOT set user session here! User must log in with their credentials.
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  // Login: Validates against registered account registry and checks password match
  const login = async (email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password ? password.trim() : '';

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!cleanPassword) {
      return { success: false, error: 'Please enter your password.' };
    }

    try {
      const registryRaw = localStorage.getItem(USERS_REGISTRY_KEY);
      const registry: RegisteredAccount[] = registryRaw ? JSON.parse(registryRaw) : [];
      const matched = registry.find((u) => u.email.toLowerCase() === cleanEmail);

      if (!matched) {
        return {
          success: false,
          error: 'No registered account found with this email. Please register first.'
        };
      }

      // Verify password
      if (matched.password && matched.password !== cleanPassword) {
        return {
          success: false,
          error: 'Incorrect password. Please verify your credentials and try again.'
        };
      }

      // Authentication Successful -> Create user profile session (without exposing raw password)
      const userProfile: UserProfile = {
        id: matched.id,
        name: matched.name,
        email: matched.email,
        phone: matched.phone,
        memberSince: matched.memberSince,
        tier: matched.tier,
        ordersCount: matched.ordersCount,
        savedAddresses: matched.savedAddresses || [],
        wishlist: matched.wishlist || wishlist,
      };

      setUser(userProfile);
      if (matched.wishlist && matched.wishlist.length > 0) {
        setWishlist(Array.from(new Set([...wishlist, ...matched.wishlist])));
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
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
