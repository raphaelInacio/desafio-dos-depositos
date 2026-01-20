# Technical Specification: Desafio dos Depósitos

## Executive Summary

O "Desafio dos Depósitos" é uma aplicação web mobile-first que gamifica desafios de poupança. Esta especificação detalha a arquitetura que utiliza **Firebase** (Auth, Firestore, Storage) diretamente no frontend para funcionalidades CRUD, com um backend **Spring Boot** dedicado exclusivamente a processamento de pagamentos via Asaas e lógica de webhooks.

O MVP frontend já existe com React + TailwindCSS + shadcn/ui, e esta spec foca em adicionar: autenticação, cloud sync, sistema premium com trial/referral, upload de recibos e pagamento.

---

## System Architecture

### Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                 FRONTEND (React - MVP Existente)                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │  Firebase│ │Challenge │ │ Savings  │ │  Social  │            │
│  │   Auth   │ │ Tracker  │ │ Journal  │ │  Share   │            │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────────┘            │
│       │            │            │                                │
│       ▼            ▼            ▼                                │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              Firebase SDK (Direct Connection)                ││
│  │        Auth │ Firestore │ Storage                           ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                               │
          Apenas Pagamentos    │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND (Spring Boot)                          │
│  ┌──────────────────────────┐  ┌───────────────────────────────┐│
│  │   PaymentController      │  │   WebhookController           ││
│  │   POST /api/checkout     │  │   POST /api/webhooks/asaas    ││
│  └────────────┬─────────────┘  └──────────────┬────────────────┘│
│               │                               │                  │
│  ┌────────────▼───────────────────────────────▼────────────────┐│
│  │                   PaymentService                             ││
│  │   - createCheckoutSession()                                  ││
│  │   - handlePaymentConfirmed()                                 ││
│  │   - updateUserPremiumStatus() → Firestore Admin SDK          ││
│  └──────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        EXTERNAL                                  │
│              ┌──────────────────────────┐                        │
│              │    Asaas Payment Gateway │                        │
│              │    (Checkout Session)    │                        │
│              └──────────────────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
```

### Responsabilidades

| Camada | Responsabilidade |
|--------|------------------|
| **Frontend** | Auth, CRUD de challenges/deposits, upload de recibos, UI/UX |
| **Firebase** | Auth, Firestore (dados), Storage (imagens) |
| **Backend** | Criar checkout session, processar webhooks, atualizar status premium |

---

## Implementation Design

### Data Models (Firestore)

#### Collection: `users/{uid}`

```typescript
interface User {
  email: string;
  displayName: string;
  isPremium: boolean;
  trialExpiresAt: Timestamp | null;       // null = sem trial ativo
  referralCode: string;                   // 8 chars único
  referredBy: string | null;              // uid do referente
  referralRewardClaimed: boolean;         // se ganhou trial por referral
  asaasCustomerId: string | null;
  createdAt: Timestamp;
}
```

#### Collection: `users/{uid}/challenges/{challengeId}`

```typescript
interface Challenge {
  id: string;
  name: string;
  targetAmount: number;
  numberOfDeposits: number;
  mode: 'classic' | 'fixed';
  createdAt: Timestamp;
  completedAt: Timestamp | null;
}
```

#### Collection: `users/{uid}/challenges/{challengeId}/deposits/{depositId}`

```typescript
interface Deposit {
  id: number;
  value: number;
  isPaid: boolean;
  paidAt: Timestamp | null;
  note: string | null;
  receiptImageUrl: string | null;
}
```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuário só acessa seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Subcollections seguem mesma regra
      match /challenges/{challengeId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
        
        match /deposits/{depositId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }
    }
    
    // Backend pode atualizar qualquer usuário (via Admin SDK - bypassa rules)
  }
}
```

### API Endpoints (Spring Boot)

| Method | Path | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/api/checkout` | Cria checkout session Asaas | Firebase Token |
| `POST` | `/api/webhooks/asaas` | Recebe eventos de pagamento | Asaas Signature |

#### POST /api/checkout

**Request:**
```json
{
  "userId": "firebase-uid"
}
```

**Response:**
```json
{
  "checkoutUrl": "https://sandbox.asaas.com/c/..."
}
```

#### POST /api/webhooks/asaas

**Payload (Asaas):**
```json
{
  "event": "PAYMENT_CONFIRMED",
  "payment": {
    "id": "pay_xxx",
    "externalReference": "firebase-uid",
    "value": 4.99,
    "status": "CONFIRMED"
  }
}
```

**Action:** Atualiza `users/{uid}.isPremium = true` via Admin SDK.

---

## Frontend Changes (MVP Existente)

### Novos Serviços

```typescript
// src/services/firebase.ts
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// src/services/userService.ts
export async function createUserDocument(user: FirebaseUser): Promise<void>;
export async function getUserDocument(uid: string): Promise<User | null>;
export async function updateUserPremiumStatus(uid: string, isPremium: boolean): Promise<void>;

// src/services/challengeService.ts
export async function createChallenge(uid: string, data: ChallengeInput): Promise<Challenge>;
export async function getChallenges(uid: string): Promise<Challenge[]>;
export async function getDeposits(uid: string, challengeId: string): Promise<Deposit[]>;
export async function updateDeposit(uid: string, challengeId: string, depositId: number, data: Partial<Deposit>): Promise<void>;

// src/services/paymentService.ts
export async function createCheckoutSession(uid: string): Promise<{checkoutUrl: string}>;
```

### Novas Páginas

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/login` | `LoginPage` | Email/Password + Google Sign-In |
| `/register` | `RegisterPage` | Signup + campo opcional referralCode |
| `/upgrade` | `UpgradePage` | CTA Premium + redirect para Asaas |

### Modificações Existentes

| Arquivo | Mudança |
|---------|---------|
| `useChallengeStore.ts` | Migrar de localStorage → Firestore |
| `Index.tsx` | Adicionar verificação de auth |
| `DepositCard.tsx` | Adicionar upload de recibo |

---

## Referral System

### Fluxo

1. Usuário A compartilha link: `https://app.com/?ref=ABC12345`
2. Usuário B cria conta com `referralCode` preenchido
3. Ao criar primeiro desafio, sistema verifica se B foi referido
4. Se sim: `users/{A}.referralRewardClaimed = true` + `trialExpiresAt = null` (trial infinito para completar 1 desafio)

### Lógica de Trial

```typescript
function canCreateChallenge(user: User, existingChallenges: number): boolean {
  // Premium pode criar ilimitados
  if (user.isPremium) return true;
  
  // Trial ativo (por tempo ou por referral)
  if (user.trialExpiresAt && user.trialExpiresAt > now()) return true;
  if (user.referralRewardClaimed) return existingChallenges === 0;
  
  // Free: máximo 1 desafio
  return existingChallenges === 0;
}
```

---

## Social Share (Simplificado)

### Implementação MVP

- **Imagem fixa** pré-definida em `/public/share/challenge-share.png`
- Texto dinâmico com progresso

```typescript
async function shareProgress(challenge: Challenge, stats: ChallengeStats) {
  const text = `🎯 ${stats.progressPercentage}% do meu desafio "${challenge.name}"! Já economizei ${formatCurrency(stats.savedSoFar)}. #DesafioDosDepositos`;
  
  if (navigator.share) {
    await navigator.share({
      title: 'Desafio dos Depósitos',
      text,
      url: 'https://app.com'
    });
  }
}
```

---

## Ad System (Google AdSense)

### Overview

Usuários free veem ads (banner + intersticial). Desafios pagos (R$ 4,99) são ad-free.

### Tipos de Ads

| Tipo | Localização | Frequência | Condição |
|------|------------|------------|----------|
| Banner | Rodapé (`AdBanner.tsx`) | Sempre visível | `challenge.isPaid === false` |
| Intersticial | Após `markDeposit()` | 1 a cada 3 depósitos | `!isPaid && counter % 3 === 0` |

### Challenge Model Update

```typescript
interface Challenge {
  // ... campos existentes
  isPaid: boolean;              // true = desafio comprado, sem ads
  adsDepositCounter: number;    // contador para frequência de intersticiais
}
```

### Componentes Frontend

```typescript
// frontend/src/components/ads/AdBanner.tsx
export function AdBanner({ challenge }: { challenge: Challenge }) {
  if (challenge.isPaid) return null;
  return <ins className="adsbygoogle" data-ad-slot="xxx" />;
}

// frontend/src/hooks/useInterstitialAd.ts
export function useInterstitialAd() {
  const showAd = async (): Promise<void> => {
    // Google AdSense interstitial logic
  };
  return { showAd };
}
```

### Fluxo de Integração

1. Usuário marca depósito
2. `challengeService.markDeposit()` incrementa `adsDepositCounter`
3. Se `counter % 3 === 0` e `!challenge.isPaid`:
   - Exibe intersticial
   - Após fechar, salva no Firestore
4. Banner permanece visível no footer enquanto `!isPaid`

---

## Testing Approach

### Unit Tests (Frontend)

- `challengeService.test.ts` - CRUD operations
- `userService.test.ts` - Auth flows
- `referral.test.ts` - Trial logic

### Integration Tests (Backend)

- `PaymentControllerTest.java` - Checkout creation
- `WebhookControllerTest.java` - Payment confirmation flow

### E2E Tests

- Signup → Create Challenge → Mark Deposits → Complete
- Referral flow (A invites B → B signs up → A gets reward)
- Premium upgrade flow

---

## Development Sequencing

### Build Order

1. **Firebase Setup** - Projeto, Auth, Firestore, Storage, Security Rules
2. **Auth Integration** - Login, Register, AuthContext
3. **Cloud Sync** - Migrar useChallengeStore para Firestore
4. **Backend Base** - Spring Boot + Firebase Admin SDK
5. **Pagamento** - Checkout endpoint + Webhook
6. **Referral** - Link sharing + reward logic
7. **Upload Recibos** - Firebase Storage integration
8. **Premium Features** - Temas, múltiplos desafios

### Technical Dependencies

- Firebase Project configurado
- Asaas API Key (sandbox)
- Cloud Run para deploy do backend

---

## Monitoring & Observability

### Logs

| Evento | Level | Dados |
|--------|-------|-------|
| User signup | INFO | userId, referralCode |
| Challenge created | INFO | userId, challengeId, mode |
| Payment confirmed | INFO | userId, paymentId, value |
| Webhook error | ERROR | event, error message |

### Metrics (Prometheus)

- `payments_total{status=success|failed}` - Counter
- `challenges_created_total{mode=classic|fixed}` - Counter
- `deposits_marked_total` - Counter

---

## Technical Considerations

### Key Decisions

| Decisão | Rationale |
|---------|-----------|
| Firebase SDK no frontend | Menor latência, realtime updates, menos código backend |
| Backend apenas para pagamentos | PCI compliance, webhook processing, Admin SDK |
| Trial por referral = 1 desafio completo | Incentiva viralização sem custo recorrente |
| Imagem de share fixa | Simplifica MVP, evita html2canvas complexity |

### Known Risks

| Risco | Mitigação |
|-------|-----------|
| Security Rules mal configuradas | Review cuidadoso, testes de acesso |
| Webhook não chega | Log + retry manual, idempotência |
| Abuso de trial | Limite de 1 desafio para free users |

### Standards Compliance

- [x] Firebase Auth para autenticação
- [x] Firestore NoSQL patterns (`firestore-nosql.mdc`)
- [x] Spring Boot para backend (`use-java-spring-boot.mdc`)
- [x] Asaas via Checkout Session (`asaas-integration.md`)
- [x] React patterns (`react.mdc`)
