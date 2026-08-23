import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, HamperBoxOption } from '../types/shopify';
import { BRAND_INFO, FEATURED_PRODUCTS, HAMPER_BOX_OPTIONS } from '../data/shopify-data';
import { atelierSound } from '../utils/audioAtelier';
import confetti from 'canvas-confetti';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, personalisation?: CartItem['selectedPersonalisation']) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
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

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Real empty initial cart state (only loads items user actually added)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return []; // Clean empty baseline
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hamper Builder state
  const [selectedHamperBox, setSelectedHamperBox] = useState<HamperBoxOption>(HAMPER_BOX_OPTIONS[0]);
  const [hamperItems, setHamperItems] = useState<Product[]>([]);
  const [polaroidNote, setPolaroidNote] = useState<string>("To my favourite person, shining always ✨");

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const addToCart = (product: Product, quantity = 1, personalisation?: CartItem['selectedPersonalisation']) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
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
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast("Item removed from bag");
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {}
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const addHamperItem = (product: Product) => {
    if (hamperItems.length >= 6) {
      showToast("Maximum 6 items per bespoke hamper box");
      return;
    }
    setHamperItems(prev => [...prev, product]);
    showToast(`Added ${product.title} to hamper`);
  };

  const removeHamperItem = (productId: string) => {
    setHamperItems(prev => prev.filter(i => i.id !== productId));
  };

  const checkoutViaWhatsApp = () => {
    if (cart.length === 0) {
      showToast("Your bag is currently empty");
      return;
    }
    const itemList = cart.map(i => `• ${i.product.title} (x${i.quantity}) - ₹${i.product.price * i.quantity}`).join('%0A');
    const msg = `Hello%20Celestia%20Team!%20✨%0A%0AI%20would%20like%20to%20place%20an%20order%20for:%0A${itemList}%0A%0A*Total%20Order%20Value:*%20₹${subtotal}%0A*Shipping:*%20${subtotal >= BRAND_INFO.freeShippingThreshold ? 'FREE%20Express' : '₹99'}%0A%0APlease%20confirm%20availability%20for%20Same-Day%20Mumbai%20/%20Pan-India%20dispatch.`;
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
