# Primer Payment Integration

This project uses **Primer** as the main payment orchestrator, connecting multiple payment providers for African and international payments.

## Overview

Primer acts as a single entry point for all payments, connecting:
- **Flutterwave** (Mobile Money, Franc CFA, cards)
- **Paystack** (Nigeria, Ghana, cards)
- **Visa/Mastercard** (via Primer)
- **PayPal** (optional, if enabled in Primer)

## Environment Variables

Add these to your `.env` file:

```env
# Primer API Configuration
PRIMER_API_KEY=your_primer_api_key_here
PRIMER_WEBHOOK_SECRET=your_primer_webhook_secret_here

# Optional: Keep existing Stripe/PayPal for fallback
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
```

## Setup Instructions

### 1. Create Primer Account

1. Sign up at [primer.io](https://primer.io)
2. Get your API key from the dashboard
3. Configure webhook endpoint: `https://yourdomain.com/api/primer/webhook`

### 2. Connect Payment Providers

In Primer dashboard:
- Connect **Flutterwave** account
- Connect **Paystack** account
- Enable **Visa/Mastercard** payments
- Optionally enable **PayPal**

### 3. Database Migration

Run the migration to add `paymentProvider` field:

```bash
npx prisma migrate dev
```

### 4. Update Subscription Plans

The subscription plans have been updated with new pricing:
- **Bronze**: 150 €/year - 5 listings, 8 photos/listing
- **Argent**: 250 €/year - 10 listings, 8 photos/listing
- **Or**: 400 €/year - 20 listings, 10 photos/listing
- **Diamant**: 1500 €/year - Unlimited listings, 15+ photos/listing, videos enabled

## Payment Flow

1. User selects a subscription plan
2. Clicks "Choisir ce plan"
3. Payment modal opens with options:
   - **Carte bancaire** (Visa/Mastercard via Primer)
   - **Paiements africains** (Flutterwave/Paystack via Primer)
4. User selects payment method
5. Primer creates payment session
6. User is redirected to Primer checkout
7. Payment is processed
8. Webhook confirms payment
9. Subscription is activated

## Webhook Handling

The webhook endpoint `/api/primer/webhook` handles:
- `payment.success` - Activates subscription
- `payment.failed` - Logs failure
- `subscription.created` - Handles recurring subscriptions

**Important**: Subscriptions are only activated after webhook confirmation, not from frontend.

## Subscription Limits Enforcement

The system enforces limits based on subscription plan:
- Maximum listings per plan
- Photos per listing limit
- Video upload restrictions
- Premium listing features

Limits are checked in:
- `src/lib/subscription-limits.ts` - Limit checking utilities
- `src/app/[locale]/user/properties/add/page.tsx` - Property creation
- Property upload forms - Photo/video limits

## Upgrade Logic

When upgrading:
- Old subscription is canceled
- New subscription starts immediately
- Pro-rating can be configured (currently disabled)

## Testing

1. Use Primer's test mode
2. Test with test cards provided by Primer
3. Verify webhook delivery in Primer dashboard
4. Check subscription activation in database

## Security

- All webhooks are verified using signature validation
- Payment confirmation only from webhooks (not frontend)
- SSL 256-bit encryption for all transactions

## Support

For Primer integration issues:
- Check Primer dashboard for payment status
- Verify webhook delivery
- Check server logs for errors
- Review Primer API documentation




