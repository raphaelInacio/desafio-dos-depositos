package com.desafiodosdepositos.backend.webhook.controller;

import com.desafiodosdepositos.backend.payment.service.PaymentService;
import com.desafiodosdepositos.backend.webhook.dto.AsaasWebhookEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    @org.springframework.beans.factory.annotation.Value("${asaas.webhook-token}")
    private String webhookToken;

    private final PaymentService paymentService;

    @PostMapping("/asaas")
    public ResponseEntity<Void> handleAsaasWebhook(
            @RequestHeader(name = "asaas-access-token", required = false) String accessToken,
            @RequestBody AsaasWebhookEvent event) {

        // Validate webhook token
        if (accessToken == null || !accessToken.equals(webhookToken)) {
            log.warn("Invalid webhook token received: {}", accessToken);
            return ResponseEntity.status(401).build();
        }

        log.info("Received webhook event: {}", event.getEvent());

        if (event.getPayment() != null) {
            log.info("Payment ID: {}, Status: {}, External Ref: {}",
                    event.getPayment().getId(),
                    event.getPayment().getStatus(),
                    event.getPayment().getExternalReference());
        }

        // Processar apenas eventos de pagamento confirmado
        if ("PAYMENT_CONFIRMED".equals(event.getEvent())) {
            String userId = event.getPayment().getExternalReference();

            if (userId == null || userId.isEmpty()) {
                log.error("External reference (userId) is missing in webhook");
                return ResponseEntity.badRequest().build();
            }

            try {
                paymentService.activatePremium(userId);
                log.info("Premium activated successfully for user: {}", userId);
                return ResponseEntity.ok().build();

            } catch (Exception e) {
                log.error("Error processing webhook: {}", e.getMessage());
                return ResponseEntity.internalServerError().build();
            }
        }

        // Outros eventos são apenas logados
        log.info("Webhook event {} acknowledged but not processed", event.getEvent());
        return ResponseEntity.ok().build();
    }
}
