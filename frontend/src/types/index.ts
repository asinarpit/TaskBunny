export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: {
    user: User;
  };
}

export interface TaskListResponse {
  success: boolean;
  data: {
    tasks: Task[];
    currentPage: number;
    totalPages: number;
    totalTasks: number;
  };
}

export interface SingleTaskResponse {
  success: boolean;
  data: Task;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
}

export interface AnalyticsDataPoint {
  date: string;
  day: string;
  count: number;
}

export interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsDataPoint[];
}
