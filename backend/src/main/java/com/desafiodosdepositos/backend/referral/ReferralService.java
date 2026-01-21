package com.desafiodosdepositos.backend.referral;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.WriteResult;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.util.concurrent.ExecutionException;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReferralService {

    private final Firestore firestore;

    public void grantReferralReward(String referrerId) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection("users").document(referrerId);

        // Use transaction or just update? Update is fine for idempotency if we just set
        // true
        // But we want to set trialExpiresAt = null as well.

        Map<String, Object> updates = new HashMap<>();
        updates.put("referralRewardClaimed", true);
        updates.put("trialExpiresAt", null);

        docRef.update(updates).get();
        log.info("Granted referral reward to user {}", referrerId);
    }
}
