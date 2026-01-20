package com.desafiodosdepositos.backend.webhook.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class AsaasPaymentInfo {
    private String id;
    private String customer;
    private BigDecimal value;
    private String status;
    private String externalReference;
}
