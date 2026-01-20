---
status: pending
---

# Task 3.0: Cloud Sync Migration (Firestore)

## Overview

Migrar a persistência de challenges e deposits de localStorage para Firestore, mantendo a interface do hook `useChallengeStore` para minimizar mudanças nos componentes existentes.

**MUST READ**: Before starting, review:
- `docs/ai_guidance/rules/firestore-nosql.mdc`
- Tech Spec seção "Data Models (Firestore)"

## Requirements

- Challenges persistidos em `users/{uid}/challenges/{challengeId}`
- Deposits persistidos como subcollection `deposits/`
- Hook `useChallengeStore` deve manter mesma interface
- Realtime updates via Firestore listeners
- Migração transparente (componentes existentes não precisam mudar)

## Subtasks

- [ ] 3.1 Criar `frontend/src/services/challengeService.ts` com CRUD Firestore
- [ ] 3.2 Implementar `createChallenge()` que cria challenge + deposits batch
- [ ] 3.3 Implementar `getChallenges()` com query por userId
- [ ] 3.4 Implementar `getDeposits()` para subcollection
- [ ] 3.5 Implementar `updateDeposit()` para toggle isPaid
- [ ] 3.6 Refatorar `frontend/src/hooks/useChallengeStore.ts` para usar Firestore
- [ ] 3.7 Adicionar listener realtime com `onSnapshot`
- [ ] 3.8 Manter fallback para localStorage se não autenticado (modo offline)
- [ ] 3.9 Implementar testes unitários para challengeService
- [ ] 3.10 Testar fluxo: criar desafio → marcar depósitos → refresh página → dados persistem

## Implementation Details

### challengeService.ts

```typescript
export async function createChallenge(uid: string, input: ChallengeInput): Promise<Challenge> {
  const challengeRef = doc(collection(db, `users/${uid}/challenges`));
  const challenge: Challenge = {
    id: challengeRef.id,
    ...input,
    createdAt: Timestamp.now(),
    completedAt: null
  };
  
  // Batch write: challenge + deposits
  const batch = writeBatch(db);
  batch.set(challengeRef, challenge);
  
  const deposits = generateDeposits(input.targetAmount, input.numberOfDeposits, input.mode);
  for (const deposit of deposits) {
    const depositRef = doc(collection(challengeRef, 'deposits'), deposit.id.toString());
    batch.set(depositRef, deposit);
  }
  
  await batch.commit();
  return challenge;
}
```

### Relevant Files

- `frontend/src/services/challengeService.ts` [NEW]
- `frontend/src/hooks/useChallengeStore.ts` [MODIFY - major refactor]
- `frontend/src/lib/challengeUtils.ts` [Keep as-is, reuse generateDeposits]

## Success Criteria

- [ ] Criar challenge salva no Firestore (verificar no console)
- [ ] Marcar depósito atualiza Firestore em realtime
- [ ] Refresh da página mantém dados
- [ ] Logout + Login mostra mesmos dados
- [ ] Componentes existentes (TrackerGrid, DepositCard) funcionam sem alterações
- [ ] Testes passam
