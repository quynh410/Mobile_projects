import { WishlistContextType, WishlistItem } from '@/types/wishlist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = '@wishlist_items';

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load wishlist from storage on mount
  React.useEffect(() => {
    const loadWishlist = async () => {
      try {
        const storedWishlist = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
        if (storedWishlist) {
          setItems(JSON.parse(storedWishlist));
        }
      } catch (error) {
        console.error('Error loading wishlist from storage:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadWishlist();
  }, []);

  // Save wishlist to storage whenever items change (only after initial load)
  React.useEffect(() => {
    if (isLoaded) {
      const saveWishlist = async () => {
        try {
          await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
          console.error('Error saving wishlist to storage:', error);
        }
      };
      saveWishlist();
    }
  }, [items, isLoaded]);

  const addItem = useCallback((item: WishlistItem) => {
    setItems((prevItems) => {
      // Check if item already exists
      const exists = prevItems.some((i) => i.productId === item.productId);
      if (exists) {
        return prevItems; // Don't add duplicate
      }
      return [...prevItems, item];
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  }, []);

  const isInWishlist = useCallback((productId: number): boolean => {
    return items.some((item) => item.productId === productId);
  }, [items]);

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalItems = useCallback((): number => {
    return items.length;
  }, [items]);

  const value: WishlistContextType = {
    items,
    addItem,
    removeItem,
    isInWishlist,
    clearWishlist,
    getTotalItems,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

