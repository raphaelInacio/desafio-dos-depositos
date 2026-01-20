package com.desafiodosdepositos.backend.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AsaasCustomerRequest {
    private String name;
    private String email;
}
