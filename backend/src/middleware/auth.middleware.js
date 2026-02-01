import { supabase } from '../config/supabase.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@nexor.com';

/**
 * Middleware to verify JWT token from Supabase
 */
export async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing authorization header' });
        }

        const token = authHeader.split(' ')[1];

        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        req.user = user;
        req.isAdmin = user.email === ADMIN_EMAIL;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Authentication failed' });
    }
}

/**
 * Middleware to require admin access
 */
export async function adminMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing authorization header' });
        }

        const token = authHeader.split(' ')[1];

        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        if (user.email !== ADMIN_EMAIL) {
            return res.status(403).json({ error: 'Admin access required' });
        }

        req.user = user;
        req.isAdmin = true;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Authentication failed' });
    }
}

export default { authMiddleware, adminMiddleware };
