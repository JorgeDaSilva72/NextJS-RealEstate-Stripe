import { FilterValueTypes } from "../app/[locale]/hooks/useFilterChange";

export type SelectNameType =
  | "queryStatus"
  | "queryType"
  | "city"
  | "sortOrder"
  | "price"
  | "area"
  | "room"
  | "bathroom"
  | "country";

export interface SelectFilterType {
  ariaLabel: string;
  placeholder?: string;
  name: SelectNameType;
  items?: FilterValueTypes;
  type?: "slider";
  rangeName?: string[];
  rangeValue?: number[];
  step?: number;
  formatOptions?: Intl.NumberFormatOptions;
}

export type SelectFilterTypes = SelectFilterType[];

export const selectFilters: SelectFilterTypes = [
  {
    ariaLabel: "Opération",
    placeholder: "Choisir l'opération",
    name: "queryStatus",
  },
  {
    ariaLabel: "Type de bien",
    placeholder: "Choisir le type de bien",
    name: "queryType",
  },
  {
    ariaLabel: "Pays",
    placeholder: "Choisir un pays",
    name: "country",
  },
  {
    ariaLabel: "Ville",
    placeholder: "Choisir une ville",
    name: "city",
  },
  {
    ariaLabel: "Trier par",
    placeholder: "Trier par",
    name: "sortOrder",
    items: [
      { id: "none", value: "Aucun tri" },
      { id: "price-asc", value: "Prix croissant" },
      { id: "price-desc", value: "Prix décroissant" },
      { id: "surface-asc", value: "Surface croissante" },
      { id: "surface-desc", value: "Surface décroissante" },
      { id: "date-asc", value: "Plus ancien" },
      { id: "date-desc", value: "Plus récent" },
    ],
  },
  {
    ariaLabel: "Prix (€)",
    name: "price",
    type: "slider",
    rangeName: ["minPrice", "maxPrice"],
    rangeValue: [0, 1000000],
    step: 10000,
    formatOptions: { style: "currency", currency: "EUR" },
  },
  {
    ariaLabel: "Surface habitable (m²)",
    name: "area",
    type: "slider",
    rangeName: ["minArea", "maxArea"],
    rangeValue: [0, 1000],
    step: 10,
  },
  {
    ariaLabel: "Chambres",
    name: "room",
    type: "slider",
    rangeName: ["minBedrooms", "maxBedrooms"],
    rangeValue: [0, 10],
    step: 1,
  },
  {
    ariaLabel: "Salles de bain",
    name: "bathroom",
    type: "slider",
    rangeName: ["minBathrooms", "maxBathrooms"],
    rangeValue: [0, 10],
    step: 1,
  },
];
