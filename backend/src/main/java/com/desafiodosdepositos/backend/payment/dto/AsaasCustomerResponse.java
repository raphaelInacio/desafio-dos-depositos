package com.desafiodosdepositos.backend.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AsaasCustomerResponse {
    private String id;
    private String name;
    private String email;
}
