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
    private String billingType;
    private BigDecimal value;
    private String dueDate;
    private String description;
    private String externalReference;
}
