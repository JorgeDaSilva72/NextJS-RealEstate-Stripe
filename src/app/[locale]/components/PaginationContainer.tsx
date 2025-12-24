"use client";
import { Pagination } from "@nextui-org/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";

interface Props {
  totalPages: number;
  currentPage: number;
}
const PaginationContainer = ({
  totalPages,
  currentPage,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("pagenum", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Pagination
      total={totalPages}
      initialPage={1}
      page={currentPage}
      onChange={handlePageChange}
      showControls
      classNames={{
        wrapper: "gap-0",
        item: "w-10 h-10",
        cursor: "bg-blue-600 text-white font-semibold",
      }}
    />
  );
};

export default PaginationContainer;
