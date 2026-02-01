import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '@/services/auth.service';

describe('AuthService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.getItem = vi.fn();
        localStorage.setItem = vi.fn();
        localStorage.removeItem = vi.fn();
    });

    describe('getToken', () => {
        it('should return token from localStorage', () => {
            const mockToken = 'test-token';
            (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(mockToken);

            const token = authService.getToken();

            expect(localStorage.getItem).toHaveBeenCalledWith('nexor_token');
            expect(token).toBe(mockToken);
        });

        it('should return null if no token', () => {
            (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);

            const token = authService.getToken();

            expect(token).toBeNull();
        });
    });

    describe('isAuthenticated', () => {
        it('should return true if token exists', () => {
            (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('test-token');

            expect(authService.isAuthenticated()).toBe(true);
        });

        it('should return false if no token', () => {
            (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);

            expect(authService.isAuthenticated()).toBe(false);
        });
    });

    describe('isAdmin', () => {
        it('should return true if admin flag is set', () => {
            (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('true');

            expect(authService.isAdmin()).toBe(true);
        });

        it('should return false if admin flag is not set', () => {
            (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('false');

            expect(authService.isAdmin()).toBe(false);
        });
    });

    describe('logout', () => {
        it('should clear localStorage', async () => {
            (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);

            await authService.logout();

            expect(localStorage.removeItem).toHaveBeenCalledWith('nexor_token');
            expect(localStorage.removeItem).toHaveBeenCalledWith('nexor_user');
            expect(localStorage.removeItem).toHaveBeenCalledWith('nexor_is_admin');
        });
    });

    describe('login', () => {
        it('should call API with credentials', async () => {
            const mockResponse = {
                data: {
                    user: { id: '1', email: 'test@test.com' },
                    session: { access_token: 'token', refresh_token: 'refresh' },
                    isAdmin: false,
                },
            };

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            });

            const result = await authService.login('test@test.com', 'password');

            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:3000/api/auth/login',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ email: 'test@test.com', password: 'password' }),
                })
            );
            expect(result).toEqual(mockResponse.data);
        });

        it('should throw error on failed login', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
                json: () => Promise.resolve({ error: 'Invalid credentials' }),
            });

            await expect(authService.login('test@test.com', 'wrong')).rejects.toThrow('Invalid credentials');
        });
    });

    describe('adminLogin', () => {
        it('should call admin login endpoint', async () => {
            const mockResponse = {
                data: {
                    user: { id: '1', email: 'admin@nexor.com' },
                    session: { access_token: 'token', refresh_token: 'refresh' },
                    isAdmin: true,
                },
            };

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            });

            const result = await authService.adminLogin('admin@nexor.com', 'password');

            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:3000/api/auth/admin/login',
                expect.objectContaining({
                    method: 'POST',
                })
            );
            expect(result.isAdmin).toBe(true);
        });

        it('should reject non-admin users', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
                json: () => Promise.resolve({ error: 'Unauthorized: Only admin@nexor.com can access admin panel' }),
            });

            await expect(authService.adminLogin('user@test.com', 'password')).rejects.toThrow('admin@nexor.com');
        });
    });
});
