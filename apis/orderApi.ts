import {
    OrderDeleteResponse,
    OrderPageResponse,
    OrderRequest,
    OrderSingleResponse,
    UpdateOrderStatusRequest
} from '@/types/order';
import axiosInstance from '@/utils/axiosInstance';

/**
 * Get orders by user ID with pagination
 * @param userId - User ID
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 10)
 * @returns Paginated orders response
 */
export const getOrdersByUser = async (
  userId: number,
  page: number = 0,
  size: number = 10
): Promise<OrderPageResponse> => {
  try {
    const response = await axiosInstance.get(`/v1/orders/user/${userId}`, {
      params: {
        page,
        size,
      },
    });
    return response.data;
  } catch (err: any) {
    console.error('Get Orders By User API Error:', {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
    });

    let errorMessage = 'Không thể lấy danh sách đơn hàng';

    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Get order by ID
 * @param id - Order ID
 * @returns Order response
 */
export const getOrderById = async (id: number): Promise<OrderSingleResponse> => {
  try {
    const response = await axiosInstance.get(`/v1/orders/${id}`);
    return response.data;
  } catch (err: any) {
    console.error('Get Order By ID API Error:', {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
    });

    let errorMessage = 'Không thể lấy thông tin đơn hàng';

    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Get all orders with pagination
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 10)
 * @returns Paginated orders response
 */
export const getAllOrders = async (
  page: number = 0,
  size: number = 10
): Promise<OrderPageResponse> => {
  try {
    const response = await axiosInstance.get('/v1/orders', {
      params: {
        page,
        size,
      },
    });
    return response.data;
  } catch (err: any) {
    console.error('Get All Orders API Error:', {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
    });

    let errorMessage = 'Không thể lấy danh sách đơn hàng';

    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Create a new order
 * @param data - Order request data
 * @returns Created order response
 */
export const createOrder = async (data: OrderRequest): Promise<OrderSingleResponse> => {
  try {
    const response = await axiosInstance.post('/v1/orders', data);
    return response.data;
  } catch (err: any) {
    console.error('Create Order API Error:', {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
    });

    let errorMessage = 'Không thể tạo đơn hàng';

    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Update order status
 * @param id - Order ID
 * @param data - Update order status request data
 * @returns Updated order response
 */
export const updateOrderStatus = async (
  id: number,
  data: UpdateOrderStatusRequest
): Promise<OrderSingleResponse> => {
  try {
    const response = await axiosInstance.patch(`/v1/orders/${id}/status`, data);
    return response.data;
  } catch (err: any) {
    console.error('Update Order Status API Error:', {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
    });

    let errorMessage = 'Không thể cập nhật trạng thái đơn hàng';

    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Cancel an order
 * @param id - Order ID
 * @returns Delete response
 */
export const cancelOrder = async (id: number): Promise<OrderDeleteResponse> => {
  try {
    const response = await axiosInstance.delete(`/v1/orders/${id}`);
    return response.data;
  } catch (err: any) {
    console.error('Cancel Order API Error:', {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
    });

    let errorMessage = 'Không thể hủy đơn hàng';

    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }

    throw new Error(errorMessage);
  }
};

