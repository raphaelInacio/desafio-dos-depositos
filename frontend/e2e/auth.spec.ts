import { test, expect } from '@playwright/test';
import { loginUser, signupUser, logoutUser } from './helpers/auth-helpers';
import { TestUsers, generateUniqueEmail } from './helpers/test-data';

test.describe('Authentication Flow', () => {
    test('should login with existing user credentials', async ({ page }) => {
        await loginUser(
            page,
            TestUsers.existing.email,
            TestUsers.existing.password
        );

        // Verificar que está na página inicial
        await expect(page).toHaveURL('/');

        // Verificar que elementos do dashboard estão visíveis
        await expect(page.locator('text=Criar Desafio')).toBeVisible();
    });

    test('should signup new user', async ({ page }) => {
        const uniqueEmail = generateUniqueEmail();

        await signupUser(
            page,
            uniqueEmail,
            TestUsers.new.password,
            TestUsers.new.displayName
        );

        // Verificar redirect para dashboard
        await expect(page).toHaveURL('/');

        // Verificar mensagem de boas-vindas ou elemento que confirma signup
        await expect(page.locator('text=Criar Desafio')).toBeVisible();
    });

    test('should logout successfully', async ({ page }) => {
        // Primeiro fazer login
        await loginUser(
            page,
            TestUsers.existing.email,
            TestUsers.existing.password
        );

        // Verificar que está logado
        await expect(page).toHaveURL('/');

        // Fazer logout
        await logoutUser(page);

        // Verificar redirect para login
        await expect(page).toHaveURL('/login');
    });

    test('should show error for invalid credentials', async ({ page }) => {
        await page.goto('/login');
        await page.fill('[name="email"]', 'invalid@example.com');
        await page.fill('[name="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');

        // Verificar mensagem de erro
        await expect(page.locator('text=/credenciais.*inválidas/i')).toBeVisible({ timeout: 5000 });
    });

    test('should validate email format on signup', async ({ page }) => {
        await page.goto('/register');
        await page.fill('[name="email"]', 'invalid-email');
        await page.fill('[name="password"]', TestUsers.new.password);
        await page.fill('[name="displayName"]', TestUsers.new.displayName);
        await page.click('button[type="submit"]');

        // Verificar que o formulário mostra erro de validação
        await expect(page.locator('text=/email.*inválido/i')).toBeVisible();
    });
});
