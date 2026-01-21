import { Page } from '@playwright/test';

/**
 * Helper para login de usuários em testes E2E
 */
export async function loginUser(page: Page, email: string, password: string) {
    await page.goto('/login');
    await page.fill('[name="email"]', email);
    await page.fill('[name="password"]', password);
    await page.click('button[type="submit"]');

    // Aguardar redirect para dashboard
    await page.waitForURL('/');
}

/**
 * Helper para criar uma nova conta
 */
export async function signupUser(
    page: Page,
    email: string,
    password: string,
    displayName: string,
    referralCode?: string
) {
    await page.goto('/register');
    await page.fill('[name="email"]', email);
    await page.fill('[name="password"]', password);
    await page.fill('[name="displayName"]', displayName);

    if (referralCode) {
        await page.fill('[name="referralCode"]', referralCode);
    }

    await page.click('button[type="submit"]');

    // Aguardar redirect para dashboard
    await page.waitForURL('/');
}

/**
 * Helper para logout
 */
export async function logoutUser(page: Page) {
    // Abrir menu do usuário
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-button"]');

    // Aguardar redirect para login
    await page.waitForURL('/login');
}

/**
 * Helper para verificar se o usuário está autenticado
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
    try {
        await page.waitForSelector('[data-testid="user-menu"]', { timeout: 2000 });
        return true;
    } catch {
        return false;
    }
}
