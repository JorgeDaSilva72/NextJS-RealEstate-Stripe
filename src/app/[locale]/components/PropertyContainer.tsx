import { PropsWithChildren } from "react";
import PaginationContainer from "./PaginationContainer";
import { usePathname } from "next/navigation";

type Props = PropsWithChildren<{
  totalPages: number;
  currentPage: number;
}>;

const PropertyContainer = ({ children, currentPage, totalPages }: Props) => {
  return (
    <div className="w-full py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {children}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <PaginationContainer currentPage={currentPage} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
};

export default PropertyContainer;
