"use client";
import { CalendarIcon, TrashIcon } from "@heroicons/react/16/solid";
import { EyeIcon, PencilIcon } from "@heroicons/react/16/solid";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { Prisma, Property } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  properties: Prisma.PropertyGetPayload<{
    include: {
      status: true;
      images: true;
      type: true;
    };
  }>[];
  totalPages: number;
  currentPage: number;
};

// const PropertiesTable = ({ properties, totalPages, currentPage }: Props) => {
const PropertiesTable = ({ properties, totalPages, currentPage }: any) => {
  // To DEPLOY
  const router = useRouter();
  return (
    <div className="flex flex-col items-center gap-4">
      <Table>
        <TableHeader>
          <TableColumn>TITRE</TableColumn>
          <TableColumn>PRIX</TableColumn>
          <TableColumn>TYPE</TableColumn>
          <TableColumn>STATUT</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {properties.map(
            (
              item: any,
              index: number // TO DEPLOY
            ) => (
              // {properties.map((item, index) => (

              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.type.value}</TableCell>
                <TableCell>{item.status.value}</TableCell>
                <TableCell width={250}>
                  <div className="flex items-center gap-4">
                    <Tooltip content="Détails">
                      <Link href={`/property/${item.id}`}>
                        <EyeIcon className="w-6 text-slate-500" />
                      </Link>
                    </Tooltip>
                    <Tooltip content="Editer" color="warning">
                      <Link href={`/user/properties/${item.id}/edit`}>
                        <PencilIcon className="w-6 text-yellow-500" />
                      </Link>
                    </Tooltip>
                    <Tooltip content="Supprimer" color="danger">
                      <Link href={`/user/properties/${item.id}/delete`}>
                        <TrashIcon className="w-6 text-red-500" />
                      </Link>
                    </Tooltip>
                    <Tooltip content="Rendez-vous" color="secondary">
                      <Link
                        href={`/user/properties/${item.id}/appointment`}
                        className="flex gap-[2px]"
                      >
                        <CalendarIcon className="w-6 text-[#7828C8]" />
                        {item?.appointments && item.appointments?.length > 0 && <div className="flex items-center relative top-[-5px] justify-center w-4 h-4 bg-red-500 text-white text-[9px] font-extrabold rounded-full">
                          {item.appointments.length}
                        </div>}
                      </Link>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
      <Pagination
        total={totalPages}
        initialPage={1}
        page={currentPage}
        onChange={(page) => router.push(`/user/properties?pagenum=${page}`)}
      />
    </div>
  );
};

export default PropertiesTable;

type Props2 = {
  properties: Prisma.PropertyGetPayload<{
    include: {
      type: true;
      status: true;
    };
  }>[];
  totalPages: number;
  currentPage: number;
};
