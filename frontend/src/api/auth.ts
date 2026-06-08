import API from './axios';
import { AuthResponse, ProfileResponse } from '../types';

export const registerUser = async (data: Record<string, string>): Promise<AuthResponse> => {
  const response = await API.post<AuthResponse>('/auth/register', data);
  return response.data;
};

export const loginUser = async (data: Record<string, string>): Promise<AuthResponse> => {
  const response = await API.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await API.get<ProfileResponse>('/auth/profile');
  return response.data;
};
