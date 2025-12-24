"use server";

import { NextRequest, NextResponse } from "next/server";
import { verifyPrimerWebhookSignature } from "@/lib/primer";
import prisma from "@/lib/prisma";
import { SubscriptionStatus } from "@prisma/client";

/**
 * POST /api/primer/webhook
 * 
 * Handles Primer webhook events:
 * - payment.success
 * - payment.failed
 * - subscription.created
 */
export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-primer-signature") || "";
    const payload = await request.text();
    const body = JSON.parse(payload);

    // Verify webhook signature
    if (!verifyPrimerWebhookSignature(payload, signature)) {
      console.error("Invalid Primer webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const eventType = body.type;
    const paymentData = body.payment || body.data;

    console.log(`Primer webhook received: ${eventType}`, {
      paymentId: paymentData?.id,
      orderId: paymentData?.orderId,
    });

    switch (eventType) {
      case "payment.success":
      case "PAYMENT.SETTLED":
        await handlePaymentSuccess(paymentData);
        break;

      case "payment.failed":
      case "PAYMENT.FAILED":
        await handlePaymentFailed(paymentData);
        break;

      case "subscription.created":
        await handleSubscriptionCreated(paymentData);
        break;

      default:
        console.log(`Unhandled Primer webhook event: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Error processing Primer webhook:", error);
    return NextResponse.json(
      { error: error.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(paymentData: any) {
  const { orderId, id: paymentId, metadata } = paymentData;

  if (!orderId || !metadata?.planId || !metadata?.userId) {
    console.error("Missing required data in payment success webhook");
    return;
  }

  const planId = parseInt(metadata.planId);
  const userId = metadata.userId;

  // Get the plan to calculate subscription dates
  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    console.error(`Plan not found: ${planId}`);
    return;
  }

  // Calculate subscription dates (annual)
  const startDate = new Date();
  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 1);

  // Extract currency information from metadata
  const baseAmount = metadata?.baseAmount ? parseFloat(metadata.baseAmount.toString()) : null;
  const baseCurrency = metadata?.baseCurrency || "EUR";
  const paidAmount = paymentData?.amount ? parseFloat(paymentData.amount.toString()) / 100 : null; // Convert from cents
  const paidCurrency = paymentData?.currencyCode || metadata?.convertedCurrency || "EUR";
  const exchangeRate = metadata?.exchangeRate ? parseFloat(metadata.exchangeRate.toString()) : null;

  // Check if user has an existing active subscription
  const existingSubscription = await prisma.subscriptions.findFirst({
    where: {
      userId,
      status: SubscriptionStatus.ACTIVE,
      endDate: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // If upgrading, handle pro-rating or restart (configurable)
  // For now, we'll restart the subscription
  if (existingSubscription) {
    // Cancel or expire the old subscription
    await prisma.subscriptions.update({
      where: { id: existingSubscription.id },
      data: {
        status: SubscriptionStatus.CANCELED,
      },
    });
  }

  // Create or update subscription with currency information
  await prisma.subscriptions.upsert({
    where: { paymentID: paymentId },
    update: {
      status: SubscriptionStatus.ACTIVE,
      startDate,
      endDate,
      planId,
      paymentProvider: "Primer",
      baseAmount: baseAmount ? baseAmount : null,
      baseCurrency: baseCurrency || null,
      paidAmount: paidAmount ? paidAmount : null,
      paidCurrency: paidCurrency || null,
      exchangeRate: exchangeRate ? exchangeRate : null,
    },
    create: {
      paymentID: paymentId,
      userId,
      planId,
      status: SubscriptionStatus.ACTIVE,
      startDate,
      endDate,
      paymentProvider: "Primer",
      baseAmount: baseAmount ? baseAmount : null,
      baseCurrency: baseCurrency || null,
      paidAmount: paidAmount ? paidAmount : null,
      paidCurrency: paidCurrency || null,
      exchangeRate: exchangeRate ? exchangeRate : null,
    },
  });

  console.log(`Subscription activated for user ${userId}, plan ${planId}`);
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentData: any) {
  const { orderId, id: paymentId, metadata } = paymentData;

  if (!orderId || !metadata?.userId) {
    console.error("Missing required data in payment failed webhook");
    return;
  }

  // Log the failure
  console.log(`Payment failed for order ${orderId}, payment ${paymentId}`);

  // Optionally create a pending subscription with FAILED status
  if (metadata?.planId && metadata?.userId) {
    await prisma.subscriptions.upsert({
      where: { paymentID: paymentId },
      update: {
        status: SubscriptionStatus.EXPIRED,
      },
      create: {
        paymentID: paymentId,
        userId: metadata.userId,
        planId: parseInt(metadata.planId),
        status: SubscriptionStatus.EXPIRED,
        startDate: new Date(),
        endDate: new Date(),
        paymentProvider: "Primer",
      },
    });
  }
}

/**
 * Handle subscription created event
 */
async function handleSubscriptionCreated(paymentData: any) {
  // This might be used for recurring subscriptions in the future
  console.log("Subscription created event received", paymentData);
}

