"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotmartWebhook = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const admin = __importStar(require("firebase-admin"));
const logger = __importStar(require("firebase-functions/logger"));
admin.initializeApp();
const db = admin.firestore();
// Hotmart security token - configure with: firebase functions:secrets:set HOTMART_HOTTOK
const hotmartHottok = (0, params_1.defineSecret)("HOTMART_HOTTOK");
/**
 * Webhook handler for Hotmart purchase events.
 *
 * When a purchase is completed, this function:
 * 1. Validates the Hotmart security token (hottok)
 * 2. Extracts the buyer's email from the payload
 * 3. Finds the user in Firestore by email
 * 4. Updates the user's isPremium status to true
 */
exports.hotmartWebhook = (0, https_1.onRequest)({ secrets: [hotmartHottok] }, async (req, res) => {
    // Only accept POST requests
    if (req.method !== "POST") {
        logger.warn("Rejected non-POST request", { method: req.method });
        res.status(405).send("Method Not Allowed");
        return;
    }
    // Validate Hotmart security token
    const receivedToken = req.headers["x-hotmart-hottok"];
    const expectedToken = hotmartHottok.value();
    if (!receivedToken || receivedToken !== expectedToken) {
        logger.warn("Invalid or missing hottok", {
            hasToken: !!receivedToken,
            tokenMatch: receivedToken === expectedToken
        });
        res.status(401).send("Unauthorized");
        return;
    }
    try {
        const payload = req.body;
        logger.info("Received Hotmart webhook", {
            event: payload.event,
            buyerEmail: payload.data?.buyer?.email,
            product: payload.data?.product?.name
        });
        // Handle purchase completion
        if (payload.event === "PURCHASE_COMPLETE" || payload.event === "PURCHASE_APPROVED") {
            const buyerEmail = payload.data?.buyer?.email?.toLowerCase().trim();
            if (!buyerEmail) {
                logger.error("No buyer email in payload");
                res.status(400).send("Missing buyer email");
                return;
            }
            // Find user by email
            const usersRef = db.collection("users");
            const querySnapshot = await usersRef
                .where("email", "==", buyerEmail)
                .limit(1)
                .get();
            if (querySnapshot.empty) {
                logger.warn("User not found for email", { email: buyerEmail });
                // Still return 200 to prevent Hotmart from retrying
                // User might register later
                res.status(200).send("User not found, will be updated on registration");
                return;
            }
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            // Idempotency check - only update if not already premium
            if (userData.isPremium) {
                logger.info("User already premium, skipping update", {
                    userId: userDoc.id
                });
                res.status(200).send("User already premium");
                return;
            }
            // Update user to premium
            await userDoc.ref.update({
                isPremium: true,
                premiumActivatedAt: admin.firestore.FieldValue.serverTimestamp(),
                hotmartPurchaseEvent: payload.event,
            });
            logger.info("User upgraded to premium", {
                userId: userDoc.id,
                email: buyerEmail
            });
            res.status(200).send("Premium activated successfully");
            return;
        }
        // Handle refund (optional, for future use)
        if (payload.event === "PURCHASE_REFUNDED") {
            const buyerEmail = payload.data?.buyer?.email?.toLowerCase().trim();
            if (buyerEmail) {
                const usersRef = db.collection("users");
                const querySnapshot = await usersRef
                    .where("email", "==", buyerEmail)
                    .limit(1)
                    .get();
                if (!querySnapshot.empty) {
                    await querySnapshot.docs[0].ref.update({
                        isPremium: false,
                        premiumRevokedAt: admin.firestore.FieldValue.serverTimestamp(),
                    });
                    logger.info("Premium revoked due to refund", { email: buyerEmail });
                }
            }
            res.status(200).send("Refund processed");
            return;
        }
        // Unknown event - acknowledge but don't process
        logger.info("Unhandled event type", { event: payload.event });
        res.status(200).send("Event acknowledged");
    }
    catch (error) {
        logger.error("Error processing webhook", { error });
        res.status(500).send("Internal Server Error");
    }
});
//# sourceMappingURL=index.js.map