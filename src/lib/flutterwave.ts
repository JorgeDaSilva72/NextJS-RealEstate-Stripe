/**
 * Flutterwave Payment Integration
 * 
 * Handles payments via Flutterwave for African countries
 */

export interface FlutterwavePaymentRequest {
  amount: number;
  currency: string;
  email: string;
  phone_number?: string;
  name: string;
  tx_ref: string; // Unique transaction reference
  redirect_url?: string;
  metadata?: Record<string, any>;
}

export interface FlutterwavePaymentResponse {
  status: string;
  message: string;
  data: {
    link: string;
  };
}

/**
 * Initialize Flutterwave payment
 */
export async function initializeFlutterwavePayment(
  request: FlutterwavePaymentRequest
): Promise<FlutterwavePaymentResponse> {
  const publicKey = process.env.FLUTTERWAVE_PUBLIC_KEY;
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;

  if (!publicKey || !secretKey) {
    throw new Error("Flutterwave API keys not configured");
  }

  const response = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey}`,
    },
    body: JSON.stringify({
      tx_ref: request.tx_ref,
      amount: request.amount,
      currency: request.currency,
      redirect_url: request.redirect_url || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/callback`,
      payment_options: "card,account,ussd,mobilemoney,banktransfer",
      customer: {
        email: request.email,
        phone_number: request.phone_number,
        name: request.name,
      },
      customizations: {
        title: "Subscription Payment",
        description: "Real Estate Platform Subscription",
      },
      meta: request.metadata || {},
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Flutterwave API error: ${error.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Verify Flutterwave transaction
 */
export async function verifyFlutterwaveTransaction(
  transactionId: string
): Promise<any> {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Flutterwave secret key not configured");
  }

  const response = await fetch(
    `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Flutterwave verification error: ${error.message || response.statusText}`);
  }

  return response.json();
}




