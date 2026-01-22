---
status: completed
---

# Task 4.0: Backend Setup + Payment Integration

## Overview

Criar o backend Spring Boot com Firebase Admin SDK para processar pagamentos via Asaas. O backend é mínimo: apenas checkout session e webhook handler.

**MUST READ**: Before starting, review:
- `docs/ai_guidance/rules/use-java-spring-boot.mdc`
- `docs/ai_guidance/rules/asaas-integration.md`
- Tech Spec seção "API Endpoints"

## Requirements

- Spring Boot project com Firebase Admin SDK
- Endpoint POST /api/checkout → cria Asaas checkout session
- Endpoint POST /api/webhooks/asaas → processa PAYMENT_CONFIRMED
- Atualiza `users/{uid}.isPremium = true` via Admin SDK
- Deploy ready para Cloud Run

## Subtasks

- [x] 4.1 Criar projeto Spring Boot (Maven, Java 17+)
- [x] 4.2 Adicionar dependências: Firebase Admin, Spring Web, Lombok
- [x] 4.3 Configurar Firebase Admin SDK com service account JSON
- [x] 4.4 Criar `PaymentController` com endpoint `/api/checkout`
- [x] 4.5 Criar `AsaasService` para chamar API de checkout session
- [x] 4.6 Criar `WebhookController` para `/api/webhooks/asaas`
- [x] 4.7 Implementar `handlePaymentConfirmed()` que atualiza Firestore
- [x] 4.8 Adicionar validação de assinatura do webhook Asaas
- [x] 4.9 Configurar CORS para aceitar requests do frontend
- [x] 4.10 Criar Dockerfile para deploy
- [x] 4.11 Implementar testes unitários e de integração
- [x] 4.12 Testar fluxo completo no sandbox Asaas

## Implementation Details

### pom.xml dependencies

```xml
<dependency>
    <groupId>com.google.firebase</groupId>
    <artifactId>firebase-admin</artifactId>
    <version>9.2.0</version>
</dependency>
```

### PaymentController

```java
@RestController
@RequestMapping("/api")
public class PaymentController {
    
    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> createCheckout(@RequestBody CheckoutRequest request) {
        String checkoutUrl = asaasService.createCheckoutSession(request.getUserId());
        return ResponseEntity.ok(new CheckoutResponse(checkoutUrl));
    }
}
```

### WebhookController

```java
@PostMapping("/webhooks/asaas")
public ResponseEntity<Void> handleAsaasWebhook(@RequestBody AsaasWebhookEvent event) {
    if ("PAYMENT_CONFIRMED".equals(event.getEvent())) {
        String userId = event.getPayment().getExternalReference();
        paymentService.activatePremium(userId);
    }
    return ResponseEntity.ok().build();
}
```

### Relevant Files

- `backend/` [NEW - entire module]
- `backend/src/main/java/.../controller/PaymentController.java`
- `backend/src/main/java/.../controller/WebhookController.java`
- `backend/src/main/java/.../service/AsaasService.java`
- `backend/src/main/java/.../service/PaymentService.java`
- `backend/Dockerfile`

## Success Criteria

- [ ] `/api/checkout` retorna URL válida do Asaas sandbox
- [ ] Webhook recebido atualiza `isPremium = true` no Firestore
- [ ] Testes de integração passam
- [ ] Docker build funciona
- [ ] Frontend consegue chamar endpoint com CORS configurado
