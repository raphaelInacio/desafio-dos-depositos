/**
 * Test data factories para E2E tests
 */

export const TestUsers = {
    existing: {
        email: 'contato.raphaelinacio@gmail.com',
        password: '1234567',
        displayName: 'Raphael Inacio'
    },
    new: {
        email: `test-${Date.now()}@example.com`,
        password: '1234567',
        displayName: 'Test User'
    }
};

export const TestChallenges = {
    classic: {
        name: 'Desafio Teste Clássico',
        targetAmount: 1000,
        numberOfDeposits: 20,
        mode: 'classic' as const
    },
    fixed: {
        name: 'Desafio Teste Fixo',
        targetAmount: 1000,
        numberOfDeposits: 20,
        mode: 'fixed' as const
    }
};

export function generateUniqueEmail(): string {
    return `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
}

export function generateReferralCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}
