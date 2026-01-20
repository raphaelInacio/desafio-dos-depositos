---
status: completed
---

# Task 1.0: Firebase Project Setup

## Overview

Configuração inicial do projeto Firebase incluindo Auth, Firestore e Storage. Esta é a tarefa fundacional que habilita todas as outras trilhas de desenvolvimento.

**MUST READ**: Before starting, review:
- `docs/ai_guidance/rules/firestore-nosql.mdc`

## Requirements

- Firebase project criado no console
- Firebase Auth habilitado (Email/Password provider)
- Firestore database criado (production mode)
- Firebase Storage bucket criado
- Security Rules configuradas conforme Tech Spec
- Firebase SDK configurado no frontend

## Subtasks

- [ ] 1.1 Criar projeto Firebase no console (desafio-dos-depositos)
- [ ] 1.2 Habilitar Authentication com provider Email/Password
- [ ] 1.3 Criar Firestore database em modo production
- [ ] 1.4 Criar Storage bucket
- [ ] 1.5 Configurar Security Rules do Firestore (copiar do Tech Spec)
- [ ] 1.6 Configurar Storage Rules (permitir upload apenas para usuário autenticado)
- [ ] 1.7 Instalar Firebase SDK no frontend (`npm install firebase`)
- [ ] 1.8 Criar `src/services/firebase.ts` com inicialização do app
- [ ] 1.9 Adicionar variáveis de ambiente (`.env`) para Firebase config
- [ ] 1.10 Testar conexão básica com Firestore (criar documento de teste)

## Implementation Details

### Firebase Config (src/services/firebase.ts)

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### Security Rules (Firestore)

Ver Tech Spec seção "Firestore Security Rules".

### Relevant Files

- `frontend/src/services/firebase.ts` [NEW]
- `frontend/.env` [MODIFY]
- `frontend/.env.example` [NEW]

## Success Criteria

- [ ] Firebase console mostra projeto ativo
- [ ] Frontend consegue importar `auth`, `db`, `storage` sem erros
- [ ] Console do browser não mostra erros de Firebase config
- [ ] Teste manual: criar documento no Firestore via código e verificar no console
