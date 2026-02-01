const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface AuthResponse {
    user: {
        id: string;
        email: string;
    };
    session: {
        access_token: string;
        refresh_token: string;
    };
    isAdmin: boolean;
}

export interface ApiError {
    error: string;
}

class AuthService {
    private baseUrl = `${API_URL}/api/auth`;

    private getHeaders(token?: string): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    async signUp(email: string, password: string): Promise<AuthResponse> {
        const response = await fetch(`${this.baseUrl}/signup`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error: ApiError = await response.json();
            throw new Error(error.error);
        }

        return response.json();
    }

    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await fetch(`${this.baseUrl}/login`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error: ApiError = await response.json();
            throw new Error(error.error);
        }

        const result = await response.json();

        // Store session
        if (result.data?.session) {
            localStorage.setItem('nexor_token', result.data.session.access_token);
            localStorage.setItem('nexor_user', JSON.stringify(result.data.user));
            localStorage.setItem('nexor_is_admin', String(result.data.isAdmin));
        }

        return result.data;
    }

    async adminLogin(email: string, password: string): Promise<AuthResponse> {
        const response = await fetch(`${this.baseUrl}/admin/login`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error: ApiError = await response.json();
            throw new Error(error.error);
        }

        const result = await response.json();

        // Store session
        if (result.data?.session) {
            localStorage.setItem('nexor_token', result.data.session.access_token);
            localStorage.setItem('nexor_user', JSON.stringify(result.data.user));
            localStorage.setItem('nexor_is_admin', 'true');
        }

        return result.data;
    }

    async logout(): Promise<void> {
        const token = this.getToken();

        if (token) {
            try {
                await fetch(`${this.baseUrl}/logout`, {
                    method: 'POST',
                    headers: this.getHeaders(token),
                });
            } catch (error) {
                console.error('Logout error:', error);
            }
        }

        // Clear local storage
        localStorage.removeItem('nexor_token');
        localStorage.removeItem('nexor_user');
        localStorage.removeItem('nexor_is_admin');
    }

    async forgotPassword(email: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/forgot-password`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const error: ApiError = await response.json();
            throw new Error(error.error);
        }
    }

    getToken(): string | null {
        return localStorage.getItem('nexor_token');
    }

    getUser(): { id: string; email: string } | null {
        const user = localStorage.getItem('nexor_user');
        return user ? JSON.parse(user) : null;
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    isAdmin(): boolean {
        return localStorage.getItem('nexor_is_admin') === 'true';
    }
}

export const authService = new AuthService();
export default authService;
