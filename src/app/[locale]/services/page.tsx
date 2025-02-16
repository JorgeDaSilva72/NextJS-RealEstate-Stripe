import VirtualTourPage from "@/components/ui/VirtualTourPage";

// Données du plan de visite virtuelle (à adapter selon votre structure)
const visit3DPlanData = {
  namePlan: "Visite Virtuelle 3D",
  price: "",
  country: "",
  duration: "",
};

export default function Page() {
  return <VirtualTourPage visit3DPlanData={visit3DPlanData} />;
}
