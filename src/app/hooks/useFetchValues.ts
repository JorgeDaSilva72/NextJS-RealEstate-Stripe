import { PropertyStatus } from "@prisma/client";

type SetValuesType = React.Dispatch<React.SetStateAction<PropertyStatus[]>>;

const useFetchValues = () => {
  return async (
    setValues: SetValuesType,
    url: string,
    errorMessage: string
  ) => {
    try {
      const response = await fetch(url);
      const data: PropertyStatus[] = await response.json();
      setValues(data);
      // console.log('data', data)
    } catch (error) {
      console.error(errorMessage, error);
    }
  };
};

export default useFetchValues;
