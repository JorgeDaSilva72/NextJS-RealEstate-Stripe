// import React, { useEffect, useState } from "react";
// import { Button, Card } from "@nextui-org/react";
// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
// import { PropertyImage, PropertyVideo } from "@prisma/client";
// import Image from "next/image";
// import PictureCard from "./PictureCard";
// import { toast } from "react-toastify";

// interface Props {
//   next: () => void;
//   prev: () => void;
//   className?: string;
//   images: File[];
//   setImages: (images: File[]) => void;
//   videos?: string[];
//   setVideos?: (videos: string[]) => void;
//   savedImagesUrl?: PropertyImage[];
//   setSavedImageUrl?: (propertyImages: PropertyImage[]) => void;
//   savedVideosUrl?: PropertyVideo[];
//   setSavedVideoUrl?: (propertyVideos: PropertyVideo[]) => void;
//   maxImages: number;
//   maxVideos?: number;
//   isPremium: boolean;
// }

// const Picture = ({
//   next,
//   prev,
//   className,
//   images,
//   setImages,
//   savedImagesUrl = [],
//   setSavedImageUrl,
//   savedVideosUrl = [],
//   setSavedVideoUrl,
//   maxImages,
//   videos = [],
//   setVideos,
//   maxVideos = 0,
//   isPremium,
// }: Props) => {
//   const [error, setError] = useState<string | null>(null);
//   const [videoUrl, setVideoUrl] = useState<string>("");

//   // Utiliser useEffect pour afficher le toast seulement lorsque l'erreur change
//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//     }
//   }, [error]);

//   // Gère l'ajout des images
//   const handleSelectImages = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFiles = Array.from(event.target.files as FileList);

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

//   // Gère la suppression des images locales
//   const removeImage = (index: number) => {
//     setImages(images.filter((_, i) => i !== index));
//   };

//   // Gère la suppression des images sauvegardées
//   const removeSavedImage = (id: number) => {
//     setSavedImageUrl?.(savedImagesUrl.filter((img) => img.id !== id));
//   };

//   // Gère l'ajout de vidéos
//   const handleAddVideo = () => {
//     if (!isPremium) {
//       setError(
//         "Seuls les utilisateurs avec le PACK ELITE DIAMANT peuvent ajouter une vidéo."
//       );
//       return;
//     }

//     const youtubeRegex =
//       /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

//     if (!youtubeRegex.test(videoUrl)) {
//       setError("Lien YouTube non valide.");
//       return;
//     }

//     if (videos.length >= maxVideos) {
//       setError(`Vous ne pouvez pas ajouter plus de ${maxVideos} vidéos.`);
//       return;
//     }

//     setError(null);
//     setVideos?.([...videos, videoUrl]);
//     setVideoUrl("");
//   };

//   // Gère la suppression des vidéos
//   const removeVideo = (index: number) => {
//     setVideos?.(videos.filter((_, i) => i !== index));
//   };

//   // const handleVideoDelete = (videoToDelete: PropertyVideo) => {
//   //   setSavedVideoUrl(prev => prev.filter(video => video.id !== videoToDelete.id));
//   // };

//   return (
//     <Card className={`p-4 ${className}`}>
//       {/* Gestion des images */}
//       <div>
//         <input
//           type="file"
//           accept="image/*"
//           multiple
//           onChange={handleSelectImages}
//           className="hidden"
//           id="image-upload"
//         />
//         <label
//           htmlFor="image-upload"
//           className="cursor-pointer border border-dashed p-4 text-center rounded-lg hover:bg-gray-100"
//         >
//           Cliquez pour sélectionner des images ou déposez-les ici
//         </label>
//         {/* {error && <p className="text-red-500 mt-2">{error}</p>} */}
//         {/* Affichage du Toast si une erreur existe */}
//         {/* {error && toast.error(`${error}`)} */}
//         <div className="flex flex-wrap gap-4 mt-4">
//           {savedImagesUrl?.map((image, index) => (
//             <PictureCard
//               key={`saved-${image.id}`}
//               src={image.url}
//               index={index}
//               onDelete={(idx) => removeSavedImage(savedImagesUrl[idx].id)} // Gérer la suppression avec l'index
//             />
//           ))}
//           {images.map((file, index) => (
//             <div key={`new-${index}`} className="relative">
//               <Image
//                 width={300}
//                 height={200}
//                 src={URL.createObjectURL(file)}
//                 alt={file.name}
//                 className="w-24 h-24 object-cover rounded-lg"
//               />
//               <button
//                 onClick={() => removeImage(index)}
//                 className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
//               >
//                 &times;
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Gestion des vidéos */}
//       <div className="mt-6">
//         <label className="block text-sm font-medium text-gray-700">
//           Ajouter une vidéo YouTube
//         </label>
//         {/* {!isPremium ? ( */}
//         {false ? (
//           <p className="text-gray-500 mt-2">
//             <strong>Note :</strong> Seuls les utilisateurs avec le PACK ELITE
//             DIAMANT peuvent ajouter une vidéo.
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

//         <div className="mt-4 flex flex-wrap gap-4">
//           {savedVideosUrl?.map((video, index) => (
//             <div key={index} className="relative w-36 h-36">
//               <iframe
//                 src={`https://www.youtube.com/embed/${new URL(
//                   video.url
//                 ).searchParams.get("v")}`}
//                 frameBorder="0"
//                 allowFullScreen
//                 className="w-full h-full object-contain rounded"
//               />
//               <button
//                 onClick={() => removeVideo(index)}
//                 className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
//               >
//                 &times;
//               </button>
//             </div>
//           ))}

//           {videos.map((video, index) => (
//             <div key={index} className="relative w-36 h-36">
//               <iframe
//                 src={`https://www.youtube.com/embed/${new URL(
//                   video
//                 ).searchParams.get("v")}`}
//                 frameBorder="0"
//                 allowFullScreen
//                 className="w-full h-full object-contain rounded"
//               />
//               <button
//                 onClick={() => removeVideo(index)}
//                 className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
//               >
//                 &times;
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Boutons navigation */}
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

// -------JhnRavelo fixer le bug de la suppression de l'image

// import React, { useEffect, useState } from "react";
// import { Button, Card } from "@nextui-org/react";
// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
// import { PropertyImage, PropertyVideo } from "@prisma/client";
// import Image from "next/image";
// import PictureCard from "./PictureCard";
// import { toast } from "react-toastify";
// import ButtonClose from "@/app/components/ButtonClose";

// interface Props {
//   next: () => void;
//   prev: () => void;
//   className?: string;
//   images: File[];
//   setImages: (images: File[]) => void;
//   videos?: string[];
//   setVideos?: (videos: string[]) => void;
//   savedImagesUrl?: PropertyImage[];
//   setSavedImageUrl?: (propertyImages: PropertyImage[]) => void;
//   savedVideosUrl?: PropertyVideo[];
//   setSavedVideoUrl?: (propertyVideos: PropertyVideo[]) => void;
//   maxImages: number;
//   maxVideos?: number;
//   isPremium: boolean;
// }

// const Picture = ({
//   next,
//   prev,
//   className,
//   images,
//   setImages,
//   savedImagesUrl = [],
//   setSavedImageUrl,
//   savedVideosUrl = [],
//   setSavedVideoUrl,
//   maxImages,
//   videos = [],
//   setVideos,
//   maxVideos = 0,
//   isPremium,
// }: Props) => {
//   const [error, setError] = useState<string | null>(null);
//   const [videoUrl, setVideoUrl] = useState<string>("");

//   // Utiliser useEffect pour afficher le toast seulement lorsque l'erreur change
//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//     }
//   }, [error]);

//   // Gère l'ajout des images
//   const handleSelectImages = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFiles = Array.from(event.target.files as FileList);

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

//   // Gère la suppression des images locales
//   const removeImage = (index: number) => {
//     setImages(images.filter((_, i) => i !== index));
//   };

//   // Gère la suppression des images sauvegardées
//   const removeSavedImage = (id: number) => {
//     setSavedImageUrl?.(savedImagesUrl.filter((img) => img.id !== id));
//   };

//   // Gère l'ajout de vidéos
//   const handleAddVideo = () => {
//     if (!isPremium) {
//       setError(
//         "Seuls les utilisateurs avec le PACK ELITE DIAMANT peuvent ajouter une vidéo."
//       );
//       return;
//     }

//     const youtubeRegex =
//       /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

//     if (!youtubeRegex.test(videoUrl)) {
//       setError("Lien YouTube non valide.");
//       return;
//     }

//     if (savedVideosUrl.length >= maxVideos) {
//       setError(`Vous ne pouvez pas ajouter plus de ${maxVideos} vidéos.`);
//       return;
//     }

//     setError(null);
//     setVideos?.([...videos, videoUrl]);
//     setVideoUrl("");
//   };

//   // Gère la suppression des vidéos
//   const removeVideo = (index: number) => {
//     setVideos?.(videos.filter((_, i) => i !== index));
//   };

//   const removeSavedVideo = (id: number) => {
//     const videos = savedVideosUrl.filter((video) => video.id !== id);
//     setSavedVideoUrl?.(videos);
//   };

//   return (
//     <Card className={`p-4 ${className}`}>
//       {/* Gestion des images */}
//       <div>
//         <input
//           type="file"
//           accept="image/*"
//           multiple
//           onChange={handleSelectImages}
//           className="hidden"
//           id="image-upload"
//         />
//         <label
//           htmlFor="image-upload"
//           className="cursor-pointer border border-dashed p-4 text-center rounded-lg hover:bg-gray-100"
//         >
//           Cliquez pour sélectionner des images ou déposez-les ici
//         </label>
//         {/* {error && <p className="text-red-500 mt-2">{error}</p>} */}
//         {/* Affichage du Toast si une erreur existe */}
//         {/* {error && toast.error(`${error}`)} */}
//         <div className="flex flex-wrap gap-4 mt-4">
//           {savedImagesUrl?.map((image, index) => (
//             <PictureCard
//               key={`saved-${image.id}`}
//               src={image.url}
//               index={index}
//               onDelete={(idx) => removeSavedImage(savedImagesUrl[idx].id)} // Gérer la suppression avec l'index
//             />
//           ))}
//           {images.map((file, index) => (
//             <div key={`new-${index}`} className="relative">
//               <Image
//                 width={300}
//                 height={200}
//                 src={URL.createObjectURL(file)}
//                 alt={file.name}
//                 className="w-24 h-24 object-cover rounded-lg"
//               />
//               <ButtonClose
//                 top="top-1"
//                 right="right-1"
//                 width="w-6"
//                 height="h-6"
//                 onClick={() => removeImage(index)}
//               />
//               {/* <button
//                 onClick={() => removeImage(index)}
//                 className="absolute z-50 top-1 right-1 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
//               >
//                 ✕
//               </button> */}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Gestion des vidéos */}
//       <div className="mt-6">
//         <label className="block text-sm font-medium text-gray-700">
//           Ajouter une vidéo YouTube
//         </label>
//         {/* {!isPremium ? ( */}
//         {false ? (
//           <p className="text-gray-500 mt-2">
//             <strong>Note :</strong> Seuls les utilisateurs avec le PACK ELITE
//             DIAMANT peuvent ajouter une vidéo.
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

//         <div className="mt-4 flex flex-wrap gap-4">
//           {savedVideosUrl?.map((video, index) => (
//             <div key={index} className="relative w-36 h-36">
//               <iframe
//                 src={`https://www.youtube.com/embed/${new URL(
//                   video.url
//                 ).searchParams.get("v")}`}
//                 frameBorder="0"
//                 allowFullScreen
//                 className="w-full h-full object-contain rounded"
//               />
//               <ButtonClose
//                 top="top-1"
//                 right="right-1"
//                 width="w-6"
//                 height="h-6"
//                 onClick={() => removeSavedVideo(savedVideosUrl[index].id)}
//               />
//               {/* <button
//                 onClick={() => removeVideo(index)}
//                 className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
//               >
//                 &times;
//               </button> */}
//             </div>
//           ))}

//           {videos.map((video, index) => (
//             <div key={index} className="relative w-36 h-36">
//               <iframe
//                 src={`https://www.youtube.com/embed/${new URL(
//                   video
//                 ).searchParams.get("v")}`}
//                 frameBorder="0"
//                 allowFullScreen
//                 className="w-full h-full object-contain rounded"
//               />
//               <ButtonClose
//                 top="top-1"
//                 right="right-1"
//                 width="w-6"
//                 height="h-6"
//                 onClick={() => removeVideo(index)}
//               />
//               {/* <button
//                 onClick={() => removeVideo(index)}
//                 className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
//               >
//                 &times;
//               </button> */}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Boutons navigation */}
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

// end ---------------------------------------

// Cedrico : convertir image en webp et limitez la taille du fichier à 2Mo
import React, { useEffect, useState } from "react";
import { Button, Card } from "@nextui-org/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { PropertyImage, PropertyVideo } from "@prisma/client";
import Image from "next/image";
import PictureCard from "./PictureCard";
import { toast } from "react-toastify";
import ButtonClose from "@/app/components/ButtonClose";

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

const MAX_SIZE_MB = 2; // Limite en Mo
export const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024; // Conversion en octets

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

    const validFileSizes = selectedFiles.filter(
      (file) => file.size <= MAX_SIZE_BYTES
    );

    if (selectedFiles.length !== validFileSizes.length) {
      setError("Certains fichiers sont plus grand que 2Mo.");
      return;
    }

    setError(null);
    setImages([...validFileSizes, ...images]);
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

    if (savedVideosUrl.length >= maxVideos) {
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

  const removeSavedVideo = (id: number) => {
    const videos = savedVideosUrl.filter((video) => video.id !== id);
    setSavedVideoUrl?.(videos);
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
              <ButtonClose
                top="top-1"
                right="right-1"
                width="w-6"
                height="h-6"
                onClick={() => removeImage(index)}
              />
              {/* <button
                onClick={() => removeImage(index)}
                className="absolute z-50 top-1 right-1 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                ✕
              </button> */}
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
              <ButtonClose
                top="top-1"
                right="right-1"
                width="w-6"
                height="h-6"
                onClick={() => removeSavedVideo(savedVideosUrl[index].id)}
              />
              {/* <button
                onClick={() => removeVideo(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                &times;
              </button> */}
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
              <ButtonClose
                top="top-1"
                right="right-1"
                width="w-6"
                height="h-6"
                onClick={() => removeVideo(index)}
              />
              {/* <button
                onClick={() => removeVideo(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                &times;
              </button> */}
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
