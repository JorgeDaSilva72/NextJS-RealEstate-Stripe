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

// export default Picture;
import FileInput from "@/app/components/fileUpload";
import { Button, Card, cn } from "@nextui-org/react";
import React from "react";
import PictureCard from "./PictureCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { PropertyImage } from "@prisma/client";

interface Props {
  next: () => void;
  prev: () => void;
  className?: string;
  images: File[];
  setImages: (images: File[]) => void;
  savedImagesUrl?: PropertyImage[];
  setSavedImageUrl?: (propertyImages: PropertyImage[]) => void;
  maxImages: number; // Limite des images en fonction du plan d'abonnement
}

const Picture = (props: Props) => {
  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = (event.target.files as FileList)[0];

    // Vérifier si le nombre total d'images dépasse la limite
    if (
      props.images.length + (props.savedImagesUrl?.length || 0) >=
      props.maxImages
    ) {
      alert(
        `Vous ne pouvez pas télécharger plus de ${props.maxImages} images.`
      );
      return;
    }

    // Ajouter l'image sélectionnée
    props.setImages([selectedFile, ...props.images]);
  };

  return (
    <Card className={cn("p-3", props.className)}>
      <FileInput onSelect={handleSelect} />
      <div className="flex flex-wrap gap-3 mt-4">
        {props.savedImagesUrl &&
          props.setSavedImageUrl &&
          props.savedImagesUrl.map((image, index) => (
            <PictureCard
              key={image.id}
              src={image.url}
              index={index}
              onDelete={() =>
                props.setSavedImageUrl &&
                props.setSavedImageUrl(
                  props.savedImagesUrl!.filter((img) => img.id !== image.id)
                )
              }
            />
          ))}
      </div>
      <div className="flex flex-col md:flex-row justify-center col-span-1 md:col-span-2 gap-3 mt-4">
        <Button
          onClick={props.prev}
          startContent={<ChevronLeftIcon className="w-6" />}
          color="primary"
          className="w-full md:w-36"
        >
          Précédent
        </Button>
        <Button
          onClick={props.next}
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
