"use client";
import { TrashIcon } from "@heroicons/react/16/solid";
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

const SaveSearchTable = () => {
  // To DEPLOY
  const router = useRouter();
  return (
    <div className="flex flex-col items-center gap-4">
      <Table>
        <TableHeader>
          <TableColumn>Status</TableColumn>
          <TableColumn>Type</TableColumn>
          <TableColumn>Pays</TableColumn>
          <TableColumn>Ville</TableColumn>
          <TableColumn>Prix</TableColumn>
          <TableColumn>Superficie</TableColumn>
          <TableColumn>chambre</TableColumn>
          <TableColumn>salle de bain</TableColumn>

        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Aucune donnée disponible.</TableCell>
            <TableCell>Aucune donnée disponible.</TableCell>
            <TableCell>Aucune donnée disponible.</TableCell>
            <TableCell>Aucune donnée disponible.</TableCell>
            <TableCell>Aucune donnée disponible.</TableCell>
            <TableCell>Aucune donnée disponible.</TableCell>
            <TableCell>Aucune donnée disponible.</TableCell>
            <TableCell>Aucune donnée disponible.</TableCell>
          </TableRow>
        </TableBody>
        {/* <TableBody>
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
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Tooltip content="Détails">
                      <Link href={`/property/${item.id}`}>
                        <EyeIcon className="w-5 text-slate-500" />
                      </Link>
                    </Tooltip>
                    <Tooltip content="Editer" color="warning">
                      <Link href={`/user/properties/${item.id}/edit`}>
                        <PencilIcon className="w-5 text-yellow-500" />
                      </Link>
                    </Tooltip>
                    <Tooltip content="Supprimer" color="danger">
                      <Link href={`/user/properties/${item.id}/delete`}>
                        <TrashIcon className="w-5 text-red-500" />
                      </Link>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody> */}
      </Table>
      {/* <Pagination
        total={totalPages}
        initialPage={1}
        page={currentPage}
        onChange={(page) => router.push(`/user/properties?pagenum=${page}`)}
      /> */}
    </div>
  );
};

export default SaveSearchTable;

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
