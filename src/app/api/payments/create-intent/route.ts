"use server";

import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createPrimerPaymentSession } from "@/lib/primer";
import { initializeFlutterwavePayment } from "@/lib/flutterwave";
import { initializePaystackPayment } from "@/lib/paystack";
import { convertCurrency, getExchangeRate } from "@/lib/exchange-rates";
import { CurrencyCode, getCurrency } from "@/lib/currencies";
import { getRecommendedProvider } from "@/lib/payment-providers";

interface CreateIntentRequest {
  amount: number; // Base amount in EUR or USD
  currency: CurrencyCode; // Target currency
  planId: number;
  userCountry: string;
  paymentType: "subscription";
  paymentProvider?: "primer" | "flutterwave" | "paystack" | "paypal";
}

/**
 * POST /api/payments/create-intent
 * 
 * Creates a payment intent with the appropriate provider based on currency and country
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { getUser } = await getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: CreateIntentRequest = await request.json();
    const { amount, currency, planId, userCountry, paymentType, paymentProvider } = body;

    if (!amount || !currency || !planId || !userCountry) {
      return NextResponse.json(
        { error: "Missing required fields: amount, currency, planId, userCountry" },
        { status: 400 }
      );
    }

    // Convert amount to target currency
    const baseCurrency: CurrencyCode = currency === "USD" ? "USD" : "EUR";
    const convertedAmount = await convertCurrency(amount, baseCurrency, currency);

    // Get recommended provider if not specified
    const provider = paymentProvider || getRecommendedProvider(currency, userCountry);
    const currencyInfo = getCurrency(currency);

    // Create unique transaction reference
    const txRef = `sub_${user.id}_${planId}_${Date.now()}`;

    let paymentIntent: any;

    switch (provider) {
      case "primer":
        // Use Primer as orchestrator
        paymentIntent = await createPrimerPaymentSession({
          amount: Math.round(convertedAmount * 100), // Convert to cents
          currency: currency,
          orderId: txRef,
          customerId: user.id,
          metadata: {
            planId,
            userId: user.id,
            userEmail: user.email,
            userName: `${user.given_name} ${user.family_name}`,
            userCountry,
            baseAmount: amount,
            baseCurrency,
            convertedAmount,
            convertedCurrency: currency,
            paymentType,
          },
        });

        return NextResponse.json({
          success: true,
          provider: "primer",
          paymentId: paymentIntent.id,
          clientToken: paymentIntent.clientToken,
          redirectUrl: paymentIntent.redirectUrl,
          status: paymentIntent.status,
          amount: convertedAmount,
          currency: currency,
          txRef,
        });

      case "flutterwave":
        // Use Flutterwave directly
        paymentIntent = await initializeFlutterwavePayment({
          amount: convertedAmount,
          currency: currency,
          email: user.email || "",
          name: `${user.given_name} ${user.family_name}`,
          tx_ref: txRef,
          redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/callback?provider=flutterwave`,
          metadata: {
            planId,
            userId: user.id,
            baseAmount: amount,
            baseCurrency,
            convertedAmount,
            convertedCurrency: currency,
            paymentType,
          },
        });

        return NextResponse.json({
          success: true,
          provider: "flutterwave",
          paymentId: paymentIntent.data.link,
          redirectUrl: paymentIntent.data.link,
          status: "pending",
          amount: convertedAmount,
          currency: currency,
          txRef,
        });

      case "paystack":
        // Use Paystack directly
        // Convert to smallest unit (kobo for NGN, pesewas for GHS)
        const amountInSmallestUnit = Math.round(convertedAmount * 100);

        paymentIntent = await initializePaystackPayment({
          amount: amountInSmallestUnit,
          email: user.email || "",
          currency: currency,
          reference: txRef,
          callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/callback?provider=paystack`,
          metadata: {
            planId,
            userId: user.id,
            baseAmount: amount,
            baseCurrency,
            convertedAmount,
            convertedCurrency: currency,
            paymentType,
          },
        });

        return NextResponse.json({
          success: true,
          provider: "paystack",
          paymentId: paymentIntent.data.reference,
          redirectUrl: paymentIntent.data.authorization_url,
          status: "pending",
          amount: convertedAmount,
          currency: currency,
          txRef,
        });

      case "paypal":
        // PayPal is handled through Primer or directly
        // For now, route through Primer
        paymentIntent = await createPrimerPaymentSession({
          amount: Math.round(convertedAmount * 100),
          currency: currency,
          orderId: txRef,
          customerId: user.id,
          metadata: {
            planId,
            userId: user.id,
            userEmail: user.email,
            userName: `${user.given_name} ${user.family_name}`,
            userCountry,
            baseAmount: amount,
            baseCurrency,
            convertedAmount,
            convertedCurrency: currency,
            paymentType,
            paymentMethod: "paypal",
          },
        });

        return NextResponse.json({
          success: true,
          provider: "paypal",
          paymentId: paymentIntent.id,
          clientToken: paymentIntent.clientToken,
          redirectUrl: paymentIntent.redirectUrl,
          status: paymentIntent.status,
          amount: convertedAmount,
          currency: currency,
          txRef,
        });

      default:
        return NextResponse.json(
          { error: `Unsupported payment provider: ${provider}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment intent" },
      { status: 500 }
    );
  }
}




