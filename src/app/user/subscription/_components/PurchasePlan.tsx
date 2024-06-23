"use client";

import { ShoppingBagIcon } from "@heroicons/react/16/solid";
import { Button } from "@nextui-org/react";
import { SubscriptionPlan } from "@prisma/client";

type Props = {
  plan: SubscriptionPlan;
};
const PurchasePlan = ({ plan }: Props) => {
  if (plan.price === 0) return <Button>Essayez-le gratuitement!</Button>;
  return (
    <>
      <Button
        color="secondary"
        endContent={<ShoppingBagIcon className="w-4" />}
      >
        Acheter cet abonnement.
      </Button>
    </>
  );
};

export default PurchasePlan;
