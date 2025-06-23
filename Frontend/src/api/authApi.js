//src/api/authApi.js
const API_BASE_URL = 'http://localhost:5000/api';

class AuthApi {
    async makeRequest(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const config = {
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

    async register(userData) {
        return this.makeRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async login(credentials) {
        const response = await this.makeRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        if(response.token) {
            localStorage.setItem('token', response.token);
        }
        return response;
    }

    async logout() {
        try {
            await this.makeRequest('/auth/logout', { 
                method: 'POST' 
            });
        } finally {
            localStorage.removeItem('token');
        }
    }

    async getUserProfile() {
        const response = await this.makeRequest('/auth/me');
        return response.user;
    }

    async requestPasswordReset(email) {
        return this.makeRequest('/auth/request-password-reset', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }

    async resetPassword(data) {
        return this.makeRequest('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async verifyEmail(token) {
        return this.makeRequest(`/auth/verify-email/${token}`);
    }

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    getToken() {
        return localStorage.getItem('token');
    }
}

export const authApi = new AuthApi();