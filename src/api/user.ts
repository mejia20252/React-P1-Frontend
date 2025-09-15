// src/api/user.ts

import axiosInstance from '../app/axiosInstance';
import type { CustomUserResponse, CreateUserPayload } from '../types/user';


// ✅ Fetch all users
export const fetchUsers = async (): Promise<CustomUserResponse[]> => {
  const response = await axiosInstance.get<CustomUserResponse[]>('/usuarios/');
  return response.data;
};

// ✅ Fetch single user by ID
export const fetchUser = async (id: number): Promise<CustomUserResponse> => {
  const response = await axiosInstance.get<CustomUserResponse>(`/usuarios/${id}`);
  return response.data;
};

// ✅ Create new user (with dynamic fields)
export const createUser = async (payload: CreateUserPayload): Promise<CustomUserResponse> => {
  const response = await axiosInstance.post<CustomUserResponse>('/usuarios/', payload);
  return response.data;
};

// ✅ Update existing user (partial update allowed)
export const updateUser = async (
  id: number,
  payload: Partial<CreateUserPayload>
): Promise<CustomUserResponse> => {
  const response = await axiosInstance.put<CustomUserResponse>(`/usuarios/${id}`, payload);
  return response.data;
};

// ✅ Delete user
export const deleteUser = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/usuarios/${id}/`);
};