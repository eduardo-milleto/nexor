import { apiClient } from './api.client';

export interface Company {
    id: string;
    email: string;
    name: string | null;
    status: 'active' | 'inactive';
    max_users: number;
    user_count: number;
    created_at: string;
    updated_at: string;
}

export interface CompanyStats {
    total_companies: number;
    active_companies: number;
    total_users: number;
}

export interface CreateCompanyData {
    email: string;
    password: string;
    name?: string;
}

export interface UpdateCompanyData {
    name?: string;
    status?: 'active' | 'inactive';
    max_users?: number;
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
}

export const companyService = {
    // Get all companies
    async getAll(): Promise<Company[]> {
        const response = await apiClient.get<ApiResponse<Company[]>>('/api/companies');
        if (!response.success) throw new Error(response.error);
        return response.data;
    },

    // Get company statistics
    async getStats(): Promise<CompanyStats> {
        const response = await apiClient.get<ApiResponse<CompanyStats>>('/api/companies/stats');
        if (!response.success) throw new Error(response.error);
        return response.data;
    },

    // Get company by ID
    async getById(id: string): Promise<Company> {
        const response = await apiClient.get<ApiResponse<Company>>(`/api/companies/${id}`);
        if (!response.success) throw new Error(response.error);
        return response.data;
    },

    // Create new company
    async create(data: CreateCompanyData): Promise<Company> {
        const response = await apiClient.post<ApiResponse<Company>>('/api/companies', data);
        if (!response.success) throw new Error(response.error);
        return response.data;
    },

    // Update company
    async update(id: string, data: UpdateCompanyData): Promise<Company> {
        const response = await apiClient.put<ApiResponse<Company>>(`/api/companies/${id}`, data);
        if (!response.success) throw new Error(response.error);
        return response.data;
    },

    // Toggle company status
    async toggleStatus(id: string): Promise<Company> {
        const response = await apiClient.patch<ApiResponse<Company>>(`/api/companies/${id}/toggle-status`);
        if (!response.success) throw new Error(response.error);
        return response.data;
    },

    // Delete company
    async delete(id: string): Promise<void> {
        const response = await apiClient.delete<ApiResponse<null>>(`/api/companies/${id}`);
        if (!response.success) throw new Error(response.error);
    }
};
