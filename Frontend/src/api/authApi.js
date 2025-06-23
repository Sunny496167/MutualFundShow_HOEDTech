//srec/api/authApi.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface User {
    id: string;
    email: string;
    name: string;
    isEmailVerified: boolean;
}

export interface LoginRequest{
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user?: User;
    token?: string;
}

export interface PasswordResetRequest  {
    token: string;
}

export interface ResetPasswordRequest  {
    token: string;
    newPassword: string;
}


class AuthApi {
    private async makeRequest(endpoint: String, options: RequestInit = {}): Promise<any> {
        const token = localStorage.getItem('token');
        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers,
            },
            ...options,
        };
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'An error occurred');
        }
        return data;
    }

    async register(userData: RegisterRequest): Promise<AuthResponse> {
        return this.makeRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = this.makeRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        if(response.token) {
            localStorage.setItem('token', response.token);
        }
        return response;
    }

    async logout(): Promise<void> {
        try {
            await this.makeRequest('/auth/logout', { 
                method: 'POST' 
            });
        }finally {
            localStorage.removeItem('token');
        }
    }

    async getUserProfile(): Promise<User> {
        const response = await this.makeRequest('/auth/me');
        return response.user;
    }

    async requestPasswordReset(email: string): Promise<{message: string}> {
        return this.makeRequest('/auth/request-password-reset', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }

    async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
        return this.makeRequest('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async verifyEmail(token: string): Promise<{ message: string }> {
        return this.makeRequest(`/auth/verify-email/${token}`);
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }
}

export const authApi = new AuthApi();
