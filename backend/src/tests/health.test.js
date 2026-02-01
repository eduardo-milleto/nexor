import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';

const API_URL = process.env.API_URL || 'http://localhost:3000';

describe('Health Check', () => {
    it('should return healthy status', async () => {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();

        assert.strictEqual(response.status, 200);
        assert.strictEqual(data.status, 'healthy');
        assert.strictEqual(data.database, 'connected');
        assert.ok(data.timestamp);
    });
});

describe('API Info', () => {
    it('should return API information', async () => {
        const response = await fetch(`${API_URL}/api`);
        const data = await response.json();

        assert.strictEqual(response.status, 200);
        assert.strictEqual(data.message, 'Nexor API');
        assert.strictEqual(data.version, '1.0.0');
        assert.ok(data.endpoints);
    });
});

describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
        const response = await fetch(`${API_URL}/unknown-route`);
        const data = await response.json();

        assert.strictEqual(response.status, 404);
        assert.strictEqual(data.error, 'Not found');
    });
});
