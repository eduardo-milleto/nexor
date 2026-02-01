import { describe, it } from 'node:test';
import assert from 'node:assert';

const API_URL = process.env.API_URL || 'http://localhost:3000';
const ADMIN_EMAIL = 'admin@nexor.com';

describe('Auth Routes', () => {
    describe('POST /api/auth/login', () => {
        it('should require email and password', async () => {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            const data = await response.json();

            assert.strictEqual(response.status, 400);
            assert.strictEqual(data.error, 'Email and password are required');
        });

        it('should reject invalid credentials', async () => {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'invalid@test.com',
                    password: 'wrongpassword'
                })
            });

            assert.strictEqual(response.status, 401);
        });
    });

    describe('POST /api/auth/admin/login', () => {
        it('should require email and password', async () => {
            const response = await fetch(`${API_URL}/api/auth/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            const data = await response.json();

            assert.strictEqual(response.status, 400);
            assert.strictEqual(data.error, 'Email and password are required');
        });

        it('should reject non-admin emails', async () => {
            const response = await fetch(`${API_URL}/api/auth/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'user@test.com',
                    password: 'password123'
                })
            });
            const data = await response.json();

            assert.strictEqual(response.status, 401);
            assert.ok(data.error.includes('admin@nexor.com'));
        });
    });

    describe('POST /api/auth/signup', () => {
        it('should require email and password', async () => {
            const response = await fetch(`${API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            const data = await response.json();

            assert.strictEqual(response.status, 400);
            assert.strictEqual(data.error, 'Email and password are required');
        });

        it('should require password with minimum length', async () => {
            const response = await fetch(`${API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'test@test.com',
                    password: '123'
                })
            });
            const data = await response.json();

            assert.strictEqual(response.status, 400);
            assert.ok(data.error.includes('6 characters'));
        });
    });

    describe('GET /api/auth/me', () => {
        it('should require authorization header', async () => {
            const response = await fetch(`${API_URL}/api/auth/me`);
            const data = await response.json();

            assert.strictEqual(response.status, 401);
            assert.strictEqual(data.error, 'Missing authorization header');
        });

        it('should reject invalid token', async () => {
            const response = await fetch(`${API_URL}/api/auth/me`, {
                headers: { 'Authorization': 'Bearer invalid-token' }
            });

            assert.strictEqual(response.status, 401);
        });
    });

    describe('GET /api/auth/admin/verify', () => {
        it('should require authorization header', async () => {
            const response = await fetch(`${API_URL}/api/auth/admin/verify`);
            const data = await response.json();

            assert.strictEqual(response.status, 401);
            assert.strictEqual(data.error, 'Missing authorization header');
        });
    });

    describe('POST /api/auth/forgot-password', () => {
        it('should require email', async () => {
            const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            const data = await response.json();

            assert.strictEqual(response.status, 400);
            assert.strictEqual(data.error, 'Email is required');
        });
    });
});
