---
status: completed
---

# Task 6.0: Social Share (Imagem Fixa)

## Overview

Implementar o botão de compartilhamento com imagem fixa e texto dinâmico usando a Web Share API.

**MUST READ**: Before starting, review:
- Tech Spec seção "Social Share (Simplificado)"

## Requirements

- Botão "Compartilhar Progresso" no header do tracker
- Usa Web Share API quando disponível
- Texto dinâmico com porcentagem e valor economizado
- Imagem estática pré-definida
- Fallback para copiar texto se Share API não disponível

## Subtasks

- [ ] 6.1 Criar imagem estática para share em `frontend/public/share/challenge-share.png`
- [ ] 6.2 Criar `frontend/src/services/shareService.ts` com `shareProgress()`
- [ ] 6.3 Adicionar botão de share no `frontend/src/components/ProgressHeader.tsx`
- [ ] 6.4 Implementar fallback (copiar texto + toast de confirmação)
- [ ] 6.5 Adicionar analytics event ao compartilhar (console.log por ora)
- [ ] 6.6 Testar em dispositivo móvel (WhatsApp, Instagram)

## Implementation Details

### shareService.ts

```typescript
export async function shareProgress(challenge: Challenge, stats: ChallengeStats): Promise<boolean> {
  const text = `🎯 ${stats.progressPercentage}% do meu desafio "${challenge.name}"! Já economizei ${formatCurrency(stats.savedSoFar)}. #DesafioDosDepositos`;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Desafio dos Depósitos',
        text,
        url: window.location.origin
      });
      return true;
    } catch (e) {
      // User cancelled or error
      return false;
    }
  }
  
  // Fallback: copy to clipboard
  await navigator.clipboard.writeText(text);
  return true;
}
```

### Imagem Share

Criar uma imagem vibrante 1200x630px (tamanho ideal para redes sociais) com:
- Logo do app
- Texto motivacional genérico
- Call-to-action

### Relevant Files

- `frontend/public/share/challenge-share.png` [NEW]
- `frontend/src/services/shareService.ts` [NEW]
- `frontend/src/components/ProgressHeader.tsx` [MODIFY - add share button]

## Success Criteria

- [ ] Botão de share visível no header
- [ ] Clique abre share sheet em mobile
- [ ] Texto inclui porcentagem e valor dinamicamente
- [ ] Fallback copia texto e mostra toast
- [ ] Nenhum erro no console
