import { supabase } from '../config/supabase.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@nexor.com';

export class AuthService {

    /**
     * Sign up a new user
     */
    async signUp(email, password) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    /**
     * Sign in with email and password
     */
    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            throw new Error(error.message);
        }

        return {
            user: data.user,
            session: data.session,
            isAdmin: email === ADMIN_EMAIL
        };
    }

    /**
     * Sign in as administrator - only admin@nexor.com allowed
     */
    async signInAsAdmin(email, password) {
        if (email !== ADMIN_EMAIL) {
            throw new Error('Unauthorized: Only admin@nexor.com can access admin panel');
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            throw new Error(error.message);
        }

        return {
            user: data.user,
            session: data.session,
            isAdmin: true
        };
    }

    /**
     * Sign out current user
     */
    async signOut() {
        const { error } = await supabase.auth.signOut();

        if (error) {
            throw new Error(error.message);
        }

        return { success: true };
    }

    /**
     * Get current session
     */
    async getSession() {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
            throw new Error(error.message);
        }

        return session;
    }

    /**
     * Get current user
     */
    async getUser() {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
            throw new Error(error.message);
        }

        return {
            user,
            isAdmin: user?.email === ADMIN_EMAIL
        };
    }

    /**
     * Reset password
     */
    async resetPassword(email) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.APP_URL || 'http://localhost'}/reset-password`
        });

        if (error) {
            throw new Error(error.message);
        }

        return { success: true };
    }

    /**
     * Update password
     */
    async updatePassword(newPassword) {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            throw new Error(error.message);
        }

        return { success: true };
    }

    /**
     * Check if email is admin
     */
    isAdminEmail(email) {
        return email === ADMIN_EMAIL;
    }
}

export const authService = new AuthService();
export default authService;
