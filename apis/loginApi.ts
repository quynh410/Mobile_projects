import { LoginRequest, LoginResponse } from '@/types';
import axiosInstance from '@/utils/axiosInstance';

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  } catch (err: any) {
    console.error("Login API Error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
      error: err.response?.data?.error,
    });
    
    // Lấy thông báo lỗi chi tiết từ backend
    let errorMessage = 'Đăng nhập thất bại';
    
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
