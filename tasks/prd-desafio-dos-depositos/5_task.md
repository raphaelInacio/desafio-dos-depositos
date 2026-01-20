---
status: pending
---

# Task 5.0: Savings Journal (Upload de Recibos)

## Overview

Implementar a funcionalidade de upload de fotos (recibos) ao marcar um depósito, com armazenamento no Firebase Storage e visualização em galeria.

**MUST READ**: Before starting, review:
- `docs/ai_guidance/rules/react.mdc`
- Tech Spec seção "Data Models" (campo `receiptImageUrl`)

## Requirements

- Ao marcar depósito, opção de anexar foto
- Upload para Firebase Storage em `users/{uid}/receipts/{filename}`
- URL salva no documento do deposit
- Galeria de todos os recibos do challenge
- Compressão de imagem no client-side antes do upload

## Subtasks

- [ ] 5.1 Criar `frontend/src/services/storageService.ts` com `uploadReceipt()`
- [ ] 5.2 Implementar compressão de imagem client-side (canvas resize)
- [ ] 5.3 Modificar `frontend/src/components/DepositCard.tsx` para incluir botão de anexar foto
- [ ] 5.4 Criar modal `frontend/src/components/ReceiptUploadModal.tsx`
- [ ] 5.5 Ao fazer upload, atualizar `deposit.receiptImageUrl` no Firestore
- [ ] 5.6 Criar componente `frontend/src/components/ReceiptGallery.tsx` com grid de imagens
- [ ] 5.7 Adicionar rota/tab para acessar galeria do challenge
- [ ] 5.8 Implementar preview da imagem antes do upload
- [ ] 5.9 Adicionar loading state durante upload
- [ ] 5.10 Testar fluxo completo: marcar depósito → upload → ver na galeria

## Implementation Details

### storageService.ts

```typescript
export async function uploadReceipt(
  uid: string, 
  challengeId: string, 
  depositId: number, 
  file: File
): Promise<string> {
  const compressedFile = await compressImage(file, { maxWidth: 1024, quality: 0.8 });
  const path = `users/${uid}/receipts/${challengeId}_${depositId}_${Date.now()}.jpg`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, compressedFile);
  return getDownloadURL(storageRef);
}
```

### DepositCard modification

Adicionar ícone de câmera no card quando clicado, mostrando opção de "Anexar Comprovante".

### Relevant Files

- `frontend/src/services/storageService.ts` [NEW]
- `frontend/src/components/DepositCard.tsx` [MODIFY]
- `frontend/src/components/ReceiptUploadModal.tsx` [NEW]
- `frontend/src/components/ReceiptGallery.tsx` [NEW]

## Success Criteria

- [ ] Upload funciona e imagem aparece no Firebase Storage console
- [ ] URL salva corretamente no documento do deposit
- [ ] Galeria mostra todas as imagens do challenge
- [ ] Imagens são comprimidas antes do upload (< 500KB)
- [ ] Loading state visível durante upload
