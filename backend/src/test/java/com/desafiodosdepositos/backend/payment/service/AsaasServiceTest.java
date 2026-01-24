package com.desafiodosdepositos.backend.payment.service;

import com.desafiodosdepositos.backend.payment.dto.AsaasCheckoutResponse;
import com.desafiodosdepositos.backend.payment.dto.AsaasCustomerResponse;
import com.desafiodosdepositos.backend.shared.exception.PaymentException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class AsaasServiceTest {

    private AsaasService asaasService;
    private RestTemplate restTemplate;

    @BeforeEach
    void setUp() {
        asaasService = new AsaasService();
        restTemplate = mock(RestTemplate.class);

        // Inject mocked RestTemplate via reflection
        ReflectionTestUtils.setField(asaasService, "restTemplate", restTemplate);
        ReflectionTestUtils.setField(asaasService, "apiKey", "test-api-key");
        ReflectionTestUtils.setField(asaasService, "baseUrl", "https://sandbox.asaas.com/api/v3");
        ReflectionTestUtils.setField(asaasService, "successUrl", "http://localhost/success");
        ReflectionTestUtils.setField(asaasService, "cancelUrl", "http://localhost/cancel");
    }

    @Test
    void createCustomer_Success() {
        // Arrange
        AsaasCustomerResponse mockResponse = new AsaasCustomerResponse();
        mockResponse.setId("cus_123");
        mockResponse.setEmail("test@test.com");
        mockResponse.setName("Test User");

        when(restTemplate.exchange(
                anyString(),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(AsaasCustomerResponse.class))).thenReturn(ResponseEntity.ok(mockResponse));

        // Act
        String customerId = asaasService.createCustomer("test@test.com", "Test User");

        // Assert
        assertEquals("cus_123", customerId);
        verify(restTemplate).exchange(
                anyString(),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(AsaasCustomerResponse.class));
    }

    @Test
    void createCustomer_Failure() {
        // Arrange
        when(restTemplate.exchange(
                anyString(),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(AsaasCustomerResponse.class))).thenThrow(new HttpClientErrorException(HttpStatus.BAD_REQUEST));

        // Act & Assert
        assertThrows(PaymentException.class, () -> {
            asaasService.createCustomer("test@test.com", "Test User");
        });
    }

    @Test
    void createCheckoutSession_Success() {
        // Arrange
        AsaasCheckoutResponse mockResponse = new AsaasCheckoutResponse();
        mockResponse.setId("pay_123");
        mockResponse.setInvoiceUrl("https://sandbox.asaas.com/i/abc123");

        when(restTemplate.exchange(
                anyString(),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(AsaasCheckoutResponse.class))).thenReturn(ResponseEntity.ok(mockResponse));

        // Act
        String checkoutUrl = asaasService.createCheckoutSession("cus_123", "user_123");

        // Assert
        assertEquals("https://sandbox.asaas.com/i/abc123", checkoutUrl);
    }

    @Test
    void createCheckoutSession_EmptyResponse() {
        // Arrange
        when(restTemplate.exchange(
                anyString(),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(AsaasCheckoutResponse.class))).thenReturn(ResponseEntity.ok(null));

        // Act & Assert
        assertThrows(PaymentException.class, () -> {
            asaasService.createCheckoutSession("cus_123", "user_123");
        });
    }
}
