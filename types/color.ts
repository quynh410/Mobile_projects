export interface ColorResponse {
  colorId: number;
  colorName: string;
  productId: number;
  productName?: string;
}

export interface ColorRequest {
  colorName: string;
  productId: number;
}

export interface ColorListResponse {
  statusCode: number;
  message?: string;
  data?: ColorResponse[];
}

export interface ColorSingleResponse {
  statusCode: number;
  message?: string;
  data?: ColorResponse;
}

export interface ColorDeleteResponse {
  statusCode: number;
  message?: string;
  data?: null;
}

