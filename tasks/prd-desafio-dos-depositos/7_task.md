---
status: completed
---

# Task 7.0: Referral System

## Overview

Implementar o sistema de indicação que permite ao usuário convidar amigos e ganhar trial completo para 1 desafio quando o convidado criar conta e iniciar um desafio.

**MUST READ**: Before starting, review:
- Tech Spec seção "Referral System"

## Requirements

- Cada usuário tem um `referralCode` único de 8 caracteres
- URL de convite: `https://app.com/?ref=ABC12345`
- Ao registrar com referralCode, salvar `referredBy` no documento
- Quando convidado criar primeiro desafio, marcar `referralRewardClaimed = true` no referente
- Referente ganha trial para completar 1 desafio inteiro

## Subtasks

- [ ] 7.1 Gerar `referralCode` único no registro (verificar unicidade)
- [ ] 7.2 Adicionar botão "Convidar Amigo" com share do link
- [ ] 7.3 Na página `frontend/src/pages/Register.tsx`, ler `ref` da URL e preencher campo
- [ ] 7.4 Ao criar primeiro desafio, verificar se tem `referredBy`
- [ ] 7.5 Se sim, atualizar documento do referente com reward
- [ ] 7.6 Criar componente `frontend/src/components/ReferralCard.tsx` mostrando código e status
- [ ] 7.7 Implementar lógica `canCreateChallenge()` em `frontend/src/services/challengeService.ts` considerando referral
- [ ] 7.8 Adicionar testes para fluxo de referral

## Implementation Details

### Geração de Referral Code

```typescript
function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // evita confusão O/0, I/1
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
```

### Fluxo de Reward

```typescript
// Em challengeService.createChallenge()
async function handleReferralReward(newUser: User) {
  if (newUser.referredBy && !alreadyRewarded) {
    // Buscar referente
    const referrerDoc = await getDoc(doc(db, 'users', newUser.referredBy));
    if (referrerDoc.exists()) {
      await updateDoc(referrerDoc.ref, {
        referralRewardClaimed: true,
        trialExpiresAt: null // trial infinito para 1 desafio
      });
    }
  }
}
```

### Relevant Files

- `frontend/src/services/userService.ts` [MODIFY - add referral logic]
- `frontend/src/services/challengeService.ts` [MODIFY - trigger reward]
- `frontend/src/components/ReferralCard.tsx` [NEW]
- `frontend/src/pages/Register.tsx` [MODIFY - read ref param]

## Success Criteria

- [ ] Botão de compartilhar link funciona
- [ ] Register captura `ref` da URL
- [ ] Ao criar desafio, referente recebe reward
- [ ] Referente consegue criar 1 desafio completo com trial infinito
- [ ] Testes passam
