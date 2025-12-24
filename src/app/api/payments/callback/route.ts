"use server";

import { NextRequest, NextResponse } from "next/server";
import { verifyFlutterwaveTransaction } from "@/lib/flutterwave";
import { verifyPaystackTransaction } from "@/lib/paystack";
import prisma from "@/lib/prisma";
import { SubscriptionStatus } from "@prisma/client";

/**
 * GET /api/payments/callback
 * 
 * Handles payment callbacks from Flutterwave and Paystack
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const provider = searchParams.get("provider");
  const transactionId = searchParams.get("transaction_id");
  const reference = searchParams.get("reference");
  const status = searchParams.get("status");

  try {
    if (provider === "flutterwave" && transactionId) {
      // Verify Flutterwave transaction
      const verification = await verifyFlutterwaveTransaction(transactionId);

      if (verification.status === "success" && verification.data.status === "successful") {
        const txData = verification.data;
        const metadata = txData.meta || {};

        // Extract subscription information
        const userId = metadata.userId;
        const planId = parseInt(metadata.planId);
        const baseAmount = parseFloat(metadata.baseAmount || txData.amount);
        const baseCurrency = metadata.baseCurrency || "EUR";
        const paidAmount = parseFloat(txData.amount);
        const paidCurrency = txData.currency;

        if (!userId || !planId) {
          throw new Error("Missing userId or planId in transaction metadata");
        }

        // Calculate subscription dates
        const startDate = new Date();
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1);

        // Cancel existing subscription if any
        const existingSubscription = await prisma.subscriptions.findFirst({
          where: {
            userId,
            status: SubscriptionStatus.ACTIVE,
            endDate: {
              gt: new Date(),
            },
          },
        });

        if (existingSubscription) {
          await prisma.subscriptions.update({
            where: { id: existingSubscription.id },
            data: {
              status: SubscriptionStatus.CANCELED,
            },
          });
        }

        // Create new subscription
        await prisma.subscriptions.create({
          data: {
            paymentID: transactionId,
            userId,
            planId,
            status: SubscriptionStatus.ACTIVE,
            startDate,
            endDate,
            paymentProvider: "Flutterwave",
            baseAmount: baseAmount,
            baseCurrency: baseCurrency,
            paidAmount: paidAmount,
            paidCurrency: paidCurrency,
          },
        });

        // Redirect to success page
        return NextResponse.redirect(
          new URL("/user/subscription?success=true", request.url)
        );
      } else {
        // Payment failed
        return NextResponse.redirect(
          new URL("/user/subscription?error=payment_failed", request.url)
        );
      }
    } else if (provider === "paystack" && reference) {
      // Verify Paystack transaction
      const verification = await verifyPaystackTransaction(reference);

      if (verification.status && verification.data.status === "success") {
        const txData = verification.data;
        const metadata = txData.metadata || {};

        // Extract subscription information
        const userId = metadata.userId;
        const planId = parseInt(metadata.planId);
        const baseAmount = parseFloat(metadata.baseAmount || txData.amount / 100);
        const baseCurrency = metadata.baseCurrency || "EUR";
        const paidAmount = parseFloat(txData.amount) / 100; // Convert from kobo/pesewas
        const paidCurrency = txData.currency;

        if (!userId || !planId) {
          throw new Error("Missing userId or planId in transaction metadata");
        }

        // Calculate subscription dates
        const startDate = new Date();
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1);

        // Cancel existing subscription if any
        const existingSubscription = await prisma.subscriptions.findFirst({
          where: {
            userId,
            status: SubscriptionStatus.ACTIVE,
            endDate: {
              gt: new Date(),
            },
          },
        });

        if (existingSubscription) {
          await prisma.subscriptions.update({
            where: { id: existingSubscription.id },
            data: {
              status: SubscriptionStatus.CANCELED,
            },
          });
        }

        // Create new subscription
        await prisma.subscriptions.create({
          data: {
            paymentID: reference,
            userId,
            planId,
            status: SubscriptionStatus.ACTIVE,
            startDate,
            endDate,
            paymentProvider: "Paystack",
            baseAmount: baseAmount,
            baseCurrency: baseCurrency,
            paidAmount: paidAmount,
            paidCurrency: paidCurrency,
          },
        });

        // Redirect to success page
        return NextResponse.redirect(
          new URL("/user/subscription?success=true", request.url)
        );
      } else {
        // Payment failed
        return NextResponse.redirect(
          new URL("/user/subscription?error=payment_failed", request.url)
        );
      }
    } else {
      return NextResponse.json(
        { error: "Invalid callback parameters" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Payment callback error:", error);
    return NextResponse.redirect(
      new URL(`/user/subscription?error=${encodeURIComponent(error.message)}`, request.url)
    );
  }
}




