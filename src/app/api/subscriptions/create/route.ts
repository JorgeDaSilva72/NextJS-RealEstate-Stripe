"use server";

import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";
import { SubscriptionStatus } from "@prisma/client";

/**
 * POST /api/subscriptions/create
 * 
 * Creates a subscription after successful payment
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

    const body = await request.json();
    const { planId, paymentId, paymentProvider, amount, currency, baseAmount, baseCurrency } = body;

    if (!planId || !paymentId || !paymentProvider) {
      return NextResponse.json(
        { error: "Missing required fields: planId, paymentId, paymentProvider" },
        { status: 400 }
      );
    }

    // Get the plan
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: parseInt(planId) },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    // Calculate subscription dates (annual)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    // Check if user has an existing active subscription
    const existingSubscription = await prisma.subscriptions.findFirst({
      where: {
        userId: user.id,
        status: SubscriptionStatus.ACTIVE,
        endDate: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Cancel existing subscription if any
    if (existingSubscription) {
      await prisma.subscriptions.update({
        where: { id: existingSubscription.id },
        data: {
          status: SubscriptionStatus.CANCELED,
        },
      });
    }

    // Calculate exchange rate if provided
    let exchangeRate = null;
    if (baseAmount && amount && baseCurrency && currency && baseCurrency !== currency) {
      exchangeRate = parseFloat(amount.toString()) / parseFloat(baseAmount.toString());
    }

    // Create new subscription
    const subscription = await prisma.subscriptions.create({
      data: {
        paymentID: paymentId,
        userId: user.id,
        planId: parseInt(planId),
        status: SubscriptionStatus.ACTIVE,
        startDate,
        endDate,
        paymentProvider: paymentProvider,
        baseAmount: baseAmount ? parseFloat(baseAmount.toString()) : null,
        baseCurrency: baseCurrency || null,
        paidAmount: amount ? parseFloat(amount.toString()) : null,
        paidCurrency: currency || null,
        exchangeRate: exchangeRate,
      },
    });

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        planId: subscription.planId,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
      },
    });
  } catch (error: any) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create subscription" },
      { status: 500 }
    );
  }
}




