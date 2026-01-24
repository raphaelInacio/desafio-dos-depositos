package com.desafiodosdepositos.backend.payment.service;

import com.desafiodosdepositos.backend.payment.dto.*;
import com.desafiodosdepositos.backend.shared.exception.PaymentException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;

@Slf4j
@Service
public class AsaasService {

    @Value("${asaas.api-key}")
    private String apiKey;

    @Value("${asaas.base-url}")
    private String baseUrl;

    @Value("${asaas.checkout.success-url}")
    private String successUrl;

    @Value("${asaas.checkout.cancel-url}")
    private String cancelUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Cria um customer no Asaas
     */
    public String createCustomer(String email, String name) {
        log.info("Creating Asaas customer for email: {}", email);

        String url = baseUrl + "/customers";
        HttpHeaders headers = createHeaders();

        AsaasCustomerRequest request = new AsaasCustomerRequest(name, email);
        HttpEntity<AsaasCustomerRequest> entity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<AsaasCustomerResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    AsaasCustomerResponse.class);

            if (response.getBody() == null || response.getBody().getId() == null) {
                throw new PaymentException("Failed to create customer: empty response");
            }

            String customerId = response.getBody().getId();
            log.info("Customer created successfully: {}", customerId);
            return customerId;

        } catch (HttpClientErrorException e) {
            log.error("Error creating customer: {}", e.getMessage());
            throw new PaymentException("Failed to create Asaas customer", e);
        }
    }

    /**
     * Cria uma cobrança (Pagamento) no Asaas para redirecionamento.
     * Retorna a invoiceUrl para onde o user deve ser redirecionado.
     */
    public String createCheckoutSession(String customerId, String userId) {
        log.info("Creating payment for customer: {}", customerId);

        String url = baseUrl + "/payments";
        HttpHeaders headers = createHeaders();

        // Data de vencimento = Amanhã (Simples lógica para pagamento imediato)
        String dueDate = java.time.LocalDate.now().plusDays(1).toString();

        AsaasCheckoutRequest request = new AsaasCheckoutRequest(
                customerId,
                "UNDEFINED", // Permite user escolher (Boleto/Pix/Card) na tela do Asaas
                new BigDecimal("4.99"),
                dueDate,
                "Upgrade para Premium - Desafio dos Depósitos",
                userId // referencing user for webhook
        );

        HttpEntity<AsaasCheckoutRequest> entity = new HttpEntity<>(request, headers);

        try {
            // Note: AsaasPaymentResponse is essentially same as CheckoutResponse but let's
            // confirm format
            // response.invoiceUrl is what we want.
            // Using AsaasCheckoutResponse for now if it maps 'url' or 'invoiceUrl'.
            // Let's assume we need to fix the Response DTO too to match Payment response.
            ResponseEntity<AsaasCheckoutResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    AsaasCheckoutResponse.class);

            if (response.getBody() == null || response.getBody().getInvoiceUrl() == null) {
                // Fallback: check 'url' or 'bankSlipUrl' or throw
                // Asaas API v3 /payments returns 'invoiceUrl'.
                throw new PaymentException("Failed to create payment: invoices url missing");
            }

            String checkoutUrl = response.getBody().getInvoiceUrl();
            log.info("Payment created: {}", checkoutUrl);
            return checkoutUrl;

        } catch (HttpClientErrorException e) {
            log.error("Error creating payment: {}", e.getResponseBodyAsString());
            throw new PaymentException("Failed to create payment session", e);
        }
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("access_token", apiKey);
        return headers;
    }
}
