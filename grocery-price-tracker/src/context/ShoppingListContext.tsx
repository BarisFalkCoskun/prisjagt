import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Product } from '../types';

interface ShoppingListItem {
  product: Product;
  quantity: number;
  addedAt: Date;
  checked: boolean;
}

interface ShoppingListContextType {
  items: ShoppingListItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleChecked: (productId: string) => void;
  clearList: () => void;
  clearChecked: () => void;
  isInList: (productId: string) => boolean;
  totalsByStore: { storeId: string; storeName: string; storeColor: string; total: number }[];
  bestStore: { storeId: string; storeName: string; storeColor: string; total: number } | null;
  totalSavings: number;
  itemCount: number;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

export function ShoppingListProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ShoppingListItem[]>(() => {
    const saved = localStorage.getItem('shoppingList');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((item: ShoppingListItem) => ({
        ...item,
        addedAt: new Date(item.addedAt),
      }));
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, addedAt: new Date(), checked: false }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const toggleChecked = useCallback((productId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, checked: !item.checked } : item
      )
    );
  }, []);

  const clearList = useCallback(() => {
    setItems([]);
  }, []);

  const clearChecked = useCallback(() => {
    setItems((prev) => prev.filter((item) => !item.checked));
  }, []);

  const isInList = useCallback(
    (productId: string) => items.some((item) => item.product.id === productId),
    [items]
  );

  // Calculate totals by store
  const totalsByStore = items.length > 0
    ? (() => {
        const storeMap = new Map<string, { storeName: string; storeColor: string; total: number }>();

        items.forEach((item) => {
          item.product.storePrices.forEach((sp) => {
            const existing = storeMap.get(sp.store.id);
            const itemTotal = sp.currentPrice * item.quantity;
            if (existing) {
              existing.total += itemTotal;
            } else {
              storeMap.set(sp.store.id, {
                storeName: sp.store.name,
                storeColor: sp.store.color,
                total: itemTotal,
              });
            }
          });
        });

        return Array.from(storeMap.entries())
          .map(([storeId, data]) => ({ storeId, ...data }))
          .sort((a, b) => a.total - b.total);
      })()
    : [];

  const bestStore = totalsByStore.length > 0 ? totalsByStore[0] : null;

  const totalSavings = totalsByStore.length > 1
    ? totalsByStore[totalsByStore.length - 1].total - totalsByStore[0].total
    : 0;

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ShoppingListContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        toggleChecked,
        clearList,
        clearChecked,
        isInList,
        totalsByStore,
        bestStore,
        totalSavings,
        itemCount,
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
}

export function useShoppingList() {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
}
