import api from './axios';
import { ApiResponse, User } from '@/types';

interface AuthResponse { user: User; token: string; }

export const authApi = {
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post<ApiResponse<AuthResponse>>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', data),

  getMe: () =>
    api.get<ApiResponse<{ user: User }>>('/auth/me'),
};
