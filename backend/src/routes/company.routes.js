import express from 'express';
import { companyService } from '../services/company.service.js';
import { requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require admin authentication
router.use(requireAdmin);

// GET /api/companies - List all companies
router.get('/', async (req, res) => {
    try {
        const companies = await companyService.getAll();
        res.json({ success: true, data: companies });
    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/companies/stats - Get statistics
router.get('/stats', async (req, res) => {
    try {
        const stats = await companyService.getStats();
        res.json({ success: true, data: stats });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/companies/:id - Get company by ID
router.get('/:id', async (req, res) => {
    try {
        const company = await companyService.getById(req.params.id);
        if (!company) {
            return res.status(404).json({ success: false, error: 'Company not found' });
        }
        res.json({ success: true, data: company });
    } catch (error) {
        console.error('Error fetching company:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/companies - Create new company
router.post('/', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        // Check if company already exists
        const existing = await companyService.getByEmail(email);
        if (existing) {
            return res.status(409).json({
                success: false,
                error: 'Company with this email already exists'
            });
        }

        const result = await companyService.create(email, password, name);
        res.status(201).json({ success: true, data: result.company });
    } catch (error) {
        console.error('Error creating company:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT /api/companies/:id - Update company
router.put('/:id', async (req, res) => {
    try {
        const company = await companyService.update(req.params.id, req.body);
        if (!company) {
            return res.status(404).json({ success: false, error: 'Company not found' });
        }
        res.json({ success: true, data: company });
    } catch (error) {
        console.error('Error updating company:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// PATCH /api/companies/:id/toggle-status - Toggle company status
router.patch('/:id/toggle-status', async (req, res) => {
    try {
        const company = await companyService.toggleStatus(req.params.id);
        if (!company) {
            return res.status(404).json({ success: false, error: 'Company not found' });
        }
        res.json({ success: true, data: company });
    } catch (error) {
        console.error('Error toggling status:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE /api/companies/:id - Delete company
router.delete('/:id', async (req, res) => {
    try {
        await companyService.delete(req.params.id);
        res.json({ success: true, message: 'Company deleted successfully' });
    } catch (error) {
        console.error('Error deleting company:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
