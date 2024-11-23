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
// import React, { useState } from "react";
// import { Button, Card } from "@nextui-org/react";
// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
// import { PropertyImage } from "@prisma/client";
// import Image from "next/image";
// import PictureCard from "./PictureCard";

// interface Props {
//   next: () => void;
//   prev: () => void;
//   className?: string;
//   images: File[];
//   setImages: (images: File[]) => void;
//   savedImagesUrl?: PropertyImage[]; // Images déjà sauvegardées
//   setSavedImageUrl?: (propertyImages: PropertyImage[]) => void;
//   maxImages: number;
// }

// const Picture = ({
//   next,
//   prev,
//   className,
//   images,
//   setImages,
//   savedImagesUrl = [],
//   setSavedImageUrl,
//   maxImages,
// }: Props) => {
//   const [error, setError] = useState<string | null>(null);

//   const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFiles = Array.from(event.target.files as FileList);

//     // Vérifier si le nombre total d'images dépasse la limite
//     if (
//       images.length + savedImagesUrl.length + selectedFiles.length >
//       maxImages
//     ) {
//       setError(`Vous ne pouvez pas télécharger plus de ${maxImages} images.`);
//       return;
//     }

//     const validFiles = selectedFiles.filter((file) =>
//       file.type.startsWith("image/")
//     );

//     if (validFiles.length !== selectedFiles.length) {
//       setError("Certains fichiers ne sont pas des images valides.");
//       return;
//     }

//     setError(null);
//     setImages([...validFiles, ...images]);
//   };

//   const removeImage = (index: number) => {
//     setImages(images.filter((_, i) => i !== index));
//   };

//   const removeSavedImage = (id: number) => {
//     if (setSavedImageUrl) {
//       setSavedImageUrl(savedImagesUrl.filter((img) => img.id !== id));
//     }
//   };

//   return (
//     <Card className={`p-4 ${className}`}>
//       <input
//         type="file"
//         accept="image/*"
//         multiple
//         onChange={handleSelect}
//         className="hidden"
//         id="image-upload"
//       />
//       <label
//         htmlFor="image-upload"
//         className="cursor-pointer border border-dashed p-4 text-center rounded-lg hover:bg-gray-100"
//       >
//         Cliquez pour sélectionner des images ou déposez-les ici
//       </label>
//       {error && <p className="text-red-500 mt-2">{error}</p>}

//       <div className="flex flex-wrap gap-4 mt-4">
//         {/* Afficher les images sauvegardées */}
//         {savedImagesUrl &&
//           setSavedImageUrl &&
//           savedImagesUrl.map((image, index) => (
//             <PictureCard
//               key={`saved-${image.id}`} // Utilisez un key unique pour éviter des conflits
//               src={image.url}
//               index={index}
//               onDelete={() => {
//                 if (setSavedImageUrl!!) {
//                   setSavedImageUrl(
//                     savedImagesUrl.filter((img) => img.id !== image.id)
//                   );
//                 }
//               }}
//             />
//           ))}
//         {/* Afficher les nouvelles images */}
//         {images.map((file, index) => (
//           <div key={`new-${index}`} className="relative">
//             <Image
//               width={300}
//               height={200}
//               src={URL.createObjectURL(file)}
//               alt={file.name}
//               className="w-24 h-24 object-cover rounded-lg"
//             />
//             <button
//               onClick={() => removeImage(index)}
//               className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
//             >
//               &times;
//             </button>
//           </div>
//         ))}
//       </div>

//       <div className="flex justify-center gap-4 mt-6">
//         <Button
//           onClick={prev}
//           startContent={<ChevronLeftIcon className="w-6" />}
//           color="primary"
//           className="w-full md:w-36"
//         >
//           Précédent
//         </Button>
//         <Button
//           onClick={next}
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
// import React, { useState } from "react";
// import { Button, Card } from "@nextui-org/react";
// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
// import { PropertyImage } from "@prisma/client";
// import Image from "next/image";
// import PictureCard from "./PictureCard";

// interface Props {
//   next: () => void;
//   prev: () => void;
//   className?: string;
//   images: File[];
//   setImages: (images: File[]) => void;
//   savedImagesUrl?: PropertyImage[]; // Images déjà sauvegardées
//   setSavedImageUrl?: (propertyImages: PropertyImage[]) => void;
//   maxImages: number;
//   videos?: string[]; // Liste des liens YouTube
//   setVideos?: (videos: string[]) => void; // Setter pour les vidéos
//   maxVideos?: number; // Limite des vidéos
//   isPremium: boolean; // Statut de l'abonnement de l'utilisateur
// }

// const Picture = ({
//   next,
//   prev,
//   className,
//   images,
//   setImages,
//   savedImagesUrl = [],
//   setSavedImageUrl,
//   maxImages,
//   videos = [],
//   setVideos,
//   maxVideos,
//   isPremium,
// }: Props) => {
//   const [error, setError] = useState<string | null>(null);
//   const [videoUrl, setVideoUrl] = useState<string>("");

//   const handleAddVideo = () => {
//     if (!isPremium) {
//       setError("Seuls les utilisateurs Premium peuvent ajouter une vidéo.");
//       return;
//     }

//     const youtubeRegex =
//       /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

//     if (!youtubeRegex.test(videoUrl)) {
//       setError("Lien YouTube non valide.");
//       return;
//     }

//     if (setVideos && videos.length >= (maxVideos || 0)) {
//       setError(`Vous ne pouvez pas ajouter plus de ${maxVideos} vidéos.`);
//       return;
//     }
//     setError(null);
//     setVideos && setVideos([...videos, videoUrl]);
//     setVideoUrl("");
//   };

//   const removeVideo = (index: number) => {
//     if (setVideos) {
//       setVideos(videos.filter((_, i) => i !== index));
//     }
//   };

//   const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFiles = Array.from(event.target.files as FileList);

//     // Vérifier si le nombre total d'images dépasse la limite
//     if (
//       images.length + savedImagesUrl.length + selectedFiles.length >
//       maxImages
//     ) {
//       setError(`Vous ne pouvez pas télécharger plus de ${maxImages} images.`);
//       return;
//     }

//     const validFiles = selectedFiles.filter((file) =>
//       file.type.startsWith("image/")
//     );

//     if (validFiles.length !== selectedFiles.length) {
//       setError("Certains fichiers ne sont pas des images valides.");
//       return;
//     }

//     setError(null);
//     setImages([...validFiles, ...images]);
//   };

//   const removeImage = (index: number) => {
//     setImages(images.filter((_, i) => i !== index));
//   };

//   const removeSavedImage = (id: number) => {
//     if (setSavedImageUrl) {
//       setSavedImageUrl(savedImagesUrl.filter((img) => img.id !== id));
//     }
//   };

//   return (
//     <Card className={`p-4 ${className}`}>
//       {/* Section pour les images */}
//       <input
//         type="file"
//         accept="image/*"
//         multiple
//         onChange={handleSelect}
//         className="hidden"
//         id="image-upload"
//       />
//       <label
//         htmlFor="image-upload"
//         className="cursor-pointer border border-dashed p-4 text-center rounded-lg hover:bg-gray-100"
//       >
//         Cliquez pour sélectionner des images ou déposez-les ici
//       </label>
//       {error && <p className="text-red-500 mt-2">{error}</p>}

//       <div className="flex flex-wrap gap-4 mt-4">
//         {/* Afficher les images sauvegardées */}
//         {savedImagesUrl &&
//           setSavedImageUrl &&
//           savedImagesUrl.map((image, index) => (
//             <PictureCard
//               key={`saved-${image.id}`} // Utilisez un key unique pour éviter des conflits
//               src={image.url}
//               index={index}
//               onDelete={() => {
//                 if (setSavedImageUrl!!) {
//                   setSavedImageUrl(
//                     savedImagesUrl.filter((img) => img.id !== image.id)
//                   );
//                 }
//               }}
//             />
//           ))}
//         {/* Afficher les nouvelles images */}
//         {images.map((file, index) => (
//           <div key={`new-${index}`} className="relative">
//             <Image
//               width={300}
//               height={200}
//               src={URL.createObjectURL(file)}
//               alt={file.name}
//               className="w-24 h-24 object-cover rounded-lg"
//             />
//             <button
//               onClick={() => removeImage(index)}
//               className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
//             >
//               &times;
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Section pour les vidéos */}
//       <div className="mt-6">
//         <label className="block text-sm font-medium text-gray-700">
//           Ajouter une vidéo YouTube
//         </label>
//         {!isPremium ? (
//           <p className="text-gray-500 mt-2">
//             <strong>Note :</strong> Seuls les utilisateurs Premium peuvent
//             ajouter une vidéo.
//           </p>
//         ) : (
//           <div className="flex gap-2 mt-2">
//             <input
//               type="text"
//               value={videoUrl}
//               onChange={(e) => setVideoUrl(e.target.value)}
//               placeholder="Entrez un lien YouTube"
//               className="flex-grow p-2 border rounded-lg"
//             />
//             <Button onClick={handleAddVideo} color="primary">
//               Ajouter
//             </Button>
//           </div>
//         )}
//       </div>
//       <div className="mt-4">
//         {videos.map((video, index) => (
//           <div key={index} className="relative mt-2">
//             <iframe
//               src={`https://www.youtube.com/embed/${new URL(
//                 video
//               ).searchParams.get("v")}`}
//               frameBorder="0"
//               allowFullScreen
//               className="w-full h-48"
//             />
//             <button
//               onClick={() => removeVideo(index)}
//               className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
//             >
//               &times;
//             </button>
//           </div>
//         ))}
//       </div>
//       {/* Boutons Précédent/Suivant */}
//       <div className="flex justify-center gap-4 mt-6">
//         <Button
//           onClick={prev}
//           startContent={<ChevronLeftIcon className="w-6" />}
//           color="primary"
//           className="w-full md:w-36"
//         >
//           Précédent
//         </Button>
//         <Button
//           onClick={next}
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

import React, { useEffect, useState } from "react";
import { Button, Card } from "@nextui-org/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { PropertyImage, PropertyVideo } from "@prisma/client";
import Image from "next/image";
import PictureCard from "./PictureCard";
import { toast } from "react-toastify";

interface Props {
  next: () => void;
  prev: () => void;
  className?: string;
  images: File[];
  setImages: (images: File[]) => void;
  videos?: string[];
  setVideos?: (videos: string[]) => void;
  savedImagesUrl?: PropertyImage[];
  setSavedImageUrl?: (propertyImages: PropertyImage[]) => void;
  savedVideosUrl?: PropertyVideo[];
  setSavedVideoUrl?: (propertyVideos: PropertyVideo[]) => void;
  maxImages: number;
  maxVideos?: number;
  isPremium: boolean;
}

const Picture = ({
  next,
  prev,
  className,
  images,
  setImages,
  savedImagesUrl = [],
  setSavedImageUrl,
  savedVideosUrl = [],
  setSavedVideoUrl,
  maxImages,
  videos = [],
  setVideos,
  maxVideos = 0,
  isPremium,
}: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");

  // Utiliser useEffect pour afficher le toast seulement lorsque l'erreur change
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Gère l'ajout des images
  const handleSelectImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files as FileList);

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

  // Gère la suppression des images locales
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Gère la suppression des images sauvegardées
  const removeSavedImage = (id: number) => {
    setSavedImageUrl?.(savedImagesUrl.filter((img) => img.id !== id));
  };

  // Gère l'ajout de vidéos
  const handleAddVideo = () => {
    if (!isPremium) {
      setError(
        "Seuls les utilisateurs avec le PACK ELITE DIAMANT peuvent ajouter une vidéo."
      );
      return;
    }

    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

    if (!youtubeRegex.test(videoUrl)) {
      setError("Lien YouTube non valide.");
      return;
    }

    if (videos.length >= maxVideos) {
      setError(`Vous ne pouvez pas ajouter plus de ${maxVideos} vidéos.`);
      return;
    }

    setError(null);
    setVideos?.([...videos, videoUrl]);
    setVideoUrl("");
  };

  // Gère la suppression des vidéos
  const removeVideo = (index: number) => {
    setVideos?.(videos.filter((_, i) => i !== index));
  };

  return (
    <Card className={`p-4 ${className}`}>
      {/* Gestion des images */}
      <div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleSelectImages}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer border border-dashed p-4 text-center rounded-lg hover:bg-gray-100"
        >
          Cliquez pour sélectionner des images ou déposez-les ici
        </label>
        {/* {error && <p className="text-red-500 mt-2">{error}</p>} */}
        {/* Affichage du Toast si une erreur existe */}
        {/* {error && toast.error(`${error}`)} */}
        <div className="flex flex-wrap gap-4 mt-4">
          {savedImagesUrl?.map((image, index) => (
            <PictureCard
              key={`saved-${image.id}`}
              src={image.url}
              index={index}
              onDelete={(idx) => removeSavedImage(savedImagesUrl[idx].id)} // Gérer la suppression avec l'index
            />
          ))}
          {images.map((file, index) => (
            <div key={`new-${index}`} className="relative">
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
      </div>

      {/* Gestion des vidéos */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">
          Ajouter une vidéo YouTube
        </label>
        {/* {!isPremium ? ( */}
        {false ? (
          <p className="text-gray-500 mt-2">
            <strong>Note :</strong> Seuls les utilisateurs avec le PACK ELITE
            DIAMANT peuvent ajouter une vidéo.
          </p>
        ) : (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Entrez un lien YouTube"
              className="flex-grow p-2 border rounded-lg"
            />
            <Button onClick={handleAddVideo} color="primary">
              Ajouter
            </Button>
          </div>
        )}
        {/* <div className="mt-4">
          {videos.map((video, index) => (
            <div key={index} className="relative mt-2">
              <iframe
                src={`https://www.youtube.com/embed/${new URL(
                  video
                ).searchParams.get("v")}`}
                frameBorder="0"
                allowFullScreen
                className="w-full h-48"
              />
              <button
                onClick={() => removeVideo(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                &times;
              </button>
            </div>
          ))}
        </div> */}
        <div className="mt-4 flex flex-wrap gap-4">
          {savedVideosUrl?.map((video, index) => (
            <div key={index} className="relative w-36 h-36">
              <iframe
                src={`https://www.youtube.com/embed/${new URL(
                  video.url
                ).searchParams.get("v")}`}
                frameBorder="0"
                allowFullScreen
                className="w-full h-full object-contain rounded"
              />
              <button
                onClick={() => removeVideo(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                &times;
              </button>
            </div>
          ))}

          {videos.map((video, index) => (
            <div key={index} className="relative w-36 h-36">
              <iframe
                src={`https://www.youtube.com/embed/${new URL(
                  video
                ).searchParams.get("v")}`}
                frameBorder="0"
                allowFullScreen
                className="w-full h-full object-contain rounded"
              />
              <button
                onClick={() => removeVideo(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Boutons navigation */}
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
