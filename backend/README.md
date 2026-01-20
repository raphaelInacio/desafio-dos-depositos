# Desafio dos Depósitos - Backend

Backend minimal Spring Boot para processar pagamentos via Asaas.

## Tecnologias

- Java 17
- Spring Boot 3.2.1
- Firebase Admin SDK 9.2.0
- Maven

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` ou configure as seguintes variáveis:

```bash
ASAAS_API_KEY=seu_api_key_sandbox
FIREBASE_SERVICE_ACCOUNT_PATH=caminho/para/firebase-service-account.json
FRONTEND_URL=http://localhost:5173
```

### Firebase Service Account

1. Acesse o Firebase Console
2. Project Settings > Service Accounts
3. Clique em "Generate new private key"
4. Salve o arquivo como `firebase-service-account.json` em `src/main/resources/`
5. **IMPORTANTE**: Este arquivo está no `.gitignore` e não deve ser commitado

## Desenvolvimento

### Executar localmente

```bash
mvn spring-boot:run
```

### Build

```bash
mvn clean package
```

### Docker

```bash
docker build -t desafio-backend .
docker run -p 8080:8080 \
  -e ASAAS_API_KEY=seu_key \
  -e FIREBASE_SERVICE_ACCOUNT_PATH=/app/firebase-service-account.json \
  -v /caminho/local/firebase-service-account.json:/app/firebase-service-account.json \
  desafio-backend
```

## Endpoints

### POST /api/checkout

Cria checkout session para pagamento de R$ 4,99.

**Request:**
```json
{
  "userId": "firebase-uid",
  "email": "user@example.com",
  "name": "Nome do Usuário"
}
```

**Response:**
```json
{
  "checkoutUrl": "https://sandbox.asaas.com/c/..."
}
```

### POST /api/webhooks/asaas

Recebe webhooks do Asaas para confirmar pagamentos.

Eventos processados:
- `PAYMENT_CONFIRMED`: Ativa premium no Firestore

## Estrutura do Projeto

```
backend/
├── src/main/java/com/desafiodosdepositos/backend/
│   ├── shared/              # Configurações compartilhadas
│   │   ├── config/          # Firebase, CORS
│   │   └── exception/       # PaymentException
│   ├── payment/             # Feature de pagamento
│   │   ├── controller/      # PaymentController
│   │   ├── service/         # AsaasService, PaymentService
│   │   └── dto/             # DTOs de pagamento
│   └── webhook/             # Feature de webhook
│       ├── controller/      # WebhookController
│       └── dto/             # DTOs de webhook
```
