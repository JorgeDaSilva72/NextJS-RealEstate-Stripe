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

// import React, { useEffect, useState } from "react";
// import { Button, Card } from "@nextui-org/react";
// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
// import { PropertyImage, PropertyVideo } from "@prisma/client";
// import Image from "next/image";
// import PictureCard from "./PictureCard";
// import { toast } from "react-toastify";
// // import ButtonClose from "@/app/components/ButtonClose";

// import { PhotoIcon } from "@heroicons/react/24/outline";
// import ButtonClose from "@/app/[locale]/components/ButtonClose";

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

// const MAX_SIZE_MB = 2; // Limite en Mo
// export const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024; // Conversion en octets

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

//     const validFileSizes = selectedFiles.filter(
//       (file) => file.size <= MAX_SIZE_BYTES
//     );

//     if (selectedFiles.length !== validFileSizes.length) {
//       setError("Certains fichiers sont plus grand que 2Mo.");
//       return;
//     }

//     setError(null);
//     setImages([...validFileSizes, ...images]);
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
//           accept=".jpg,.jpeg,.webp"
//           multiple
//           onChange={handleSelectImages}
//           className="hidden"
//           id="image-upload"
//         />
//         <label
//           htmlFor="image-upload"
//           className="cursor-pointer border border-dashed p-4 text-center rounded-lg hover:bg-gray-100 flex flex-col items-center"
//         >
//           {/* Cliquez pour sélectionner des images ou déposez-les ici */}
//           <PhotoIcon className="w-8 h-8 text-gray-500" />

//           <span className="text-sm text-gray-500 mt-2">
//             Cliquer ici pour ajouter des images
//           </span>
//           <span className="text-sm text-gray-500 mt-2">
//             Formats acceptés : JPG, JPEG, WEBP (max. 2 Mo par fichier)
//           </span>
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
//         {!isPremium ? (
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
// end ----------------------------------------------------------
// next-intl with claude

import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@nextui-org/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { PropertyImage, PropertyVideo } from "@prisma/client";
import Image from "next/image";
import PictureCard from "./PictureCard";
import { toast } from "react-toastify";
import { Upload, X } from "lucide-react";
import ButtonClose from "@/app/[locale]/components/ButtonClose";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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

const MAX_SIZE_MB = 2;
export const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

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
  const t = useTranslations("PropertyForm.Picture");
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<number, number>>({});

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processFiles = useCallback((selectedFiles: File[]) => {
    if (
      images.length + savedImagesUrl.length + selectedFiles.length >
      maxImages
    ) {
      setError(t("maxImagesError", { count: maxImages }));
      return;
    }

    const validFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length !== selectedFiles.length) {
      setError(t("invalidFilesError"));
      return;
    }

    const validFileSizes = selectedFiles.filter(
      (file) => file.size <= MAX_SIZE_BYTES
    );

    if (selectedFiles.length !== validFileSizes.length) {
      setError(t("fileSizeError", { size: MAX_SIZE_MB }));
      return;
    }

    setError(null);
    setImages([...validFileSizes, ...images]);
  }, [images, savedImagesUrl, maxImages, t, setImages, setError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, [processFiles]);

  const handleSelectImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files as FileList);

    if (
      images.length + savedImagesUrl.length + selectedFiles.length >
      maxImages
    ) {
      setError(t("maxImagesError", { count: maxImages }));
      return;
    }

    const validFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length !== selectedFiles.length) {
      setError(t("invalidFilesError"));
      return;
    }

    const validFileSizes = selectedFiles.filter(
      (file) => file.size <= MAX_SIZE_BYTES
    );

    if (selectedFiles.length !== validFileSizes.length) {
      setError(t("fileSizeError", { size: MAX_SIZE_MB }));
      return;
    }

    setError(null);
    setImages([...validFileSizes, ...images]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeSavedImage = (id: number) => {
    setSavedImageUrl?.(savedImagesUrl.filter((img) => img.id !== id));
  };

  const handleAddVideo = () => {
    if (!isPremium) {
      setError(t("premiumOnlyError"));
      return;
    }

    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

    if (!youtubeRegex.test(videoUrl)) {
      setError(t("invalidYoutubeLink"));
      return;
    }

    if (savedVideosUrl.length >= maxVideos) {
      setError(t("maxVideosError", { count: maxVideos }));
      return;
    }

    setError(null);
    setVideos?.([...videos, videoUrl]);
    setVideoUrl("");
  };

  const removeVideo = (index: number) => {
    setVideos?.(videos.filter((_, i) => i !== index));
  };

  const removeSavedVideo = (id: number) => {
    const videos = savedVideosUrl.filter((video) => video.id !== id);
    setSavedVideoUrl?.(videos);
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{t("title") || "Photos et vidéos"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image Upload Section */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t("images") || "Images"} <span className="text-red-500">*</span>
          </Label>
          <input
            type="file"
            accept=".jpg,.jpeg,.webp"
            multiple
            onChange={handleSelectImages}
            className="hidden"
            id="image-upload"
          />
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "cursor-pointer border-2 border-dashed rounded-lg p-8 text-center transition-all",
              isDragging
                ? "border-primary-500 bg-primary-50 scale-105"
                : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
            )}
          >
            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
              {isDragging ? (
                <>
                  <Upload className="w-12 h-12 text-primary-500 mb-4" />
                  <span className="text-primary-600 font-medium">
                    {t("dropHere") || "Déposez les images ici"}
                  </span>
                </>
              ) : (
                <>
                  <PhotoIcon className="w-12 h-12 text-gray-400 mb-4" />
                  <span className="text-sm font-medium text-gray-700 mb-2">
                    {t("clickToAddImages") || "Cliquez pour sélectionner ou glissez-déposez"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {t("acceptedFormats") || `Formats acceptés : JPG, JPEG, WEBP (max. ${MAX_SIZE_MB} Mo par fichier)`}
                  </span>
                </>
              )}
            </label>
          </div>
          <p className="text-xs text-gray-500">
            {`Images sélectionnées : ${images.length + savedImagesUrl.length} / ${maxImages}`}
          </p>
        </div>

        {/* Image Preview Grid */}
        {(savedImagesUrl.length > 0 || images.length > 0) && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t("preview") || "Aperçu des images"}
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {savedImagesUrl?.map((image, index) => (
                <PictureCard
                  key={`saved-${image.id}`}
                  src={image.url}
                  index={index}
                  onDelete={(idx) => removeSavedImage(savedImagesUrl[idx].id)}
                />
              ))}
              {images.map((file, index) => (
                <div key={`new-${index}`} className="relative group">
                  <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                    <Image
                      width={200}
                      height={200}
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <button
                        onClick={() => removeImage(index)}
                        className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-opacity"
                        type="button"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video Section */}
        <div className="space-y-2 pt-4 border-t">
          <Label className="text-sm font-medium">
            {t("addYoutubeVideo") || "Vidéo YouTube"}
          </Label>
          {!isPremium ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>{t("note") || "Note"}:</strong> {t("premiumFeatureNote") || "Seuls les utilisateurs avec le PACK ELITE DIAMANT peuvent ajouter une vidéo."}
              </p>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder={t("enterYoutubeLink") || "Entrez un lien YouTube"}
                className="flex-1"
              />
              <Button onPress={handleAddVideo} color="primary">
                {t("add") || "Ajouter"}
              </Button>
            </div>
          )}

          {(savedVideosUrl.length > 0 || videos.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {savedVideosUrl?.map((video, index) => (
                <div key={`saved-${index}`} className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 group">
                  <iframe
                    src={`https://www.youtube.com/embed/${new URL(
                      video.url
                    ).searchParams.get("v")}`}
                    frameBorder="0"
                    allowFullScreen
                    className="w-full h-full"
                  />
                  <button
                    onClick={() => removeSavedVideo(savedVideosUrl[index].id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-opacity"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {videos.map((video, index) => (
                <div key={`new-${index}`} className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 group">
                  <iframe
                    src={`https://www.youtube.com/embed/${new URL(
                      video
                    ).searchParams.get("v")}`}
                    frameBorder="0"
                    allowFullScreen
                    className="w-full h-full"
                  />
                  <button
                    onClick={() => removeVideo(index)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-opacity"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col md:flex-row justify-end gap-3 pt-4 border-t">
          <Button
            onPress={prev}
            startContent={<ChevronLeftIcon className="w-5 h-5" />}
            color="primary"
            className="w-full md:w-auto"
          >
            {t("previous")}
          </Button>
          <Button
            onPress={next}
            endContent={<ChevronRightIcon className="w-5 h-5" />}
            color="primary"
            className="w-full md:w-auto"
          >
            {t("next")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Picture;
