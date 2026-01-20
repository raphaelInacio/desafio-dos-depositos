package com.desafiodosdepositos.backend.payment.service;

import com.desafiodosdepositos.backend.shared.exception.PaymentException;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final AsaasService asaasService;

    /**
     * Cria checkout session para um usuário
     * Se o usuário não tiver asaasCustomerId, cria um novo customer primeiro
     */
    public String createCheckout(String userId, String email, String name) {
        log.info("Creating checkout for user: {}", userId);

        try {
            Firestore firestore = FirestoreClient.getFirestore();
            Map<String, Object> userData = firestore.collection("users")
                    .document(userId)
                    .get()
                    .get()
                    .getData();

            String asaasCustomerId;

            if (userData != null && userData.containsKey("asaasCustomerId")) {
                asaasCustomerId = (String) userData.get("asaasCustomerId");
                log.info("Using existing Asaas customer: {}", asaasCustomerId);
            } else {
                // Criar novo customer no Asaas
                asaasCustomerId = asaasService.createCustomer(email, name);

                // Salvar asaasCustomerId no Firestore
                Map<String, Object> updates = new HashMap<>();
                updates.put("asaasCustomerId", asaasCustomerId);
                firestore.collection("users")
                        .document(userId)
                        .update(updates)
                        .get();

                log.info("New Asaas customer created and saved: {}", asaasCustomerId);
            }

            // Criar checkout session
            String checkoutUrl = asaasService.createCheckoutSession(asaasCustomerId, userId);
            return checkoutUrl;

        } catch (InterruptedException | ExecutionException e) {
            log.error("Error accessing Firestore: {}", e.getMessage());
            throw new PaymentException("Failed to access user data", e);
        }
    }

    /**
     * Ativa premium para um usuário após confirmação de pagamento
     */
    public void activatePremium(String userId) {
        log.info("Activating premium for user: {}", userId);

        try {
            Firestore firestore = FirestoreClient.getFirestore();

            Map<String, Object> updates = new HashMap<>();
            updates.put("isPremium", true);

            firestore.collection("users")
                    .document(userId)
                    .update(updates)
                    .get();

            log.info("Premium activated successfully for user: {}", userId);

        } catch (InterruptedException | ExecutionException e) {
            log.error("Error updating Firestore: {}", e.getMessage());
            throw new PaymentException("Failed to activate premium", e);
        }
    }
}
