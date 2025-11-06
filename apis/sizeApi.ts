import { SizeDeleteResponse, SizeListResponse, SizeRequest, SizeSingleResponse } from '@/types/size';
import axiosInstance from '@/utils/axiosInstance';

export const getAllSizes = async (): Promise<SizeListResponse> => {
  try {
    const response = await axiosInstance.get('/v1/sizes');
    return response.data;
  } catch (err: any) {
    console.error("Get All Sizes API Error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
    });
    
    let errorMessage = 'Không thể lấy danh sách sizes';
    
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    throw new Error(errorMessage);
  }
};

export const getSizeById = async (id: number): Promise<SizeSingleResponse> => {
  try {
    const response = await axiosInstance.get(`/v1/sizes/${id}`);
    return response.data;
  } catch (err: any) {
    console.error("Get Size By ID API Error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
    });
    
    let errorMessage = 'Không thể lấy thông tin size';
    
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    throw new Error(errorMessage);
  }
};

export const getSizesByProductId = async (productId: number): Promise<SizeListResponse> => {
  try {
    const response = await axiosInstance.get(`/v1/sizes/product/${productId}`);
    return response.data;
  } catch (err: any) {
    // Xử lý các trường hợp lỗi phổ biến
    const status = err.response?.status;
    const errorMessage = err.response?.data?.error || '';
    
    // 404: Sản phẩm không có sizes hoặc không tồn tại
    if (status === 404) {
      console.log(`Product ${productId} has no sizes (404)`);
      return {
        statusCode: 200,
        message: 'No sizes found for this product',
        data: [],
      };
    }
    
    // 500 với "No static resource": Endpoint chưa được implement hoặc chưa được deploy
    if (status === 500 && errorMessage.includes('No static resource')) {
      console.warn(`Sizes endpoint not available for product ${productId} - backend may not be deployed`);
      return {
        statusCode: 200,
        message: 'Sizes endpoint not available',
        data: [],
      };
    }
    
    // Các lỗi khác (500, 403, etc.) - trả về empty array để app không crash
    if (status >= 400) {
      console.warn(`Sizes API error ${status} for product ${productId}`);
      return {
        statusCode: 200,
        message: 'No sizes available',
        data: [],
      };
    }
    
    console.error("Get Sizes By Product ID API Error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
      error: err.response?.data?.error,
    });
    
    // Network errors - trả về empty array
    if (err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
      return {
        statusCode: 200,
        message: 'Network error',
        data: [],
      };
    }
    
    // Nếu không phải các trường hợp trên, trả về empty array để an toàn
    return {
      statusCode: 200,
      message: 'No sizes available',
      data: [],
    };
  }
};


export const createSize = async (data: SizeRequest): Promise<SizeSingleResponse> => {
  try {
    const response = await axiosInstance.post('/v1/sizes', data);
    return response.data;
  } catch (err: any) {
    console.error("Create Size API Error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
    });
    
    let errorMessage = 'Không thể tạo size';
    
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    throw new Error(errorMessage);
  }
};

export const updateSize = async (id: number, data: SizeRequest): Promise<SizeSingleResponse> => {
  try {
    const response = await axiosInstance.put(`/v1/sizes/${id}`, data);
    return response.data;
  } catch (err: any) {
    console.error("Update Size API Error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
    });
    
    let errorMessage = 'Không thể cập nhật size';
    
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    throw new Error(errorMessage);
  }
};


export const deleteSize = async (id: number): Promise<SizeDeleteResponse> => {
  try {
    const response = await axiosInstance.delete(`/v1/sizes/${id}`);
    return response.data;
  } catch (err: any) {
    console.error("Delete Size API Error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
    });
    
    let errorMessage = 'Không thể xóa size';
    
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    throw new Error(errorMessage);
  }
};

