import express from 'express';
import { authService } from '../services/auth.service.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * POST /auth/signup
 * Register a new user
 */
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const data = await authService.signUp(email, password);
        res.status(201).json({ message: 'User created successfully', data });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * POST /auth/login
 * User login
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const data = await authService.signIn(email, password);
        res.json({ message: 'Login successful', data });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

/**
 * POST /auth/admin/login
 * Admin login - only admin@nexor.com allowed
 */
router.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const data = await authService.signInAsAdmin(email, password);
        res.json({ message: 'Admin login successful', data });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

/**
 * POST /auth/logout
 * User logout
 */
router.post('/logout', authMiddleware, async (req, res) => {
    try {
        await authService.signOut();
        res.json({ message: 'Logout successful' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * GET /auth/me
 * Get current user info
 */
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const data = await authService.getUser();
        res.json(data);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

/**
 * POST /auth/forgot-password
 * Request password reset
 */
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        await authService.resetPassword(email);
        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * POST /auth/reset-password
 * Update password with token
 */
router.post('/reset-password', authMiddleware, async (req, res) => {
    try {
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        await authService.updatePassword(password);
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * GET /auth/admin/verify
 * Verify admin access
 */
router.get('/admin/verify', adminMiddleware, (req, res) => {
    res.json({ isAdmin: true, user: req.user });
});

export default router;
