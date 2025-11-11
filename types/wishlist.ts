
export interface WishlistItem {
  productId: number;
  productName: string;
  price: number;
  imageUrl?: string;
  stockQuantity: number;
  categoryId?: number;
  categoryName?: string;
}

export interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
  getTotalItems: () => number;
}

