---
status: completed
---

# Task 8.0: Premium Features (Themes & Multi-Challenge)

## Overview

Implementar as funcionalidades exclusivas para usuários Premium: múltiplos desafios ativos e temas customizados.

**MUST READ**: Before starting, review:
- PRD seção "Monetization (Low-Ticket Premium)"

## Requirements

- Premium pode criar desafios ilimitados
- Premium pode escolher entre temas (Dark, Pastel, Neon)
- Página de upgrade integrada com checkout
- Gate de features premium (mostrar modal de upgrade se free)

## Subtasks

- [ ] 8.1 Criar `frontend/src/services/paymentService.ts` que chama backend `/api/checkout`
- [ ] 8.2 Criar página `frontend/src/pages/UpgradePage.tsx` com CTA e benefícios
- [ ] 8.3 Implementar listener para `isPremium` changes (realtime update)
- [ ] 8.4 Criar sistema de temas com CSS variables em `frontend/src/index.css`
- [ ] 8.5 Criar componente `frontend/src/components/ThemeSelector.tsx` para Premium users
- [ ] 8.6 Adicionar gate na criação de múltiplos desafios
- [ ] 8.7 Criar modal `frontend/src/components/UpgradeModal.tsx` para upsell
- [ ] 8.8 Adicionar página/lista de desafios para quem tem múltiplos
- [ ] 8.9 Testar fluxo completo de upgrade

## Implementation Details

### Temas CSS

```css
:root {
  --theme-primary: #6366f1;
  --theme-background: #ffffff;
  /* ... */
}

[data-theme="dark"] {
  --theme-primary: #818cf8;
  --theme-background: #0f172a;
}

[data-theme="pastel"] {
  --theme-primary: #f472b6;
  --theme-background: #fdf2f8;
}

[data-theme="neon"] {
  --theme-primary: #22d3ee;
  --theme-background: #020617;
}
```

### Premium Gate

```typescript
function requirePremium(user: User, action: string): boolean {
  if (user.isPremium) return true;
  
  // Mostrar modal de upgrade
  showUpgradeModal(action);
  return false;
}
```

### Relevant Files

- `frontend/src/services/paymentService.ts` [NEW]
- `frontend/src/pages/UpgradePage.tsx` [NEW]
- `frontend/src/components/ThemeSelector.tsx` [NEW]
- `frontend/src/components/UpgradeModal.tsx` [NEW]
- `frontend/src/index.css` [MODIFY - add theme variables]

## Success Criteria

- [ ] Clique em Upgrade redireciona para Asaas checkout
- [ ] Após pagamento, `isPremium` atualiza em realtime
- [ ] Premium pode trocar de tema
- [ ] Premium pode criar múltiplos desafios
- [ ] Free user vê modal de upgrade ao tentar features premium
