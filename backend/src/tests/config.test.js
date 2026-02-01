import { describe, it } from 'node:test';
import assert from 'node:assert';

// Unit tests - validate code logic and environment configuration

describe('Application Logic', () => {
    it('should validate email format correctly', () => {
        const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        assert.ok(isValidEmail('admin@nexor.com'), 'Valid email should pass');
        assert.ok(isValidEmail('user@example.com'), 'Valid email should pass');
        assert.ok(!isValidEmail('invalid-email'), 'Invalid email should fail');
        assert.ok(!isValidEmail(''), 'Empty string should fail');
    });

    it('should validate admin email restriction', () => {
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@nexor.com';
        const isAdmin = (email) => email === ADMIN_EMAIL;

        assert.ok(isAdmin('admin@nexor.com'), 'Admin email should be recognized');
        assert.ok(!isAdmin('user@nexor.com'), 'Non-admin should not be recognized');
    });
});

describe('Environment Configuration', () => {
    it('should have DATABASE_URL configured', () => {
        assert.ok(process.env.DATABASE_URL, 'DATABASE_URL should be set');
    });

    it('should have SUPABASE_URL configured', () => {
        assert.ok(process.env.SUPABASE_URL, 'SUPABASE_URL should be set');
    });

    it('should have SUPABASE_ANON_KEY configured', () => {
        assert.ok(process.env.SUPABASE_ANON_KEY, 'SUPABASE_ANON_KEY should be set');
    });
});

describe('Utility Functions', () => {
    it('should sanitize user input', () => {
        const sanitize = (input) => input.trim().toLowerCase();

        assert.strictEqual(sanitize('  HELLO  '), 'hello');
        assert.strictEqual(sanitize('Test@Email.COM'), 'test@email.com');
