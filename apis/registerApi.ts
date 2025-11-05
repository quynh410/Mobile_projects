import { RegisterRequest, RegisterResponse } from '@/types';
import axiosInstance from '@/utils/axiosInstance';

export const registerUser = async (data: RegisterRequest): Promise<RegisterResponse> => {
  try {
    // Chuẩn bị request body theo đúng format backend yêu cầu
    const requestBody = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      gender: data.gender,
      ...(data.address && { address: data.address }),
      ...(data.avatarUrl && { avatarUrl: data.avatarUrl }),
    };
    
    console.log("Sending register request:", requestBody);
    
    const res = await axiosInstance.post('/auth/register', requestBody);
    return res.data;
  } catch (err: any) {
    console.error("Register API Error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.response?.data?.message,
      errors: err.response?.data?.errors,
    });
        let errorMessage = 'Đăng ký thất bại';
    
    if (err.response?.data) {
      if (err.response.data.error) {
        errorMessage = err.response.data.error;
      } else if (err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.response.data.errors) {
        const errors = Object.values(err.response.data.errors).flat();
        errorMessage = errors.join(', ') || 'Validation failed';
      }
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    throw new Error(errorMessage);
  }
};

