import { LoginRequest, LoginResponse } from '@/types';
import axiosInstance from '@/utils/axiosInstance';

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'Login failed');
  }
};
