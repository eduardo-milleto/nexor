import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export async function testConnection() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        console.log('Database connected:', result.rows[0].now);
        client.release();
        return true;
    } catch (error) {
        console.error('Database connection error:', error.message);
        return false;
    }
}

export async function query(text, params) {
    const start = Date.now();
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Query executed:', { text, duration, rows: result.rowCount });
    return result;
}
