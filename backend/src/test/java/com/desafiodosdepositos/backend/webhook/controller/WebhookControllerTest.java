package com.desafiodosdepositos.backend.webhook.controller;

import com.desafiodosdepositos.backend.payment.service.PaymentService;
import com.desafiodosdepositos.backend.webhook.dto.AsaasPaymentInfo;
import com.desafiodosdepositos.backend.webhook.dto.AsaasWebhookEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(WebhookController.class)
@TestPropertySource(properties = "asaas.webhook-token=valid-token")
class WebhookControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PaymentService paymentService;

    @Test
    void handleAsaasWebhook_PaymentConfirmed() throws Exception {
        // Arrange
        AsaasWebhookEvent event = new AsaasWebhookEvent();
        event.setEvent("PAYMENT_CONFIRMED");

        AsaasPaymentInfo payment = new AsaasPaymentInfo();
        payment.setId("pay_123");
        payment.setCustomer("cus_123");
        payment.setValue(new BigDecimal("4.99"));
        payment.setStatus("CONFIRMED");
        payment.setExternalReference("user_123");

        event.setPayment(payment);

        doNothing().when(paymentService).activatePremium(anyString());

        // Act & Assert
        mockMvc.perform(post("/api/webhooks/asaas")
                .header("asaas-access-token", "valid-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(event)))
                .andExpect(status().isOk());

        verify(paymentService).activatePremium("user_123");
    }

    @Test
    void handleAsaasWebhook_OtherEvent() throws Exception {
        // Arrange
        AsaasWebhookEvent event = new AsaasWebhookEvent();
        event.setEvent("PAYMENT_RECEIVED");

        AsaasPaymentInfo payment = new AsaasPaymentInfo();
        payment.setId("pay_123");
        payment.setExternalReference("user_123");
        event.setPayment(payment);

        // Act & Assert
        mockMvc.perform(post("/api/webhooks/asaas")
                .header("asaas-access-token", "valid-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(event)))
                .andExpect(status().isOk());

        // Não deve chamar activatePremium para outros eventos
        verify(paymentService, never()).activatePremium(anyString());
    }

    @Test
    void handleAsaasWebhook_MissingExternalReference() throws Exception {
        // Arrange
        AsaasWebhookEvent event = new AsaasWebhookEvent();
        event.setEvent("PAYMENT_CONFIRMED");

        AsaasPaymentInfo payment = new AsaasPaymentInfo();
        payment.setId("pay_123");
        payment.setExternalReference(null); // Missing userId
        event.setPayment(payment);

        // Act & Assert
        mockMvc.perform(post("/api/webhooks/asaas")
                .header("asaas-access-token", "valid-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(event)))
                .andExpect(status().isBadRequest());

        verify(paymentService, never()).activatePremium(anyString());
    }

    @Test
    void handleAsaasWebhook_InvalidToken() throws Exception {
        // Arrange
        AsaasWebhookEvent event = new AsaasWebhookEvent();
        event.setEvent("PAYMENT_CONFIRMED");

        // Act & Assert
        mockMvc.perform(post("/api/webhooks/asaas")
                .header("asaas-access-token", "wrong-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(event)))
                .andExpect(status().isUnauthorized());

        verify(paymentService, never()).activatePremium(anyString());
    }
}
