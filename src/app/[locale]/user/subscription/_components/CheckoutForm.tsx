import { saveSubscription } from "@/lib/actions/subscription";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { SubscriptionPlan } from "@prisma/client";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useRouter } from "@/i18n/routing";
import React, { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  show: boolean;
  setShow: (show: boolean) => void;
  plan: SubscriptionPlan;
}

const CheckoutForm = (props: Props) => {
  const [isLoading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useKindeBrowserClient();
  const router = useRouter();
  if (!user) return;
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);
      if (!elements || !stripe) return;

      // Get current locale from URL
      const currentLocale = typeof window !== "undefined" 
        ? window.location.pathname.split('/')[1] || 'fr'
        : 'fr';
      const baseUrl = typeof window !== "undefined" 
        ? window.location.origin 
        : "http://localhost:3000";

      const result = await stripe?.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${baseUrl}/${currentLocale}/user/profile`,
        },
        redirect: "if_required",
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        // Date de début de l'abonnement
        const startDate = new Date();
        // const startDate = new Date().toISOString();

        // Date de fin de l'abonnement (par exemple, 12 mois après la date de début)
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 12); // Ajouter un mois
        // const endDateISOString = endDate.toISOString();

        const subscriptionResult = await saveSubscription({
          paymentId: result.paymentIntent.id,
          planId: props.plan.id,
          userId: user?.id,
          startDate: startDate,
          endDate: endDate,
        });

        if (subscriptionResult.success) {
          toast.success("Merci pour votre abonnement.");
          router.push("/user/profile");
        } else {
          toast.error(subscriptionResult.message || "Erreur lors de l'enregistrement de l'abonnement.");
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={props.show} onOpenChange={props.setShow}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Finalisez votre achat d&apos;abonnement</DialogTitle>
          <DialogDescription>
            Complétez votre paiement pour activer votre plan {props.plan.namePlan}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="py-4">
            <PaymentElement />
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => props.setShow(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isLoading ? "Traitement..." : "Payer maintenant"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutForm;
