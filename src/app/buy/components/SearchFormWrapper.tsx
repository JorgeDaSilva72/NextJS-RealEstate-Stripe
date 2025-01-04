// components/SearchFormWrapper.tsx
"use client";

import SearchForm from "@/app/components/SearchForm";
import React from "react";

const SearchFormWrapper = () => {
  return (
    <SearchForm
      defaultValues={{
        ville: "",
        categorie: "Appartement",
        budget: "",
        chambres: "",
      }}
      defaultActiveTab="Vente"
      backgroundColor="bg-black"
    />
  );
};

export default SearchFormWrapper;
