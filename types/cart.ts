
export interface CartItem {
  id: string; // Unique ID for cart item (productId-colorId-sizeId)
  productId: number;
  productName: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  colorId?: number;
  colorName?: string;
  sizeId?: number;
  sizeName?: string;
  stockQuantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

