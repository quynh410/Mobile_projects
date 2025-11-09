// Order Status Enum
export enum OrderStatus {
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

// Order Item Request
export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

// Order Request
export interface OrderRequest {
  userId: number;
  shippingAddress: string;
  orderItems: OrderItemRequest[];
}

// Order Item Response
export interface OrderItemResponse {
  orderItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

// Order Response
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

// Update Order Status Request
export interface UpdateOrderStatusRequest {
  orderStatus: OrderStatus;
}

// Order Page Response (for paginated endpoints)
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

// Order Single Response
export interface OrderSingleResponse {
  statusCode: number;
  message?: string;
  data?: OrderResponse;
}

// Order Delete Response
export interface OrderDeleteResponse {
  statusCode: number;
  message?: string;
  data?: null;
}

