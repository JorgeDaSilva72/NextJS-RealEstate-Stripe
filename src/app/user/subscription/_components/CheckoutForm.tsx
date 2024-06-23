import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { SubscriptionPlan } from "@prisma/client";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import React, { FormEvent, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  show: boolean;
  setShow: (show: boolean) => void;
  plan: SubscriptionPlan;
}

const CheckoutForm = (props: Props) => {
  const [isLoading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);

      if (!elements || !stripe) return;

      const result = await stripe?.confirmPayment({
        elements,
        confirmParams: {
          return_url: "http://localhost:3000/user/profile",
        },
        redirect: "if_required",
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        toast.success("Payment Sucessfull!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal isOpen={props.show}>
      <ModalContent>
        <ModalHeader>Finalisez votre achat d&apos;abonnement</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <PaymentElement />
            {/* <AddressElement
              options={{
                mode: "shipping",
                allowedCountries: ["US"],
              }}
            /> */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => props.setShow(false)}
                color="danger"
                variant="light"
              >
                Annuler
              </Button>
              <Button color="primary" type="submit">
                Payer
              </Button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CheckoutForm;
