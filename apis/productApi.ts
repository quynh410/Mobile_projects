import { ProductPageResponse, ProductResponse } from '@/types/product';
import axiosInstance from '@/utils/axiosInstance';

export const getAllProducts = async (
  page: number = 0,
  size: number = 10,
  sortBy: string = 'productId',
  direction: string = 'ASC'
): Promise<ProductPageResponse> => {
  try {
    const response = await axiosInstance.get('/v1/products', {
      params: {
        page,
        size,
        sortBy,
        direction,
      },
    });
    console.log("11111111111111", response);
    
    return response.data;
  } catch (err: any) {
    console.error("Get Products API Error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
    });
    
    let errorMessage = 'Không thể lấy danh sách sản phẩm';
    
    if (err.response?.data) {
      if (err.response.data.error) {
        errorMessage = err.response.data.error;
      } else if (err.response.data.message) {
        errorMessage = err.response.data.message;
      }
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Get product by ID
export const getProductById = async (id: number): Promise<ProductResponse> => {
  try {
    const response = await axiosInstance.get(`/v1/products/${id}`);
    return response.data.data;
  } catch (err: any) {
    console.error("Get Product API Error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
    });
    
    let errorMessage = 'Không thể lấy thông tin sản phẩm';
    
    if (err.response?.data) {
      if (err.response.data.error) {
        errorMessage = err.response.data.error;
      } else if (err.response.data.message) {
        errorMessage = err.response.data.message;
      }
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Get products by category
export const getProductsByCategory = async (
  categoryId: number,
  page: number = 0,
  size: number = 10
): Promise<ProductPageResponse> => {
  try {
    const response = await axiosInstance.get(`/v1/products/category/${categoryId}`, {
      params: {
        page,
        size,
      },
    });
    return response.data;
  } catch (err: any) {
    console.error("Get Products by Category API Error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
    });
    
    let errorMessage = 'Không thể lấy sản phẩm theo danh mục';
    
    if (err.response?.data) {
      if (err.response.data.error) {
        errorMessage = err.response.data.error;
      } else if (err.response.data.message) {
        errorMessage = err.response.data.message;
      }
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Search products
export const searchProducts = async (
  keyword: string,
  page: number = 0,
  size: number = 10
): Promise<ProductPageResponse> => {
  try {
    const response = await axiosInstance.get('/v1/products/search', {
      params: {
        keyword,
        page,
        size,
      },
    });
    return response.data;
  } catch (err: any) {
    console.error("Search Products API Error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
    });
    
    let errorMessage = 'Không thể tìm kiếm sản phẩm';
    
    if (err.response?.data) {
      if (err.response.data.error) {
        errorMessage = err.response.data.error;
      } else if (err.response.data.message) {
        errorMessage = err.response.data.message;
      }
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    throw new Error(errorMessage);
  }
};

