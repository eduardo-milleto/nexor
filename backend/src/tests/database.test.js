import { describe, it } from 'node:test';
import assert from 'node:assert';
import { pool } from '../config/database.js';

describe('Database Connection', () => {
    it('should connect to PostgreSQL', async () => {
        const result = await pool.query('SELECT NOW()');
        assert.ok(result.rows[0].now);
    });

    it('should return valid timestamp', async () => {
        const result = await pool.query('SELECT NOW() as timestamp');
        const timestamp = new Date(result.rows[0].timestamp);
        assert.ok(timestamp instanceof Date);
        assert.ok(!isNaN(timestamp.getTime()));
    });
});
