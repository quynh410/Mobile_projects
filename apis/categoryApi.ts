import { CategoryListResponse, CategoryPageResponse, CategoryResponse } from '@/types/category';
import axiosInstance from '@/utils/axiosInstance';

export const getAllCategories = async (
  page: number = 0,
  size: number = 10
): Promise<CategoryPageResponse> => {
  try {
    const response = await axiosInstance.get('/v1/categories', {
      params: {
        page,
        size,
      },
    });
    return {
      statusCode: response.status,
      data: {
        content: response.data.content || [],
        totalElements: response.data.totalElements || 0,
        totalPages: response.data.totalPages || 0,
        size: response.data.size || size,
        number: response.data.number || page,
      },
    };
  } catch (err: any) {
    console.error("Get Categories API Error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
    });
    
    let errorMessage = 'Không thể lấy danh sách danh mục';
    
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

export const getAllCategoriesNoPaging = async (): Promise<CategoryListResponse> => {
  try {
    const response = await axiosInstance.get('/v1/categories/no-paging');
    return { statusCode: response.status, data: response.data };
  } catch (err: any) {
    console.error("Get All Categories (No Paging) API Error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
    });
    
    let errorMessage = 'Không thể lấy danh sách danh mục';
    
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

export const getCategoryById = async (id: number): Promise<CategoryResponse> => {
  try {
    const response = await axiosInstance.get(`/v1/categories/${id}`);
    return response.data;
  } catch (err: any) {
    console.error("Get Category API Error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
    });
    
    let errorMessage = 'Không thể lấy thông tin danh mục';
    
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

export const createCategory = async (
  categoryName: string,
  description?: string,
  image?: { uri: string; type?: string; name?: string } | File | Blob,
  removeBackground: boolean = false
): Promise<CategoryResponse> => {
  try {
    const formData = new FormData();
    formData.append('categoryName', categoryName);
    
    if (description) {
      formData.append('description', description);
    }
    
    if (image) {
      // Handle React Native image object with uri property
      if (typeof image === 'object' && 'uri' in image) {
        const imageFile = {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: image.name || 'image.jpg',
        };
        formData.append('image', imageFile as any);
      } else {
        // Handle File or Blob (for web)
        formData.append('image', image);
      }
    }
    
    formData.append('removeBackground', removeBackground.toString());
    
    // Axios interceptor will handle removing Content-Type for FormData
    const response = await axiosInstance.post('/v1/categories', formData);
    
    return response.data;
  } catch (err: any) {
    console.error("Create Category API Error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
    });
    
    let errorMessage = 'Không thể tạo danh mục';
    
    if (err.response?.data) {
      if (err.response.data.error) {
        errorMessage = err.response.data.error;
      } else if (err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (typeof err.response.data === 'string') {
        errorMessage = err.response.data;
      }
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    throw new Error(errorMessage);
  }
};

export const updateCategory = async (
  id: number,
  categoryName: string,
  description?: string,
  image?: { uri: string; type?: string; name?: string } | File | Blob,
  removeBackground: boolean = false
): Promise<CategoryResponse> => {
  try {
    const formData = new FormData();
    formData.append('categoryName', categoryName);
    
    if (description) {
      formData.append('description', description);
    }
    
    if (image) {
      // Handle React Native image object with uri property
      if (typeof image === 'object' && 'uri' in image) {
        const imageFile = {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: image.name || 'image.jpg',
        };
        formData.append('image', imageFile as any);
      } else {
        // Handle File or Blob (for web)
        formData.append('image', image);
      }
    }
    
    formData.append('removeBackground', removeBackground.toString());
    
    // Axios interceptor will handle removing Content-Type for FormData
    const response = await axiosInstance.put(`/v1/categories/${id}`, formData);
    
    return response.data;
  } catch (err: any) {
    console.error("Update Category API Error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
    });
    
    let errorMessage = 'Không thể cập nhật danh mục';
    
    if (err.response?.data) {
      if (err.response.data.error) {
        errorMessage = err.response.data.error;
      } else if (err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (typeof err.response.data === 'string') {
        errorMessage = err.response.data;
      }
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    throw new Error(errorMessage);
  }
};
export const deleteCategory = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/v1/categories/${id}`);
  } catch (err: any) {
    console.error("Delete Category API Error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
    });
    
    let errorMessage = 'Không thể xóa danh mục';
    
    if (err.response?.data) {
      if (err.response.data.error) {
        errorMessage = err.response.data.error;
      } else if (err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (typeof err.response.data === 'string') {
        errorMessage = err.response.data;
      }
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    throw new Error(errorMessage);
  }
};

