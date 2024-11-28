import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
} from "next/navigation";
import { SelectNameType } from "../data/filters";

export interface FilterValueType {
  id: number | string;
  value: string;
}

export type FilterValueTypes = FilterValueType[];

export type SetArrayNumberAndStringType = React.Dispatch<React.SetStateAction<string | number[]>>

const useFilterChange = () => {
  const router = useRouter();
  const pathName = usePathname();
  return (
    value: string | number[],
    setValue: SetArrayNumberAndStringType,
    searchParams: ReadonlyURLSearchParams,
    name: SelectNameType,
    values?: FilterValueTypes,
    rangeName?: string[],
  ) => {
    const selectedId =Array.isArray(value) ? value : Array.from(value)[0] as string;
    const params = new URLSearchParams(searchParams);
    const updateRoute = (params:URLSearchParams) => router.replace(`${pathName}?${params.toString()}`);
    if (selectedId === "none") {
      setValue("");
      params.delete(name);
      updateRoute(params);
      return;
    }
    const selected = values?.find((item) => String(item.id) === selectedId) || null;

    if (selected) {
      setValue(selected.id.toString());
      params.set(name, name === "sortOrder" ? String(selected.id) : selected.value);
      updateRoute(params);
    } else if (Array.isArray(value) && Array.isArray(rangeName)) {
      setValue(value);
      params.set(rangeName[0], value[0].toString());
      params.set(rangeName[1], value[1].toString());
      updateRoute(params);
    } else {
      params.delete(name);
      updateRoute(params);
    }
  };
};

export default useFilterChange;
