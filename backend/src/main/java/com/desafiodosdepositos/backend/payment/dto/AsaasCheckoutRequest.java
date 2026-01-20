package com.desafiodosdepositos.backend.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AsaasCheckoutRequest {
    private String customer;
    private BigDecimal value;
    private String externalReference;
    private String successUrl;
    private String cancelUrl;
}
