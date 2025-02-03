"use client";
import { Pagination } from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface Props {
  totalPages: number;
  currentPage: number;
  route?: string; //to make the component more reuseable
}
const PaginationContainer = ({
  totalPages,
  currentPage,
  // route = "/", // before hero section
  route = "/result",
}: Props) => {
  const router = useRouter();
  if (totalPages <= 1) return null;

  return (
    <Pagination
      total={totalPages}
      initialPage={1}
      page={currentPage}
      onChange={(page) => router.push(`${route}?pagenum=${page}`)}
    />
  );
};

export default PaginationContainer;
