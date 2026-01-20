---
status: pending
---

# Task 2.0: Authentication UI (Frontend)

## Overview

Implementar as páginas de Login, Register e AuthContext no frontend React, utilizando Firebase Auth SDK diretamente.

**MUST READ**: Before starting, review:
- `docs/ai_guidance/rules/react.mdc`
- Tech Spec seção "Frontend Changes"

## Requirements

- Página de Login com Email/Password
- Página de Register com campos: email, password, displayName
- Campo opcional de referralCode no Register
- AuthContext com estado do usuário logado
- Rotas protegidas (redirect para login se não autenticado)
- Recuperação de senha via Firebase

## Subtasks

- [ ] 2.1 Criar `src/contexts/AuthContext.tsx` com provider
- [ ] 2.2 Criar `src/services/authService.ts` (signup, login, logout, resetPassword)
- [ ] 2.3 Criar página `src/pages/Login.tsx`
- [ ] 2.4 Criar página `src/pages/Register.tsx` (com campo referralCode opcional)
- [ ] 2.5 Criar componente `ProtectedRoute.tsx` para rotas autenticadas
- [ ] 2.6 Atualizar `App.tsx` com AuthProvider e novas rotas
- [ ] 2.7 Criar `src/services/userService.ts` com `createUserDocument()`
- [ ] 2.8 No Register, ao criar conta, criar documento em `users/{uid}` no Firestore
- [ ] 2.9 Implementar testes unitários para authService
- [ ] 2.10 Testar fluxo completo: Register → Auto-login → Redirect para home

## Implementation Details

### AuthContext

```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string, referralCode?: string) => Promise<void>;
  logout: () => Promise<void>;
}
```

### User Document (Firestore)

Ao registrar, criar documento com:
```typescript
{
  email: user.email,
  displayName: displayName,
  isPremium: false,
  trialExpiresAt: Timestamp.fromDate(addDays(new Date(), 3)),
  referralCode: generateReferralCode(), // 8 chars
  referredBy: referralCode || null,
  referralRewardClaimed: false,
  asaasCustomerId: null,
  createdAt: Timestamp.now()
}
```

### Relevant Files

- `frontend/src/contexts/AuthContext.tsx` [NEW]
- `frontend/src/services/authService.ts` [NEW]
- `frontend/src/services/userService.ts` [NEW]
- `frontend/src/pages/Login.tsx` [NEW]
- `frontend/src/pages/Register.tsx` [NEW]
- `frontend/src/components/ProtectedRoute.tsx` [NEW]
- `frontend/src/App.tsx` [MODIFY]

## Success Criteria

- [ ] Usuário consegue criar conta com email/password
- [ ] Usuário consegue fazer login
- [ ] Documento criado no Firestore em `users/{uid}`
- [ ] Usuário é redirecionado para home após login
- [ ] Rotas protegidas redirecionam para /login se não autenticado
- [ ] Testes passam
