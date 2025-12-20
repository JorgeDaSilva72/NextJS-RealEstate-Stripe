"use client";

import React, { useEffect, useState } from "react";
import HomeNavbar from "../../../../components/HomeNavbar";
import HomeFooter from "../../../../components/HomeFooter";
import HeroSection from "../../../../components/HeroSection";
import { SubscriptionPlan } from "@prisma/client";
import AddPropertyForm from "./AddPropertyForm";
import { Link } from "@/i18n/routing";
import SubModal from "./SubModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// ⚠️ NOUVEAU TYPE : Structure des données traduites (ID + Nom traduit)
interface TranslatedClientItem {
  id: number;
  code: string;
  name: string; // Le nom traduit du type/statut
}

interface AddPropertyClientProps {
  showModal: boolean;
  modalMessage: string;

  // ✅ Types et Status sont désormais des tableaux de l'interface traduite
  types: TranslatedClientItem[];
  statuses: TranslatedClientItem[];

  countries: TranslatedClientItem[] | undefined;
  cities: TranslatedClientItem[] | undefined;

  // ✅ NOUVELLES PROPS : Limites des médias (calculées côté serveur)
  photoLimit: number;
  shortVideoLimit: number;

  planDetails?: Pick<
    SubscriptionPlan,
    | "namePlan"
    | "premiumAds"
    | "photosPerAd"
    | "shortVideosPerAd"
    | "youtubeVideoDuration"
  > | null;
}

const AddPropertyClient: React.FC<AddPropertyClientProps> = ({
  showModal,
  modalMessage,
  types,
  statuses,
  cities,
  countries,
  planDetails,
  photoLimit,
  shortVideoLimit,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(showModal);

  useEffect(() => {
    setIsModalOpen(showModal);
  }, [showModal]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Navbar */}
      <HomeNavbar />

      {/* Hero Section */}
      <HeroSection
        title="Publier une annonce"
        description="Remplissez le formulaire ci-dessous pour publier votre propriété"
      />

      {/* Subscription Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Abonnement requis</DialogTitle>
            <DialogDescription>{modalMessage}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button asChild>
              <Link href="/user/subscription">Voir les abonnements</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Form Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AddPropertyForm
          types={types}
          statuses={statuses}
          countries={countries || []}
          cities={cities || []}
          planDetails={planDetails}
          photoLimit={photoLimit}
          shortVideoLimit={shortVideoLimit}
        />
      </section>

      {/* Footer */}
      <HomeFooter />
    </div>
  );
};

export default AddPropertyClient;
