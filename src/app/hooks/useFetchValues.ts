import { PropertyStatus } from "@prisma/client";
import { useCallback } from "react";

type SetValuesType = React.Dispatch<React.SetStateAction<PropertyStatus[]>>;

const useFetchValues = () => {
  return useCallback(
    async (setValues: SetValuesType, url: string, errorMessage: string) => {
      try {
        const response = await fetch(url);
        const data: PropertyStatus[] = await response.json();
        setValues(data);
      } catch (error) {
        console.error(errorMessage, error);
      }
    },
    []
  ); // La fonction est mémorisée et ne change jamais;
};

export default useFetchValues;

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
