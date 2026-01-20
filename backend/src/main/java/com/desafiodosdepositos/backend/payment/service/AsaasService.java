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
     * Cria uma checkout session no Asaas
     */
    public String createCheckoutSession(String customerId, String userId) {
        log.info("Creating checkout session for customer: {}", customerId);

        String url = baseUrl + "/paymentLinks";
        HttpHeaders headers = createHeaders();

        AsaasCheckoutRequest request = new AsaasCheckoutRequest(
                customerId,
                new BigDecimal("4.99"),
                userId, // externalReference para rastrear o pagamento
                successUrl,
                cancelUrl);

        HttpEntity<AsaasCheckoutRequest> entity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<AsaasCheckoutResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    AsaasCheckoutResponse.class);

            if (response.getBody() == null || response.getBody().getUrl() == null) {
                throw new PaymentException("Failed to create checkout session: empty response");
            }

            String checkoutUrl = response.getBody().getUrl();
            log.info("Checkout session created: {}", checkoutUrl);
            return checkoutUrl;

        } catch (HttpClientErrorException e) {
            log.error("Error creating checkout session: {}", e.getMessage());
            throw new PaymentException("Failed to create checkout session", e);
        }
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("access_token", apiKey);
        return headers;
    }
}
