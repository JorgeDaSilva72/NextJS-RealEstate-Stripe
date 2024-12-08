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


const SaveSearchTable = ({ filtres }: any) => {
  // console.log('liste des filtres', filtres)

  const filtresArray = Array.isArray(filtres) ? filtres : filtres ? [filtres] : [];
  // To DEPLOY
  const router = useRouter();
  return (
    <div className="flex flex-col items-center gap-4">
      <Table>
        <TableHeader>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>TYPE</TableColumn>
          <TableColumn>PAYS</TableColumn>
          <TableColumn>VILLE</TableColumn>
          <TableColumn>PRIX</TableColumn>
          <TableColumn>SUPERFICIE</TableColumn>
          <TableColumn>CHAMBRE</TableColumn>
          <TableColumn>SALLE DE BAIN</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody>
          {
            // filtresArray.length === 0 ? (
            //   <TableRow>
            //     {/* Le colSpan doit être égal au nombre de colonnes dans TableHeader */}
            //     <TableCell colSpan={9} className="text-center">
            //       Aucune donnée disponible.
            //     </TableCell>
            //     {/* <TableCell className="text-center">Aucune donnée</TableCell>
            //     <TableCell className="text-center">Aucune donnée</TableCell>
            //     <TableCell className="text-center">Aucune donnée</TableCell>
            //     <TableCell className="text-center">Aucune donnée</TableCell>
            //     <TableCell className="text-center">Aucune donnée</TableCell>
            //     <TableCell className="text-center">Aucune donnée</TableCell>
            //     <TableCell className="text-center">Aucune donnée</TableCell>
            //     <TableCell className="text-center">Aucune donnée</TableCell>
            //     <TableCell className="text-center"> </TableCell> */}
            //   </TableRow>
            // ) : 
            (
              filtresArray.map((filter: any, index: number) => (
                <TableRow key={index}>
                  {/* Vérifiez que chaque ligne a bien 9 cellules */}
                  <TableCell>{filter.status?.value || "Non défini"}</TableCell>
                  <TableCell>{filter.type?.value || "Non défini"}</TableCell>
                  <TableCell>{filter.country || "Non défini"}</TableCell>
                  <TableCell>{filter.city || "Non défini"}</TableCell>
                  <TableCell>{`${filter.minPrice || 0} - ${filter.maxPrice || 0}`}</TableCell>
                  <TableCell>{`${filter.minArea || 0} - ${filter.maxArea || 0}`}</TableCell>
                  <TableCell>{`${filter.minRoom || 0} - ${filter.maxRoom || 0}`}</TableCell>
                  <TableCell>{`${filter.minBathroom || 0} - ${filter.maxBathroom || 0}`}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Tooltip content="Supprimer" color="danger">
                        <Link href={`/user/search/${filter.id}/delete`}>
                          <TrashIcon className="w-5 text-red-500" />
                        </Link>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
        </TableBody>
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
