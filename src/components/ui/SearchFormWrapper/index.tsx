// "use client";

// import SearchForm from "@/app/[locale]/components/SearchForm";
// // import SearchForm from "@/app/components/SearchForm";
// import React from "react";

// interface SearchFormWrapperProps {
//   defaultValues: {
//     ville: string;
//     categorie: string;
//     budget: string;
//     chambres: string;
//   };
//   defaultActiveTab: string;
//   backgroundColor: string;
// }

// const SearchFormWrapper: React.FC<SearchFormWrapperProps> = (props) => {
//   return <SearchForm {...props} />;
// };

// export default SearchFormWrapper;

// SearchForm.tsx

// 09-12-2025 code du dessus mise en commentaire
"use client"; // Le code est utilisé côté client, nécessaire pour les hooks d'interaction.

import React from "react";

// Définition de l'interface des props (si vous n'avez pas de props, vous pouvez l'omettre)
interface SearchFormProps {
  // Ajoutez des props si votre composant en a besoin
  className?: string;
}

// Définition du composant
const SearchForm: React.FC<SearchFormProps> = ({ className }) => {
  return (
    <div className={`p-4 border rounded ${className}`}>
      {/* Contenu du formulaire */}
    </div>
  );
};

// EXPORTATION PAR DÉFAUT CRITIQUE : Ceci corrige l'erreur "is not a module"
export default SearchForm;
