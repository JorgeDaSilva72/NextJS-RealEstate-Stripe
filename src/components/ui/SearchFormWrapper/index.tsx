// "use client";

// import SearchForm from "@/app/components/SearchForm";
// import React from "react";

// const SearchFormWrapper = () => {
//   return (
//     <SearchForm
//       defaultValues={{
//         ville: "",
//         categorie: "Appartement",
//         budget: "",
//         chambres: "",
//       }}
//       defaultActiveTab="Vente"
//       backgroundColor="bg-black"
//     />
//   );
// };

// export default SearchFormWrapper;
"use client";

import SearchForm from "@/app/[locale]/components/SearchForm";
// import SearchForm from "@/app/components/SearchForm";
import React from "react";

interface SearchFormWrapperProps {
  defaultValues: {
    ville: string;
    categorie: string;
    budget: string;
    chambres: string;
  };
  defaultActiveTab: string;
  backgroundColor: string;
}

const SearchFormWrapper: React.FC<SearchFormWrapperProps> = (props) => {
  return <SearchForm {...props} />;
};

export default SearchFormWrapper;
