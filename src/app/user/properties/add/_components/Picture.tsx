// import FileInput from "@/app/components/fileUpload";
// import { Button, Card, cn } from "@nextui-org/react";
// import React from "react";
// import PictureCard from "./PictureCard";
// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
// import { PropertyImage } from "@prisma/client";

// interface Props {
//   next: () => void;
//   prev: () => void;
//   className?: string;
//   images: File[];
//   setImages: (images: File[]) => void;
//   savedImagesUrl?: PropertyImage[];
//   setSavedImageUrl?: (propertyImages: PropertyImage[]) => void;
// }

// const Picture = (props: Props) => {
//   return (
//     <Card className={cn("p-3", props.className)}>
//       <FileInput
//         onSelect={(e) =>
//           props.setImages([(e as any).target.files[0], ...props.images])
//         }
//       />
//       <div className="flex flex-wrap gap-3 mt-4">
//         {props.savedImagesUrl &&
//           props.setSavedImageUrl &&
//           props.savedImagesUrl.map((image, index) => (
//             <PictureCard
//               key={image.id}
//               src={image.url}
//               index={index}
//               onDelete={(i) =>
//                 props.setSavedImageUrl!! &&
//                 props.setSavedImageUrl(
//                   props.savedImagesUrl!.filter((img) => img.id !== image.id)
//                 )
//               }
//             />
//           ))}
//       </div>
//       <div className="flex flex-col md:flex-row justify-center col-span-1 md:col-span-2 gap-3 mt-4">
//         <Button
//           onClick={props.prev}
//           startContent={<ChevronLeftIcon className="w-6" />}
//           color="primary"
//           className="w-full md:w-36"
//         >
//           Précédent
//         </Button>
//         <Button
//           onClick={props.next}
//           endContent={<ChevronRightIcon className="w-6" />}
//           color="primary"
//           className="w-full md:w-36"
//         >
//           Suivant
//         </Button>
//       </div>
//     </Card>
//   );
// };
// ----------------------------------------------------------------------------
// export default Picture;
// import FileInput from "@/app/components/fileUpload";
// import { Button, Card, cn } from "@nextui-org/react";
// import React from "react";
// import PictureCard from "./PictureCard";
// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
// import { PropertyImage } from "@prisma/client";

// interface Props {
//   next: () => void;
//   prev: () => void;
//   className?: string;
//   images: File[];
//   setImages: (images: File[]) => void;
//   savedImagesUrl?: PropertyImage[];
//   setSavedImageUrl?: (propertyImages: PropertyImage[]) => void;
//   maxImages: number; // Limite des images en fonction du plan d'abonnement
// }

// const Picture = (props: Props) => {
//   const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = (event.target.files as FileList)[0];

//     // Vérifier si le nombre total d'images dépasse la limite
//     if (
//       props.images.length + (props.savedImagesUrl?.length || 0) >=
//       props.maxImages
//     ) {
//       alert(
//         `Vous ne pouvez pas télécharger plus de ${props.maxImages} images.`
//       );
//       return;
//     }

//     // Ajouter l'image sélectionnée
//     props.setImages([selectedFile, ...props.images]);
//   };

//   return (
//     <Card className={cn("p-3", props.className)}>
//       <FileInput onSelect={handleSelect} />
//       <div className="flex flex-wrap gap-3 mt-4">
//         {props.savedImagesUrl &&
//           props.setSavedImageUrl &&
//           props.savedImagesUrl.map((image, index) => (
//             <PictureCard
//               key={image.id}
//               src={image.url}
//               index={index}
//               onDelete={() =>
//                 props.setSavedImageUrl &&
//                 props.setSavedImageUrl(
//                   props.savedImagesUrl!.filter((img) => img.id !== image.id)
//                 )
//               }
//             />
//           ))}
//       </div>
//       <div className="flex flex-col md:flex-row justify-center col-span-1 md:col-span-2 gap-3 mt-4">
//         <Button
//           onClick={props.prev}
//           startContent={<ChevronLeftIcon className="w-6" />}
//           color="primary"
//           className="w-full md:w-36"
//         >
//           Précédent
//         </Button>
//         <Button
//           onClick={props.next}
//           endContent={<ChevronRightIcon className="w-6" />}
//           color="primary"
//           className="w-full md:w-36"
//         >
//           Suivant
//         </Button>
//       </div>
//     </Card>
//   );
// };

// export default Picture;

// ------------------------------------------------------------------
import React, { useState } from "react";
import { Button, Card } from "@nextui-org/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { PropertyImage } from "@prisma/client";
import Image from "next/image";

interface Props {
  next: () => void;
  prev: () => void;
  className?: string;
  images: File[];
  setImages: (images: File[]) => void;
  savedImagesUrl?: PropertyImage[];
  setSavedImageUrl?: (propertyImages: PropertyImage[]) => void;
  maxImages: number;
}

const Picture = ({
  next,
  prev,
  className,
  images,
  setImages,
  savedImagesUrl = [],
  setSavedImageUrl,
  maxImages,
}: Props) => {
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files as FileList);

    // Vérifier si le nombre total d'images dépasse la limite
    if (
      images.length + savedImagesUrl.length + selectedFiles.length >
      maxImages
    ) {
      setError(`Vous ne pouvez pas télécharger plus de ${maxImages} images.`);
      return;
    }

    const validFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length !== selectedFiles.length) {
      setError("Certains fichiers ne sont pas des images valides.");
      return;
    }

    setError(null);
    setImages([...validFiles, ...images]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeSavedImage = (id: number) => {
    if (setSavedImageUrl) {
      setSavedImageUrl(savedImagesUrl.filter((img) => img.id !== id));
    }
  };

  return (
    <Card className={`p-4 ${className}`}>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleSelect}
        className="hidden"
        id="image-upload"
      />
      <label
        htmlFor="image-upload"
        className="cursor-pointer border border-dashed p-4 text-center rounded-lg hover:bg-gray-100"
      >
        Cliquez pour sélectionner des images ou déposez-les ici
      </label>
      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div className="flex flex-wrap gap-4 mt-4">
        {savedImagesUrl.map((image) => (
          <div key={image.id} className="relative">
            <Image
              width={300}
              height={200}
              src={image.url}
              alt="Saved"
              className="w-24 h-24 object-cover rounded-lg"
            />
            <button
              onClick={() => removeSavedImage(image.id)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
            >
              &times;
            </button>
          </div>
        ))}
        {images.map((file, index) => (
          <div key={index} className="relative">
            <Image
              width={300}
              height={200}
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <Button
          onClick={prev}
          startContent={<ChevronLeftIcon className="w-6" />}
          color="primary"
          className="w-full md:w-36"
        >
          Précédent
        </Button>
        <Button
          onClick={next}
          endContent={<ChevronRightIcon className="w-6" />}
          color="primary"
          className="w-full md:w-36"
        >
          Suivant
        </Button>
      </div>
    </Card>
  );
};

export default Picture;
