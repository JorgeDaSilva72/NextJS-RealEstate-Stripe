"use server";

import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createPrimerPaymentSession } from "@/lib/primer";

/**
 * POST /api/primer/create-session
 * 
 * Creates a Primer payment session for a subscription plan
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
    const { planId, amount, currency = "EUR" } = body;

    if (!planId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: planId, amount" },
        { status: 400 }
      );
    }

    // Create unique order ID
    const orderId = `sub_${user.id}_${planId}_${Date.now()}`;

    // Create payment session with Primer
    const paymentSession = await createPrimerPaymentSession({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      orderId,
      customerId: user.id,
      metadata: {
        planId,
        userId: user.id,
        userEmail: user.email,
        userName: `${user.given_name} ${user.family_name}`,
      },
    });

    return NextResponse.json({
      success: true,
      paymentId: paymentSession.id,
      clientToken: paymentSession.clientToken,
      redirectUrl: paymentSession.redirectUrl,
      status: paymentSession.status,
    });
  } catch (error: any) {
    console.error("Error creating Primer payment session:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment session" },
      { status: 500 }
    );
  }
}




