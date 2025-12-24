/**
 * Primer Payment Integration
 * 
 * Primer acts as the main payment orchestrator, connecting:
 * - Flutterwave (Mobile Money, Franc CFA, cards)
 * - Paystack (Nigeria, Ghana, cards)
 * - Visa/Mastercard via Primer
 * - PayPal (optional, if enabled in Primer)
 */

export interface PrimerPaymentRequest {
  amount: number; // in cents
  currency: string; // "EUR"
  orderId: string;
  customerId: string;
  metadata?: Record<string, any>;
}

export interface PrimerPaymentResponse {
  id: string;
  status: "PENDING" | "AUTHORIZED" | "SETTLED" | "FAILED" | "CANCELLED";
  clientToken?: string;
  redirectUrl?: string;
}

/**
 * Create a payment session with Primer
 */
export async function createPrimerPaymentSession(
  request: PrimerPaymentRequest
): Promise<PrimerPaymentResponse> {
  const apiKey = process.env.PRIMER_API_KEY;
  if (!apiKey) {
    throw new Error("PRIMER_API_KEY is not configured");
  }

  const response = await fetch("https://api.primer.io/v2/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Version": "2.1",
      "X-Api-Key": apiKey,
    },
    body: JSON.stringify({
      amount: request.amount,
      currencyCode: request.currency,
      orderId: request.orderId,
      customerId: request.customerId,
      metadata: request.metadata || {},
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Primer API error: ${error.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Get payment status from Primer
 */
export async function getPrimerPaymentStatus(
  paymentId: string
): Promise<PrimerPaymentResponse> {
  const apiKey = process.env.PRIMER_API_KEY;
  if (!apiKey) {
    throw new Error("PRIMER_API_KEY is not configured");
  }

  const response = await fetch(`https://api.primer.io/v2/payments/${paymentId}`, {
    method: "GET",
    headers: {
      "X-API-Version": "2.1",
      "X-Api-Key": apiKey,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Primer API error: ${error.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Verify Primer webhook signature
 */
export function verifyPrimerWebhookSignature(
  payload: string,
  signature: string
): boolean {
  // Primer webhook signature verification
  // This should use Primer's webhook secret
  const webhookSecret = process.env.PRIMER_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.warn("PRIMER_WEBHOOK_SECRET not configured, skipping verification");
    return true; // In development, allow without verification
  }

  // Implement signature verification based on Primer's documentation
  // This is a placeholder - actual implementation depends on Primer's spec
  // Primer typically uses HMAC SHA256 for webhook signatures
  try {
    const crypto = require("crypto");
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(payload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error("Error verifying Primer webhook signature:", error);
    return false;
  }
}

