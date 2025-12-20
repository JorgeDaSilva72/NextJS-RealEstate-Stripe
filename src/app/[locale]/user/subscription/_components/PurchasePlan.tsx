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
// import ModalCity from "./ModalCity";
// import useModalOpen from "@/app/[locale]/hooks/useModalOpen";
// import { toast } from "react-toastify";
// import { useRouter } from "@/i18n/routing";
// import {
//   saveFreeSubscription,
//   saveSubscription,
// } from "@/lib/actions/subscription";
// import { AnyNode } from "postcss";
// // import type { OnApproveData, OnApproveActions } from "@paypal/react-paypal-js";

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
//   // const [openModal, setOpenModal] = useState(false);
//   // const handleModalOpen = useModalOpen();

//   const { user } = useKindeBrowserClient();
//   const router = useRouter();

//   // if (!user) {
//   //   toast.error("Vous devez être connecté pour effectuer un achat.");
//   //   router.push("/");
//   //   return null;
//   // }

//   //Vérification des clés d'environnement
//   if (
//     (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
//       !process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) &&
//     plan.namePlan.toLowerCase() != "gratuit"
//   ) {
//     console.error(
//       "Les clés d'environnement Stripe ou PayPal sont manquantes !"
//     );
//     toast.error(
//       "Une erreur de configuration est survenue. Veuillez réessayer plus tard."
//     );
//     return null;
//   }

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
//       toast.error(
//         "Une erreur est survenue lors de l'initialisation du paiement."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // PayPal payment success handler
//   const handlePayPalPaymentSuccess = async (details: any) => {
//     // Logique après paiement réussi

//     console.log(
//       `Transaction paypal réussie ! Merci, ${details.payer.name.given_name}. Réf : ${details.id}`
//     );
//     // Date de début de l'abonnement
//     const startDate = new Date();
//     // const startDate = new Date().toISOString();

//     // Date de fin de l'abonnement (par exemple, 12 mois après la date de début)
//     const endDate = new Date();
//     endDate.setMonth(endDate.getMonth() + 12);
//     // const endDateISOString = endDate.toISOString();

//     if (!user) {
//       toast.error("Vous devez être connecté pour effectuer un achat.");
//       router.push("/");
//       return null;
//     }

//     try {
//       await saveSubscription({
//         paymentId: details.id,
//         planId: plan.id,
//         userId: user?.id,
//         startDate: startDate,
//         endDate: endDate,
//       });
//       toast.success("Merci pour votre abonnement.");
//       router.push("/user/profile");
//     } catch (error) {
//       console.error("Erreur lors de l'enregistrement de l'abonnement :", error);
//       toast.error("Une erreur est survenue. Veuillez réessayer.");
//     }

//     setShowCheckout(false);
//     return; // Return a Promise<void>
//   };

//   // PayPal payment error handler
//   const handlePayPalPaymentError = (error: any) => {
//     console.error("Erreur de paiement PayPal :", error);
//     toast.error(
//       `Erreur de paiement : ${error.message || "Transaction échouée"}`
//     );
//   };

//   // Render checkout based on payment provider
//   const renderCheckout = () => {
//     if (paymentProvider === "paypal") {
//       return (
//         <PayPalScriptProvider
//           options={{
//             clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
//             currency: "EUR",
//           }}
//         >
//           <PayPalButtons
//             style={{
//               layout: "vertical",
//               color: "blue",
//               shape: "rect",
//               label: "paypal",
//             }}
//             createOrder={(data, actions) => {
//               return actions.order.create({
//                 intent: "CAPTURE",
//                 purchase_units: [
//                   {
//                     amount: {
//                       currency_code: "EUR",
//                       value: plan.price.toFixed(2),
//                     },
//                     description: `Payment of the user ${user?.given_name} ${user?.family_name} for buying ${plan.namePlan}.`,
//                   },
//                 ],
//               });
//             }}
//             onApprove={async (data: any, actions: any): Promise<void> => {
//               if (!actions.order) {
//                 console.error("Order is undefined");
//                 throw new Error("Order is undefined"); // Lever une erreur explicite au lieu de retourner null/undefined
//               }

//               try {
//                 const details = await actions.order.capture(); // Appel de la méthode capture
//                 await handlePayPalPaymentSuccess(details); // Appel de la fonction de succès
//               } catch (error) {
//                 console.error("Erreur lors de la capture de l'ordre :", error);
//                 handlePayPalPaymentError(error); // Gestion de l'erreur
//                 throw error; // Relancer l'erreur pour respecter Promise<void>
//               }
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
//       <>
//         {/* {openModal && <ModalCity setOpenModal={setOpenModal} plan={plan} />} */}
//         <Button
//           aria-label={`Essayez-le gratuitement! ${plan.namePlan}`}
//           className="w-full text-gray-800 font-bold py-3 rounded-lg shadow-lg transition duration-300"
//           onClick={async () => {
//             if (!user?.id) return;
//             const startDate = new Date();
//             // const startDate = new Date().toISOString();

//             // Date de fin de l'abonnement (par exemple, 12 mois après la date de début)
//             const endDate = new Date();
//             endDate.setMonth(endDate.getMonth() + 12);
//             const result = await saveFreeSubscription({
//               userId: user?.id,
//               planId: plan.id,
//               endDate,
//               startDate,
//               paymentId: "gratuit",
//             });

//             if (result.success) {
//               toast.success(result.message);
//               router.push("/user/profile");
//             } else toast.error(result.message);
//             // handleModalOpen(setOpenModal, "hidden", true);
//           }}
//         >
//           Essayez-le gratuitement!
//         </Button>
//       </>
//     );
//   }

//   return (
//     <div>
//       <div className="flex items-center space-x-2 mb-2">
//         <span className="text-primary">Payer avec:</span>
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
//         {/* <button
//           className={`border-2 border-primary rounded-md px-4 py-2 transition-colors ${
//             paymentProvider === "stripe"
//               ? "bg-primary text-white"
//               : "hover:bg-primary/10"
//           }`}
//           onClick={() => setPaymentProvider("stripe")}
//         >
//           Stripe
//         </button> */}
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
// --------------------------------------------------
// ----------------------------------------------------------
// next-intl with chatgpt
"use client";

import { useTranslations } from "next-intl";
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
import { toast } from "react-toastify";
import { useRouter } from "@/i18n/routing";
import {
  saveFreeSubscription,
  saveSubscription,
} from "@/lib/actions/subscription";

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
  const t = useTranslations("PurchasePlan");
  const [showCheckout, setShowCheckout] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentProvider, setPaymentProvider] = useState<"paypal" | "stripe">(
    defaultPaymentProvider
  );

  const { user } = useKindeBrowserClient();
  const router = useRouter();

  if (
    (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
      !process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) &&
    plan.namePlan.toLowerCase() !== "gratuit"
  ) {
    console.error(t("environmentKeysMissing"));
    toast.error(t("configError"));
    return null;
  }

  const initiateStripePayment = async () => {
    setIsLoading(true);
    try {
      const numericPrice =
        typeof plan.price === "number"
          ? plan.price
          : (plan.price as any).toNumber?.() ?? Number(plan.price);

      const paymentIntent = await createPaymentIntent(
        numericPrice * 100,
        `Payment of the user ${user?.given_name} ${user?.family_name} for buying ${plan.namePlan}.`
      );
      setClientSecret(paymentIntent.client_secret);
      setShowCheckout(true);
    } catch (error) {
      console.error(t("paymentError"), error);
      toast.error(t("paymentError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayPalPaymentSuccess = async (details: any) => {
    console.log(
      t("transactionSuccess", {
        userName: details.payer.name.given_name,
        transactionId: details.id,
      })
    );
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 12);

    if (!user) {
      toast.error(t("loginRequired"));
      router.push("/");
      return null;
    }

    try {
      await saveSubscription({
        paymentId: details.id,
        planId: plan.id,
        userId: user?.id,
        startDate: startDate,
        endDate: endDate,
      });
      toast.success(t("paymentSuccess"));
      router.push("/user/profile");
    } catch (error) {
      console.error(t("subscriptionError"), error);
      toast.error(t("subscriptionError"));
    }

    setShowCheckout(false);
  };

  const handlePayPalPaymentError = (error: any) => {
    console.error(t("paypalError", { errorMessage: error.message }));
    toast.error(
      t("paypalError", { errorMessage: error.message || "Transaction échouée" })
    );
  };

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
            style={{
              layout: "vertical",
              color: "blue",
              shape: "rect",
              label: "paypal",
            }}
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
            onApprove={async (data, actions) => {
              if (!actions.order) {
                console.error("Order is undefined");
                throw new Error("Order is undefined");
              }
              try {
                const details = await actions.order.capture();
                await handlePayPalPaymentSuccess(details);
              } catch (error) {
                console.error("Erreur lors de la capture de l'ordre :", error);
                handlePayPalPaymentError(error);
                throw error;
              }
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
          options={{ clientSecret: clientSecret }}
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

  const handleSubscribe = () => {
    if (paymentProvider === "stripe") {
      initiateStripePayment();
    } else {
      setShowCheckout(true);
    }
  };

  const numericPrice =
    typeof plan.price === "number"
      ? plan.price
      : (plan.price as any).toNumber?.() ?? Number(plan.price);

  if (numericPrice === 0) {
    return (
      <Button
        aria-label={t("tryForFree")}
        className="w-full text-gray-800 font-bold py-3 rounded-lg shadow-lg transition duration-300"
        onClick={async () => {
          if (!user?.id) return;
          const startDate = new Date();
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + 12);
          const result = await saveFreeSubscription({
            userId: user?.id,
            planId: plan.id,
            endDate,
            startDate,
            paymentId: "gratuit",
          });

          if (result.success) {
            toast.success(result.message);
            router.push("/user/profile");
          } else toast.error(result.message);
        }}
      >
        {t("tryForFree")}
      </Button>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-primary">{t("payWith")}</span>
        <button
          className={`border-2 border-primary rounded-md px-4 py-2 transition-colors ${
            paymentProvider === "paypal"
              ? "bg-primary text-white"
              : "hover:bg-primary/10"
          }`}
          onClick={() => setPaymentProvider("paypal")}
        >
          {t("paypal")}
        </button>
      </div>

      <button
        aria-label={t("subscribeToPlan", { planName: plan.namePlan })}
        onClick={handleSubscribe}
        disabled={isLoading}
        className={`w-full text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-300 ${buttonClassName} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? "Chargement..." : t("subscribe")}
      </button>

      {showCheckout && renderCheckout()}
    </div>
  );
};

export default PurchasePlan;
