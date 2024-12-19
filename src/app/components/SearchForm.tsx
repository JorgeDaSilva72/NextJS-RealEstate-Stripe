// import { useState, ChangeEvent, useEffect } from "react";
// import { citiesOfMorocco } from "../data/cities";
// import { PropertyStatus, PropertyType } from "@prisma/client";
// import useFetchValues from "../hooks/useFetchValues";

// type TabType = "vente" | "location";

// interface FormValues {
//   ville: string;
//   categorie: string;
//   budget: string;
//   chambres: string;
// }

// interface SearchFormProps {
//   onSearch?: (values: FormValues & { type: TabType }) => void;
// }

// const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
//   const [activeTab, setActiveTab] = useState<TabType>("vente");
//   const [formValues, setFormValues] = useState<FormValues>({
//     ville: "",
//     categorie: "",
//     budget: "",
//     chambres: "",
//   });
//   const [statuses, setStatuses] = useState<PropertyStatus[]>([]);
//   const [types, setTypes] = useState<PropertyType[]>([]);
//   const fetchValues = useFetchValues();

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
//         return { min: 3, max: 10 }; // 3+ chambres
//       default:
//         return { min: 1, max: 10 };
//     }
//   };

//   const handleInputChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormValues((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = () => {
//     const selectedCity = citiesOfMorocco.find(
//       (city) => city.id === formValues.ville
//     );
//     const budgetRange = getBudgetRange(formValues.budget);
//     const bedroomRange = getBedroomRange(formValues.chambres);

//     const queryParams = new URLSearchParams();

//     // Ajout des paramètres s'ils sont définis
//     if (selectedCity) {
//       queryParams.append("city", selectedCity.value);
//     }

//     queryParams.append(
//       "queryStatus",
//       activeTab === "vente" ? "Vente" : "Location"
//     );

//     if (formValues.categorie) {
//       queryParams.append(
//         "queryType",
//         formValues.categorie.charAt(0).toUpperCase() +
//           formValues.categorie.slice(1)
//       );
//     }

//     queryParams.append("minPrice", budgetRange.min.toString());
//     queryParams.append("maxPrice", budgetRange.max.toString());
//     queryParams.append("minBedrooms", bedroomRange.min.toString());
//     queryParams.append("maxBedrooms", bedroomRange.max.toString());

//     // Construction de l'URL complète
//     const url = `/result?${queryParams.toString()}`;
//     window.location.href = url;
//   };

//   const selectClassName = `
//     bg-white/10 text-white border border-white/20 rounded-md p-2
//     focus:outline-none focus:ring-2 focus:ring-primary-500
//     [&>option]:bg-gray-800 [&>option]:text-white
//     appearance-none cursor-pointer
//   `;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch both statuses and types in parallel
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
//   }, [fetchValues]); // Only run once on mount

//   return (
//     <div className="w-full max-w-4xl bg-black/30 backdrop-blur-sm rounded-lg p-4">
//       <div className="flex mb-4">
//         <button
//           onClick={() => setActiveTab("vente")}
//           className={`px-6 py-2 text-white font-medium ${
//             activeTab === "vente"
//               ? "border-b-2 border-primary-500"
//               : "opacity-70 hover:opacity-100"
//           }`}
//         >
//           Vente
//         </button>
//         <button
//           onClick={() => setActiveTab("location")}
//           className={`px-6 py-2 text-white font-medium ${
//             activeTab === "location"
//               ? "border-b-2 border-primary-500"
//               : "opacity-70 hover:opacity-100"
//           }`}
//         >
//           Location
//         </button>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
//         <select
//           name="ville"
//           value={formValues.ville}
//           onChange={handleInputChange}
//           className={selectClassName}
//         >
//           <option value="">VILLE</option>
//           {citiesOfMorocco.map((city) => (
//             <option key={city.id} value={city.id} className="text-white">
//               {city.value}
//             </option>
//           ))}
//         </select>

//         <select
//           name="categorie"
//           value={formValues.categorie}
//           onChange={handleInputChange}
//           className={selectClassName}
//         >
//           <option value="">CATÉGORIE</option>
//           {types.map((type) => (
//             <option key={type.id} value={type.value} className="text-white">
//               {type.value}
//             </option>
//           ))}
//         </select>

//         <select
//           name="budget"
//           value={formValues.budget}
//           onChange={handleInputChange}
//           className={selectClassName}
//         >
//           <option value="">BUDGET</option>
//           <option value="0-200000">0 - 200 000 €</option>
//           <option value="200000-500000">200 000 - 500 000 €</option>
//           <option value="500000+">500 000 € +</option>
//         </select>

//         <select
//           name="chambres"
//           value={formValues.chambres}
//           onChange={handleInputChange}
//           className={selectClassName}
//         >
//           <option value="">CHAMBRE(S)</option>
//           <option value="1">1</option>
//           <option value="2">2</option>
//           <option value="3">3+</option>
//         </select>

//         <button
//           onClick={handleSubmit}
//           className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors"
//         >
//           RECHERCHER
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SearchForm;

import { useState, ChangeEvent, useEffect } from "react";
import { citiesOfMorocco } from "../data/cities";
import { PropertyStatus, PropertyType } from "@prisma/client";
import useFetchValues from "../hooks/useFetchValues";
import { ChevronDown } from "lucide-react";

interface FormValues {
  ville: string;
  categorie: string;
  budget: string;
  chambres: string;
}

interface SearchFormProps {
  onSearch?: (values: FormValues & { type: string }) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [statuses, setStatuses] = useState<PropertyStatus[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [types, setTypes] = useState<PropertyType[]>([]);
  const [isTabsOpen, setIsTabsOpen] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({
    ville: "",
    categorie: "",
    budget: "",
    chambres: "",
  });
  const fetchValues = useFetchValues();

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

  const handleInputChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    setIsTabsOpen(false); // Ferme le menu des tabs sur mobile lors de la soumission
    const selectedCity = citiesOfMorocco.find(
      (city) => city.id === formValues.ville
    );
    const budgetRange = getBudgetRange(formValues.budget);
    const bedroomRange = getBedroomRange(formValues.chambres);

    const queryParams = new URLSearchParams();

    if (selectedCity) {
      queryParams.append("city", selectedCity.value);
    }

    // Utilise directement la valeur du status actif
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
  };

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

  // Définit le premier status comme tab actif une fois les données chargées
  useEffect(() => {
    if (statuses.length > 0 && !activeTab) {
      setActiveTab(statuses[0].value);
    }
  }, [statuses]);

  const selectClassName = `
    bg-white/10 text-white border border-white/20 rounded-md p-2 
    focus:outline-none focus:ring-2 focus:ring-primary-500
    [&>option]:bg-gray-800 [&>option]:text-white
    appearance-none cursor-pointer
  `;

  return (
    // <div className="w-full max-w-4xl bg-black/30 backdrop-blur-sm rounded-lg p-4">
    //   <div className="flex mb-4">
    //     {statuses.map((status) => (
    //       <button
    //         key={status.id}
    //         onClick={() => setActiveTab(status.value)}
    //         className={`px-6 py-2 text-white font-medium ${
    //           activeTab === status.value
    //             ? "border-b-2 border-primary-500"
    //             : "opacity-70 hover:opacity-100"
    //         }`}
    //       >
    //         {status.value}
    //       </button>
    //     ))}
    //   </div>

    //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
    //     <select
    //       name="ville"
    //       value={formValues.ville}
    //       onChange={handleInputChange}
    //       className={selectClassName}
    //     >
    //       <option value="">VILLE</option>
    //       {citiesOfMorocco.map((city) => (
    //         <option key={city.id} value={city.id} className="text-white">
    //           {city.value}
    //         </option>
    //       ))}
    //     </select>

    //     <select
    //       name="categorie"
    //       value={formValues.categorie}
    //       onChange={handleInputChange}
    //       className={selectClassName}
    //     >
    //       <option value="">CATÉGORIE</option>
    //       {types.map((type) => (
    //         <option key={type.id} value={type.value} className="text-white">
    //           {type.value}
    //         </option>
    //       ))}
    //     </select>

    //     <select
    //       name="budget"
    //       value={formValues.budget}
    //       onChange={handleInputChange}
    //       className={selectClassName}
    //     >
    //       <option value="">BUDGET</option>
    //       <option value="0-200000">0 - 200 000 €</option>
    //       <option value="200000-500000">200 000 - 500 000 €</option>
    //       <option value="500000+">500 000 € +</option>
    //     </select>

    //     <select
    //       name="chambres"
    //       value={formValues.chambres}
    //       onChange={handleInputChange}
    //       className={selectClassName}
    //     >
    //       <option value="">CHAMBRE(S)</option>
    //       <option value="1">1</option>
    //       <option value="2">2</option>
    //       <option value="3">3+</option>
    //     </select>

    //     <button
    //       onClick={handleSubmit}
    //       className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors"
    //     >
    //       RECHERCHER
    //     </button>
    //   </div>
    // </div>
    <div className="w-full max-w-4xl bg-black/30 backdrop-blur-sm rounded-lg p-4">
      {/* Version mobile des tabs */}
      <div className="lg:hidden relative mb-4">
        <button
          onClick={() => setIsTabsOpen(!isTabsOpen)}
          className="w-full flex items-center justify-between px-4 py-2 bg-white/10 rounded-md text-white"
        >
          <span>{activeTab}</span>
          <ChevronDown
            className={`transform transition-transform ${
              isTabsOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isTabsOpen && (
          <div className="absolute z-10 mt-1 w-full bg-gray-800 rounded-md shadow-lg">
            {statuses.map((status) => (
              <button
                key={status.id}
                onClick={() => {
                  setActiveTab(status.value);
                  setIsTabsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-white hover:bg-gray-700 ${
                  activeTab === status.value ? "bg-gray-700" : ""
                }`}
              >
                {status.value}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Version desktop des tabs */}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <select
          name="ville"
          value={formValues.ville}
          onChange={handleInputChange}
          className={selectClassName}
        >
          <option value="">VILLE</option>
          {citiesOfMorocco.map((city) => (
            <option key={city.id} value={city.id} className="text-white">
              {city.value}
            </option>
          ))}
        </select>

        <select
          name="categorie"
          value={formValues.categorie}
          onChange={handleInputChange}
          className={selectClassName}
        >
          <option value="">CATÉGORIE</option>
          {types.map((type) => (
            <option key={type.id} value={type.value} className="text-white">
              {type.value}
            </option>
          ))}
        </select>

        <select
          name="budget"
          value={formValues.budget}
          onChange={handleInputChange}
          className={selectClassName}
        >
          <option value="">BUDGET</option>
          <option value="0-200000">0 - 200 000 €</option>
          <option value="200000-500000">200 000 - 500 000 €</option>
          <option value="500000+">500 000 € +</option>
        </select>

        <select
          name="chambres"
          value={formValues.chambres}
          onChange={handleInputChange}
          className={selectClassName}
        >
          <option value="">CHAMBRE(S)</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3+</option>
        </select>

        <button
          onClick={handleSubmit}
          className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors"
        >
          RECHERCHER
        </button>
      </div>
    </div>
  );
};

export default SearchForm;
