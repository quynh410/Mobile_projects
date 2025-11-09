import { ColorDeleteResponse, ColorListResponse, ColorRequest, ColorSingleResponse } from '@/types/color';
import axiosInstance from '@/utils/axiosInstance';

export const getAllColors = async (): Promise<ColorListResponse> => {
  try {
    const response = await axiosInstance.get('/v1/colors');
    return response.data;
  } catch (err: any) {
    console.error("Get All Colors API Error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
    });
    
    let errorMessage = 'Không thể lấy danh sách colors';
    
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    throw new Error(errorMessage);
  }
};

export const getColorById = async (id: number): Promise<ColorSingleResponse> => {
  try {
    const response = await axiosInstance.get(`/v1/colors/${id}`);
    return response.data;
  } catch (err: any) {
    console.error("Get Color By ID API Error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
    });
    
    let errorMessage = 'Không thể lấy thông tin color';
    
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    throw new Error(errorMessage);
  }
};

export const getColorsByProductId = async (productId: number): Promise<ColorListResponse> => {
  try {
    const response = await axiosInstance.get(`/v1/colors/product/${productId}`);
    return response.data;
  } catch (err: any) {
    const status = err.response?.status;
    const errorMsg = err.response?.data?.error || '';
    
    if (status === 404) {
      console.log(`Product ${productId} has no colors (404)`);
      return {  
        statusCode: 200,
        message: 'No colors found for this product',
        data: [],
      };
    }
    
    if (status === 500 && errorMsg.includes('No static resource')) {
      console.warn(`Colors endpoint not available for product ${productId} - backend may not be deployed`);
      return {
        statusCode: 200,
        message: 'Colors endpoint not available',
        data: [],
      };
    }
    
    if (status >= 400) {
      console.warn(`Colors API error ${status} for product ${productId}`);
      return {
        statusCode: 200,
        message: 'No colors available',
        data: [],
      };
    }
    
    console.error("Get Colors By Product ID API Error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
      error: err.response?.data?.error,
    });
    
    if (err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
      return {
        statusCode: 200,
        message: 'Network error',
        data: [],
      };
    }
    
    return {
      statusCode: 200,
      message: 'No colors available',
      data: [],
    };
  }
};

export const createColor = async (data: ColorRequest): Promise<ColorSingleResponse> => {
  try {
    const response = await axiosInstance.post('/v1/colors', data);
    return response.data;
  } catch (err: any) {
    console.error("Create Color API Error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
    });
    
    let errorMessage = 'Không thể tạo color';
    
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    throw new Error(errorMessage);
  }
};

export const updateColor = async (id: number, data: ColorRequest): Promise<ColorSingleResponse> => {
  try {
    const response = await axiosInstance.put(`/v1/colors/${id}`, data);
    return response.data;
  } catch (err: any) {
    console.error("Update Color API Error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
    });
    
    let errorMessage = 'Không thể cập nhật color';
    
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    throw new Error(errorMessage);
  }
};

export const deleteColor = async (id: number): Promise<ColorDeleteResponse> => {
  try {
    const response = await axiosInstance.delete(`/v1/colors/${id}`);
    return response.data;
  } catch (err: any) {
    console.error("Delete Color API Error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
    });
    
    let errorMessage = 'Không thể xóa color';
    
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    throw new Error(errorMessage);
  }
};

