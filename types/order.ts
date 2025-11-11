export enum OrderStatus {
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderRequest {
  userId: number;
  shippingAddress: string;
  orderItems: OrderItemRequest[];
}

export interface OrderItemResponse {
  orderItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface OrderResponse {
  orderId: number;
  userId: number;
  userName: string;
  totalPrice: number;
  orderStatus: OrderStatus;
  shippingAddress: string;
  orderItems: OrderItemResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateOrderStatusRequest {
  orderStatus: OrderStatus;
}

export interface OrderPageResponse {
  statusCode: number;
  message?: string;
  data?: {
    content: OrderResponse[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
}

export interface OrderSingleResponse {
  statusCode: number;
  message?: string;
  data?: OrderResponse;
}

export interface OrderDeleteResponse {
  statusCode: number;
  message?: string;
  data?: null;
}

