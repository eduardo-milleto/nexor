import { pool } from '../config/database.js';
import { supabase } from '../config/supabase.js';

export const companyService = {
    // Get all companies with user count
    async getAll() {
        const result = await pool.query(`
            SELECT 
                c.*,
                COUNT(cu.id) as user_count
            FROM companies c
            LEFT JOIN company_users cu ON c.id = cu.company_id
            GROUP BY c.id
            ORDER BY c.created_at DESC
        `);
        return result.rows;
    },

    // Get company by ID
    async getById(id) {
        const result = await pool.query(
            'SELECT * FROM companies WHERE id = $1',
            [id]
        );
        return result.rows[0];
    },

    // Get company by email
    async getByEmail(email) {
        const result = await pool.query(
            'SELECT * FROM companies WHERE email = $1',
            [email]
        );
        return result.rows[0];
    },

    // Create new company with Supabase auth user
    async create(email, password, name = null) {
        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true
        });

        if (authError) {
            throw new Error(`Failed to create auth user: ${authError.message}`);
        }

        // Create company in database
        const result = await pool.query(
            `INSERT INTO companies (email, name) 
             VALUES ($1, $2) 
             RETURNING *`,
            [email, name || email.split('@')[0]]
        );

        return {
            company: result.rows[0],
            authUser: authData.user
        };
    },

    // Update company
    async update(id, data) {
        const { name, status, max_users } = data;
        const result = await pool.query(
            `UPDATE companies 
             SET name = COALESCE($2, name),
                 status = COALESCE($3, status),
                 max_users = COALESCE($4, max_users)
             WHERE id = $1
             RETURNING *`,
            [id, name, status, max_users]
        );
        return result.rows[0];
    },

    // Delete company (also deletes Supabase auth user)
    async delete(id) {
        // Get company email first
        const company = await this.getById(id);
        if (!company) {
            throw new Error('Company not found');
        }

        // Get Supabase user by email
        const { data: users } = await supabase.auth.admin.listUsers();
        const authUser = users.users.find(u => u.email === company.email);

        if (authUser) {
            // Delete from Supabase Auth
            await supabase.auth.admin.deleteUser(authUser.id);
        }

        // Delete from database (cascade deletes company_users)
        await pool.query('DELETE FROM companies WHERE id = $1', [id]);

        return { success: true };
    },

    // Toggle company status
    async toggleStatus(id) {
        const result = await pool.query(
            `UPDATE companies 
             SET status = CASE WHEN status = 'active' THEN 'inactive' ELSE 'active' END
             WHERE id = $1
             RETURNING *`,
            [id]
        );
        return result.rows[0];
    },

    // Get company statistics
    async getStats() {
        const result = await pool.query(`
            SELECT 
                COUNT(*) as total_companies,
                COUNT(*) FILTER (WHERE status = 'active') as active_companies,
                (SELECT COUNT(*) FROM company_users) as total_users
            FROM companies
        `);
        return result.rows[0];
    }
};
