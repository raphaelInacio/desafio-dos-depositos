import { api } from "./api";

export interface CheckoutResponse {
    checkoutUrl: string;
}

/**
 * Creates a checkout session via the backend.
 * @param userId The UID of the user initiating the checkout
 * @param email User's email (optional, for pre-filling)
 * @param name User's name (optional, for pre-filling)
 * @returns Object containing the checkout URL
 */
export async function createCheckoutSession(
    userId: string,
    email?: string,
    name?: string
): Promise<CheckoutResponse> {
    const response = await api.post("/checkout", {
        userId,
        email,
        name
    });
    return await response.json() as CheckoutResponse;
}
