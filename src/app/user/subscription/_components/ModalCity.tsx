import ButtonClose from "@/app/components/ButtonClose";
import { citiesOfMorocco } from "@/data/cities";
import useModalOpen from "@/app/hooks/useModalOpen";
import { saveFreeSubscription } from "@/lib/actions/subscription";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Select, SelectItem } from "@nextui-org/react";
import { SubscriptionPlan } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface ModalCityPropsType {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  plan: SubscriptionPlan;
}

const ModalCity = ({ setOpenModal, plan }: ModalCityPropsType) => {
  const [selectedCity, setSelectedCity] = useState("");
  const handleModalOpen = useModalOpen();
  const { user } = useKindeBrowserClient();
  const router = useRouter();

  const handleFreeSubscribe = async () => {
    if (!user?.id) return;
    const startDate = new Date();
    // const startDate = new Date().toISOString();

    // Date de fin de l'abonnement (par exemple, 12 mois après la date de début)
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 12);
    const result = await saveFreeSubscription({
      userId: user?.id,
      planId: plan.id,
      endDate,
      startDate,
      paymentId: "gratuit",
      city: selectedCity,
    });

    if (result.success) {
      toast.success(result.message);
      router.push("/user/profile");
    } else toast.error(result.message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="p-4 relative w-full max-w-md mx-4 sm:mx-auto max-h-[90vh] bg-gradient-to-br from-sky-400 to-indigo-500 rounded-lg shadow-2xl  animate-fadeDown">
        <ButtonClose
          top="top-2"
          right="right-2"
          width="w-8"
          height="h-8"
          onClick={() => handleModalOpen(setOpenModal, "auto", false)}
        />
        <div className="flex flex-col gap-4 justify-center items-center">
          <span>
            Veuillez choisir la ville ou vous allez poster vos annonces
          </span>
          <Select
            aria-label="Villes"
            variant="bordered"
            placeholder="Choisir une ville"
            value={selectedCity}
            className="flex-grow max-w-full p-2 shadow-lg bg-white text-gray-700 rounded"
            selectionMode="single"
            onSelectionChange={(value) =>
              setSelectedCity(Array.from(value)[0] as string)
            }
          >
            {citiesOfMorocco.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.value}
              </SelectItem>
            ))}
          </Select>
          <button
            onClick={() => handleFreeSubscribe()}
            className="px-4 py-2 bg-indigo-600 text-white rounded shadow-lg hover:bg-indigo-700 mb-4 md:mb-0 text-center"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCity;
