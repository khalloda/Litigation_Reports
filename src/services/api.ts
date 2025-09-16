/**
 * API Service for Litigation Management System
 * 
 * Handles communication with the backend API.
 */

// API Configuration
const API_BASE_URL = ''; // Use relative URLs to go through Vite proxy
const API_TIMEOUT = 5000; // Reduced timeout for faster fallback to mock data

// API Response Types
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
    next_page?: number;
    prev_page?: number;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'lawyer' | 'staff';
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

// Mock API Data (for development)
const mockUsers: User[] = [
  {
    id: 1,
    name: 'Super Admin',
    email: 'admin@litigation.com',
    role: 'super_admin',
    status: 'active',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    last_login_at: '2025-09-16T12:00:00Z'
  },
  {
    id: 2,
    name: 'ناجي رمضان',
    email: 'lawyer@litigation.com',
    role: 'lawyer',
    status: 'active',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    last_login_at: '2025-09-16T11:30:00Z'
  },
  {
    id: 3,
    name: 'Staff User',
    email: 'staff@litigation.com',
    role: 'staff',
    status: 'active',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
];

// API Service Class
class ApiService {
  private baseUrl: string;
  private timeout: number;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
    
    // Load token from localStorage
    this.token = localStorage.getItem('auth_token');
  }

  // Set authentication token
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Get authentication token
  getToken(): string | null {
    return this.token;
  }

  // Make HTTP request
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      defaultHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      
      // Return mock data for development
      return this.getMockResponse<T>(endpoint, options);
    }
  }

  // Get mock response for development
  private getMockResponse<T>(endpoint: string, options: RequestInit): ApiResponse<T> {
    const method = options.method || 'GET';
    
    switch (endpoint) {
      case '/api/health':
        return {
          success: true,
          data: {
            status: 'ok',
            timestamp: new Date().toISOString(),
            server: 'Mock API',
            version: '1.0.0'
          }
        } as ApiResponse<T>;

      case '/api/auth/login':
        if (method === 'POST') {
          const body = JSON.parse(options.body as string || '{}');
          const user = mockUsers.find(u => u.email === body.email);
          
          if (user && body.password === 'admin123') {
            this.setToken('mock-token-123');
            return {
              success: true,
              message: 'Login successful',
              data: {
                user: user,
                token: 'mock-token-123'
              }
            } as ApiResponse<T>;
          } else {
            return {
              success: false,
              error: 'Invalid credentials'
            } as ApiResponse<T>;
          }
        }
        break;

      case '/api/auth/me':
        if (this.token) {
          const user = mockUsers[0]; // Return first user as current user
          return {
            success: true,
            data: user
          } as ApiResponse<T>;
        }
        return {
          success: false,
          error: 'Not authenticated'
        } as ApiResponse<T>;

      case '/api/users':
        if (method === 'GET') {
          return {
            success: true,
            data: mockUsers,
            pagination: {
              current_page: 1,
              per_page: 20,
              total: mockUsers.length,
              total_pages: 1,
              has_next: false,
              has_prev: false
            }
          } as ApiResponse<T>;
        }
        break;

      case '/api/clients':
        return {
          success: true,
          data: [],
          pagination: {
            current_page: 1,
            per_page: 20,
            total: 0,
            total_pages: 0,
            has_next: false,
            has_prev: false
          }
        } as ApiResponse<T>;

      case '/api/cases':
        return {
          success: true,
          data: [],
          pagination: {
            current_page: 1,
            per_page: 20,
            total: 0,
            total_pages: 0,
            has_next: false,
            has_prev: false
          }
        } as ApiResponse<T>;

      case '/api/reports/dashboard':
        return {
          success: true,
          data: {
            total_clients: 0,
            total_cases: 0,
            total_hearings: 0,
            total_invoices: 0,
            recent_activities: [],
            upcoming_hearings: [],
            financial_summary: {
              total_revenue: 0,
              pending_amount: 0,
              paid_amount: 0
            }
          }
        } as ApiResponse<T>;
    }

    return {
      success: false,
      error: 'Endpoint not implemented'
    } as ApiResponse<T>;
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<ApiResponse> {
    this.setToken(null);
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/api/auth/me');
  }

  // User management methods
  async getUsers(page: number = 1, limit: number = 20, filters: any = {}): Promise<ApiResponse<User[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    
    return this.request<User[]>(`/api/users?${params}`);
  }

  async getUser(id: number): Promise<ApiResponse<User>> {
    return this.request<User>(`/api/users/${id}`);
  }

  async createUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: number, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number): Promise<ApiResponse> {
    return this.request(`/api/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Dashboard methods
  async getDashboard(): Promise<ApiResponse<any>> {
    return this.request('/api/reports/dashboard');
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.request('/api/health');
  }
}

// Create and export API service instance
export const apiService = new ApiService();
export default apiService;

// Export types
export type { ApiResponse, User, LoginRequest, LoginResponse };
