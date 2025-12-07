// import { PropertyStatus } from "@prisma/client";
// import { useCallback } from "react";

// type SetValuesType = React.Dispatch<React.SetStateAction<PropertyStatus[]>>;

// const useFetchValues = () => {
//   return useCallback(
//     async (setValues: SetValuesType, url: string, errorMessage: string) => {
//       try {
//         const response = await fetch(url);
//         const data: PropertyStatus[] = await response.json();
//         setValues(data);
//       } catch (error) {
//         console.error(errorMessage, error);
//       }
//     },
//     []
//   ); // La fonction est mémorisée et ne change jamais;
// };

// export default useFetchValues;

// todo A integrer - ransformez useFetchValues en une fonction générique qui retourne une promesse. Cela rendra la fonction compatible avec Promise.all et permettra de gérer différents types de données.
// import { useCallback } from "react";

// const useFetchValues = () => {
//   return useCallback(
//     async <T>(url: string, errorMessage: string): Promise<T> => {
//       try {
//         const response = await fetch(url);

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data: T = await response.json();
//         return data;
//       } catch (error) {
//         console.error(errorMessage, error);
//         throw error; // Propagation de l'erreur si nécessaire
//       }
//     },
//     []
//   );
// };

// export default useFetchValues;

// 07/12 code modifié pour s adapter au nouveau prisma feature/multilingual-countries

import { useCallback } from "react";
// Suppression de l'import PropertyStatus car le type est maintenant générique <T>
// import { PropertyStatus } from "@prisma/client";

// Définition de SetValuesType comme générique, utilisant le type T
type SetValuesType<T> = React.Dispatch<React.SetStateAction<T[]>>;

// Le hook lui-même est générique (T est déduit à l'appel)
const useFetchValues = () => {
  // La fonction retournée est désormais générique <T>
  return useCallback(
    async <T>(
      setValues: SetValuesType<T>, // Le setValues accepte maintenant un tableau de type T
      url: string,
      errorMessage: string
    ) => {
      try {
        const response = await fetch(url);

        // Les données JSON sont castées en T[]
        const data: T[] = await response.json();

        setValues(data);
      } catch (error) {
        console.error(errorMessage, error);
      }
    },
    []
  );
};

export default useFetchValues;
