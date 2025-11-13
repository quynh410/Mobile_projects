import { UpdateProfileRequest, UserDTO } from '@/types/auth';
import axiosInstance from '@/utils/axiosInstance';

export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get('/users');
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'Failed to get users');
  }
};

export const getCurrentProfile = async (): Promise<UserDTO> => {
  try {
    const response = await axiosInstance.get('/v1/user/profile');
    return response.data;
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || 'Không thể lấy thông tin profile';
    throw new Error(errorMessage);
  }
};

export const updateProfile = async (
  userId: number,
  data: UpdateProfileRequest
): Promise<UserDTO> => {
  try {
    const formData = new FormData();
    
    if (data.fullName) {
      formData.append('fullName', data.fullName);
    }
    if (data.firstName) {
      formData.append('firstName', data.firstName);
    }
    if (data.lastName) {
      formData.append('lastName', data.lastName);
    }
    if (data.gender) {
      formData.append('gender', data.gender);
    }
    if (data.phoneNumber) {
      formData.append('phoneNumber', data.phoneNumber);
    }
    if (data.address) {
      formData.append('address', data.address);
    }
    if (data.avatarUrl) {
      formData.append('avatarUrl', data.avatarUrl);
    }
    
    if (data.avatar) {
      formData.append('avatar', {
        uri: data.avatar.uri,
        type: data.avatar.type || 'image/jpeg',
        name: data.avatar.fileName || 'avatar.jpg',
      } as any);
    }

    const response = await axiosInstance.put(
      `/v1/user/profile/${userId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  } catch (err: any) {
    let errorMessage = 'Không thể cập nhật profile';
    
    if (err.response?.data) {
      if (typeof err.response.data === 'string') {
        errorMessage = err.response.data;
      } else if (err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.response.data.error) {
        errorMessage = err.response.data.error;
      }
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    throw new Error(errorMessage);
  }
};

