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
