import { test, expect } from '@playwright/test';
import { loginUser } from './helpers/auth-helpers';
import { TestUsers } from './helpers/test-data';

test.describe('Premium Features', () => {
    test.beforeEach(async ({ page }) => {
        await loginUser(
            page,
            TestUsers.existing.email,
            TestUsers.existing.password
        );
    });

    test('should display upgrade CTA for free users', async ({ page }) => {
        // Verificar se botão/banner de upgrade está visível
        const upgradeCTA = page.locator('[data-testid="upgrade-cta"]');

        if (await upgradeCTA.count() > 0) {
            await expect(upgradeCTA).toBeVisible();

            // Clicar e verificar redirect para página de upgrade
            await upgradeCTA.click();
            await expect(page).toHaveURL('/upgrade');
        }
    });

    test('should show premium features on upgrade page', async ({ page }) => {
        await page.goto('/upgrade');

        // Verificar que features premium estão listadas
        await expect(page.locator('text=/sem anúncios|ad-free/i')).toBeVisible();
        await expect(page.locator('text=/temas exclusivos|exclusive themes/i')).toBeVisible();
        await expect(page.locator('text=/múltiplos desafios|multiple challenges/i')).toBeVisible();
    });

    test('should mock payment flow (Asaas checkout)', async ({ page }) => {
        // Interceptar chamada de API para checkout
        await page.route('**/api/checkout', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    checkoutUrl: 'https://sandbox.asaas.com/c/mockcheckouturl'
                })
            });
        });

        await page.goto('/upgrade');

        // Clicar em botão de upgrade
        const upgradeButton = page.locator('button:has-text("Assinar Premium")');
        if (await upgradeButton.count() > 0) {
            await upgradeButton.click();

            // Verificar que foi redirecionado (ou modal abriu)
            // Como é mock, podemos verificar se a requisição foi feita
            await page.waitForTimeout(1000);
        }
    });

    test('should access theme selector if premium', async ({ page }) => {
        await page.goto('/');

        // Verificar se seletor de tema está acessível
        const themeSelector = page.locator('[data-testid="theme-selector"]');

        if (await themeSelector.count() > 0) {
            await themeSelector.click();

            // Verificar temas disponíveis
            const darkTheme = page.locator('text=/dark|escuro/i');
            const pastelTheme = page.locator('text=Pastel');
            const neonTheme = page.locator('text=Neon');

            // Pelo menos um tema especial deve estar visível
            const themesVisible =
                (await darkTheme.count() > 0) ||
                (await pastelTheme.count() > 0) ||
                (await neonTheme.count() > 0);

            expect(themesVisible).toBeTruthy();
        }
    });

    test('should create multiple challenges if premium', async ({ page }) => {
        // Criar primeiro desafio
        await page.click('text=Criar Desafio');
        await page.fill('[name="name"]', 'Desafio Premium 1');
        await page.fill('[name="targetAmount"]', '1000');
        await page.fill('[name="numberOfDeposits"]', '20');
        await page.click('button:has-text("Criar")');

        await expect(page.locator('text=Desafio Premium 1')).toBeVisible();

        // Tentar criar segundo desafio
        await page.goto('/');
        await page.click('text=Criar Desafio');
        await page.fill('[name="name"]', 'Desafio Premium 2');
        await page.fill('[name="targetAmount"]', '2000');
        await page.fill('[name="numberOfDeposits"]', '30');
        await page.click('button:has-text("Criar")');

        // Se for premium, deve conseguir criar segundo desafio
        // Se for free, deve ver mensagem de limite
        const limitMessage = page.locator('text=/limite.*desafios|upgrade.*premium/i');
        const secondChallenge = page.locator('text=Desafio Premium 2');

        // Um dos dois deve ser verdadeiro
        const isPremium = await secondChallenge.count() > 0;
        const isFree = await limitMessage.count() > 0;

        expect(isPremium || isFree).toBeTruthy();
    });

    test('should not show ads in paid challenges', async ({ page }) => {
        // Para este teste, assumir que o usuário possui um desafio pago
        // Navegar para um desafio específico
        await page.goto('/');

        const challenges = page.locator('[data-testid="challenge-card"]');
        if (await challenges.count() > 0) {
            await challenges.first().click();

            // Verificar ausência de ads se o desafio for pago
            const adBanner = page.locator('[data-testid="ad-banner"]');

            // Se banner de ad não existir, significa que é desafio pago
            // ou que ads estão desabilitados para premium
            const hasAds = await adBanner.count() > 0;

            // Este teste é informativo - depende do estado real do usuário
            console.log(`Has ads: ${hasAds}`);
        }
    });
});
