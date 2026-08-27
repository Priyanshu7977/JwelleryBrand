import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, HamperBoxOption } from '../types/shopify';
import { BRAND_INFO, FEATURED_PRODUCTS, HAMPER_BOX_OPTIONS } from '../data/shopify-data';
import { atelierSound } from '../utils/audioAtelier';
import confetti from 'canvas-confetti';
import {
  reserveCartItem,
  releaseCartItem,
  clearAllPatronReservations,
  syncEntireCart,
} from '../services/inventoryLockService';
import { useInventory } from './InventoryContext';

export interface AppliedCoupon {
  code: string;
  type: 'percent' | 'flat' | 'shipping';
  value: number;
  description: string;
  minOrder?: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, personalisation?: CartItem['selectedPersonalisation']) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discountAmount: number;
  finalPayable: number;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isConciergeOpen: boolean;
  setIsConciergeOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  checkoutViaWhatsApp: () => void;
  selectedHamperBox: HamperBoxOption;
  setSelectedHamperBox: (box: HamperBoxOption) => void;
  hamperItems: Product[];
  addHamperItem: (product: Product) => void;
  removeHamperItem: (productId: string) => void;
  polaroidNote: string;
  setPolaroidNote: (note: string) => void;
}

const CART_STORAGE_KEY = 'celestia_cart_items';
const COUPON_STORAGE_KEY = 'celestia_applied_coupon';

export const POPULAR_COUPONS: AppliedCoupon[] = [
  { code: 'CELESTIA10', type: 'percent', value: 10, description: '10% OFF Entire Order' },
  { code: 'FIRSTBUY', type: 'flat', value: 150, description: '₹150 Flat Off (Min. ₹499)', minOrder: 499 },
  { code: 'ROYAL500', type: 'flat', value: 500, description: '₹500 Flat Off (Min. ₹1,999)', minOrder: 1999 },
  { code: 'BONKERSTYLE', type: 'percent', value: 15, description: '15% Streetwear Drop Discount' }
];

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Single shared global cart state for the entire application
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(() => {
    try {
      const saved = localStorage.getItem(COUPON_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hamper Builder configuration state
  const [selectedHamperBox, setSelectedHamperBox] = useState<HamperBoxOption>(HAMPER_BOX_OPTIONS[0]);
  const [polaroidNote, setPolaroidNote] = useState<string>("To my favourite person, shining always ✨");

  const { reservedByOthers, isOutOfStock } = useInventory();

  // Sync existing cart items on mount to maintain reservations
  useEffect(() => {
    if (cart.length > 0) {
      syncEntireCart(
        cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.product.price,
        }))
      );
    }
  }, []);

  // Persist single global cart & coupon to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch {}
  }, [appliedCoupon]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const addToCart = (product: Product, quantity = 1, personalisation?: CartItem['selectedPersonalisation']) => {
    // Check if item is already held by someone else
    const inMyCart = cart.find((item) => item.product.id === product.id)?.quantity || 0;
    const baseStock = product.availableStock ?? 1;
    const reservedOthers = reservedByOthers[product.id] || 0;
    const remainingForMe = Math.max(0, baseStock - reservedOthers);

    if (remainingForMe <= 0) {
      showToast(`⚠️ "${product.title}" is currently held in another customer's bag!`);
      return;
    }

    const nextQuantity = inMyCart + quantity;
    if (nextQuantity > baseStock) {
      showToast(`⚠️ Only ${baseStock} piece(s) available in the atelier!`);
      return;
    }

    // Reserve in Supabase and broadcast
    reserveCartItem(product.id, nextQuantity, product.price);

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? {
                ...item,
                quantity: item.quantity + quantity,
                selectedPersonalisation: personalisation || item.selectedPersonalisation
              }
            : item
        );
      }
      return [...prev, { product, quantity, selectedPersonalisation: personalisation }];
    });

    showToast(`Added "${product.title}" to your curated bag`);
    
    // Play subtle audio sparkle
    try {
      atelierSound.playBagSparkle();
    } catch {}

    // Dispatch fly-to-cart animation token
    try {
      window.dispatchEvent(new CustomEvent('celestia-fly-to-cart', {
        detail: { x: window.innerWidth / 2, y: window.innerHeight / 2 }
      }));
    } catch {}

    // Subtle luxury gold confetti sparkle
    try {
      confetti({
        particleCount: 24,
        spread: 45,
        origin: { y: 0.85, x: 0.9 },
        colors: ['#D8C39A', '#C7AE7F', '#F5EBE6', '#FFFFFF'],
        ticks: 180,
        gravity: 1.2,
        scalar: 0.7,
        shapes: ['circle']
      });
    } catch {}
  };

  const removeFromCart = (productId: string) => {
    // Release reservation so other customers see it back in stock immediately
    releaseCartItem(productId);
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast("Item removed from bag — returned to atelier stock");
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const item = cart.find((i) => i.product.id === productId);
    if (item) {
      reserveCartItem(productId, quantity, item.product.price);
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    clearAllPatronReservations();
    setCart([]);
    setAppliedCoupon(null);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(COUPON_STORAGE_KEY);
    } catch {}
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.minOrder && subtotal < appliedCoupon.minOrder) {
      discountAmount = 0;
    } else if (appliedCoupon.type === 'percent') {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else if (appliedCoupon.type === 'flat') {
      discountAmount = Math.min(subtotal, appliedCoupon.value);
    }
  }

  const finalPayable = Math.max(0, subtotal - discountAmount);

  const applyCoupon = (rawCode: string): { success: boolean; message: string } => {
    if (/[^a-zA-Z0-9]/.test(rawCode.trim())) {
      return { success: false, message: 'Invalid characters. Coupon codes only contain letters and numbers.' };
    }

    const clean = rawCode.replace(/[^a-zA-Z0-9]/g, '').trim().toUpperCase();
    if (!clean) {
      return { success: false, message: 'Please enter a valid coupon code (alphanumeric only).' };
    }

    const found = POPULAR_COUPONS.find(c => c.code === clean);
    if (!found) {
      return { success: false, message: `Coupon code "${clean}" is invalid.` };
    }

    if (found.minOrder && subtotal < found.minOrder) {
      return {
        success: false,
        message: `Add ₹${found.minOrder - subtotal} more to unlock "${clean}".`
      };
    }

    setAppliedCoupon(found);
    showToast(`✨ Coupon "${found.code}" applied!`);
    return { success: true, message: `Coupon "${found.code}" applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  // Derived directly from the single global cart to prevent parallel detached states
  const hamperItems = cart.map(item => item.product);

  const addHamperItem = (product: Product) => {
    addToCart(product, 1, {
      boxType: selectedHamperBox.name,
      customNote: polaroidNote
    });
  };

  const removeHamperItem = (productId: string) => {
    removeFromCart(productId);
  };

  const checkoutViaWhatsApp = () => {
    if (cart.length === 0) {
      showToast("Your bag is currently empty");
      return;
    }
    const itemList = cart.map(i => `• ${i.product.title} (x${i.quantity}) - ₹${i.product.price * i.quantity}`).join('%0A');
    const discountLine = discountAmount > 0 ? `%0A*Discount Applied (${appliedCoupon?.code}):* -₹${discountAmount}` : '';
    const shippingLine = `%0A*Shipping:* ${finalPayable >= BRAND_INFO.freeShippingThreshold ? 'FREE Express' : '₹99'}`;
    const totalLine = `%0A*Total Order Value:* ₹${finalPayable + (finalPayable >= BRAND_INFO.freeShippingThreshold ? 0 : 99)}`;
    const msg = `Hello%20Celestia%20Team!%20✨%0A%0AI%20would%20like%20to%20place%20an%20order%20for:%0A${itemList}${discountLine}${shippingLine}${totalLine}%0A%0APlease%20confirm%20availability%20for%20Same-Day%20Mumbai%20/%20Pan-India%20dispatch.`;
    window.open(`https://wa.me/917718825792?text=${msg}`, '_blank');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        discountAmount,
        finalPayable,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
        quickViewProduct,
        setQuickViewProduct,
        isSearchOpen,
        setIsSearchOpen,
        isConciergeOpen,
        setIsConciergeOpen,
        toastMessage,
        showToast,
        checkoutViaWhatsApp,
        selectedHamperBox,
        setSelectedHamperBox,
        hamperItems,
        addHamperItem,
        removeHamperItem,
        polaroidNote,
        setPolaroidNote,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
