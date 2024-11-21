"use client";

import { ShoppingBagIcon } from "@heroicons/react/16/solid";
import { Button } from "@nextui-org/react";
import { SubscriptionPlan } from "@prisma/client";
import { useState } from "react";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { createPaymentIntent } from "@/lib/actions/payment";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type Props = {
  plan: SubscriptionPlan;
  buttonClassName?: string; // Nouvelle prop pour personnaliser le bouton
};
const PurchasePlan = ({ plan, buttonClassName }: Props) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useKindeBrowserClient();

  const intiatePayment = async () => {
    setIsLoading(true);
    const paymentIntent = await createPaymentIntent(
      plan.price * 100,
      `Payment of the user ${user?.given_name} ${user?.family_name} for buying ${plan.namePlan}. `
    );
    setClientSecret(paymentIntent.client_secret);
    setShowCheckout(true);
    setIsLoading(false);
  };
  if (plan.price === 0) return <Button>Essayez-le gratuitement!</Button>;
  return (
    <>
      <Button
        aria-label={`Souscrire au Pack ${plan.namePlan}`}
        onClick={intiatePayment}
        endContent={<ShoppingBagIcon className="w-4" />}
        isLoading={isLoading}
        className={`w-full text-white font-bold py-3 rounded-lg shadow-lg transition duration-300 ${buttonClassName}`}
      >
        Souscrire
      </Button>
      {clientSecret!! && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: clientSecret,
          }}
        >
          <CheckoutForm
            plan={plan}
            show={showCheckout}
            setShow={setShowCheckout}
          />
        </Elements>
      )}
    </>
  );
};

export default PurchasePlan;
