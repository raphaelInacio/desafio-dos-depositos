---
status: pending
---

# Task 9.0: E2E Tests & Final Integration

## Overview

Implementar testes end-to-end para validar todos os fluxos críticos e garantir que a integração entre frontend, Firebase e backend está funcionando corretamente.

**MUST READ**: Before starting, review:
- `docs/ai_guidance/rules/e2e-testing.mdc`
- Tech Spec seção "Testing Approach"

## Requirements

- Testes E2E para fluxos críticos
- Testes de integração frontend ↔ Firebase
- Testes de integração backend ↔ Asaas (sandbox)
- Validação de Security Rules
- Performance baseline

## Subtasks

- [ ] 9.1 Setup framework de E2E (Playwright ou Cypress)
- [ ] 9.2 Criar test para: Signup → Login → Logout
- [ ] 9.3 Criar test para: Create Challenge → Mark Deposits → Complete
- [ ] 9.4 Criar test para: Referral flow (A invites B → B signup → A reward)
- [ ] 9.5 Criar test para: Premium upgrade flow (mock)
- [ ] 9.6 Criar test para: Upload receipt → View gallery
- [ ] 9.7 Testar Security Rules (tentar acessar dados de outro usuário)
- [ ] 9.8 Medir performance (Lighthouse score)
- [ ] 9.9 Criar script de CI/CD para rodar testes
- [ ] 9.10 Documentar resultados e coverage

## Implementation Details

### Playwright Setup

```typescript
// e2e/auth.spec.ts
test.describe('Authentication', () => {
  test('user can signup and login', async ({ page }) => {
    await page.goto('/register');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.fill('[name="displayName"]', 'Test User');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Criar Desafio')).toBeVisible();
  });
});
```

### Security Rules Test

```typescript
// test/security-rules.test.ts
test('user cannot access other user data', async () => {
  const userA = await signInAsUser('userA@test.com');
  const userB = await signInAsUser('userB@test.com');
  
  // userB tenta ler dados de userA
  await expect(
    getDoc(doc(db, `users/${userA.uid}/challenges/xxx`))
  ).rejects.toThrow('permission-denied');
});
```

### Relevant Files

- `frontend/e2e/` [NEW - entire folder]
- `frontend/e2e/auth.spec.ts`
- `frontend/e2e/challenge.spec.ts`
- `frontend/e2e/referral.spec.ts`
- `frontend/e2e/premium.spec.ts`
- `frontend/playwright.config.ts` [NEW]

## Success Criteria

- [ ] Todos os testes E2E passam
- [ ] Security Rules bloqueiam acesso não autorizado
- [ ] Lighthouse score > 80 em Performance
- [ ] CI/CD pipeline configurado e executando
- [ ] Documentação de cobertura de testes
