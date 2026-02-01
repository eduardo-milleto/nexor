const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface RequestConfig extends RequestInit {
    params?: Record<string, string>;
}

class ApiClient {
    private baseUrl = API_URL;

    private getToken(): string | null {
        return localStorage.getItem('nexor_token');
    }

    private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
        const { params, ...init } = config;

        let url = `${this.baseUrl}${endpoint}`;

        if (params) {
            const searchParams = new URLSearchParams(params);
            url += `?${searchParams.toString()}`;
        }

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...init.headers,
        };

        const token = this.getToken();
        if (token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            ...init,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Request failed' }));
            throw new Error(error.error || 'Request failed');
        }

        return response.json();
    }

    async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET', params });
    }

    async post<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async patch<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }

    async health(): Promise<{ status: string; database: string; timestamp: string }> {
        return this.get('/health');
    }
}

export const apiClient = new ApiClient();
export default apiClient;
