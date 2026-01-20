package com.desafiodosdepositos.backend.payment.controller;

import com.desafiodosdepositos.backend.payment.dto.CheckoutRequest;
import com.desafiodosdepositos.backend.payment.dto.CheckoutResponse;
import com.desafiodosdepositos.backend.payment.service.PaymentService;
import com.desafiodosdepositos.backend.shared.exception.PaymentException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> createCheckout(@Valid @RequestBody CheckoutRequest request) {
        log.info("Received checkout request for user: {}", request.getUserId());

        try {
            String checkoutUrl = paymentService.createCheckout(
                    request.getUserId(),
                    request.getEmail(),
                    request.getName());

            return ResponseEntity.ok(new CheckoutResponse(checkoutUrl));

        } catch (PaymentException e) {
            log.error("Payment exception: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
