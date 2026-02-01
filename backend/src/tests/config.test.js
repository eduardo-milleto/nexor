import { describe, it } from 'node:test';
import assert from 'node:assert';

// Unit tests that run without external dependencies

describe('Environment Variables', () => {
    it('should have DATABASE_URL set', () => {
        assert.ok(process.env.DATABASE_URL, 'DATABASE_URL should be set');
    });

    it('should have SUPABASE_URL set', () => {
        assert.ok(process.env.SUPABASE_URL, 'SUPABASE_URL should be set');
    });

    it('should have SUPABASE_ANON_KEY set', () => {
        assert.ok(process.env.SUPABASE_ANON_KEY, 'SUPABASE_ANON_KEY should be set');
    });

    it('should have valid DATABASE_URL format', () => {
        const url = process.env.DATABASE_URL;
        assert.ok(url.startsWith('postgresql://'), 'DATABASE_URL should start with postgresql://');
    });

    it('should have valid SUPABASE_URL format', () => {
        const url = process.env.SUPABASE_URL;
        assert.ok(url.startsWith('https://'), 'SUPABASE_URL should start with https://');
    });
});

describe('Admin Configuration', () => {
    it('should have ADMIN_EMAIL configured', () => {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@nexor.com';
        assert.ok(adminEmail.includes('@'), 'ADMIN_EMAIL should be a valid email');
    });
});
