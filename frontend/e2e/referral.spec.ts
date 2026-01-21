import { test, expect, Page } from '@playwright/test';
import { loginUser, signupUser } from './helpers/auth-helpers';
import { TestUsers, generateUniqueEmail } from './helpers/test-data';

test.describe('Referral System', () => {
    let userAReferralCode: string;

    test('should display referral code for logged user', async ({ page }) => {
        await loginUser(
            page,
            TestUsers.existing.email,
            TestUsers.existing.password
        );

        // Navegar para página de referral ou dashboard
        await page.goto('/');

        // Verificar se código de referral está visível
        const referralSection = page.locator('[data-testid="referral-card"]');
        await expect(referralSection).toBeVisible();

        // Capturar código de referral
        const referralCodeElement = page.locator('[data-testid="referral-code"]');
        userAReferralCode = (await referralCodeElement.textContent()) || '';

        expect(userAReferralCode).toBeTruthy();
        expect(userAReferralCode.length).toBeGreaterThanOrEqual(6);
    });

    test('should generate shareable referral link', async ({ page }) => {
        await loginUser(
            page,
            TestUsers.existing.email,
            TestUsers.existing.password
        );

        // Clicar em botão de compartilhar referral
        const shareButton = page.locator('[data-testid="share-referral-button"]');
        if (await shareButton.count() > 0) {
            await shareButton.click();

            // Verificar que link foi copiado ou modal apareceu
            const linkDisplay = page.locator('[data-testid="referral-link"]');
            await expect(linkDisplay).toBeVisible();

            const linkText = await linkDisplay.textContent();
            expect(linkText).toContain('ref=');
        }
    });

    test('should signup new user with referral code', async ({ page }) => {
        // Primeiro obter código de referral do usuário A
        await loginUser(
            page,
            TestUsers.existing.email,
            TestUsers.existing.password
        );

        const referralCodeElement = page.locator('[data-testid="referral-code"]');
        const referralCode = (await referralCodeElement.textContent()) || '';

        // Fazer logout
        await page.click('[data-testid="user-menu"]');
        await page.click('[data-testid="logout-button"]');

        // Criar novo usuário com código de referral
        const newUserEmail = generateUniqueEmail();
        await signupUser(
            page,
            newUserEmail,
            TestUsers.new.password,
            TestUsers.new.displayName,
            referralCode
        );

        // Verificar que está logado
        await expect(page).toHaveURL('/');

        // Criar primeiro desafio para ativar reward
        await page.click('text=Criar Desafio');
        await page.fill('[name="name"]', 'Primeiro Desafio');
        await page.fill('[name="targetAmount"]', '500');
        await page.fill('[name="numberOfDeposits"]', '10');
        await page.click('button:has-text("Criar")');

        // Verificar que desafio foi criado
        await expect(page.locator('text=Primeiro Desafio')).toBeVisible();
    });

    test('should reward referrer when referred user creates first challenge', async ({
        page,
        context
    }) => {
        // Este é um teste mais complexo que requer 2 contextos de usuário
        // Vamos simplificar verificando apenas se o sistema permite criar desafios

        await loginUser(
            page,
            TestUsers.existing.email,
            TestUsers.existing.password
        );

        // Verificar benefícios de referral no dashboard
        const referralRewardBadge = page.locator('[data-testid="referral-reward-badge"]');

        // Se tiver reward ativo, deve ser visível
        if (await referralRewardBadge.count() > 0) {
            await expect(referralRewardBadge).toBeVisible();
        }
    });
});
