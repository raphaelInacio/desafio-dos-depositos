package com.desafiodosdepositos.backend.webhook.dto;

import lombok.Data;

@Data
public class AsaasWebhookEvent {
    private String event;
    private AsaasPaymentInfo payment;
}
