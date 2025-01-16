import axios from 'axios';

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

interface TextbookParams {
    department?: string;
    level?: string;
    search?: string;
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

export const auth = {
    login: async (username: string, password: string) => {
        const response = await api.post<TokenResponse>('/token/', { username, password });
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
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
    },
    getProfile: async () => {
        const response = await api.get<ProfileResponse>('/auth/me/');
        return response.data;
    },
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
    getAll: async (params?: TextbookParams) => {
        const response = await api.get<Textbook[]>('/textbooks/', { params });
        return response.data;
    },
    get: async (id: number) => {
        const response = await api.get<Textbook>(`/textbooks/${id}/`);
        return response.data;
    },
};

export interface Order {
    id: number;
    user: {
        id: number;
        username: string;
        email: string;
    };
    reference: string;
    status: string;
    total_amount: number;
    created_at: string;
    items: {
        id: number;
        textbook: Textbook;
        quantity: number;
        price: number;
    }[];
}

interface OrderData {
    textbooks: {
        id: number;
        quantity: number;
    }[];
    reference: string;
    total_amount: number;
}

export const orders = {
    create: async (data: OrderData) => {
        const response = await api.post<Order>('/orders/', data);
        return response.data;
    },
    getAll: async () => {
        const response = await api.get<Order[]>('/orders/');
        return response.data;
    },
};

export default api;