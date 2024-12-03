// "use client";

// import { ShoppingBagIcon } from "@heroicons/react/16/solid";
// import { Button } from "@nextui-org/react";
// import { SubscriptionPlan } from "@prisma/client";
// import { useState } from "react";
// import CheckoutForm from "./CheckoutForm";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import { createPaymentIntent } from "@/lib/actions/payment";
// import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// // Si on utilise stripe
// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
// );

// type Props = {
//   plan: SubscriptionPlan;
//   buttonClassName?: string; // Nouvelle prop pour personnaliser le bouton
//   defaultPaymentProvider?: "paypal" | "stripe";
// };
// const PurchasePlan = ({
//   plan,
//   buttonClassName,
//   defaultPaymentProvider = "paypal",
// }: Props) => {
//   const [showCheckout, setShowCheckout] = useState(false);
//   const [clientSecret, setClientSecret] = useState<string | null>("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [paymentProvider, setPaymentProvider] = useState<"paypal" | "stripe">(
//     defaultPaymentProvider
//   ); // or dynamically determine

//   const { user } = useKindeBrowserClient();

//   // Stripe payment initiation
//   const intiatePayment = async () => {
//     setIsLoading(true);
//     const paymentIntent = await createPaymentIntent(
//       plan.price * 100,
//       `Payment of the user ${user?.given_name} ${user?.family_name} for buying ${plan.namePlan}. `
//     );
//     setClientSecret(paymentIntent.client_secret);
//     setShowCheckout(true);
//     setIsLoading(false);
//   };

//   // PayPal payment success handler
//   const handlePaymentSuccess = (details: any) => {
//     // Détails de la transaction réussie
//     alert(
//       `Transaction réussie ! Merci, ${details.payer.name.given_name}. Réf : ${details.id}`
//     );
//     setShowCheckout(false);
//   };

//   // PayPal payment error handler
//   const handlePaymentError = (error: any) => {
//     // Gérer les erreurs ici
//     console.error("Erreur de paiement :", error);
//     alert("Une erreur est survenue lors du paiement.");
//   };
//   //avec paypal
//   const onPaymentCancel = () => {
//     // Gérer les erreurs ici
//   };

//   console.log("Plan Price:", plan.price);
//   console.log("Payment Provider:", paymentProvider);
//   console.log("PayPal Client ID:", process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);
//   console.log("User Data:", user);

//   // if (plan.price === 0) return <Button>Essayez-le gratuitement!</Button>;
//   if (plan.price === 0)
//     return (
//       <Button
//         aria-label={`Essayez-le gratuitement! ${plan.namePlan}`}
//         className="w-full text-gray-800 font-bold py-3 rounded-lg shadow-lg transition duration-300"
//       >
//         Essayez-le gratuitement!
//       </Button>
//     );
//   // Render checkout based on payment provider
//   const renderCheckout = () => {
//     if (paymentProvider === "paypal") {
//       return (
//         <PayPalScriptProvider
//           options={{
//             clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
//             currency: "USD",
//           }}
//         >
//           <PayPalButtons
//             style={{ layout: "vertical" }}
//             aria-label={`Souscrire au Pack ${plan.namePlan}`}
//             // onClick={intiatePayment}
//             onClick={() => setShowCheckout(true)}
//             // endContent={<ShoppingBagIcon className="w-4" />}
//             // isLoading={isLoading}
//             className={`w-full text-white font-bold py-3 rounded-lg shadow-lg transition duration-300 ${buttonClassName}`}
//           >
//             Souscrire
//           </PayPalButtons>
//           {/* {clientSecret!! && (
//         <Elements
//           stripe={stripePromise}
//           options={{
//             clientSecret: clientSecret,
//           }}
//         >
//           <CheckoutForm
//             plan={plan}
//             show={showCheckout}
//             setShow={setShowCheckout}
//           />
//         </Elements>
//       )} */}
//           {showCheckout && (
//             <div className="mt-4">
//               <PayPalButtons
//                 style={{ layout: "vertical" }}
//                 createOrder={(data, actions) => {
//                   return actions.order.create({
//                     intent: "CAPTURE", // Ajout du champ intent
//                     purchase_units: [
//                       {
//                         amount: {
//                           currency_code: "USD", // Devise
//                           value: plan.price.toFixed(2), // Prix du plan
//                         },
//                         description: `Payment of the user ${user?.given_name} ${user?.family_name} for buying ${plan.namePlan}.`,
//                       },
//                     ],
//                   });
//                 }}
//                 onApprove={(data, actions) => {
//                   return actions.order?.capture().then(handlePaymentSuccess);
//                 }}
//                 onError={handlePaymentError}
//                 onCancel={onPaymentCancel}
//               />
//             </div>
//           )}
//         </PayPalScriptProvider>
//       );
//     }
//     if (paymentProvider === "stripe") {
//       return (
//         <>
//           <Button
//             aria-label={`Souscrire au Pack ${plan.namePlan}`}
//             onClick={intiatePayment}
//             endContent={<ShoppingBagIcon className="w-4" />}
//             isLoading={isLoading}
//             className={`w-full text-white font-bold py-3 rounded-lg shadow-lg transition duration-300 ${buttonClassName}`}
//           >
//             Souscrire
//           </Button>
//           {clientSecret!! && (
//             <Elements
//               stripe={stripePromise}
//               options={{
//                 clientSecret: clientSecret,
//               }}
//             >
//               <CheckoutForm
//                 plan={plan}
//                 show={showCheckout}
//                 setShow={setShowCheckout}
//               />
//             </Elements>
//           )}
//         </>
//       );
//     }
//     return null;
//   };

//   return (
//     <div>
//       <Button onClick={() => setShowCheckout(true)}>Souscrire</Button>
//       {showCheckout && renderPaymentButtons()}
//     </div>
//   );
// };

// export default PurchasePlan;
// end ----------------------------------------------------

// begin -----------------------------------------------------
// "use client";

// import { ShoppingBagIcon } from "@heroicons/react/16/solid";
// import { Button } from "@nextui-org/react";
// import { SubscriptionPlan } from "@prisma/client";
// import { useState } from "react";
// import CheckoutForm from "./CheckoutForm";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import { createPaymentIntent } from "@/lib/actions/payment";
// import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// // Stripe promise
// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
// );

// type Props = {
//   plan: SubscriptionPlan;
//   buttonClassName?: string;
//   defaultPaymentProvider?: "paypal" | "stripe";
// };

// const PurchasePlan = ({
//   plan,
//   buttonClassName,
//   defaultPaymentProvider = "paypal",
// }: Props) => {
//   const [showCheckout, setShowCheckout] = useState(false);
//   const [clientSecret, setClientSecret] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [paymentProvider, setPaymentProvider] = useState<"paypal" | "stripe">(
//     defaultPaymentProvider
//   );

//   const { user } = useKindeBrowserClient();

//   // Stripe payment initiation
//   const initiateStripePayment = async () => {
//     setIsLoading(true);
//     try {
//       const paymentIntent = await createPaymentIntent(
//         plan.price * 100,
//         `Payment of the user ${user?.given_name} ${user?.family_name} for buying ${plan.namePlan}. `
//       );
//       setClientSecret(paymentIntent.client_secret);
//       setShowCheckout(true);
//     } catch (error) {
//       console.error("Stripe payment initiation failed:", error);
//       alert("Une erreur est survenue lors de l'initialisation du paiement.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // PayPal payment success handler
//   const handlePayPalPaymentSuccess = async (details: any) => {
//     alert(
//       `Transaction réussie ! Merci, ${details.payer.name.given_name}. Réf : ${details.id}`
//     );
//     setShowCheckout(false);
//     return; // Return a Promise<void>
//   };

//   // PayPal payment error handler
//   const handlePayPalPaymentError = (error: any) => {
//     console.error("Erreur de paiement PayPal :", error);
//     alert("Une erreur est survenue lors du paiement.");
//   };

//   // Render checkout based on payment provider
//   const renderCheckout = () => {
//     if (paymentProvider === "paypal") {
//       return (
//         <PayPalScriptProvider
//           options={{
//             clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
//             currency: "USD",
//           }}
//         >
//           <PayPalButtons
//             style={{ layout: "vertical" }}
//             createOrder={(data, actions) => {
//               return actions.order.create({
//                 intent: "CAPTURE",
//                 purchase_units: [
//                   {
//                     amount: {
//                       currency_code: "USD",
//                       value: plan.price.toFixed(2),
//                     },
//                     description: `Payment of the user ${user?.given_name} ${user?.family_name} for buying ${plan.namePlan}.`,
//                   },
//                 ],
//               });
//             }}
//             onApprove={(data, actions) => {
//               if (!actions.order) {
//                 console.error("Order is undefined");
//                 return Promise.reject("Order is undefined");
//               }
//               return actions.order?.capture().then(handlePayPalPaymentSuccess);
//             }}
//             onError={handlePayPalPaymentError}
//             onCancel={() => setShowCheckout(false)}
//           />
//         </PayPalScriptProvider>
//       );
//     }

//     if (paymentProvider === "stripe" && clientSecret) {
//       return (
//         <Elements
//           stripe={stripePromise}
//           options={{
//             clientSecret: clientSecret,
//           }}
//         >
//           <CheckoutForm
//             plan={plan}
//             show={showCheckout}
//             setShow={setShowCheckout}
//           />
//         </Elements>
//       );
//     }

//     return null;
//   };

//   // Handle subscribe button click
//   const handleSubscribe = () => {
//     if (paymentProvider === "stripe") {
//       initiateStripePayment();
//     } else {
//       setShowCheckout(true);
//     }
//   };

//   // If plan is free
//   if (plan.price === 0) {
//     return (
//       <Button
//         aria-label={`Essayez-le gratuitement! ${plan.namePlan}`}
//         className="w-full text-gray-800 font-bold py-3 rounded-lg shadow-lg transition duration-300"
//       >
//         Essayez-le gratuitement!
//       </Button>
//     );
//   }

//   return (
//     <div>
//       <div className="flex items-center space-x-2 mb-2">
//         <span className="text-white">Payer avec:</span>
//         <button
//           className={`border-2 border-primary rounded-md px-4 py-2 transition-colors ${
//             paymentProvider === "paypal"
//               ? "bg-primary text-white"
//               : "hover:bg-primary/10"
//           }`}
//           onClick={() => setPaymentProvider("paypal")}
//         >
//           PayPal
//         </button>
//         <button
//           className={`border-2 border-primary rounded-md px-4 py-2 transition-colors ${
//             paymentProvider === "stripe"
//               ? "bg-primary text-white"
//               : "hover:bg-primary/10"
//           }`}
//           onClick={() => setPaymentProvider("stripe")}
//         >
//           Stripe
//         </button>
//       </div>

//       <button
//         aria-label={`Souscrire au Pack ${plan.namePlan}`}
//         onClick={handleSubscribe}
//         className={`w-full bg-primary hover:bg-primary/80 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-300 ${buttonClassName}`}
//       >
//         Souscrire
//       </button>

//       {showCheckout && renderCheckout()}
//     </div>
//   );
// };

// export default PurchasePlan;

// end -------------------------------

// begin ---------------------
// integration plan gratuit par Cedrico

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
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import ModalCity from "./ModalCity";
import useModalOpen from "@/app/hooks/useModalOpen";

// Stripe promise
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type Props = {
  plan: SubscriptionPlan;
  buttonClassName?: string;
  defaultPaymentProvider?: "paypal" | "stripe";
};

const PurchasePlan = ({
  plan,
  buttonClassName,
  defaultPaymentProvider = "paypal",
}: Props) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentProvider, setPaymentProvider] = useState<"paypal" | "stripe">(
    defaultPaymentProvider
  );
  const [openModal, setOpenModal] = useState(false);
  const handleModalOpen = useModalOpen();

  const { user } = useKindeBrowserClient();

  // Stripe payment initiation
  const initiateStripePayment = async () => {
    setIsLoading(true);
    try {
      const paymentIntent = await createPaymentIntent(
        plan.price * 100,
        `Payment of the user ${user?.given_name} ${user?.family_name} for buying ${plan.namePlan}. `
      );
      setClientSecret(paymentIntent.client_secret);
      setShowCheckout(true);
    } catch (error) {
      console.error("Stripe payment initiation failed:", error);
      alert("Une erreur est survenue lors de l'initialisation du paiement.");
    } finally {
      setIsLoading(false);
    }
  };

  // PayPal payment success handler
  const handlePayPalPaymentSuccess = async (details: any) => {
    alert(
      `Transaction réussie ! Merci, ${details.payer.name.given_name}. Réf : ${details.id}`
    );
    setShowCheckout(false);
    return; // Return a Promise<void>
  };

  // PayPal payment error handler
  const handlePayPalPaymentError = (error: any) => {
    console.error("Erreur de paiement PayPal :", error);
    alert("Une erreur est survenue lors du paiement.");
  };

  // Render checkout based on payment provider
  const renderCheckout = () => {
    if (paymentProvider === "paypal") {
      return (
        <PayPalScriptProvider
          options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
            currency: "EUR",
          }}
        >
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={(data, actions) => {
              return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [
                  {
                    amount: {
                      currency_code: "EUR",
                      value: plan.price.toFixed(2),
                    },
                    description: `Payment of the user ${user?.given_name} ${user?.family_name} for buying ${plan.namePlan}.`,
                  },
                ],
              });
            }}
            onApprove={(data, actions) => {
              if (!actions.order) {
                console.error("Order is undefined");
                return Promise.reject("Order is undefined");
              }
              return actions.order?.capture().then(handlePayPalPaymentSuccess);
            }}
            onError={handlePayPalPaymentError}
            onCancel={() => setShowCheckout(false)}
          />
        </PayPalScriptProvider>
      );
    }

    if (paymentProvider === "stripe" && clientSecret) {
      return (
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
      );
    }

    return null;
  };

  // Handle subscribe button click
  const handleSubscribe = () => {
    if (paymentProvider === "stripe") {
      initiateStripePayment();
    } else {
      setShowCheckout(true);
    }
  };

  // If plan is free
  if (plan.price === 0) {
    return (
      <>
        {openModal && <ModalCity setOpenModal={setOpenModal} plan={plan} />}
        <Button
          aria-label={`Essayez-le gratuitement! ${plan.namePlan}`}
          className="w-full text-gray-800 font-bold py-3 rounded-lg shadow-lg transition duration-300"
          onClick={() => {
            handleModalOpen(setOpenModal, "hidden", true);
          }}
        >
          Essayez-le gratuitement!
        </Button>
      </>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-white">Payer avec:</span>
        <button
          className={`border-2 border-primary rounded-md px-4 py-2 transition-colors ${
            paymentProvider === "paypal"
              ? "bg-primary text-white"
              : "hover:bg-primary/10"
          }`}
          onClick={() => setPaymentProvider("paypal")}
        >
          PayPal
        </button>
        <button
          className={`border-2 border-primary rounded-md px-4 py-2 transition-colors ${
            paymentProvider === "stripe"
              ? "bg-primary text-white"
              : "hover:bg-primary/10"
          }`}
          onClick={() => setPaymentProvider("stripe")}
        >
          Stripe
        </button>
      </div>

      <button
        aria-label={`Souscrire au Pack ${plan.namePlan}`}
        onClick={handleSubscribe}
        className={`w-full bg-primary hover:bg-primary/80 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-300 ${buttonClassName}`}
      >
        Souscrire
      </button>

      {showCheckout && renderCheckout()}
    </div>
  );
};

export default PurchasePlan;
