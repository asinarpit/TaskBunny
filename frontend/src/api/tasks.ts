import API from './axios';
import { TaskListResponse, SingleTaskResponse, AnalyticsResponse } from '../types';

export interface GetTasksParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const getTasks = async (params: GetTasksParams = {}): Promise<TaskListResponse> => {
  const response = await API.get<TaskListResponse>('/tasks', { params });
  return response.data;
};

export const getTaskById = async (id: string): Promise<SingleTaskResponse> => {
  const response = await API.get<SingleTaskResponse>(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (data: { title: string; description?: string }): Promise<SingleTaskResponse> => {
  const response = await API.post<SingleTaskResponse>('/tasks', data);
  return response.data;
};

export const updateTask = async (
  id: string,
  data: { title?: string; description?: string; status?: 'pending' | 'completed' }
): Promise<SingleTaskResponse> => {
  const response = await API.put<SingleTaskResponse>(`/tasks/${id}`, data);
  return response.data;
};

export const updateTaskStatus = async (id: string, status: 'pending' | 'completed'): Promise<SingleTaskResponse> => {
  const response = await API.patch<SingleTaskResponse>(`/tasks/${id}/status`, { status });
  return response.data;
};

export const deleteTask = async (id: string): Promise<{ success: boolean; data: { id: string } }> => {
  const response = await API.delete<{ success: boolean; data: { id: string } }>(`/tasks/${id}`);
  return response.data;
};

export const getTaskAnalytics = async (timezone?: string): Promise<AnalyticsResponse> => {
  const response = await API.get<AnalyticsResponse>('/tasks/analytics', {
    params: { timezone },
  });
  return response.data;
};
