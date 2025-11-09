// Category Types
export interface CategoryResponse {
  categoryId: number;
  categoryName: string;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryRequest {
  categoryName: string;
  description?: string;
  imageUrl?: string;
}

export interface CategoryPageResponse {
  statusCode: number;
  message?: string;
  data?: {
    content: CategoryResponse[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
}

export interface CategoryListResponse {
  statusCode: number;
  message?: string;
  data?: CategoryResponse[];
}

export interface CategoryDetailResponse {
  statusCode: number;
  message?: string;
  data?: CategoryResponse;
}

