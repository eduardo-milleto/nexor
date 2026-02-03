import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool, testConnection } from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import companyRoutes from './routes/company.routes.js';

// Load environment variables
dotenv.config({ path: '../.env.local' });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: [
        'http://localhost',
        'http://localhost:80',
        'http://localhost:5173',
        'https://nexorcorp.app',
        'https://staging.nexorcorp.app',
        'https://nexor-eta.vercel.app',
        /\.vercel\.app$/  // Allow all Vercel preview URLs
    ],
    credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            status: 'healthy',
            database: 'connected',
            timestamp: result.rows[0].now
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            database: 'disconnected',
            error: error.message
        });
    }
});

// API info
app.get('/api', (req, res) => {
    res.json({
        message: 'Nexor API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            auth: '/api/auth/*',
            companies: '/api/companies/*'
        }
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Admin email: ${process.env.ADMIN_EMAIL || 'admin@nexor.com'}`);
    await testConnection();
});
