import React, { useState, useEffect, useReducer } from "react";
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
  }, [statuses, activeTab]);

  return (
    <div className="w-full max-w-4xl bg-black/70 backdrop-blur-sm rounded-lg p-4 texte-white">
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
        <Select
          className="max-w-full"
          aria-label="ville"
          placeholder="Ville"
          selectedKeys={formValues.ville ? [formValues.ville] : []}
          variant="bordered"
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0] as string;
            setFormValues((prev) => ({ ...prev, ville: selectedKey }));
          }}
          classNames={{
            base: "max-w-full",
            trigger: `bg-white/10 data-[hover=true]:bg-white/20 ${
              formValues.ville ? "bg-white" : ""
            }`,
            label: "text-white/90",
            value: "text-white font-medium !important",
            // innerWrapper: "text-white",
            // mainWrapper: "text-white",
            // listboxWrapper: "bg-gray-800",
            // listbox: "bg-gray-800",
            // selectorIcon: "text-white",
            // popoverContent: "text-white",
          }}
        >
          {citiesOfMorocco.map((city) => (
            <SelectItem key={city.id}>{city.value}</SelectItem>
          ))}
        </Select>

        <Select
          className="max-w-full"
          aria-label="Type de bien"
          placeholder="Type de bien"
          selectedKeys={formValues.categorie ? [formValues.categorie] : []}
          variant="bordered"
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0] as string;
            setFormValues((prev) => ({ ...prev, categorie: selectedKey }));
          }}
          classNames={{
            base: "max-w-full",
            trigger: `bg-white/10 data-[hover=true]:bg-white/20 ${
              formValues.categorie ? "bg-white" : ""
            }`,
            value: "text-white",
            label: "text-white/90",
          }}
        >
          {types.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.value}
            </SelectItem>
          ))}
        </Select>

        <Select
          className="max-w-full"
          aria-label="Budget"
          placeholder="Budget"
          selectedKeys={formValues.budget ? [formValues.budget] : []}
          variant="bordered"
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0] as string;
            setFormValues((prev) => ({ ...prev, budget: selectedKey }));
          }}
          classNames={{
            base: "max-w-full",
            trigger: `bg-white/10 data-[hover=true]:bg-white/20 ${
              formValues.budget ? "bg-white" : ""
            }`,
            value: "text-white",
            label: "text-white/90",
          }}
        >
          {budgetOptions.map((option) => (
            <SelectItem key={option.key}>{option.label}</SelectItem>
          ))}
        </Select>

        <Select
          className="max-w-full"
          aria-label="Budget"
          placeholder="Chambre(s)"
          selectedKeys={formValues.chambres ? [formValues.chambres] : []}
          variant="bordered"
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0] as string;
            setFormValues((prev) => ({ ...prev, chambres: selectedKey }));
          }}
          classNames={{
            base: "max-w-full",
            trigger: `bg-white/10 data-[hover=true]:bg-white/20 ${
              formValues.chambres ? "bg-white" : ""
            }`,
            value: "text-white",
            label: "text-white/90",
          }}
        >
          {bedroomOptions.map((option) => (
            <SelectItem key={option.key}>{option.label}</SelectItem>
          ))}
        </Select>

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
