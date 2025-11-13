
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: 'MALE' | 'FEMALE';
  address?: string;
  avatarUrl?: string;
  confirmPassword?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  statusCode: number;
  message?: string;
  data?: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface LoginResponse {
  statusCode: number;
  message?: string;
  data?: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

// Legacy types for backward compatibility
export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: {
    [key: string]: string[];
  };
}

export interface UpdateProfileRequest {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  gender?: 'MALE' | 'FEMALE';
  phoneNumber?: string;
  address?: string;
  avatarUrl?: string;
  avatar?: any; // File/FormData for upload
}

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  gender?: 'MALE' | 'FEMALE';
  avatarUrl?: string;
  address?: string;
}

