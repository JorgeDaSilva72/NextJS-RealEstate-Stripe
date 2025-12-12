//

// JhnRavelo fixer le bug de la suppression de l'image

// "use client";

// import React, { useState } from "react";
// import Stepper from "./Stepper";
// import Basic from "./basic";
// import Location from "./Location";
// import Features from "./Features";
// import Picture from "./Picture";
// import Contact from "./Contact";

// import {
//   Prisma,
//   PropertyImage,
//   PropertyStatus,
//   PropertyType,
//   PropertyVideo,
//   SubscriptionPlan,
// } from "@prisma/client";
// import { cn } from "@nextui-org/react";
// import { z } from "zod";
// import { AddPropertyFormSchema } from "@/lib/zodSchema";
// import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { removeImages, uploadImages } from "@/lib/upload";
// import { editProperty, saveProperty } from "@/lib/actions/property";
// import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";

// const steps = [
//   {
//     label: "Basique",
//   },
//   {
//     label: "Emplacement",
//   },
//   {
//     label: "Caractéristiques",
//   },
//   {
//     label: "Photos",
//   },
//   {
//     label: "Contact",
//   },
// ];

// interface Props {
//   types: PropertyType[];
//   statuses: PropertyStatus[];
//   property?: Prisma.PropertyGetPayload<{
//     include: {
//       location: true;
//       contact: true;
//       feature: true;
//       images: true;
//       videos: true; // Ajout
//     };
//   }>;
//   isEdit?: boolean;
//   planDetails?: Pick<
//     SubscriptionPlan,
//     | "namePlan"
//     | "premiumAds"
//     | "photosPerAd"
//     | "shortVideosPerAd"
//     | "youtubeVideoDuration"
//   > | null; // Ajout de `null`;
// }

// export type AddPropertyInputType = z.infer<typeof AddPropertyFormSchema>;

// const AddPropertyForm = ({ isEdit = false, ...props }: Props) => {
//   const router = useRouter();

//   const methods = useForm<AddPropertyInputType>({
//     resolver: zodResolver(AddPropertyFormSchema),
//     defaultValues: {
//       contact: props.property?.contact ?? undefined,
//       location: props.property?.location ?? undefined,
//       // propertyFeature: props.property?.feature ?? undefined,
//       description: props.property?.description ?? undefined,
//       name: props.property?.name ?? undefined,
//       price: props.property?.price ?? undefined,
//       statusId: props.property?.statusId ?? undefined,
//       typeId: props.property?.typeId ?? undefined,
//       propertyFeature: {
//         bedrooms: props.property?.feature?.bedrooms ?? 0,
//         bathrooms: props.property?.feature?.bathrooms ?? 0,
//         parkingSpots: props.property?.feature?.parkingSpots ?? 0,
//         area: props.property?.feature?.area ?? 0,
//         hasSwimmingPool: props.property?.feature?.hasSwimmingPool ?? false,
//         hasGardenYard: props.property?.feature?.hasGardenYard ?? false,
//         hasBalcony: props.property?.feature?.hasBalcony ?? false,
//       },
//     },
//   });
//   const [step, setStep] = useState(0);
//   const [images, setImages] = useState<File[]>([]);
//   const [videos, setVideos] = useState<string[]>([]);
//   const [savedImagesUrl, setSavedImagesUrl] = useState<PropertyImage[]>(
//     props.property?.images ?? []
//   );
//   const [savedVideosUrl, setSavedVideosUrl] = useState<PropertyVideo[]>(
//     props.property?.videos ?? []
//   ); // Ajout

//   const { user } = useKindeBrowserClient();

//   const onSubmit: SubmitHandler<AddPropertyInputType> = async (data) => {
//     console.log("data from addPropertyInputType:", { data });
//     const imageUrls = await uploadImages(images);

//     try {
//       if (isEdit && props.property) {
//         const deletedImages = props.property?.images.filter(
//           (item) => !savedImagesUrl.includes(item)
//         );

//         const deletedImageIDs = deletedImages.map((item) => item.id);
//         const deletedImageURLs = deletedImages
//           .map((item) => item.url.split("/").at(-1))
//           .filter((item) => item !== undefined);
//         await removeImages(deletedImageURLs);
//         // const deletedVideosIDs = props.property?.videos
//         //   .filter((item) => !savedVideosUrl.includes(item))
//         //   .map((item) => item.id);

//         // Pour les vidéos - Modification ici
//         const deletedVideosIDs = props.property?.videos
//           .filter(
//             (item) => !savedVideosUrl.some((saved) => saved.id === item.id)
//           )
//           .map((item) => item.id);

//         await editProperty(
//           props.property?.id,
//           data,
//           imageUrls,
//           deletedImageIDs,
//           videos,
//           deletedVideosIDs
//         );

//         toast.success("Annonce modifiée!");
//       } else {
//         await saveProperty(data, imageUrls, videos, user?.id!); //ajout

//         toast.success("Annonce ajoutée !");
//       }
//     } catch (error) {
//       console.error({ error });
//     } finally {
//       router.push("/user/properties");
//       router.refresh(); // Added
//     }
//   };

//   return (
//     <div>
//       <Stepper
//         className="m-2"
//         items={steps}
//         activeItem={step}
//         setActiveItem={setStep}
//       />
//       <FormProvider {...methods}>
//         <form
//           className="mt-3 p-2"
//           onSubmit={methods.handleSubmit(onSubmit, (errors) =>
//             console.log({ errors })
//           )}
//         >
//           <Basic
//             className={cn({ hidden: step !== 0 })}
//             next={() => setStep((prev) => prev + 1)}
//             types={props.types}
//             statuses={props.statuses}
//           />
//           <Location
//             next={() => setStep((prev) => prev + 1)}
//             prev={() => setStep((prev) => prev - 1)}
//             className={cn({ hidden: step !== 1 })}
//           />
//           <Features
//             next={() => setStep((prev) => prev + 1)}
//             prev={() => setStep((prev) => prev - 1)}
//             className={cn({ hidden: step !== 2 })}
//           />
//           <Picture
//             next={() => setStep((prev) => prev + 1)}
//             prev={() => setStep((prev) => prev - 1)}
//             className={cn({ hidden: step !== 3 })}
//             images={images}
//             // setImages={setImages}
//             {...(props.property!! && {
//               savedImagesUrl: savedImagesUrl, // Transmet bien les images sauvegardées
//               setSavedImageUrl: setSavedImagesUrl,
//               savedVideosUrl: savedVideosUrl, // Ajout
//               setSavedVideoUrl: setSavedVideosUrl, // Ajout
//             })}
//             setImages={(newImages) => {
//               if (
//                 newImages.length > (props.planDetails?.photosPerAd || Infinity)
//               ) {
//                 toast.error(
//                   `Vous avez dépassé la limite de ${
//                     props.planDetails?.photosPerAd || "Illimité"
//                   } photos.`
//                 );
//                 return;
//               }
//               setImages(newImages);
//             }}
//             maxImages={props.planDetails?.photosPerAd || Infinity}
//             isPremium={
//               props.planDetails?.namePlan?.toLowerCase() === "diamant" || false
//             }
//             maxVideos={props.planDetails?.shortVideosPerAd || 0}
//             setVideos={(newVideos) => {
//               if (
//                 newVideos.length > (props.planDetails?.shortVideosPerAd || 0)
//               ) {
//                 toast.error(
//                   `Vous avez dépassé la limite de ${
//                     props.planDetails?.shortVideosPerAd || "0"
//                   } vidéo.`
//                 );
//                 return;
//               }
//               setVideos(newVideos);
//             }}
//             videos={videos}
//           />
//           <Contact
//             prev={() => setStep((prev) => prev - 1)}
//             className={cn({ hidden: step !== 4 })}
//           />
//         </form>
//       </FormProvider>
//     </div>
//   );
// };

// export default AddPropertyForm;

// end ---------------------------------------

// Cedrico : convertir image en webp et limitez la taille du fichier à 2Mo

// "use client";

// import React, { useState } from "react";
// import Stepper from "./Stepper";
// import Basic from "./basic";
// import Location from "./Location";
// import Features from "./Features";
// import Picture from "./Picture";
// import Contact from "./Contact";

// import {
//   Prisma,
//   PropertyImage,
//   PropertyStatus,
//   PropertyType,
//   PropertyVideo,
//   SubscriptionPlan,
// } from "@prisma/client";
// import { cn } from "@nextui-org/react";
// import { z } from "zod";
// import { AddPropertyFormSchema } from "@/lib/zodSchema";
// import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { removeImages, uploadImages, uploadImagesToWebp } from "@/lib/upload";
// import { editProperty, saveProperty } from "@/lib/actions/property";
// import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
// import fileToBase64 from "@/lib/fileToBase64";

// const steps = [
//   {
//     label: "Basique",
//   },
//   {
//     label: "Emplacement",
//   },
//   {
//     label: "Caractéristiques",
//   },
//   {
//     label: "Photos",
//   },
//   {
//     label: "Contact",
//   },
// ];

// interface Props {
//   types: PropertyType[];
//   statuses: PropertyStatus[];
//   property?: Prisma.PropertyGetPayload<{
//     include: {
//       location: true;
//       contact: true;
//       feature: true;
//       images: true;
//       videos: true; // Ajout
//     };
//   }>;
//   isEdit?: boolean;
//   planDetails?: Pick<
//     SubscriptionPlan,
//     | "namePlan"
//     | "premiumAds"
//     | "photosPerAd"
//     | "shortVideosPerAd"
//     | "youtubeVideoDuration"
//   > | null; // Ajout de `null`;
// }

// export type AddPropertyInputType = z.infer<typeof AddPropertyFormSchema>;

// const AddPropertyForm = ({ isEdit = false, ...props }: Props) => {
//   const router = useRouter();

//   const methods = useForm<AddPropertyInputType>({
//     resolver: zodResolver(AddPropertyFormSchema),
//     defaultValues: {
//       contact: props.property?.contact ?? undefined,
//       location: props.property?.location ?? undefined,
//       // propertyFeature: props.property?.feature ?? undefined,
//       description: props.property?.description ?? undefined,
//       name: props.property?.name ?? undefined,
//       price: props.property?.price ?? undefined,
//       statusId: props.property?.statusId ?? undefined,
//       typeId: props.property?.typeId ?? undefined,
//       propertyFeature: {
//         bedrooms: props.property?.feature?.bedrooms ?? 0,
//         bathrooms: props.property?.feature?.bathrooms ?? 0,
//         parkingSpots: props.property?.feature?.parkingSpots ?? 0,
//         area: props.property?.feature?.area ?? 0,
//         hasSwimmingPool: props.property?.feature?.hasSwimmingPool ?? false,
//         hasGardenYard: props.property?.feature?.hasGardenYard ?? false,
//         hasBalcony: props.property?.feature?.hasBalcony ?? false,
//       },
//     },
//   });
//   const [step, setStep] = useState(0);
//   const [images, setImages] = useState<File[]>([]);
//   const [videos, setVideos] = useState<string[]>([]);
//   const [savedImagesUrl, setSavedImagesUrl] = useState<PropertyImage[]>(
//     props.property?.images ?? []
//   );
//   const [savedVideosUrl, setSavedVideosUrl] = useState<PropertyVideo[]>(
//     props.property?.videos ?? []
//   ); // Ajout

//   const { user } = useKindeBrowserClient();

//   const onSubmit: SubmitHandler<AddPropertyInputType> = async (data) => {
//     console.log("data from addPropertyInputType:", { data });

//     try {
//       const imageUrls = await Promise.all(
//         images.map(async (img) => {
//           const base64 = await fileToBase64(img);
//           const url = await uploadImagesToWebp(
//             base64,
//             img.name,
//             "propertyImages"
//           );
//           return url;
//         })
//       );

//       if (isEdit && props.property) {
//         const deletedImages = props.property?.images.filter(
//           (item) => !savedImagesUrl.includes(item)
//         );

//         const deletedImageIDs = deletedImages.map((item) => item.id);
//         const deletedImageURLs = deletedImages
//           .map((item) => item.url.split("/").at(-1))
//           .filter((item) => item !== undefined);
//         await removeImages(deletedImageURLs, "propertyImages");
//         // const deletedVideosIDs = props.property?.videos
//         //   .filter((item) => !savedVideosUrl.includes(item))
//         //   .map((item) => item.id);

//         // Pour les vidéos - Modification ici
//         const deletedVideosIDs = props.property?.videos
//           .filter(
//             (item) => !savedVideosUrl.some((saved) => saved.id === item.id)
//           )
//           .map((item) => item.id);

//         await editProperty(
//           props.property?.id,
//           data,
//           imageUrls,
//           deletedImageIDs,
//           videos,
//           deletedVideosIDs
//         );

//         toast.success("Annonce modifiée!");
//       } else {
//         await saveProperty(data, imageUrls, videos, user?.id!); //ajout

//         toast.success("Annonce ajoutée !");
//       }
//     } catch (error) {
//       console.error({ error });
//     } finally {
//       router.push("/user/properties");
//       router.refresh(); // Added
//     }
//   };

//   return (
//     <div>
//       <Stepper
//         className="m-2"
//         items={steps}
//         activeItem={step}
//         setActiveItem={setStep}
//       />
//       <FormProvider {...methods}>
//         <form
//           className="mt-3 p-2"
//           onSubmit={methods.handleSubmit(onSubmit, (errors) =>
//             console.log({ errors })
//           )}
//         >
//           <Basic
//             className={cn({ hidden: step !== 0 })}
//             next={() => setStep((prev) => prev + 1)}
//             types={props.types}
//             statuses={props.statuses}
//           />
//           <Location
//             next={() => setStep((prev) => prev + 1)}
//             prev={() => setStep((prev) => prev - 1)}
//             className={cn({ hidden: step !== 1 })}
//           />
//           <Features
//             next={() => setStep((prev) => prev + 1)}
//             prev={() => setStep((prev) => prev - 1)}
//             className={cn({ hidden: step !== 2 })}
//           />
//           <Picture
//             next={() => setStep((prev) => prev + 1)}
//             prev={() => setStep((prev) => prev - 1)}
//             className={cn({ hidden: step !== 3 })}
//             images={images}
//             // setImages={setImages}
//             {...(props.property!! && {
//               savedImagesUrl: savedImagesUrl, // Transmet bien les images sauvegardées
//               setSavedImageUrl: setSavedImagesUrl,
//               savedVideosUrl: savedVideosUrl, // Ajout
//               setSavedVideoUrl: setSavedVideosUrl, // Ajout
//             })}
//             setImages={(newImages) => {
//               if (
//                 newImages.length > (props.planDetails?.photosPerAd || Infinity)
//               ) {
//                 toast.error(
//                   `Vous avez dépassé la limite de ${
//                     props.planDetails?.photosPerAd || "Illimité"
//                   } photos.`
//                 );
//                 return;
//               }
//               setImages(newImages);
//             }}
//             maxImages={props.planDetails?.photosPerAd || Infinity}
//             isPremium={
//               props.planDetails?.namePlan?.toLowerCase() === "diamant" || false
//             }
//             maxVideos={props.planDetails?.shortVideosPerAd || 0}
//             setVideos={(newVideos) => {
//               if (
//                 newVideos.length > (props.planDetails?.shortVideosPerAd || 0)
//               ) {
//                 toast.error(
//                   `Vous avez dépassé la limite de ${
//                     props.planDetails?.shortVideosPerAd || "0"
//                   } vidéo.`
//                 );
//                 return;
//               }
//               setVideos(newVideos);
//             }}
//             videos={videos}
//           />
//           <Contact
//             prev={() => setStep((prev) => prev - 1)}
//             className={cn({ hidden: step !== 4 })}
//           />
//         </form>
//       </FormProvider>
//     </div>
//   );
// };

// export default AddPropertyForm;
// ----------------------------------------------------------
// next-intl with claude

// "use client";

// import React, { useState } from "react";
// import Stepper from "./Stepper";
// import Basic from "./basic";
// import Location from "./Location";
// import Features from "./Features";
// import Picture from "./Picture";
// import Contact from "./Contact";
// import { useTranslations } from "next-intl";

// import {
//   Prisma,
//   PropertyImage,
//   PropertyStatus,
//   PropertyType,
//   PropertyVideo,
//   SubscriptionPlan,
// } from "@prisma/client";
// import { cn } from "@nextui-org/react";
// import { z } from "zod";
// // import { AddPropertyFormSchema } from "@/lib/zodSchema";
// import { getAddPropertyFormSchema } from "@/lib/zodSchema";
// import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { removeImages, uploadImages, uploadImagesToWebp } from "@/lib/upload";
// import { editProperty, saveProperty } from "@/lib/actions/property";
// import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
// import fileToBase64 from "@/lib/fileToBase64";

// interface Props {
//   types: PropertyType[];
//   statuses: PropertyStatus[];
//   property?: Prisma.PropertyGetPayload<{
//     include: {
//       location: true;
//       contact: true;
//       feature: true;
//       images: true;
//       videos: true;
//     };
//   }>;
//   isEdit?: boolean;
//   planDetails?: Pick<
//     SubscriptionPlan,
//     | "namePlan"
//     | "premiumAds"
//     | "photosPerAd"
//     | "shortVideosPerAd"
//     | "youtubeVideoDuration"
//   > | null;
// }

// // export type AddPropertyInputType = z.infer<typeof AddPropertyFormSchema>;
// export type AddPropertyInputType = z.infer<
//   ReturnType<typeof getAddPropertyFormSchema>
// >;
// const AddPropertyForm = ({ isEdit = false, ...props }: Props) => {
//   const t = useTranslations("AddPropertyForm");
//   const router = useRouter();

//   const steps = [
//     { label: t("steps.basic") },
//     { label: t("steps.location") },
//     { label: t("steps.features") },
//     { label: t("steps.photos") },
//     { label: t("steps.contact") },
//   ];

//   const methods = useForm<AddPropertyInputType>({
//     resolver: zodResolver(getAddPropertyFormSchema(t)),
//     defaultValues: {
//       contact: props.property?.contact ?? undefined,
//       location: props.property?.location ?? undefined,
//       description: props.property?.description ?? undefined,
//       name: props.property?.name ?? undefined,
//       price: props.property?.price ?? undefined,
//       statusId: props.property?.statusId ?? undefined,
//       typeId: props.property?.typeId ?? undefined,
//       propertyFeature: {
//         bedrooms: props.property?.feature?.bedrooms ?? 0,
//         bathrooms: props.property?.feature?.bathrooms ?? 0,
//         parkingSpots: props.property?.feature?.parkingSpots ?? 0,
//         area: props.property?.feature?.area ?? 0,
//         hasSwimmingPool: props.property?.feature?.hasSwimmingPool ?? false,
//         hasGardenYard: props.property?.feature?.hasGardenYard ?? false,
//         hasBalcony: props.property?.feature?.hasBalcony ?? false,
//       },
//     },
//   });

//   const [step, setStep] = useState(0);
//   const [images, setImages] = useState<File[]>([]);
//   const [videos, setVideos] = useState<string[]>([]);
//   const [savedImagesUrl, setSavedImagesUrl] = useState<PropertyImage[]>(
//     props.property?.images ?? []
//   );
//   const [savedVideosUrl, setSavedVideosUrl] = useState<PropertyVideo[]>(
//     props.property?.videos ?? []
//   );

//   const { user } = useKindeBrowserClient();

//   const onSubmit: SubmitHandler<AddPropertyInputType> = async (data) => {
//     try {
//       const imageUrls = await Promise.all(
//         images.map(async (img) => {
//           const base64 = await fileToBase64(img);
//           const url = await uploadImagesToWebp(
//             base64,
//             img.name,
//             "propertyImages"
//           );
//           return url;
//         })
//       );

//       if (isEdit && props.property) {
//         const deletedImages = props.property?.images.filter(
//           (item) => !savedImagesUrl.includes(item)
//         );

//         const deletedImageIDs = deletedImages.map((item) => item.id);
//         const deletedImageURLs = deletedImages
//           .map((item) => item.url.split("/").at(-1))
//           .filter((item) => item !== undefined);
//         await removeImages(deletedImageURLs, "propertyImages");

//         const deletedVideosIDs = props.property?.videos
//           .filter(
//             (item) => !savedVideosUrl.some((saved) => saved.id === item.id)
//           )
//           .map((item) => item.id);

//         await editProperty(
//           props.property?.id,
//           data,
//           imageUrls,
//           deletedImageIDs,
//           videos,
//           deletedVideosIDs
//         );

//         toast.success(t("propertyEdited"));
//       } else {
//         await saveProperty(data, imageUrls, videos, user?.id!);
//         toast.success(t("propertyAdded"));
//       }
//     } catch (error) {
//       console.error({ error });
//     } finally {
//       router.push("/user/properties");
//       router.refresh();
//     }
//   };

//   return (
//     <div>
//       <Stepper
//         className="m-2"
//         items={steps}
//         activeItem={step}
//         setActiveItem={setStep}
//       />
//       <FormProvider {...methods}>
//         <form
//           className="mt-3 p-2"
//           onSubmit={methods.handleSubmit(onSubmit, (errors) => {
//             console.log("Validation errors:", errors);
//             toast.error(t("validationError"));
//           })}
//         >
//           <Basic
//             className={cn({ hidden: step !== 0 })}
//             next={() => setStep((prev) => prev + 1)}
//             types={props.types}
//             statuses={props.statuses}
//           />
//           <Location
//             next={() => setStep((prev) => prev + 1)}
//             prev={() => setStep((prev) => prev - 1)}
//             className={cn({ hidden: step !== 1 })}
//           />
//           <Features
//             next={() => setStep((prev) => prev + 1)}
//             prev={() => setStep((prev) => prev - 1)}
//             className={cn({ hidden: step !== 2 })}
//           />
//           <Picture
//             next={() => setStep((prev) => prev + 1)}
//             prev={() => setStep((prev) => prev - 1)}
//             className={cn({ hidden: step !== 3 })}
//             images={images}
//             {...(props.property!! && {
//               savedImagesUrl: savedImagesUrl,
//               setSavedImageUrl: setSavedImagesUrl,
//               savedVideosUrl: savedVideosUrl,
//               setSavedVideoUrl: setSavedVideosUrl,
//             })}
//             setImages={(newImages) => {
//               if (
//                 newImages.length > (props.planDetails?.photosPerAd || Infinity)
//               ) {
//                 toast.error(
//                   t("photoLimitExceeded", {
//                     limit: props.planDetails?.photosPerAd || t("unlimited"),
//                   })
//                 );
//                 return;
//               }
//               setImages(newImages);
//             }}
//             maxImages={props.planDetails?.photosPerAd || Infinity}
//             isPremium={
//               props.planDetails?.namePlan?.toLowerCase() === "diamant" || false
//             }
//             maxVideos={props.planDetails?.shortVideosPerAd || 0}
//             setVideos={(newVideos) => {
//               if (
//                 newVideos.length > (props.planDetails?.shortVideosPerAd || 0)
//               ) {
//                 toast.error(
//                   t("videoLimitExceeded", {
//                     limit: props.planDetails?.shortVideosPerAd || "0",
//                   })
//                 );
//                 return;
//               }
//               setVideos(newVideos);
//             }}
//             videos={videos}
//           />
//           <Contact
//             prev={() => setStep((prev) => prev - 1)}
//             className={cn({ hidden: step !== 4 })}
//           />
//         </form>
//       </FormProvider>
//     </div>
//   );
// };

// export default AddPropertyForm;

// 08/12/2025 pour s adapter au nouveau prisma feature/multlingual-countries

"use client";

import React, { useState } from "react";
import Stepper from "./Stepper";
import Basic from "./basic";
import Location from "./Location";
import Features from "./Features";
import Picture from "./Picture";
import Contact from "./Contact";
import { useTranslations, useLocale } from "next-intl";

import {
  Prisma,
  PropertyImage,
  PropertyVideo,
  SubscriptionPlan,
} from "@prisma/client";
import { cn } from "@nextui-org/react";
import { z } from "zod";
import { getAddPropertyFormSchema } from "@/lib/zodSchema";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { removeImages, uploadImagesToWebp } from "@/lib/upload";
import { editProperty, saveProperty } from "@/lib/actions/property";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import fileToBase64 from "@/lib/fileToBase64";
import { translateField } from "@/lib/translation-helper";
import { Progress } from "@nextui-org/react";

// Le type de sortie (utilisé par onSubmit , number pour price, cityId, etc.)
export type AddPropertyOutputType = z.infer<
  ReturnType<typeof getAddPropertyFormSchema>
>;

// Le type d'entrée (utilisé par useForm - string pour price, cityId, etc.)
export type AddPropertyFormInputType = z.input<
  ReturnType<typeof getAddPropertyFormSchema>
>;

// ✅ NOUVEAU TYPE : Structure des données traduites (reçues de AddPropertyClient)
interface TranslatedClientItem {
  id: number;
  code: string;
  name: string; // Le nom traduit du type/statut/ville/pays
}

interface Props {
  // ✅ Types et Status traduits
  types: TranslatedClientItem[];
  statuses: TranslatedClientItem[];

  // 🎯 NOUVEAU : Pays et Villes traduits (nécessaires pour Location.tsx)
  countries: TranslatedClientItem[];
  cities: TranslatedClientItem[];

  // ✅ Limites (calculées dans AddPropertyPage)
  photoLimit: number;
  shortVideoLimit: number;

  property?: Prisma.PropertyGetPayload<{
    include: {
      location: true;
      contact: true;
      feature: true;
      images: true;
      videos: true;
    };
  }>;
  isEdit?: boolean;
  planDetails?: Pick<
    SubscriptionPlan,
    | "namePlan"
    | "premiumAds"
    | "photosPerAd"
    | "shortVideosPerAd"
    | "youtubeVideoDuration"
  > | null;
}

export type AddPropertyInputType = z.infer<
  ReturnType<typeof getAddPropertyFormSchema>
>;

const AddPropertyForm = ({ isEdit = false, ...props }: Props) => {
  const t = useTranslations("AddPropertyForm");
  const router = useRouter();
  const locale = useLocale();

  const getLocalizedText = (field: any, locale: string): string => {
    if (!field) return "";
    if (typeof field === "string") return field;
    if (typeof field === "object") {
      return (
        field[locale] || field.fr || field.en || Object.values(field)[0] || ""
      );
    }
    return String(field);
  };

  const steps = [
    { label: t("steps.basic") },
    { label: t("steps.location") },
    { label: t("steps.features") },
    { label: t("steps.photos") },
    { label: t("steps.contact") },
  ];

  const methods = useForm<AddPropertyFormInputType>({
    resolver: zodResolver(getAddPropertyFormSchema(t)),
    defaultValues: {
      // contact: props.property?.contact ?? undefined,
      contact: props.property?.contact
        ? {
          ...props.property.contact,
          name: getLocalizedText(props.property.contact.name, locale),
        }
        : undefined,
      // description: props.property?.description ?? undefined,
      description: getLocalizedText(props.property?.description, locale),
      // name: props.property?.name ?? undefined,
      name: getLocalizedText(props.property?.name, locale),

      //  CORRECTION CRITIQUE DU PRIX : Conversion du number DB en string form-state
      // price:
      //   props.property?.price !== undefined && props.property?.price !== null
      //     ? String(props.property.price)
      //     : undefined, // Price est maintenant 'string | undefined'

      // 2. CORRECTION CRITIQUE DES IDS : Conversion vers String avec opérateur ternaire
      // Pour satisfaire le typage TypeScript/RHF avant transformation Zod (string | undefined)
      //

      // typeId:
      //   props.property?.typeId !== undefined && props.property?.typeId !== null
      //     ? String(props.property.typeId)
      //     : undefined,

      typeId: props.property?.typeId ? String(props.property.typeId) : "", // ✅ Forcer la valeur par défaut à "" (string vide)

      statusId: props.property?.statusId ? String(props.property.statusId) : "", // ✅ Forcer la valeur par défaut à "" (string vide)

      // CORRECTION POUR PRICE
      price: props.property?.price ? String(props.property.price) : "0", // ✅ Forcer la valeur par défaut à "0" (string)

      //  CORRECTION LOCATION (Reconstruction explicite)
      location: {
        // Mappage de l'objet location de la DB vers le format attendu par le formulaire

        // cityId doit être une string pour react-hook-form (car transformé en number par Zod)
        // cityId: props.property?.location?.cityId
        //   ? String(props.property.location.cityId)
        //   : undefined,

        cityId: props.property?.location?.cityId
          ? String(props.property.location.cityId)
          : "", // ✅ Forcer la valeur par défaut à "" (string vide)

        // Assurer que les autres champs sont définis pour correspondre au schéma Zod
        streetAddress: props.property?.location?.streetAddress ?? undefined,
        zip: props.property?.location?.zip ?? undefined,
        //landmark: props.property?.location?.landmark ?? undefined,
        landmark: getLocalizedText(props.property.location.landmark, locale),
        latitude: props.property?.location?.latitude ?? undefined,
        longitude: props.property?.location?.longitude ?? undefined,
      } as any, // ⚠️ Utilisation temporaire de 'as any' pour l'objet location si le Zod est trop complexe à typer.
      // Sinon, vous devez typer `location: Partial<AddPropertyInputType['location']>`

      
      
      
     
    },
  });

  const [step, setStep] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [savedImagesUrl, setSavedImagesUrl] = useState<PropertyImage[]>(
    props.property?.images ?? []
  );
  const [savedVideosUrl, setSavedVideosUrl] = useState<PropertyVideo[]>(
    props.property?.videos ?? []
  );
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useKindeBrowserClient();

  // 1. Assurez-vous que l'interface utilise le type d'entrée (string pour les IDs/prix)
  const onSubmit: SubmitHandler<AddPropertyFormInputType> = async (data) => {
    // Ici, data.price est une string, data.cityId est une string.
    // Vous pouvez effectuer les actions serveur avec des strings, ou utiliser la transformation Zod.

    // Si vous avez besoin de la valeur transformée (number), vous devez la recalculer ici.
    // Ex: const validatedData = getAddPropertyFormSchema(t).parse(data);

    // --- Laissez le type d'entrée pour la compatibilité du handler ---
    try {
      // 2. TENTER DE PARSER/VALIDER TOUTES LES DONNÉES EN UTILISANT LE SCHÉMA ZOD FINAL
      // Cette étape effectue les transformations string -> number et les validations finales
      const validatedData = getAddPropertyFormSchema(t).parse(data);

      // 3. UTILISER LES DONNÉES VALIDÉES ET NUMÉRISÉES pour les actions serveur
      setIsSubmitting(true);
      setProgress(10); // Started

      // Translate name, description, and landmark (10% -> 40%)
      const nameFR = data.name || "";
      const descriptionFR = data.description || "";
      const landmarkFR = data.location.landmark || "";

      // Translate to all target languages in parallel
      const [
        nameEN, nameAR, namePT,
        descriptionEN, descriptionAR, descriptionPT,
        landmarkEN, landmarkAR, landmarkPT
      ] = await Promise.all([
        translateField(nameFR, "en"),
        translateField(nameFR, "ar"),
        translateField(nameFR, "pt"),
        translateField(descriptionFR, "en"),
        translateField(descriptionFR, "ar"),
        translateField(descriptionFR, "pt"),
        translateField(landmarkFR, "en"),
        translateField(landmarkFR, "ar"),
        translateField(landmarkFR, "pt"),
      ]);

      setProgress(40); // Translation done

      // Prepare multilingual data with 4 languages
      const multilingualData = {
        ...data,
        name: { fr: nameFR, en: nameEN, ar: nameAR, pt: namePT },
        description: { fr: descriptionFR, en: descriptionEN, ar: descriptionAR, pt: descriptionPT },
        location: {
          ...data.location,
          landmark: { fr: landmarkFR, en: landmarkEN, ar: landmarkAR, pt: landmarkPT }
        }
      };

      // Upload Images (40% -> 80%)
      const totalImages = images.length;
      let uploadedCount = 0;

      const imageUrls = await Promise.all(
        images.map(async (img) => {
          const base64 = await fileToBase64(img);
          const url = await uploadImagesToWebp(
            base64,
            img.name,
            "propertyImages"
          );
          uploadedCount++;
          const imageProgress = Math.round((uploadedCount / (totalImages || 1)) * 40);
          setProgress(40 + imageProgress);
          return url;
        })
      );

      if (images.length === 0) setProgress(80);

      // Saving to DB (80% -> 100%)
      if (isEdit && props.property) {
        const deletedImages = props.property?.images.filter(
          (item) => !savedImagesUrl.includes(item)
        );

        const deletedImageIDs = deletedImages.map((item) => item.id);
        const deletedImageURLs = deletedImages
          .map((item) => item.url.split("/").at(-1))
          .filter((item) => item !== undefined);
        await removeImages(deletedImageURLs as string[], "propertyImages");

        const deletedVideosIDs = props.property?.videos
          .filter(
            (item) => !savedVideosUrl.some((saved) => saved.id === item.id)
          )
          .map((item) => item.id);
        //  Passez validatedData (qui contient les NOMBRES) à l'action d'édition
        // AVANT (Cause l'erreur si props.property?.id est un number)
        // await editProperty(props.property?.id, ...);

        // APRÈS (Conversion explicite en string)
        await editProperty(
          String(props.property?.id), // ✅ Conversion explicite de l'ID en STRING
          // data,
          // validatedData, // Utiliser validatedData (où cityId, price, etc. sont des NOMBRES)
          
          multilingualData as any,
          imageUrls,
          deletedImageIDs,
          videos,
          deletedVideosIDs
        );

        toast.success(t("propertyEdited"));
      } else {
        // await saveProperty(data, imageUrls, videos, user?.id!);
        // await saveProperty(validatedData, imageUrls, videos, user?.id!);
        await saveProperty(multilingualData as any, imageUrls, videos, user?.id!);
        toast.success(t("propertyAdded"));
      }

      setProgress(100);
    } catch (error) {
      console.error({ error });
      toast.error(t("error") || "An error occurred");
    } finally {
      setIsSubmitting(false);
      setProgress(0);
      router.push("/user/properties");
      router.refresh();
    }
  };

  return (
    <div>
      <Stepper
        className="m-2"
        items={steps}
        activeItem={step}
        setActiveItem={setStep}
      />
      <FormProvider {...methods}>
        <form
          className="mt-3 p-2"
          onSubmit={methods.handleSubmit(onSubmit, (errors) => {
            console.log("Validation errors:", errors);
            toast.error(t("validationError"));
          })}
        >
          {/* ÉTAPE BASIC : Utilise maintenant les listes traduites */}
          <Basic
            className={cn({ hidden: step !== 0 })}
            next={() => setStep((prev) => prev + 1)}
            types={props.types}
            statuses={props.statuses}
          />
          {/* ÉTAPE LOCATION : Passe les listes de pays/villes traduites */}
          <Location
            next={() => setStep((prev) => prev + 1)}
            prev={() => setStep((prev) => prev - 1)}
            className={cn({ hidden: step !== 1 })}
            // ✅ CORRECTION : Assurer que les listes sont des tableaux vides si undefined
            countries={props.countries || []} // 🎯 NOUVEAU
            cities={props.cities || []} // 🎯 NOUVEAU
          />
          <Features
            next={() => setStep((prev) => prev + 1)}
            prev={() => setStep((prev) => prev - 1)}
            className={cn({ hidden: step !== 2 })}
          />
          {/* ÉTAPE PICTURE : Utilise les limites passées par props */}
          <Picture
            next={() => setStep((prev) => prev + 1)}
            prev={() => setStep((prev) => prev - 1)}
            className={cn({ hidden: step !== 3 })}
            images={images}
            {...(props.property!! && {
              savedImagesUrl: savedImagesUrl,
              setSavedImageUrl: setSavedImagesUrl,
              savedVideosUrl: savedVideosUrl,
              setSavedVideoUrl: setSavedVideosUrl,
            })}
            setImages={(newImages) => {
              // Vérification basée sur la nouvelle prop photoLimit
              if (newImages.length > props.photoLimit) {
                toast.error(
                  t("photoLimitExceeded", {
                    limit: props.photoLimit || t("unlimited"),
                  })
                );
                return;
              }
              setImages(newImages);
            }}
            maxImages={props.photoLimit}
            isPremium={
              props.planDetails?.namePlan?.toLowerCase() === "diamant" || false
            }
            // Utilisation de la prop shortVideoLimit
            maxVideos={props.shortVideoLimit}
            setVideos={(newVideos) => {
              // Vérification basée sur la nouvelle prop shortVideoLimit
              if (newVideos.length > props.shortVideoLimit) {
                toast.error(
                  t("videoLimitExceeded", {
                    limit: props.shortVideoLimit || "0",
                  })
                );
                return;
              }
              setVideos(newVideos);
            }}
            videos={videos}
          />
          <Contact
            prev={() => setStep((prev) => prev - 1)}
            className={cn({ hidden: step !== 4 })}
          />
        </form>
      </FormProvider>

      {/* Loading Progress Bar Percentage Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 z-50 flex flex-col items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full flex flex-col items-center gap-4">
            <h3 className="text-xl font-bold text-gray-800">
              {t("processing")}
            </h3>
            <p className="text-gray-600 text-center text-sm">
              {progress < 40 ? t("translating") : progress < 80 ? t("uploadingImages") : t("saving")}
            </p>
            <div className="w-full flex flex-col gap-2">
              <Progress
                size="lg"
                value={progress}
                color="primary"
                showValueLabel={true}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPropertyForm;
