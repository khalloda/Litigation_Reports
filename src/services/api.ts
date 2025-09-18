/**
 * API Service for Litigation Management System
 *
 * Handles communication with the backend API.
 */

// API Configuration
const API_BASE_URL = 'http://localhost:8000/api'; // Use PHP API server - hardcoded to bypass env issues
const API_TIMEOUT = 10000; // Increased timeout for real API calls

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
    last_login_at: '2025-09-16T12:00:00Z',
  },
  {
    id: 2,
    name: 'ناجي رمضان',
    email: 'lawyer@litigation.com',
    role: 'lawyer',
    status: 'active',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    last_login_at: '2025-09-16T11:30:00Z',
  },
  {
    id: 3,
    name: 'Staff User',
    email: 'staff@litigation.com',
    role: 'staff',
    status: 'active',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
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
    this.loadToken();
  }

  private loadToken() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  // Set authentication token
  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  // Get authentication token
  getToken(): string | null {
    return this.token;
  }

  // Refresh token from localStorage
  refreshToken() {
    this.loadToken();
  }

  // Make HTTP request
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    // Refresh token from localStorage before making request
    this.refreshToken();

    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      defaultHeaders['Authorization'] = `Bearer ${this.token}`;
      console.log('API request with token:', url, 'Token:', this.token.substring(0, 20) + '...');
    } else {
      console.warn('No authentication token available for request:', url);
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

      // Check if response is HTML (error page)
      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('API request failed: Non-JSON response', {
          url,
          status: response.status,
          contentType,
          response: text.substring(0, 200),
        });
        throw new Error(`API request failed: Expected JSON but got ${contentType}`);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);

      // For development fallback to mock data only for options endpoints
      if (endpoint.includes('/options')) {
        return this.getMockResponse<T>(endpoint, options);
      }

      // For other endpoints, return proper error response
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      } as ApiResponse<T>;
    }
  }

  // Get mock response for development
  private getMockResponse<T>(endpoint: string, options: RequestInit): ApiResponse<T> {
    const method = options.method || 'GET';

    switch (endpoint) {
      case '/health':
        return {
          success: true,
          data: {
            status: 'ok',
            timestamp: new Date().toISOString(),
            server: 'Mock API',
            version: '1.0.0',
          },
        } as ApiResponse<T>;

      case '/auth/login':
        if (method === 'POST') {
          const body = JSON.parse((options.body as string) || '{}');
          const user = mockUsers.find((u) => u.email === body.email);

          if (user && body.password === 'admin123') {
            this.setToken('mock-token-123');
            return {
              success: true,
              message: 'Login successful',
              data: {
                user: user,
                token: 'mock-token-123',
              },
            } as ApiResponse<T>;
          } else {
            return {
              success: false,
              error: 'Invalid credentials',
            } as ApiResponse<T>;
          }
        }
        break;

      case '/auth/me':
        if (this.token) {
          const user = mockUsers[0]; // Return first user as current user
          return {
            success: true,
            data: user,
          } as ApiResponse<T>;
        }
        return {
          success: false,
          error: 'Not authenticated',
        } as ApiResponse<T>;

      case '/users':
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
              has_prev: false,
            },
          } as ApiResponse<T>;
        }
        break;

      case '/clients':
        return {
          success: true,
          data: {
            data: [],
            pagination: {
              current_page: 1,
              per_page: 20,
              total: 0,
              total_pages: 0,
              has_next: false,
              has_prev: false,
            },
          },
        } as ApiResponse<T>;

      case '/cases':
        return {
          success: true,
          data: {
            data: [],
            pagination: {
              current_page: 1,
              per_page: 20,
              total: 0,
              total_pages: 0,
              has_next: false,
              has_prev: false,
            },
          },
        } as ApiResponse<T>;

      case '/hearings':
        return {
          success: true,
          data: {
            data: [],
            pagination: {
              current_page: 1,
              per_page: 20,
              total: 0,
              total_pages: 0,
              has_next: false,
              has_prev: false,
            },
          },
        } as ApiResponse<T>;

      case '/reports/dashboard':
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
              paid_amount: 0,
            },
          },
        } as ApiResponse<T>;

      case '/clients/options':
        return {
          success: true,
          data: {
            status: {
              active: 'نشط',
              inactive: 'غير نشط',
              suspended: 'معلق',
              terminated: 'منتهي',
            },
            type: {
              individual: 'فرد',
              company: 'شركة',
              government: 'حكومي',
              organization: 'مؤسسة',
            },
            cash_pro_bono: {
              cash: 'نقدي',
              probono: 'مجاني',
              installment: 'أقساط',
            },
          },
        } as ApiResponse<T>;

      case '/cases/options':
        return {
          success: true,
          data: {
            status: {
              active: 'نشطة',
              closed: 'مغلقة',
              suspended: 'معلقة',
              appealed: 'مستأنفة',
            },
            type: {
              civil: 'مدنية',
              criminal: 'جنائية',
              commercial: 'تجارية',
              administrative: 'إدارية',
              family: 'أحوال شخصية',
            },
            priority: {
              high: 'عالية',
              medium: 'متوسطة',
              low: 'منخفضة',
            },
          },
        } as ApiResponse<T>;

      case '/hearings/options':
        return {
          success: true,
          data: {
            status: {
              scheduled: 'مجدولة',
              completed: 'مكتملة',
              postponed: 'مؤجلة',
              cancelled: 'ملغاة',
            },
            type: {
              initial: 'أولى',
              follow_up: 'متابعة',
              final: 'نهائية',
              appeal: 'استئناف',
            },
            outcome: {
              for: 'لصالح',
              against: 'ضد',
              pending: 'معلقة',
              settled: 'تسوية',
            },
          },
        } as ApiResponse<T>;
    }

    return {
      success: false,
      error: 'Endpoint not implemented',
    } as ApiResponse<T>;
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<ApiResponse> {
    this.setToken(null);
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me');
  }

  // User management methods
  async getUsers(
    page: number = 1,
    limit: number = 20,
    filters: any = {}
  ): Promise<ApiResponse<User[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    return this.request<User[]>(`/users?${params}`);
  }

  async getUser(id: number): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`);
  }

  async createUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: number, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number): Promise<ApiResponse> {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Dashboard methods
  async getDashboard(): Promise<ApiResponse<any>> {
    return this.request('/reports/dashboard');
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.request('/health');
  }

  // Generic HTTP methods
  async get(endpoint: string): Promise<ApiResponse<any>> {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint: string, data?: any): Promise<ApiResponse<any>> {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put(endpoint: string, data?: any): Promise<ApiResponse<any>> {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch(endpoint: string, data?: any): Promise<ApiResponse<any>> {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(endpoint: string): Promise<ApiResponse<any>> {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Create and export API service instance
export const apiService = new ApiService();
export default apiService;

// Export types
export type { ApiResponse, User, LoginRequest, LoginResponse };
