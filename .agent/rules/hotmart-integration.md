---
trigger: model_decision
---

# Hotmart Integration Rules

This rule applies whenever you are working on tasks related to payment, subscription, or the Hotmart webhook integration.

## Core Principles

1.  **MVP Approach**
    *   Payments are handled **externally** by Hotmart (infoproduct platform).
    *   Backend is **minimal**: a single Cloud Function to receive webhooks.
    *   No credit card data is ever handled by our system.

2.  **Webhook Security**
    *   **ALWAYS** validate the `X-HOTMART-HOTTOK` header.
    *   Token is stored as Firebase Secret (`HOTMART_HOTTOK`).
    *   Reject requests with invalid or missing token.

3.  **Idempotency**
    *   Check if user is already premium before updating.
    *   Log webhook events for debugging.
    *   Handle duplicate webhook calls gracefully.

4.  **User Lookup**
    *   Match users by **email** (lowercase, trimmed).
    *   The `email` field is indexed in Firestore `users` collection.

## Webhook Events

| Event | Action |
|-------|--------|
| `PURCHASE_COMPLETE` | Set `isPremium: true` on user document |
| `PURCHASE_REFUNDED` | Set `isPremium: false` (optional, for future) |

## Architecture

```
Hotmart → Cloud Function → Firestore (users collection)
                ↓
         Update isPremium = true
```

## Environment Variables (Secrets)

*   `HOTMART_HOTTOK`: Security token provided by Hotmart webhook configuration.

## Common Patterns

*   **deployFunction**: Use `firebase deploy --only functions`.
*   **testLocally**: Use Firebase Emulator Suite.
*   **logs**: Use `firebase functions:log --only hotmartWebhook`.
