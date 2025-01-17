import axios from 'axios';
// Remove AxiosError import since it's not used and not available in this version
// import type { AxiosError } from 'axios'; 

const API_URL = 'http://localhost:8000/api/v1';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return token ? {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    } : {
        'Content-Type': 'application/json'
    };
};

// Add auth headers to each request
api.interceptors.request.use((config) => {
    config.headers = {
        ...config.headers,
        ...getAuthHeaders()
    };
    return config;
});

interface UserData {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: 'student' | 'staff' | 'admin';
    department: string;
    level: string;
    matric_number: string;
    phone_number: string;
}

interface TokenResponse {
    access: string;
    refresh: string;
    user: ProfileResponse;
}

export interface ProfileResponse {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: 'student' | 'staff' | 'admin';
    department: string;
    level: string;
    matric_number: string;
    phone_number: string;
}

interface ApiError {
    response?: {
        status: number;
    };
}

export const auth = {
    login: async (username: string, password: string) => {
        const response = await api.post<TokenResponse>('/token/', { username, password });
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        document.cookie = `access_token=${response.data.access}; path=/`;
        return response.data;
    },
    register: async (userData: UserData) => {
        const response = await api.post<ProfileResponse>('/auth/register/', userData);
        return response.data;
    },
    refreshToken: async () => {
        const refresh = localStorage.getItem('refresh_token');
        const response = await api.post<TokenResponse>('/token/refresh/', { refresh });
        localStorage.setItem('access_token', response.data.access);
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        
        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
        }
    },
    getProfile: async () => {
        try {
            const response = await api.get<ProfileResponse>('/auth/me/');
            return response.data;
        } catch (error: unknown) {
            if ((error as ApiError)?.response?.status === 401) {
                auth.logout();
            }
            throw error;
        }
    },
    isAdmin: async () => {
        try {
            const profile = await auth.getProfile();
            return profile.role === 'admin';
        } catch {
            return false;
        }
    }
};

export interface Textbook {
    id: number;
    title: string;
    course_code: string;
    department: {
        id: number;
        name: string;
        code: string;
    };
    level: string;
    price: number;
    description: string;
    stock: number;
    image: string | null;
    is_popular: boolean;
    is_new: boolean;
}

export const textbooks = {
    getAll: async (params?: { department?: string; level?: string; search?: string }) => {
        const response = await api.get<Textbook[]>('/textbooks/', { params });
        return response.data;
    },
    get: async (id: number) => {
        const response = await api.get<Textbook>(`/textbooks/${id}/`);
        return response.data;
    },
    getFilters: async () => {
        const response = await api.get<{ departments: string[]; levels: string[] }>('/textbooks/filters/');
        return response.data;
    },
    create: async (data: Partial<Textbook>) => {
        const response = await api.post<Textbook>('/textbooks/', data);
        return response.data;
    },
    update: async (id: number, data: Partial<Textbook>) => {
        const response = await api.put<Textbook>(`/textbooks/${id}/`, data);
        return response.data;
    },
    delete: async (id: number) => {
        await api.delete(`/textbooks/${id}/`);
    },
};

export interface Order {
    id: number;
    reference: string;
    status: string;
    total_amount: number;
    created_at: string;
    student_name: string;
    student_email: string;
    matric_number: string;
    department: string;
    level: string;
    phone_number: string;
    items: {
        id: number;
        textbook: Textbook;
        quantity: number;
        price: number;
    }[];
}

interface OrderData {
    items: {
        textbook: number;
        quantity: number;
        price: number;
    }[];
    reference: string;
    total_amount: number;
    student_name: string;
    student_email: string;
    matric_number: string;
    department: string;
    level: string;
    phone_number: string;
}

export const orders = {
    create: async (data: OrderData) => {
        try {
            console.log('Sending order data:', data);
            const response = await api.post<Order>('/orders/', {
                ...data,
                status: 'completed'
            });
            console.log('Order creation response:', response.data);
            return { success: true, data: response.data };
        } catch (error: unknown) {
            const err = error as { response?: { data?: { detail: string } } };
            const errorMessage = err.response?.data?.detail || 'Failed to create order';
            console.error('Order creation error:', errorMessage);
            return { 
                success: false, 
                error: errorMessage
            };
        }
    },
    getAll: async () => {
        const response = await api.get<Order[]>('/orders/');
        return response.data;
    },
    getByReference: async (reference: string) => {
        const response = await api.get<Order>(`/orders/${reference}/`);
        return response.data;
    },
};

export default api;