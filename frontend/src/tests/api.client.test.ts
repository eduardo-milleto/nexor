import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '@/services/api.client';

describe('ApiClient', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.getItem = vi.fn().mockReturnValue(null);
    });

    describe('health', () => {
        it('should fetch health endpoint', async () => {
            const mockHealth = {
                status: 'healthy',
                database: 'connected',
                timestamp: '2026-02-01T12:00:00.000Z',
            };

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(mockHealth),
            });

            const result = await apiClient.health();

            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:3000/health',
                expect.objectContaining({
                    method: 'GET',
                })
            );
            expect(result).toEqual(mockHealth);
        });
    });

    describe('get', () => {
        it('should make GET request', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ data: 'test' }),
            });

            await apiClient.get('/api/test');

            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:3000/api/test',
                expect.objectContaining({
                    method: 'GET',
                })
            );
        });

        it('should include auth token if available', async () => {
            localStorage.getItem = vi.fn().mockReturnValue('test-token');

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ data: 'test' }),
            });

            await apiClient.get('/api/test');

            expect(global.fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        Authorization: 'Bearer test-token',
                    }),
                })
            );
        });
    });

    describe('post', () => {
        it('should make POST request with body', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ success: true }),
            });

            await apiClient.post('/api/test', { key: 'value' });

            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:3000/api/test',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ key: 'value' }),
                })
            );
        });
    });

    describe('error handling', () => {
        it('should throw error on failed request', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
                json: () => Promise.resolve({ error: 'Server error' }),
            });

            await expect(apiClient.get('/api/fail')).rejects.toThrow('Server error');
        });
    });
});
