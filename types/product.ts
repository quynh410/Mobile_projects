// Product Types
export interface ProductResponse {
  productId: number;
  productName: string;
  description?: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  categoryId?: number;
  categoryName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductPageResponse {
  statusCode: number;
  message?: string;
  data?: {
    content: ProductResponse[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
}

export interface ProductListResponse {
  statusCode: number;
  message?: string;
  data?: ProductResponse[];
}

