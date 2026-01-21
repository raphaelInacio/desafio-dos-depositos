package com.desafiodosdepositos.backend.referral;

import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController
@RequestMapping("/api/referral")
@RequiredArgsConstructor
public class ReferralController {

    private final ReferralService referralService;

    @PostMapping("/reward")
    public ResponseEntity<Void> grantReward(@RequestBody Map<String, String> payload) {
        String referrerId = payload.get("referrerId");
        if (referrerId == null) {
            return ResponseEntity.badRequest().build();
        }

        try {
            referralService.grantReferralReward(referrerId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
