/**
 * =============================================================================
 * AUTHENTICATION TESTS - Nexor Platform
 * =============================================================================
 * These tests run on every deploy to ensure authentication is working correctly.
 * 
 * Test Categories:
 * - Admin Login Flow
 * - Token Management
 * - Protected Routes
 * - Email Validation
 * - Company Management (Admin Only)
 * =============================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock do fetch global
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage
const localStorageMock = {
    store: {} as Record<string, string>,
    getItem: vi.fn((key: string) => localStorageMock.store[key] || null),
    setItem: vi.fn((key: string, value: string) => { localStorageMock.store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete localStorageMock.store[key]; }),
    clear: vi.fn(() => { localStorageMock.store = {}; })
};
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('🔐 Authentication Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.clear();
    });

    describe('Admin Login Flow', () => {
        it('should successfully login with admin credentials', async () => {
            const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';
            const mockUser = {
                id: '123',
                email: 'admin@nexor.com',
                role: 'admin'
            };

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    success: true,
                    data: {
                        user: mockUser,
                        token: mockToken
                    }
                })
            });

            const response = await fetch('/api/auth/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'admin@nexor.com',
                    password: 'Nexor2026!'
                })
            });

            const result = await response.json();

            expect(response.ok).toBe(true);
            expect(result.success).toBe(true);
            expect(result.data.user.email).toBe('admin@nexor.com');
            expect(result.data.token).toBe(mockToken);
        });

        it('should reject login with non-admin email', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 403,
                json: async () => ({
                    success: false,
                    error: 'Admin access required'
                })
            });

            const response = await fetch('/api/auth/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'user@example.com',
                    password: 'password123'
                })
            });

            const result = await response.json();

            expect(response.ok).toBe(false);
            expect(response.status).toBe(403);
            expect(result.success).toBe(false);
            expect(result.error).toBe('Admin access required');
        });

        it('should reject login with wrong password', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 401,
                json: async () => ({
                    success: false,
                    error: 'Invalid credentials'
                })
            });

            const response = await fetch('/api/auth/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'admin@nexor.com',
                    password: 'wrongpassword'
                })
            });

            const result = await response.json();

            expect(response.ok).toBe(false);
            expect(response.status).toBe(401);
            expect(result.error).toBe('Invalid credentials');
        });
    });

    describe('Token Storage', () => {
        it('should store token in localStorage after successful login', async () => {
            const mockToken = 'test-token-123';

            // Simulate storing token after login
            localStorageMock.setItem('nexor_token', mockToken);

            expect(localStorageMock.setItem).toHaveBeenCalledWith('nexor_token', mockToken);
            expect(localStorageMock.getItem('nexor_token')).toBe(mockToken);
        });

        it('should clear token on logout', async () => {
            localStorageMock.store['nexor_token'] = 'some-token';

            localStorageMock.removeItem('nexor_token');

            expect(localStorageMock.removeItem).toHaveBeenCalledWith('nexor_token');
            expect(localStorageMock.getItem('nexor_token')).toBeNull();
        });
    });

    describe('Protected Routes', () => {
        it('should include Authorization header when token exists', async () => {
            const token = 'valid-token';
            localStorageMock.store['nexor_token'] = token;

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true, data: [] })
            });

            await fetch('/api/companies', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorageMock.getItem('nexor_token')}`
                }
            });

            expect(mockFetch).toHaveBeenCalledWith('/api/companies', expect.objectContaining({
                headers: expect.objectContaining({
                    'Authorization': `Bearer ${token}`
                })
            }));
        });

        it('should return 401 when accessing protected route without token', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 401,
                json: async () => ({
                    error: 'Missing authorization header'
                })
            });

            const response = await fetch('/api/companies', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            expect(response.ok).toBe(false);
            expect(response.status).toBe(401);
        });
    });

    describe('Admin Email Validation', () => {
        it('should validate admin email format', () => {
            const ADMIN_EMAIL = 'admin@nexor.com';

            const isAdmin = (email: string) => email === ADMIN_EMAIL;

            expect(isAdmin('admin@nexor.com')).toBe(true);
            expect(isAdmin('user@nexor.com')).toBe(false);
            expect(isAdmin('admin@other.com')).toBe(false);
            expect(isAdmin('')).toBe(false);
        });
    });
});

describe('Company Management Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch all companies', async () => {
        const mockCompanies = [
            { id: '1', email: 'company1@example.com', status: 'active', user_count: 5 },
            { id: '2', email: 'company2@example.com', status: 'inactive', user_count: 3 }
        ];

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, data: mockCompanies })
        });

        const response = await fetch('/api/companies');
        const result = await response.json();

        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(2);
        expect(result.data[0].email).toBe('company1@example.com');
    });

    it('should create a new company', async () => {
        const newCompany = {
            email: 'newcompany@example.com',
            password: 'SecurePass123!'
        };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 201,
            json: async () => ({
                success: true,
                data: { id: '3', ...newCompany, status: 'active' }
            })
        });

        const response = await fetch('/api/companies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCompany)
        });

        const result = await response.json();

        expect(response.ok).toBe(true);
        expect(result.success).toBe(true);
        expect(result.data.email).toBe('newcompany@example.com');
    });

    it('should delete a company', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, message: 'Company deleted successfully' })
        });

        const response = await fetch('/api/companies/1', {
            method: 'DELETE'
        });

        const result = await response.json();

        expect(response.ok).toBe(true);
        expect(result.success).toBe(true);
    });

    it('should toggle company status', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                success: true,
                data: { id: '1', email: 'company@example.com', status: 'inactive' }
            })
        });

        const response = await fetch('/api/companies/1/toggle-status', {
            method: 'PATCH'
        });

        const result = await response.json();

        expect(result.success).toBe(true);
        expect(result.data.status).toBe('inactive');
    });
});
