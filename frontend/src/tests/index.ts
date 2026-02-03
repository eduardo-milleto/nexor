/**
 * =============================================================================
 * NEXOR TEST SUITE INDEX
 * =============================================================================
 * 
 * All tests in this directory run automatically on every deploy.
 * 
 * Test Files:
 * -----------
 * 1. authentication.test.ts - Login, logout, token management, admin access
 * 2. api.client.test.ts     - API client methods (GET, POST, PUT, DELETE)
 * 3. auth.service.test.ts   - Auth service integration
 * 
 * How to add new tests:
 * ---------------------
 * 1. Create a new file: [feature].test.ts
 * 2. Use describe() and it() from vitest
 * 3. The CI/CD will automatically pick up new test files
 * 
 * Running tests locally:
 * ----------------------
 * npm test                    - Run all tests once
 * npm run test:watch          - Run tests in watch mode
 * npm run test:coverage       - Run tests with coverage report
 * 
 * Test naming conventions:
 * ------------------------
 * - Use descriptive names: "should do X when Y"
 * - Group related tests with describe()
 * - Use emojis for main describe blocks for visual clarity
 * 
 * =============================================================================
 */

export const TEST_SUITES = {
    authentication: 'authentication.test.ts',
    apiClient: 'api.client.test.ts',
    authService: 'auth.service.test.ts',
} as const;

// This file is for documentation purposes only
// Vitest automatically discovers all *.test.ts files
