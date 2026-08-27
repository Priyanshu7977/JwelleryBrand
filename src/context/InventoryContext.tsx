import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  fetchReservedByOthers,
  subscribeToInventoryUpdates,
} from '../services/inventoryLockService';

interface InventoryContextType {
  reservedByOthers: Record<string, number>;
  isOutOfStock: (productId: string, baseStock?: number) => boolean;
  getAvailableStock: (productId: string, baseStock?: number) => number;
  isReservedByOthers: (productId: string) => boolean;
  refreshInventory: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reservedByOthers, setReservedByOthers] = useState<Record<string, number>>({});

  useEffect(() => {
    // Subscribe to live inventory reservations (Supabase + BroadcastChannel + Polling)
    const unsubscribe = subscribeToInventoryUpdates((updatedReserved) => {
      setReservedByOthers(updatedReserved);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const refreshInventory = useCallback(async () => {
    try {
      const latest = await fetchReservedByOthers();
      setReservedByOthers(latest);
    } catch (err) {
      console.warn('[InventoryContext] Refresh failed:', err);
    }
  }, []);

  const isReservedByOthers = useCallback(
    (productId: string) => {
      return (reservedByOthers[productId] || 0) > 0;
    },
    [reservedByOthers]
  );

  const getAvailableStock = useCallback(
    (productId: string, baseStock = 1) => {
      const reserved = reservedByOthers[productId] || 0;
      return Math.max(0, baseStock - reserved);
    },
    [reservedByOthers]
  );

  const isOutOfStock = useCallback(
    (productId: string, baseStock = 1) => {
      return getAvailableStock(productId, baseStock) <= 0;
    },
    [getAvailableStock]
  );

  return (
    <InventoryContext.Provider
      value={{
        reservedByOthers,
        isOutOfStock,
        getAvailableStock,
        isReservedByOthers,
        refreshInventory,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
