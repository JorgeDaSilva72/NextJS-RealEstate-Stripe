// import React, { useState, useEffect } from "react";
// import { citiesOfMorocco } from "../data/cities";
// import { PropertyStatus, PropertyType } from "@prisma/client";
// import useFetchValues from "../hooks/useFetchValues";
// import { ChevronDown } from "lucide-react";
// import { Select, SelectItem } from "@nextui-org/react";
// import { bedroomOptions, budgetOptions } from "../data/constants";

// interface FormValues {
//   ville: string;
//   categorie: string;
//   budget: string;
//   chambres: string;
// }

// interface SearchFormProps {
//   onSearch?: (values: FormValues & { type: string }) => void;
// }

// const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
//   const [statuses, setStatuses] = useState<PropertyStatus[]>([]);
//   const [activeTab, setActiveTab] = useState<string>("");
//   const [types, setTypes] = useState<PropertyType[]>([]);
//   const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const [formValues, setFormValues] = useState<FormValues>({
//     ville: "",
//     categorie: "",
//     budget: "",
//     chambres: "",
//   });

//   const fetchValues = useFetchValues();

//   // Utilitaires
//   const getBudgetRange = (
//     budgetValue: string
//   ): { min: number; max: number } => {
//     switch (budgetValue) {
//       case "0-200000":
//         return { min: 0, max: 200000 };
//       case "200000-500000":
//         return { min: 200000, max: 500000 };
//       case "500000+":
//         return { min: 500000, max: 100000000 };
//       default:
//         return { min: 0, max: 100000000 };
//     }
//   };

//   const getBedroomRange = (
//     chambreValue: string
//   ): { min: number; max: number } => {
//     switch (chambreValue) {
//       case "1":
//         return { min: 1, max: 1 };
//       case "2":
//         return { min: 2, max: 2 };
//       case "3":
//         return { min: 3, max: 10 };
//       default:
//         return { min: 1, max: 10 };
//     }
//   };

//   const handleSubmit = async () => {
//     setIsLoading(true);
//     try {
//       setIsAdvancedOpen(false);
//       const selectedCity = citiesOfMorocco.find(
//         (city) => city.id === formValues.ville
//       );
//       const budgetRange = getBudgetRange(formValues.budget);
//       const bedroomRange = getBedroomRange(formValues.chambres);

//       const queryParams = new URLSearchParams();

//       if (selectedCity) {
//         queryParams.append("city", selectedCity.value);
//       }

//       queryParams.append("queryStatus", activeTab);

//       if (formValues.categorie) {
//         queryParams.append(
//           "queryType",
//           formValues.categorie.charAt(0).toUpperCase() +
//             formValues.categorie.slice(1)
//         );
//       }

//       queryParams.append("minPrice", budgetRange.min.toString());
//       queryParams.append("maxPrice", budgetRange.max.toString());
//       queryParams.append("minBedrooms", bedroomRange.min.toString());
//       queryParams.append("maxBedrooms", bedroomRange.max.toString());

//       window.location.href = `/result?${queryParams.toString()}`;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Data fetching
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         await Promise.all([
//           fetchValues(
//             setStatuses,
//             "/api/searchStatuses",
//             "Échec de la récupération des types d'opération"
//           ),
//           fetchValues(
//             setTypes,
//             "/api/searchTypes",
//             "Échec de la récupération des types de bien"
//           ),
//         ]);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [fetchValues]);

//   useEffect(() => {
//     if (statuses.length > 0 && !activeTab) {
//       setActiveTab(statuses[0].value);
//     }
//   }, [statuses, activeTab]);

//   // Styles communs pour les Select
//   const selectClassNames = {
//     base: "max-w-full",
//     trigger: "bg-white/10 data-[hover=true]:bg-white/30",
//     label: "text-white/90 text-sm sm:text-base",
//     value: "text-white font-medium !important",
//     // innerWrapper: "group-data-[has-value=true]:bg-white",
//     selectorIcon: "text-white",

//     // mainWrapper: "text-white",
//     // listboxWrapper: "bg-gray-800",
//     // listbox: "bg-gray-800",
//     // popoverContent: "text-white",
//   } as const; // Ajout de as const pour s'assurer que les types sont corrects

//   return (
//     <div className="w-full" role="search" aria-label="Recherche de propriétés">
//       <div className="bg-black/50 backdrop-blur-[2px] rounded-lg p-3 sm:p-4">
//         {/* Status mobile */}
//         <div className="lg:hidden mb-3">
//           <Select
//             aria-label="Status"
//             placeholder="Type d'opération"
//             selectedKeys={[activeTab]}
//             variant="bordered"
//             onSelectionChange={(keys) => {
//               const selectedKey = Array.from(keys)[0] as string;
//               setActiveTab(selectedKey);
//             }}
//             classNames={{
//               ...selectClassNames,
//               trigger: `${selectClassNames.trigger} ${
//                 activeTab ? "bg-white" : ""
//               }`,
//             }}
//           >
//             {statuses.map((status) => (
//               <SelectItem key={status.value}>{status.value}</SelectItem>
//             ))}
//           </Select>
//         </div>

//         {/* Status desktop */}
//         <div className="hidden lg:flex mb-4 overflow-x-auto">
//           {statuses.map((status) => (
//             <button
//               key={status.id}
//               onClick={() => setActiveTab(status.value)}
//               className={`px-6 py-2 text-white font-medium whitespace-nowrap ${
//                 activeTab === status.value
//                   ? "border-b-2 border-primary-500"
//                   : "opacity-70 hover:opacity-100"
//               }`}
//             >
//               {status.value}
//             </button>
//           ))}
//         </div>

//         <div className="space-y-3">
//           {/* Ville - Toujours visible */}
//           <Select
//             aria-label="ville"
//             placeholder="Ville"
//             selectedKeys={formValues.ville ? [formValues.ville] : []}
//             variant="bordered"
//             onSelectionChange={(keys) => {
//               const selectedKey = Array.from(keys)[0] as string;
//               setFormValues((prev) => ({ ...prev, ville: selectedKey }));
//             }}
//             classNames={{
//               ...selectClassNames,
//               trigger: `${selectClassNames.trigger} ${
//                 formValues.ville ? "bg-white" : ""
//               }`,
//             }}
//           >
//             {citiesOfMorocco.map((city) => (
//               <SelectItem key={city.id}>{city.value}</SelectItem>
//             ))}
//           </Select>

//           {/* Bouton plus de filtres (mobile) */}
//           <button
//             onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
//             className="w-full py-2 px-4 text-white/90 text-sm border border-white/20 rounded-md lg:hidden flex items-center justify-between"
//           >
//             Plus de filtres
//             <ChevronDown
//               className={`transform transition-transform ${
//                 isAdvancedOpen ? "rotate-180" : ""
//               }`}
//             />
//           </button>

//           {/* Filtres additionnels */}
//           <div
//             className={`space-y-3 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-4
//             ${isAdvancedOpen ? "block" : "hidden lg:grid"}`}
//           >
//             <Select
//               aria-label="Type de bien"
//               placeholder="Type de bien"
//               selectedKeys={formValues.categorie ? [formValues.categorie] : []}
//               variant="bordered"
//               onSelectionChange={(keys) => {
//                 const selectedKey = Array.from(keys)[0] as string;
//                 setFormValues((prev) => ({ ...prev, categorie: selectedKey }));
//               }}
//               classNames={{
//                 ...selectClassNames,
//                 trigger: `${selectClassNames.trigger} ${
//                   formValues.categorie ? "bg-white" : ""
//                 }`,
//               }}
//             >
//               {types.map((type) => (
//                 <SelectItem key={type.value}>{type.value}</SelectItem>
//               ))}
//             </Select>

//             <Select
//               aria-label="Budget"
//               placeholder="Budget"
//               selectedKeys={formValues.budget ? [formValues.budget] : []}
//               variant="bordered"
//               onSelectionChange={(keys) => {
//                 const selectedKey = Array.from(keys)[0] as string;
//                 setFormValues((prev) => ({ ...prev, budget: selectedKey }));
//               }}
//               classNames={{
//                 ...selectClassNames,
//                 trigger: `${selectClassNames.trigger} ${
//                   formValues.budget ? "bg-white" : ""
//                 }`,
//               }}
//             >
//               {budgetOptions.map((option) => (
//                 <SelectItem key={option.key}>{option.label}</SelectItem>
//               ))}
//             </Select>

//             <Select
//               aria-label="Chambres"
//               placeholder="Chambre(s)"
//               selectedKeys={formValues.chambres ? [formValues.chambres] : []}
//               variant="bordered"
//               onSelectionChange={(keys) => {
//                 const selectedKey = Array.from(keys)[0] as string;
//                 setFormValues((prev) => ({ ...prev, chambres: selectedKey }));
//               }}
//               classNames={{
//                 ...selectClassNames,
//                 trigger: `${selectClassNames.trigger} ${
//                   formValues.chambres ? "bg-white" : ""
//                 }`,
//               }}
//             >
//               {bedroomOptions.map((option) => (
//                 <SelectItem key={option.key}>{option.label}</SelectItem>
//               ))}
//             </Select>
//           </div>

//           {/* Bouton de recherche */}
//           <button
//             onClick={handleSubmit}
//             disabled={isLoading}
//             className="w-full bg-primary-500 text-white px-4 py-2.5 rounded-md hover:bg-primary-600
//                      transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
//           >
//             {isLoading ? "Recherche en cours..." : "RECHERCHER"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchForm;

// end ---------------------------------------

// import React, { useState, useEffect } from "react";
// import { citiesOfMorocco } from "../data/cities";
// import { PropertyStatus, PropertyType } from "@prisma/client";
// import useFetchValues from "../hooks/useFetchValues";
// import { ChevronDown } from "lucide-react";
// import { Select, SelectItem } from "@nextui-org/react";
// import { bedroomOptions, budgetOptions } from "../data/constants";

// interface FormValues {
//   ville: string;
//   categorie: string;
//   budget: string;
//   chambres: string;
// }

// interface SearchFormProps {
//   onSearch?: (values: FormValues & { type: PropertyStatus }) => void;
//   defaultStatus?: PropertyStatus;
//   defaultCity?: string;
//   defaultCategory?: PropertyType;
//   defaultBudget?: string;
//   defaultBedrooms?: string;
//   customCities?: Array<{ id: string; value: string }>;
//   customTypes?: PropertyType[];
//   customBudgetOptions?: Array<{ key: string; label: string }>;
//   customBedroomOptions?: Array<{ key: string; label: string }>;
//   className?: string;
//   showAdvancedByDefault?: boolean;
//   isTransparent?: boolean;
// }

// const SearchForm: React.FC<SearchFormProps> = ({
//   onSearch,
//   defaultStatus,
//   defaultCity = "",
//   defaultCategory,
//   defaultBudget = "",
//   defaultBedrooms = "",
//   customCities,
//   customTypes,
//   customBudgetOptions,
//   customBedroomOptions,
//   className = "",
//   showAdvancedByDefault = false,
//   isTransparent = false,
// }) => {
//   const [statuses, setStatuses] = useState<PropertyStatus[]>([]);
//   const [activeTab, setActiveTab] = useState<PropertyStatus | undefined>(
//     defaultStatus
//   );
//   const [types, setTypes] = useState<PropertyType[]>([]);
//   const [isAdvancedOpen, setIsAdvancedOpen] = useState(showAdvancedByDefault);
//   const [isLoading, setIsLoading] = useState(false);

//   const [formValues, setFormValues] = useState<FormValues>({
//     ville: defaultCity,
//     categorie: defaultCategory ?? "",
//     budget: defaultBudget,
//     chambres: defaultBedrooms,
//   });

//   const fetchValues = useFetchValues();

//   // Utilisation des options personnalisées ou par défaut
//   const cities = customCities || citiesOfMorocco;
//   const propertyTypes = customTypes || types;
//   const budgetOpts = customBudgetOptions || budgetOptions;
//   const bedroomOpts = customBedroomOptions || bedroomOptions;

//   // Utilitaires
//   const getBudgetRange = (
//     budgetValue: string
//   ): { min: number; max: number } => {
//     switch (budgetValue) {
//       case "0-200000":
//         return { min: 0, max: 200000 };
//       case "200000-500000":
//         return { min: 200000, max: 500000 };
//       case "500000+":
//         return { min: 500000, max: 100000000 };
//       default:
//         return { min: 0, max: 100000000 };
//     }
//   };

//   const getBedroomRange = (
//     chambreValue: string
//   ): { min: number; max: number } => {
//     switch (chambreValue) {
//       case "1":
//         return { min: 1, max: 1 };
//       case "2":
//         return { min: 2, max: 2 };
//       case "3":
//         return { min: 3, max: 10 };
//       default:
//         return { min: 1, max: 10 };
//     }
//   };

//   const handleSubmit = async () => {
//     setIsLoading(true);
//     try {
//       setIsAdvancedOpen(false);
//       const selectedCity = cities.find((city) => city.id === formValues.ville);
//       const budgetRange = getBudgetRange(formValues.budget);
//       const bedroomRange = getBedroomRange(formValues.chambres);

//       const queryParams = new URLSearchParams();

//       if (selectedCity) {
//         queryParams.append("city", selectedCity.value);
//       }

//       if (activeTab) {
//         queryParams.append("queryStatus", activeTab);
//       }

//       if (formValues.categorie) {
//         queryParams.append(
//           "queryType",
//           formValues.categorie.charAt(0).toUpperCase() +
//             formValues.categorie.slice(1)
//         );
//       }

//       queryParams.append("minPrice", budgetRange.min.toString());
//       queryParams.append("maxPrice", budgetRange.max.toString());
//       queryParams.append("minBedrooms", bedroomRange.min.toString());
//       queryParams.append("maxBedrooms", bedroomRange.max.toString());

//       if (onSearch && activeTab) {
//         onSearch({ ...formValues, type: activeTab });
//       } else {
//         window.location.href = `/result?${queryParams.toString()}`;
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Data fetching
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!customTypes) {
//         try {
//           await Promise.all([
//             fetchValues(
//               setStatuses,
//               "/api/searchStatuses",
//               "Échec de la récupération des types d'opération"
//             ),
//             fetchValues(
//               setTypes,
//               "/api/searchTypes",
//               "Échec de la récupération des types de bien"
//             ),
//           ]);
//         } catch (error) {
//           console.error("Error fetching data:", error);
//         }
//       }
//     };

//     fetchData();
//   }, [fetchValues, customTypes]);

//   useEffect(() => {
//     if (statuses.length > 0 && !activeTab) {
//       setActiveTab(statuses[0].value);
//     }
//   }, [statuses, activeTab]);

//   // Styles communs pour les Select
//   const selectClassNames = {
//     base: "max-w-full",
//     trigger: `bg-white/10 data-[hover=true]:bg-white/30 ${
//       isTransparent ? "bg-transparent" : ""
//     }`,
//     label: "text-white/90 text-sm sm:text-base",
//     value: "text-white font-medium !important",
//     selectorIcon: "text-white",
//   } as const;

//   return (
//     <div
//       className={`w-full ${className}`}
//       role="search"
//       aria-label="Recherche de propriétés"
//     >
//       <div
//         className={`${
//           isTransparent ? "" : "bg-black/50"
//         } backdrop-blur-[2px] rounded-lg p-3 sm:p-4`}
//       >
//         {/* Status mobile */}
//         <div className="lg:hidden mb-3">
//           <Select
//             aria-label="Status"
//             placeholder="Type d'opération"
//             selectedKeys={[activeTab]}
//             variant="bordered"
//             onSelectionChange={(keys) => {
//               const selectedKey = Array.from(keys)[0] as string;
//               setActiveTab(selectedKey);
//             }}
//             classNames={{
//               ...selectClassNames,
//               trigger: `${selectClassNames.trigger} ${
//                 activeTab ? "bg-white" : ""
//               }`,
//             }}
//           >
//             {statuses.map((status) => (
//               <SelectItem key={status.value}>{status.value}</SelectItem>
//             ))}
//           </Select>
//         </div>

//         {/* Status desktop */}
//         <div className="hidden lg:flex mb-4 overflow-x-auto">
//           {statuses.map((status) => (
//             <button
//               key={status.id}
//               onClick={() => setActiveTab(status.value)}
//               className={`px-6 py-2 text-white font-medium whitespace-nowrap ${
//                 activeTab === status.value
//                   ? "border-b-2 border-primary-500"
//                   : "opacity-70 hover:opacity-100"
//               }`}
//             >
//               {status.value}
//             </button>
//           ))}
//         </div>
//         <div className="space-y-3">
//           {/* Ville - Toujours visible */}
//           <Select
//             aria-label="ville"
//             placeholder="Ville"
//             selectedKeys={formValues.ville ? [formValues.ville] : []}
//             variant="bordered"
//             onSelectionChange={(keys) => {
//               const selectedKey = Array.from(keys)[0] as string;
//               setFormValues((prev) => ({ ...prev, ville: selectedKey }));
//             }}
//             classNames={{
//               ...selectClassNames,
//               trigger: `${selectClassNames.trigger} ${
//                 formValues.ville ? "bg-white" : ""
//               }`,
//             }}
//           >
//             {citiesOfMorocco.map((city) => (
//               <SelectItem key={city.id}>{city.value}</SelectItem>
//             ))}
//           </Select>

//           {/* Bouton plus de filtres (mobile) */}
//           <button
//             onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
//             className="w-full py-2 px-4 text-white/90 text-sm border border-white/20 rounded-md lg:hidden flex items-center justify-between"
//           >
//             Plus de filtres
//             <ChevronDown
//               className={`transform transition-transform ${
//                 isAdvancedOpen ? "rotate-180" : ""
//               }`}
//             />
//           </button>

//           {/* Filtres additionnels */}
//           <div
//             className={`space-y-3 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-4
//             ${isAdvancedOpen ? "block" : "hidden lg:grid"}`}
//           >
//             <Select
//               aria-label="Type de bien"
//               placeholder="Type de bien"
//               selectedKeys={formValues.categorie ? [formValues.categorie] : []}
//               variant="bordered"
//               onSelectionChange={(keys) => {
//                 const selectedKey = Array.from(keys)[0] as string;
//                 setFormValues((prev) => ({ ...prev, categorie: selectedKey }));
//               }}
//               classNames={{
//                 ...selectClassNames,
//                 trigger: `${selectClassNames.trigger} ${
//                   formValues.categorie ? "bg-white" : ""
//                 }`,
//               }}
//             >
//               {types.map((type) => (
//                 <SelectItem key={type.value}>{type.value}</SelectItem>
//               ))}
//             </Select>

//             <Select
//               aria-label="Budget"
//               placeholder="Budget"
//               selectedKeys={formValues.budget ? [formValues.budget] : []}
//               variant="bordered"
//               onSelectionChange={(keys) => {
//                 const selectedKey = Array.from(keys)[0] as string;
//                 setFormValues((prev) => ({ ...prev, budget: selectedKey }));
//               }}
//               classNames={{
//                 ...selectClassNames,
//                 trigger: `${selectClassNames.trigger} ${
//                   formValues.budget ? "bg-white" : ""
//                 }`,
//               }}
//             >
//               {budgetOptions.map((option) => (
//                 <SelectItem key={option.key}>{option.label}</SelectItem>
//               ))}
//             </Select>

//             <Select
//               aria-label="Chambres"
//               placeholder="Chambre(s)"
//               selectedKeys={formValues.chambres ? [formValues.chambres] : []}
//               variant="bordered"
//               onSelectionChange={(keys) => {
//                 const selectedKey = Array.from(keys)[0] as string;
//                 setFormValues((prev) => ({ ...prev, chambres: selectedKey }));
//               }}
//               classNames={{
//                 ...selectClassNames,
//                 trigger: `${selectClassNames.trigger} ${
//                   formValues.chambres ? "bg-white" : ""
//                 }`,
//               }}
//             >
//               {bedroomOptions.map((option) => (
//                 <SelectItem key={option.key}>{option.label}</SelectItem>
//               ))}
//             </Select>
//           </div>

//           {/* Bouton de recherche */}
//           <button
//             onClick={handleSubmit}
//             disabled={isLoading}
//             className="w-full bg-primary-500 text-white px-4 py-2.5 rounded-md hover:bg-primary-600
//                      transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
//           >
//             {isLoading ? "Recherche en cours..." : "RECHERCHER"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchForm;

// end ---------------------------------------

import React, { useState, useEffect } from "react";
import { citiesOfMorocco } from "../data/cities";
import { PropertyStatus, PropertyType } from "@prisma/client";
import useFetchValues from "../hooks/useFetchValues";
import { ChevronDown } from "lucide-react";
import { Select, SelectItem } from "@nextui-org/react";
import { bedroomOptions, budgetOptions } from "../data/constants";

interface FormValues {
  ville: string;
  categorie: string;
  budget: string;
  chambres: string;
}

interface SearchFormProps {
  onSearch?: (values: FormValues & { type: string }) => void;
  defaultValues?: Partial<FormValues>;
  defaultActiveTab?: string;
  backgroundColor?: string;
}

const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  defaultValues = {},
  defaultActiveTab = "Vente",
  backgroundColor = "bg-black/50",
}) => {
  const [statuses, setStatuses] = useState<PropertyStatus[]>([]);
  const [activeTab, setActiveTab] = useState<string>(defaultActiveTab);
  const [types, setTypes] = useState<PropertyType[]>([]);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formValues, setFormValues] = useState<FormValues>({
    ville: defaultValues.ville || "",
    categorie: defaultValues.categorie || "",
    budget: defaultValues.budget || "",
    chambres: defaultValues.chambres || "",
  });

  const fetchValues = useFetchValues();

  // Utilitaires
  const getBudgetRange = (
    budgetValue: string
  ): { min: number; max: number } => {
    switch (budgetValue) {
      case "0-200000":
        return { min: 0, max: 200000 };
      case "200000-500000":
        return { min: 200000, max: 500000 };
      case "500000+":
        return { min: 500000, max: 100000000 };
      default:
        return { min: 0, max: 100000000 };
    }
  };

  const getBedroomRange = (
    chambreValue: string
  ): { min: number; max: number } => {
    switch (chambreValue) {
      case "1":
        return { min: 1, max: 1 };
      case "2":
        return { min: 2, max: 2 };
      case "3":
        return { min: 3, max: 10 };
      default:
        return { min: 1, max: 10 };
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      setIsAdvancedOpen(false);
      const selectedCity = citiesOfMorocco.find(
        (city) => city.id === formValues.ville
      );
      const budgetRange = getBudgetRange(formValues.budget);
      const bedroomRange = getBedroomRange(formValues.chambres);

      const queryParams = new URLSearchParams();

      if (selectedCity) {
        queryParams.append("city", selectedCity.value);
      }

      queryParams.append("queryStatus", activeTab);

      if (formValues.categorie) {
        queryParams.append(
          "queryType",
          formValues.categorie.charAt(0).toUpperCase() +
            formValues.categorie.slice(1)
        );
      }

      queryParams.append("minPrice", budgetRange.min.toString());
      queryParams.append("maxPrice", budgetRange.max.toString());
      queryParams.append("minBedrooms", bedroomRange.min.toString());
      queryParams.append("maxBedrooms", bedroomRange.max.toString());

      window.location.href = `/result?${queryParams.toString()}`;
    } finally {
      setIsLoading(false);
    }
  };

  // Validation de la clé pour `selectedKeys`
  const validCategorie = types.some(
    (type) => type.value === formValues.categorie
  )
    ? formValues.categorie
    : "";

  const validStatus = statuses.some((status) => status.value === activeTab)
    ? activeTab
    : "";

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchValues(
            setStatuses,
            "/api/searchStatuses",
            "Échec de la récupération des types d'opération"
          ),
          fetchValues(
            setTypes,
            "/api/searchTypes",
            "Échec de la récupération des types de bien"
          ),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [fetchValues]);

  useEffect(() => {
    if (statuses.length > 0 && !activeTab) {
      setActiveTab(defaultActiveTab || statuses[0].value);
    }
  }, [statuses, activeTab, defaultActiveTab]);

  // Styles communs pour les Select
  const selectClassNames = {
    base: "max-w-full",
    trigger: "bg-white/10 data-[hover=true]:bg-white/30",
    label: "text-white/90 text-sm sm:text-base",
    value: "text-white font-medium !important",
    selectorIcon: "text-white",
  } as const;

  return (
    <div
      className={`w-full rounded-lg p-3 sm:p-4 ${backgroundColor}`}
      role="search"
      aria-label="Recherche de propriétés"
    >
      <div className="backdrop-blur-[2px] rounded-lg p-3 sm:p-4">
        {/* Status mobile */}
        <div className="lg:hidden mb-3">
          <Select
            aria-label="Status"
            placeholder="Type d'opération"
            selectedKeys={validStatus ? [activeTab] : []}
            variant="bordered"
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              setActiveTab(selectedKey);
            }}
            classNames={{
              ...selectClassNames,
              trigger: `${selectClassNames.trigger} ${
                activeTab ? "bg-white" : ""
              }`,
            }}
          >
            {statuses.map((status) => (
              <SelectItem key={status.value}>{status.value}</SelectItem>
            ))}
          </Select>
        </div>

        {/* Status desktop */}
        <div className="hidden lg:flex mb-4 overflow-x-auto">
          {statuses.map((status) => (
            <button
              key={status.id}
              onClick={() => setActiveTab(status.value)}
              className={`px-6 py-2 text-white font-medium whitespace-nowrap ${
                activeTab === status.value
                  ? "border-b-2 border-primary-500"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              {status.value}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {/* Ville - Toujours visible */}
          <Select
            aria-label="ville"
            placeholder="Ville"
            selectedKeys={formValues.ville ? [formValues.ville] : []}
            variant="bordered"
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              setFormValues((prev) => ({ ...prev, ville: selectedKey }));
            }}
            classNames={{
              ...selectClassNames,
              trigger: `${selectClassNames.trigger} ${
                formValues.ville ? "bg-white" : ""
              }`,
            }}
          >
            {citiesOfMorocco.map((city) => (
              <SelectItem key={city.id}>{city.value}</SelectItem>
            ))}
          </Select>

          {/* Bouton plus de filtres (mobile) */}
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="w-full py-2 px-4 text-white/90 text-sm border border-white/20 rounded-md lg:hidden flex items-center justify-between"
          >
            Plus de filtres
            <ChevronDown
              className={`transform transition-transform ${
                isAdvancedOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Filtres additionnels */}
          <div
            className={`space-y-3 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-4
            ${isAdvancedOpen ? "block" : "hidden lg:grid"}`}
          >
            <Select
              aria-label="Type de bien"
              placeholder="Type de bien"
              // selectedKeys={formValues.categorie ? [formValues.categorie] : []}
              selectedKeys={validCategorie ? [formValues.categorie] : []} // Protéger ici
              variant="bordered"
              // onSelectionChange={(keys) => {
              //   const selectedKey = Array.from(keys)[0] as string;
              //   setFormValues((prev) => ({ ...prev, categorie: selectedKey }));
              // }}
              onSelectionChange={(key) => {
                const selectedKey = Array.from(key)[0] as string;
                setFormValues((prev) => ({
                  ...prev,
                  categorie: selectedKey,
                }));
              }}
              classNames={{
                ...selectClassNames,
                trigger: `${selectClassNames.trigger} ${
                  formValues.categorie ? "bg-white" : ""
                }`,
              }}
            >
              {types.map((type) => (
                <SelectItem key={type.value}>{type.value}</SelectItem>
              ))}
            </Select>

            <Select
              aria-label="Budget"
              placeholder="Budget"
              selectedKeys={formValues.budget ? [formValues.budget] : []}
              variant="bordered"
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string;
                setFormValues((prev) => ({ ...prev, budget: selectedKey }));
              }}
              classNames={{
                ...selectClassNames,
                trigger: `${selectClassNames.trigger} ${
                  formValues.budget ? "bg-white" : ""
                }`,
              }}
            >
              {budgetOptions.map((option) => (
                <SelectItem key={option.key}>{option.label}</SelectItem>
              ))}
            </Select>

            <Select
              aria-label="Chambres"
              placeholder="Chambre(s)"
              selectedKeys={formValues.chambres ? [formValues.chambres] : []}
              variant="bordered"
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string;
                setFormValues((prev) => ({ ...prev, chambres: selectedKey }));
              }}
              classNames={{
                ...selectClassNames,
                trigger: `${selectClassNames.trigger} ${
                  formValues.chambres ? "bg-white" : ""
                }`,
              }}
            >
              {bedroomOptions.map((option) => (
                <SelectItem key={option.key}>{option.label}</SelectItem>
              ))}
            </Select>
          </div>

          {/* Bouton de recherche */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-primary-500 text-white px-4 py-2.5 rounded-md hover:bg-primary-600 
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {isLoading ? "Recherche en cours..." : "RECHERCHER"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
