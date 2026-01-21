# E2E Tests - Desafio dos Depósitos

Documentação completa dos testes end-to-end implementados com Playwright.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Executando os Testes](#executando-os-testes)
- [Credenciais de Teste](#credenciais-de-teste)
- [Convenções](#convenções)
- [Debugging](#debugging)
- [CI/CD](#cicd)

## Visão Geral

Os testes E2E validam os fluxos críticos da aplicação:

- ✅ **Authentication**: Signup, Login, Logout
- ✅ **Challenges**: Criação, marcação de depósitos, conclusão
- ✅ **Referral**: Sistema de indicação e recompensas
- ✅ **Premium**: Upgrade flow, temas, múltiplos desafios

## Estrutura de Pastas

```
frontend/e2e/
├── helpers/
│   ├── auth-helpers.ts      # Helpers de autenticação
│   └── test-data.ts         # Factory de dados de teste
├── auth.spec.ts             # Testes de autenticação
├── challenge.spec.ts        # Testes de challenges
├── referral.spec.ts         # Testes de referral
├── premium.spec.ts          # Testes de premium features
└── README.md                # Esta documentação
```

## Executando os Testes

### Localmente

```bash
# Executar todos os testes
npm run test:e2e

# Executar em modo UI (interativo)
npm run test:e2e:ui

# Executar em modo debug
npm run test:e2e:debug

# Ver relatório de testes
npm run test:e2e:report
```

### Executar testes específicos

```bash
# Apenas testes de autenticação
npx playwright test auth.spec.ts

# Apenas testes de challenges
npx playwright test challenge.spec.ts

# Executar teste específico
npx playwright test -g "should login with existing user"
```

### Modos de execução

```bash
# Executar em modo headless (padrão)
npm run test:e2e

# Executar com browser visível
npx playwright test --headed

# Executar apenas no mobile (Pixel 5)
npx playwright test --project=chromium-mobile

# Executar apenas no desktop
npx playwright test --project=chromium-desktop
```

## Credenciais de Teste

Para validação manual e execução de testes:

```
Email: contato.raphaelinacio@gmail.com
Senha: 1234567
```

> **Nota**: Os testes também criam usuários temporários dinamicamente para cenários de signup.

## Convenções

### Data Test IDs

Os testes utilizam `data-testid` para seletores estáveis:

```tsx
// ✅ Bom
<button data-testid="create-challenge-button">Criar</button>

// ❌ Evitar
<button className="btn-primary">Criar</button>  // Coupling com CSS
```

### Principais Test IDs

| Test ID | Elemento | Localização |
|---------|----------|-------------|
| `user-menu` | Menu do usuário | Header |
| `logout-button` | Botão de logout | User Menu |
| `deposit-grid` | Grid de depósitos | Challenge Page |
| `deposit-card` | Card individual de depósito | Deposit Grid |
| `celebration-modal` | Modal de celebração | Após marcar depósito |
| `progress-bar` | Barra de progresso | Challenge Header |
| `total-saved` | Total economizado | Stats Header |
| `ad-banner` | Banner de anúncio | Footer |
| `referral-card` | Card de referral | Dashboard |
| `referral-code` | Código de referral | Referral Card |
| `upgrade-cta` | Botão de upgrade | Dashboard/Banner |
| `theme-selector` | Seletor de temas | Settings/Header |

### Estrutura de Testes

```typescript
test.describe('Feature Name', () => {
  // Setup antes de cada teste
  test.beforeEach(async ({ page }) => {
    // Login, navegação, etc.
  });

  test('should do something specific', async ({ page }) => {
    // Arrange - preparar estado
    // Act - executar ação
    // Assert - verificar resultado
  });
});
```

## Debugging

### Playwright Inspector

```bash
# Abrir inspector para debug passo a passo
npm run test:e2e:debug
```

### Traces

Após uma falha de teste, visualizar trace:

```bash
# Ver relatório HTML (inclui traces)
npm run test:e2e:report
```

### Screenshots e Vídeos

Configurado automaticamente em `playwright.config.ts`:

- **Screenshots**: Capturados em falhas
- **Vídeos**: Gravados em falhas
- **Traces**: Coletados no primeiro retry

Localização: `playwright-report/` e `test-results/`

### Console Logs

Ver logs do browser durante testes:

```typescript
test('my test', async ({ page }) => {
  page.on('console', msg => console.log('Browser:', msg.text()));
  // ... resto do teste
});
```

## Mocking

### API Calls

Interceptar chamadas de API:

```typescript
await page.route('**/api/checkout', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ checkoutUrl: 'https://mock.url' })
  });
});
```

### Firebase Emulator

Para testes com Firebase, configurar emulador:

```typescript
// Antes dos testes, iniciar Firebase Emulator
// firebase emulators:start
```

## CI/CD

### GitHub Actions

Pipeline configurado em `.github/workflows/e2e.yml`:

- Trigger: PRs e push para `main`
- Executa todos os testes E2E
- Upload de artifacts (screenshots, vídeos, traces)
- Integração com Lighthouse para performance

### Variáveis de Ambiente

```bash
CI=true  # Ativa modo CI (retries, reporters específicos)
```

## Troubleshooting

### Testes falhando localmente

1. **Verificar dev server**: O Vite deve estar rodando em `http://localhost:5173`
2. **Limpar cache do Playwright**:
   ```bash
   npx playwright install --with-deps
   ```
3. **Verificar dependências**:
   ```bash
   npm install
   ```

### Timeouts

Se testes estiverem dando timeout:

1. Aumentar timeout global em `playwright.config.ts`:
   ```typescript
   timeout: 60000, // 60 segundos
   ```

2. Ou aumentar timeout específico no teste:
   ```typescript
   test('slow test', async ({ page }) => {
     test.setTimeout(120000); // 2 minutos
   });
   ```

### Seletores não encontrados

1. Verificar se elemento tem `data-testid`
2. Usar Playwright Inspector para inspecionar página
3. Verificar se elemento está dentro de iframe ou shadow DOM

## Contribuindo

### Adicionando novos testes

1. Criar arquivo `*.spec.ts` em `e2e/`
2. Seguir convenções de nomenclatura
3. Usar helpers existentes quando possível
4. Adicionar `data-testid` nos componentes necessários
5. Documentar test IDs neste README

### Code Review

Checklist para PRs de testes:

- [ ] Testes passam localmente
- [ ] Nomes descritivos e claros
- [ ] Uso de `data-testid` ao invés de seletores CSS
- [ ] Cleanup adequado (logout, reset de estado)
- [ ] Documentação atualizada

## Recursos

- [Playwright Docs](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Test Selectors](https://playwright.dev/docs/selectors)
- [Debugging Guide](https://playwright.dev/docs/debug)
