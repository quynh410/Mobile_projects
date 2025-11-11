import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CartItem, CartContextType } from '@/types/cart';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = '@cart_items';

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from storage on mount
  React.useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
          setItems(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadCart();
  }, []);

  React.useEffect(() => {
    if (isLoaded) {
      const saveCart = async () => {
        try {
          await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
          console.error('Error saving cart to storage:', error);
        }
      };
      saveCart();
    }
  }, [items, isLoaded]);

  const generateCartItemId = (
    productId: number,
    colorId?: number,
    sizeId?: number
  ): string => {
    return `${productId}-${colorId || 'none'}-${sizeId || 'none'}`;
  };

  const addItem = useCallback(
    (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => {
      const id = generateCartItemId(item.productId, item.colorId, item.sizeId);
      const quantity = item.quantity || 1;

      setItems((prevItems) => {
        const existingItem = prevItems.find((i) => i.id === id);

        if (existingItem) {
          const newQuantity = Math.min(
            existingItem.quantity + quantity,
            item.stockQuantity
          );
          return prevItems.map((i) =>
            i.id === id ? { ...i, quantity: newQuantity } : i
          );
        } else {
          return [
            ...prevItems,
            {
              ...item,
              id,
              quantity: Math.min(quantity, item.stockQuantity),
            },
          ];
        }
      });
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems((prevItems) => {
      const item = prevItems.find((i) => i.id === id);
      if (!item) return prevItems;

      // Don't allow quantity to exceed stock
      const newQuantity = Math.min(quantity, item.stockQuantity);
      
      return prevItems.map((i) =>
        i.id === id ? { ...i, quantity: newQuantity } : i
      );
    });
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalPrice = useCallback((): number => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const getTotalItems = useCallback((): number => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

