// "use client";
// import { deleteProperty } from "@/lib/actions/property";
// import {
//   Button,
//   Modal,
//   ModalBody,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
// } from "@nextui-org/react";

// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";

// interface Props {
//   params: { id: string };
// }
// const ModalDeletePropertyPage = ({ params }: Props) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const router = useRouter();
//   useEffect(() => {
//     setIsOpen(true);
//   }, []);

//   const handldeDelete = async () => {
//     try {
//       await deleteProperty(Number(params.id));

//       router.push("/user/properties");

//       setIsOpen(false);
//     } catch (e) {
//       throw e;
//     }
//   };

//   const handleCancel = () => {
//     router.push("/user/properties");
//     setIsOpen(false);
//   };
//   return (
//     <Modal isOpen={isOpen} onOpenChange={handleCancel}>
//       <ModalContent>
//         <ModalHeader className="flex flex-col gap-1">
//           Supprimer l&apos;annonce
//         </ModalHeader>
//         <ModalBody>
//           <p>Êtes-vous sûr de supprimer l&apos;annonce ?</p>
//         </ModalBody>
//         <ModalFooter>
//           <Button onClick={handleCancel}>Annuler</Button>
//           <Button onClick={handldeDelete} color="danger" variant="light">
//             Supprimer
//           </Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default ModalDeletePropertyPage;

// -------------------------------------------
// JhnRavelo supprime le fichiers quand une annonce est supprimé

"use client";
import { getProperty } from "@/lib/actions/property";
import { removeImages } from "@/lib/upload";
import { deleteProperty } from "@/lib/actions/property";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ModalDelete from "@/app/[locale]/components/ModalDelete";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
// import ModalDelete from "@/app/components/ModalDelete";

interface Props {
  params: { id: string };
}
const ModalDeletePropertyPage = ({ params }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setIsOpen(true);
  }, []);

  const t = useTranslations("modalDeleteProperty");

  const handldeDelete = async () => {
    try {
      const property = await getProperty(params.id); // ✅ Passez la STRING directement
      if (property) {
        const deletedImageURLs = property.images
          .map((item) => item.url.split("/").at(-1))
          .filter((item) => item !== undefined);
        await removeImages(deletedImageURLs, "propertyImages");
      }
      await deleteProperty(params.id); // ✅ Passez la STRING directement
      toast.success(t("propertyDeletedSuccessfully"));

      router.push("/user/properties"); // Démonte le composant modal
      setIsOpen(false);
    } catch (e) {
      // Il est critique de naviguer hors de cette route même en cas d'erreur
      console.error("Erreur de suppression:", e);
      toast.error(t("errorDeletingProperty"));
      // ✅ 3. S'assurer de naviguer même en cas d'erreur pour débloquer l'utilisateur
      // setIsOpen(false); // Tente de fermer visuellement
      router.push("/user/properties");
      // Laissez le throw e pour le débogage si nécessaire, mais assurez-vous de naviguer
      // throw e;
    }
  };

  const handleCancel = () => {
    router.push("/user/properties"); // Démonte le composant modal
    setIsOpen(false);
  };
  return (
    <ModalDelete
      handleCancel={handleCancel}
      handleDelete={handldeDelete}
      isOpen={isOpen} // Géré par l'état local
      slug="l'annonce"
    />
  );
};

export default ModalDeletePropertyPage;
