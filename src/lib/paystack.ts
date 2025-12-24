/**
 * Paystack Payment Integration
 * 
 * Handles payments via Paystack for Nigeria and Ghana
 */

export interface PaystackPaymentRequest {
  amount: number; // in kobo (NGN) or pesewas (GHS)
  email: string;
  currency: string; // "NGN" or "GHS"
  reference: string; // Unique transaction reference
  callback_url?: string;
  metadata?: Record<string, any>;
}

export interface PaystackPaymentResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

/**
 * Initialize Paystack payment
 */
export async function initializePaystackPayment(
  request: PaystackPaymentRequest
): Promise<PaystackPaymentResponse> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Paystack secret key not configured");
  }

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey}`,
    },
    body: JSON.stringify({
      amount: request.amount,
      email: request.email,
      currency: request.currency,
      reference: request.reference,
      callback_url: request.callback_url || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/callback`,
      metadata: request.metadata || {},
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Paystack API error: ${error.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Verify Paystack transaction
 */
export async function verifyPaystackTransaction(
  reference: string
): Promise<any> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Paystack secret key not configured");
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Paystack verification error: ${error.message || response.statusText}`);
  }

  return response.json();
}




