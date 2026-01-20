---
status: pending
---

# Task 10.0: Ad System Integration (Google AdSense)

## Overview

Implementar sistema de anúncios para usuários free, com banner fixo no rodapé e intersticiais após marcar depósitos. Desafios pagos (R$ 4,99) são ad-free.

**MUST READ**: Before starting, review:
- Tech Spec seção "Ad System (Google AdSense)"
- PRD seção "6. Monetization (Ads + Pay-Per-Challenge)"

## Requirements

- Banner fixo 320x50 no rodapé para desafios não pagos
- Intersticial a cada 3 depósitos marcados
- Desafios com `isPaid = true` não exibem nenhum ad
- Contador de depósitos persiste no Firestore
- Integração com Google AdSense

## Subtasks

- [ ] 10.1 Criar conta Google AdSense e obter ad-unit IDs
- [ ] 10.2 Criar `frontend/src/components/ads/AdBanner.tsx`
- [ ] 10.3 Criar `frontend/src/hooks/useInterstitialAd.ts`
- [ ] 10.4 Atualizar model `Challenge` com campos `isPaid` e `adsDepositCounter`
- [ ] 10.5 Modificar `frontend/src/services/challengeService.ts` para incrementar contador
- [ ] 10.6 Integrar `AdBanner` no layout principal (`frontend/src/App.tsx` ou `Layout.tsx`)
- [ ] 10.7 Integrar lógica de intersticial em `markDeposit()`
- [ ] 10.8 Adicionar script do AdSense no `frontend/index.html`
- [ ] 10.9 Testar exibição de ads em ambiente de desenvolvimento
- [ ] 10.10 Verificar que desafios pagos não exibem ads

## Implementation Details

### AdBanner Component

```typescript
// frontend/src/components/ads/AdBanner.tsx
import { useEffect } from 'react';

interface AdBannerProps {
  challenge: { isPaid: boolean };
}

export function AdBanner({ challenge }: AdBannerProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  if (challenge.isPaid) return null;

  return (
    <div className="ad-banner-container">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXX"
        data-ad-slot="XXXXX"
        data-ad-format="horizontal"
      />
    </div>
  );
}
```

### Interstitial Hook

```typescript
// frontend/src/hooks/useInterstitialAd.ts
export function useInterstitialAd() {
  const showAd = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      // AdSense interstitial via Google Publisher Tag
      // Fallback: resolve(true) se ad não disponível
      resolve(true);
    });
  };

  return { showAd };
}
```

### Challenge Model Update

```typescript
interface Challenge {
  // ... campos existentes
  isPaid: boolean;           // default: false
  adsDepositCounter: number; // default: 0
}
```

### Relevant Files

- `frontend/src/components/ads/AdBanner.tsx` [NEW]
- `frontend/src/hooks/useInterstitialAd.ts` [NEW]
- `frontend/src/services/challengeService.ts` [MODIFY]
- `frontend/index.html` [MODIFY - add AdSense script]
- `frontend/src/App.tsx` [MODIFY - add AdBanner]

## Success Criteria

- [ ] Banner aparece no rodapé para desafios free
- [ ] Intersticial exibe após cada 3 depósitos marcados
- [ ] Desafio pago não mostra nenhum ad
- [ ] Contador de depósitos persiste no Firestore
- [ ] Console não mostra erros de AdSense
- [ ] Layout não quebra com o banner
