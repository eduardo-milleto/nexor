import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';

/**
 * Integration Test - Company CRUD Operations
 * 
 * This test validates the complete flow of:
 * 1. Authenticating as admin
 * 2. Creating a company with Supabase Auth user
 * 3. Verifying the company exists
 * 4. Deleting the company and its auth user
 * 
 * Requires: SUPABASE_SERVICE_ROLE_KEY to be set
 */

const API_URL = process.env.API_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@nexor.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const TEST_EMAIL = `test-pipeline-${Date.now()}@nexor-test.com`;
const TEST_PASSWORD = 'TestPassword123!';

let createdCompanyId = null;
let adminToken = null;

describe('Company Integration Tests', () => {
    before(async () => {
        // Login as admin to get auth token
        console.log(`🔐 Logging in as admin: ${ADMIN_EMAIL}`);

        const loginResponse = await fetch(`${API_URL}/api/auth/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD
            })
        });

        if (loginResponse.ok) {
            const data = await loginResponse.json();
            adminToken = data.data?.session?.access_token || data.data?.token || data.token;
            console.log(`✓ Admin login successful, token obtained`);
        } else {
            const error = await loginResponse.text();
            console.log(`⚠️ Admin login failed: ${loginResponse.status} - ${error}`);
            console.log(`⚠️ Tests will run without authentication`);
        }
    });

    after(async () => {
        // Cleanup: ensure test company is deleted even if test fails
        if (createdCompanyId && adminToken) {
            try {
                console.log(`🧹 Cleaning up test company: ${createdCompanyId}`);
                await fetch(`${API_URL}/api/companies/${createdCompanyId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${adminToken}`
                    }
                });
            } catch {
                // Ignore cleanup errors
            }
        }
    });

    it('should create a new company successfully', async () => {
        assert.ok(adminToken, 'Admin token is required - check ADMIN_EMAIL and ADMIN_PASSWORD env vars');

        console.log(`📝 Creating company: ${TEST_EMAIL}`);

        const response = await fetch(`${API_URL}/api/companies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({
                email: TEST_EMAIL,
                password: TEST_PASSWORD
            })
        });

        const responseText = await response.text();
        let data;
        try {
            data = JSON.parse(responseText);
        } catch {
            assert.fail(`Response is not valid JSON: ${responseText}`);
        }

        assert.strictEqual(response.ok, true, `Expected 2xx status, got ${response.status}: ${responseText}`);
        assert.ok(data.data || data.company || data.id, 'Response should contain company data');

        createdCompanyId = data.data?.id || data.company?.id || data.id;
        assert.ok(createdCompanyId, 'Company ID should be returned');

        console.log(`✓ Company created with ID: ${createdCompanyId}`);
    });

    it('should verify company exists in list', async () => {
        assert.ok(adminToken, 'Admin token is required');

        const response = await fetch(`${API_URL}/api/companies`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            }
        });

        assert.strictEqual(response.ok, true, `Should fetch companies list, got ${response.status}`);

        const result = await response.json();
        const companies = result.data || result;
        const found = companies.find(c => c.email === TEST_EMAIL);

        assert.ok(found, `Company with email ${TEST_EMAIL} should exist`);
        console.log(`✓ Company found in list`);
    });

    it('should delete the company successfully', async () => {
        assert.ok(adminToken, 'Admin token is required');
        assert.ok(createdCompanyId, 'Company ID must exist before deletion');

        console.log(`🗑️ Deleting company: ${createdCompanyId}`);

        const response = await fetch(`${API_URL}/api/companies/${createdCompanyId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            }
        });

        assert.strictEqual(response.ok, true, `Expected 2xx status, got ${response.status}`);

        console.log(`✓ Company deleted successfully`);

        // Mark as cleaned up
        createdCompanyId = null;
    });

    it('should verify company no longer exists', async () => {
        assert.ok(adminToken, 'Admin token is required');

        const response = await fetch(`${API_URL}/api/companies`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            }
        });

        assert.strictEqual(response.ok, true, `Should fetch companies list, got ${response.status}`);

        const result = await response.json();
        const companies = result.data || result;
        const found = companies.find(c => c.email === TEST_EMAIL);

        assert.ok(!found, `Company with email ${TEST_EMAIL} should NOT exist after deletion`);
        console.log(`✓ Company confirmed deleted from list`);
    });
});
