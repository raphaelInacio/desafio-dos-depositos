package com.desafiodosdepositos.backend.payment.controller;

import com.desafiodosdepositos.backend.payment.dto.CheckoutRequest;
import com.desafiodosdepositos.backend.payment.dto.CheckoutResponse;
import com.desafiodosdepositos.backend.payment.service.PaymentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PaymentController.class)
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PaymentService paymentService;

    @Test
    void createCheckout_Success() throws Exception {
        // Arrange
        CheckoutRequest request = new CheckoutRequest();
        request.setUserId("user_123");
        request.setEmail("test@test.com");
        request.setName("Test User");

        when(paymentService.createCheckout(anyString(), anyString(), anyString()))
                .thenReturn("https://sandbox.asaas.com/c/abc123");

        // Act & Assert
        mockMvc.perform(post("/api/checkout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.checkoutUrl").value("https://sandbox.asaas.com/c/abc123"));
    }

    @Test
    void createCheckout_InvalidRequest() throws Exception {
        // Arrange - request sem campos obrigatórios
        CheckoutRequest request = new CheckoutRequest();

        // Act & Assert
        mockMvc.perform(post("/api/checkout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createCheckout_InvalidEmail() throws Exception {
        // Arrange
        CheckoutRequest request = new CheckoutRequest();
        request.setUserId("user_123");
        request.setEmail("invalid-email");
        request.setName("Test User");

        // Act & Assert
        mockMvc.perform(post("/api/checkout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
