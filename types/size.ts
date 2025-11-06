export interface SizeResponse {
  sizeId: number;
  sizeName: string;
  productId: number;
  productName?: string;
}

export interface SizeRequest {
  sizeName: string;
  productId: number;
}

export interface SizeListResponse {
  statusCode: number;
  message?: string;
  data?: SizeResponse[];
}

export interface SizeSingleResponse {
  statusCode: number;
  message?: string;
  data?: SizeResponse;
}

export interface SizeDeleteResponse {
  statusCode: number;
  message?: string;
  data?: null;
}

