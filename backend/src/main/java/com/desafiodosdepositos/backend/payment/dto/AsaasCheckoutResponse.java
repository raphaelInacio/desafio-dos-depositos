package com.desafiodosdepositos.backend.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AsaasCheckoutResponse {
    private String id;
    private String invoiceUrl;
    private String bankSlipUrl;
    private String url; // sometimes used in payment links
}
