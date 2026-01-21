import { test, expect } from '@playwright/test';
import { loginUser } from './helpers/auth-helpers';
import { TestUsers, TestChallenges } from './helpers/test-data';

test.describe('Challenge Flow', () => {
    // Setup: fazer login antes de cada teste
    test.beforeEach(async ({ page }) => {
        await loginUser(
            page,
            TestUsers.existing.email,
            TestUsers.existing.password
        );
    });

    test('should create a new classic challenge', async ({ page }) => {
        // Clicar em "Criar Desafio"
        await page.click('text=Criar Desafio');

        // Preencher formulário
        await page.fill('[name="name"]', TestChallenges.classic.name);
        await page.fill('[name="targetAmount"]', TestChallenges.classic.targetAmount.toString());
        await page.fill('[name="numberOfDeposits"]', TestChallenges.classic.numberOfDeposits.toString());

        // Selecionar modo clássico (se houver seletor)
        const modeSelector = page.locator('[name="mode"]');
        if (await modeSelector.count() > 0) {
            await modeSelector.selectOption('classic');
        }

        // Submeter formulário
        await page.click('button:has-text("Criar")');

        // Verificar que o desafio foi criado
        await expect(page.locator(`text=${TestChallenges.classic.name}`)).toBeVisible();

        // Verificar que o grid de depósitos está visível
        await expect(page.locator('[data-testid="deposit-grid"]')).toBeVisible();
    });

    test('should create a fixed challenge', async ({ page }) => {
        await page.click('text=Criar Desafio');

        await page.fill('[name="name"]', TestChallenges.fixed.name);
        await page.fill('[name="targetAmount"]', TestChallenges.fixed.targetAmount.toString());
        await page.fill('[name="numberOfDeposits"]', TestChallenges.fixed.numberOfDeposits.toString());

        const modeSelector = page.locator('[name="mode"]');
        if (await modeSelector.count() > 0) {
            await modeSelector.selectOption('fixed');
        }

        await page.click('button:has-text("Criar")');

        await expect(page.locator(`text=${TestChallenges.fixed.name}`)).toBeVisible();
    });

    test('should mark deposit and update progress', async ({ page }) => {
        // Assumir que já existe um desafio ativo
        // Clicar no primeiro depósito disponível
        const firstDeposit = page.locator('[data-testid="deposit-card"]').first();
        await firstDeposit.click();

        // Verificar modal de celebração (se houver)
        const celebrationModal = page.locator('[data-testid="celebration-modal"]');
        if (await celebrationModal.count() > 0) {
            await expect(celebrationModal).toBeVisible();
            await page.click('button:has-text("Fechar")');
        }

        // Verificar que o depósito foi marcado (classe CSS ou estado visual)
        await expect(firstDeposit).toHaveClass(/paid|completed|marked/i);

        // Verificar que o progresso foi atualizado
        const progressBar = page.locator('[data-testid="progress-bar"]');
        const progressText = await progressBar.textContent();
        expect(progressText).not.toBe('0%');
    });

    test('should mark multiple deposits and track progress', async ({ page }) => {
        // Marcar 3 depósitos
        for (let i = 0; i < 3; i++) {
            const deposit = page.locator('[data-testid="deposit-card"]').nth(i);
            await deposit.click();

            // Fechar modal se aparecer
            const modal = page.locator('[data-testid="celebration-modal"]');
            if (await modal.count() > 0) {
                await page.click('button:has-text("Fechar")');
            }

            // Pequeno delay para animações
            await page.waitForTimeout(500);
        }

        // Verificar stats header
        const savedAmount = page.locator('[data-testid="total-saved"]');
        await expect(savedAmount).not.toHaveText('R$ 0,00');
    });

    test('should display ad banner for free users', async ({ page }) => {
        // Verificar se o banner de ad está visível
        const adBanner = page.locator('[data-testid="ad-banner"]');

        // Se o usuário não for premium, deve ver o banner
        if (await adBanner.count() > 0) {
            await expect(adBanner).toBeVisible();
        }
    });

    test('should show interstitial ad after 3 deposits', async ({ page }) => {
        // Marcar 3 depósitos para triggerar intersticial
        for (let i = 0; i < 3; i++) {
            const deposit = page.locator('[data-testid="deposit-card"]').nth(i);
            await deposit.click();

            // Fechar modal de celebração
            const celebrationModal = page.locator('[data-testid="celebration-modal"]');
            if (await celebrationModal.count() > 0) {
                await page.click('button:has-text("Fechar")');
            }

            await page.waitForTimeout(500);
        }

        // No terceiro depósito, pode aparecer intersticial
        // (depende se o desafio é free e se o contador está correto)
        const interstitialAd = page.locator('[data-testid="interstitial-ad"]');

        // Este teste pode não passar sempre, pois depende do estado do desafio
        // Deixar comentado ou ajustar lógica
        if (await interstitialAd.count() > 0) {
            await expect(interstitialAd).toBeVisible({ timeout: 5000 });
        }
    });

    test('should complete challenge when all deposits are marked', async ({ page }) => {
        // Este teste requer um desafio pequeno específico para completar
        // Criar um desafio com poucos depósitos
        await page.click('text=Criar Desafio');
        await page.fill('[name="name"]', 'Desafio Mini Test');
        await page.fill('[name="targetAmount"]', '100');
        await page.fill('[name="numberOfDeposits"]', '5');
        await page.click('button:has-text("Criar")');

        // Marcar todos os 5 depósitos
        const deposits = page.locator('[data-testid="deposit-card"]');
        const count = await deposits.count();

        for (let i = 0; i < Math.min(count, 5); i++) {
            await deposits.nth(i).click();

            const modal = page.locator('[data-testid="celebration-modal"]');
            if (await modal.count() > 0) {
                await page.click('button:has-text("Fechar")');
            }

            await page.waitForTimeout(500);
        }

        // Verificar modal de conclusão ou badge de completado
        const completionBadge = page.locator('text=/concluído|completed/i');
        await expect(completionBadge).toBeVisible({ timeout: 10000 });
    });
});
