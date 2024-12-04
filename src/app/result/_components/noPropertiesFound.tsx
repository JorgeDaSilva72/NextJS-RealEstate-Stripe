"use client";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation"; // Pour la redirection
import { FC } from "react";

interface NoPropertiesFoundProps {
  title?: string; // Titre à afficher
  message?: string; // Message d'information
  buttonText?: string; // Texte du bouton
  redirectPath?: string; // Chemin vers lequel rediriger
  Icon?: FC<{ className?: string }>; // Composant pour une icône personnalisée
}

const NoPropertiesFound: FC<NoPropertiesFoundProps> = ({
  title = "Aucune annonce trouvée",
  message = "Désolé, nous n'avons trouvé aucune annonce correspondant à votre recherche. Essayez d'ajuster vos critères.",
  buttonText = "Modifier la recherche",
  redirectPath = "/result", // Valeur par défaut pour la redirection
  Icon, // Icône personnalisée
}) => {
  const router = useRouter(); // Initialisation du routeur

  const handleButtonClick = () => {
    router.push(redirectPath); // Redirige l'utilisateur
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-lg min-h-[300px] w-full max-w-md mx-auto transition-all duration-300 hover:shadow-xl">
      {Icon ? (
        <Icon className="mb-4 text-gray-400 size-6" />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          aria-label="Icône de recherche"
          className="size-6 mb-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      )}
      <h2 className="text-xl font-bold text-center">{title}</h2>
      <p className="max-w-xs mt-2 text-sm text-center text-gray-500">
        {message}
      </p>
      <Button
        className="px-4 py-2 mt-6 text-white transition-colors duration-300 bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        onPress={handleButtonClick}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default NoPropertiesFound;
