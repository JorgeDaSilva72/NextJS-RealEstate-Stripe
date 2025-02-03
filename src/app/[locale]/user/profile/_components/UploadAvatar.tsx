// "use client";

// import FileInput from "@/app/components/fileUpload";
// import { updateUserAvatar } from "@/lib/actions/user";
// import { uploadAvatar } from "@/lib/upload";
// import { PencilIcon } from "@heroicons/react/16/solid";
// import {
//   Button,
//   Image,
//   Modal,
//   ModalBody,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
//   useDisclosure,
// } from "@nextui-org/react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// const UploadAvatar = ({ userId }: { userId: string }) => {
//   const { isOpen, onOpen, onOpenChange } = useDisclosure();
//   const [image, setImage] = useState<File>();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const router = useRouter();

//   return (
//     <div>
//       <button onClick={onOpen}>
//         <PencilIcon className="w-6 text-slate-400 hover:text-primary transition-colors" />
//       </button>
//       <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
//         <ModalContent>
//           {(onClose) => (
//             <>
//               <ModalHeader className="flex flex-col gap-1">
//                 Choisissez votre image:
//               </ModalHeader>
//               <ModalBody>
//                 <FileInput
//                   onChange={(e: any) => setImage((e as any).target.files[0])}
//                 />
//                 {image && <Image src={URL.createObjectURL(image)} alt="" />}
//               </ModalBody>
//               <ModalFooter>
//                 <Button color="danger" variant="light" onPress={onClose}>
//                   Effacer
//                 </Button>
//                 <Button
//                   isLoading={isSubmitting}
//                   color="primary"
//                   onPress={async () => {
//                     setIsSubmitting(true);
//                     if (!image) {
//                       onClose();
//                       return;
//                     }
//                     const avatarUrl = await uploadAvatar(image);
//                     const result = await updateUserAvatar(avatarUrl, userId);
//                     router.refresh();
//                     setIsSubmitting(false);
//                     onClose();
//                   }}
//                 >
//                   Changer votre image
//                 </Button>
//               </ModalFooter>
//             </>
//           )}
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// };

// export default UploadAvatar;
// end ---------------------------------------

// Cedrico : convertir image en webp et limitez la taille du fichier à 2Mo

// "use client";

// import FileInput from "@/app/components/fileUpload";
// import { updateUserAvatar } from "@/lib/actions/user";
// import { uploadAvatar, uploadImagesToWebp } from "@/lib/upload";
// import { PencilIcon } from "@heroicons/react/16/solid";
// import {
//   Button,
//   Image,
//   Modal,
//   ModalBody,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
//   useDisclosure,
// } from "@nextui-org/react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import fileToBase64 from "@/lib/fileToBase64";
// import { toast } from "react-toastify";
// import { MAX_SIZE_BYTES } from "../../properties/add/_components/Picture";

// const UploadAvatar = ({ userId }: { userId: string }) => {
//   const { isOpen, onOpen, onOpenChange } = useDisclosure();
//   const [image, setImage] = useState<File>();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const router = useRouter();

//   const handleChangeAvatar = (file: File) => {
//     if (!file.type.startsWith("image/")) {
//       toast.error("Le fichier doit être un image");
//       return;
//     } else if (file.size >= MAX_SIZE_BYTES) {
//       toast.error("Le fichier est plus grand que 2Mo");
//     }
//     setImage(file);
//   };

//   return (
//     <div>
//       <button onClick={onOpen}>
//         <PencilIcon className="w-6 text-slate-400 hover:text-primary transition-colors" />
//       </button>
//       <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
//         <ModalContent>
//           {(onClose) => (
//             <>
//               <ModalHeader className="flex flex-col gap-1">
//                 Choisissez votre image:
//               </ModalHeader>
//               <ModalBody>
//                 <FileInput
//                   onChange={(e: any) => {
//                     handleChangeAvatar(e.target.files[0]);
//                   }}
//                 />
//                 {image && <Image src={URL.createObjectURL(image)} alt="" />}
//               </ModalBody>
//               <ModalFooter>
//                 <Button color="danger" variant="light" onPress={onClose}>
//                   Effacer
//                 </Button>
//                 <Button
//                   isLoading={isSubmitting}
//                   color="primary"
//                   onPress={async () => {
//                     setIsSubmitting(true);
//                     if (!image) {
//                       onClose();
//                       return;
//                     }
//                     const imgBase64 = await fileToBase64(image);
//                     const avatarUrl = await uploadImagesToWebp(
//                       imgBase64,
//                       image.name,
//                       "avatars"
//                     );
//                     const result = await updateUserAvatar(avatarUrl, userId);
//                     router.refresh();
//                     setIsSubmitting(false);
//                     onClose();
//                   }}
//                 >
//                   Changer votre image
//                 </Button>
//               </ModalFooter>
//             </>
//           )}
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// };

// export default UploadAvatar;

// end ---------------------------------------

// Cedrico : fixer upload avatar et supprimer l'ancien photo 05/12/2024

"use client";

// import FileInput from "@/app/components/fileUpload";
import { updateUserAvatar } from "@/lib/actions/user";
import { removeImages, uploadAvatar, uploadImagesToWebp } from "@/lib/upload";
import { PencilIcon } from "@heroicons/react/16/solid";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import fileToBase64 from "@/lib/fileToBase64";
import { toast } from "react-toastify";
import { MAX_SIZE_BYTES } from "../../properties/add/_components/Picture";
import FileInput from "@/app/[locale]/components/fileUpload";

const UploadAvatar = ({
  userId,
  userAvatar,
}: {
  userId: string;
  userAvatar: string | null;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [image, setImage] = useState<File | null>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChangeAvatar = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Le fichier doit être un image");
      setImage(null);
      return;
    } else if (file.size >= MAX_SIZE_BYTES) {
      toast.error("Le fichier est plus grand que 2Mo");
      setImage(null);
      return;
    }
    setImage(file);
  };

  return (
    <div>
      <button onClick={onOpen}>
        <PencilIcon className="w-6 text-slate-400 hover:text-primary transition-colors" />
      </button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Choisissez votre image:
              </ModalHeader>
              <ModalBody>
                <FileInput
                  onChange={(e: any) => {
                    handleChangeAvatar(e.target.files[0]);
                  }}
                />
                {image && <Image src={URL.createObjectURL(image)} alt="" />}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    setImage(null);
                    onClose();
                  }}
                >
                  Effacer
                </Button>
                <Button
                  isLoading={isSubmitting}
                  color="primary"
                  onPress={async () => {
                    setIsSubmitting(true);
                    if (!image) {
                      setIsSubmitting(false);
                      onClose();
                      return;
                    }
                    const imgBase64 = await fileToBase64(image);
                    const avatarUrl = await uploadImagesToWebp(
                      imgBase64,
                      image.name,
                      "avatars"
                    );
                    const userAvatarFileName = userAvatar?.split("/").at(-1);
                    if (userAvatarFileName)
                      await removeImages([userAvatarFileName], "avatars");

                    const result = await updateUserAvatar(avatarUrl, userId);
                    router.refresh();
                    setIsSubmitting(false);
                    onClose();
                  }}
                >
                  Changer votre image
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UploadAvatar;
