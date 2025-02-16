import VirtualTourPage from "@/components/ui/VirtualTourPage";

const testimonials = [
  {
    id: 1,
    name: "Jean Dupont",
    role: "Agent Immobilier",
    content:
      "Un outil indispensable qui a révolutionné ma façon de travailler.",
    rating: 5,
  },
  {
    id: 2,
    name: "Marie Martin",
    role: "Propriétaire",
    content: "J'ai vendu ma maison en 2 semaines grâce à la visite virtuelle !",
    rating: 5,
  },
  {
    id: 3,
    name: "Pierre Durant",
    role: "Acheteur",
    content: "Gain de temps considérable dans ma recherche de bien.",
    rating: 4,
  },
];

// Données du plan de visite virtuelle (à adapter selon votre structure)
const visit3DPlanData = {
  namePlan: "Visite Virtuelle 3D",
  price: "199",
  country: "FR",
  duration: "1 mois",
};

export default function Page() {
  return (
    <VirtualTourPage
      visit3DPlanData={visit3DPlanData}
      testimonials={testimonials}
    />
  );
}
