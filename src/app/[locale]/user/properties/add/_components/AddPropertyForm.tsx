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


// "use client";

// import React, { useState } from "react";
// import Stepper from "./Stepper";
// import Basic from "./basic";
// import Location from "./Location";
// import Features from "./Features";
// import Picture from "./Picture";
// import Contact from "./Contact";
// import { useTranslations, useLocale } from "next-intl";

// import {
//   Prisma,
//   PropertyImage,
//   PropertyVideo,
//   SubscriptionPlan,
// } from "@prisma/client";
// import { cn } from "@nextui-org/react";
// import { z } from "zod";
// import { getAddPropertyFormSchema } from "@/lib/zodSchema";
// import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { removeImages, uploadImagesToWebp } from "@/lib/upload";
// import { editProperty, saveProperty } from "@/lib/actions/property";
// import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
// import fileToBase64 from "@/lib/fileToBase64";
// import { translateField } from "@/lib/translation-helper";
// import { Progress } from "@nextui-org/react";

// // Le type de sortie (utilisé par onSubmit , number pour price, cityId, etc.)
// export type AddPropertyOutputType = z.infer<
//   ReturnType<typeof getAddPropertyFormSchema>
// >;

// // Le type d'entrée (utilisé par useForm - string pour price, cityId, etc.)
// export type AddPropertyFormInputType = z.input<
//   ReturnType<typeof getAddPropertyFormSchema>
// >;

// // ✅ NOUVEAU TYPE : Structure des données traduites (reçues de AddPropertyClient)
// interface TranslatedClientItem {
//   id: number;
//   code: string;
//   name: string; // Le nom traduit du type/statut/ville/pays
// }

// interface Props {
//   // ✅ Types et Status traduits
//   types: TranslatedClientItem[];
//   statuses: TranslatedClientItem[];

//   // 🎯 NOUVEAU : Pays et Villes traduits (nécessaires pour Location.tsx)
//   countries: TranslatedClientItem[];
//   cities: TranslatedClientItem[];

//   // ✅ Limites (calculées dans AddPropertyPage)
//   photoLimit: number;
//   shortVideoLimit: number;

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

// export type AddPropertyInputType = z.infer<
//   ReturnType<typeof getAddPropertyFormSchema>
// >;

// const AddPropertyForm = ({ isEdit = false, ...props }: Props) => {
//   const t = useTranslations("AddPropertyForm");
//   const router = useRouter();
//   const locale = useLocale();

//   const getLocalizedText = (field: any, locale: string): string => {
//     if (!field) return "";
//     if (typeof field === "string") return field;
//     if (typeof field === "object") {
//       return (
//         field[locale] || field.fr || field.en || Object.values(field)[0] || ""
//       );
//     }
//     return String(field);
//   };

//   const steps = [
//     { label: t("steps.basic") },
//     { label: t("steps.location") },
//     { label: t("steps.features") },
//     { label: t("steps.photos") },
//     { label: t("steps.contact") },
//   ];

//   const methods = useForm<AddPropertyFormInputType>({
//     resolver: zodResolver(getAddPropertyFormSchema(t)),
//     defaultValues: {
//       // contact: props.property?.contact ?? undefined,
//       contact: props.property?.contact
//         ? {
//           ...props.property.contact,
//           name: getLocalizedText(props.property.contact.name, locale),
//         }
//         : undefined,
//       // description: props.property?.description ?? undefined,
//       description: getLocalizedText(props.property?.description, locale),
//       // name: props.property?.name ?? undefined,
//       name: getLocalizedText(props.property?.name, locale),

//       //  CORRECTION CRITIQUE DU PRIX : Conversion du number DB en string form-state
//       // price:
//       //   props.property?.price !== undefined && props.property?.price !== null
//       //     ? String(props.property.price)
//       //     : undefined, // Price est maintenant 'string | undefined'

//       // 2. CORRECTION CRITIQUE DES IDS : Conversion vers String avec opérateur ternaire
//       // Pour satisfaire le typage TypeScript/RHF avant transformation Zod (string | undefined)
//       //

//       // typeId:
//       //   props.property?.typeId !== undefined && props.property?.typeId !== null
//       //     ? String(props.property.typeId)
//       //     : undefined,

//       typeId: props.property?.typeId ? String(props.property.typeId) : "", // ✅ Forcer la valeur par défaut à "" (string vide)

//       statusId: props.property?.statusId ? String(props.property.statusId) : "", // ✅ Forcer la valeur par défaut à "" (string vide)

//       // CORRECTION POUR PRICE
//       price: props.property?.price ? String(props.property.price) : "0", // ✅ Forcer la valeur par défaut à "0" (string)

//       //  CORRECTION LOCATION (Reconstruction explicite)
//       location: {
//         // Mappage de l'objet location de la DB vers le format attendu par le formulaire

//         // cityId doit être une string pour react-hook-form (car transformé en number par Zod)
//         // cityId: props.property?.location?.cityId
//         //   ? String(props.property.location.cityId)
//         //   : undefined,

//         cityId: props.property?.location?.cityId
//           ? String(props.property.location.cityId)
//           : "", // ✅ Forcer la valeur par défaut à "" (string vide)

//         // Assurer que les autres champs sont définis pour correspondre au schéma Zod
//         streetAddress: props.property?.location?.streetAddress ?? undefined,
//         zip: props.property?.location?.zip ?? undefined,
//         //landmark: props.property?.location?.landmark ?? undefined,
//         landmark: getLocalizedText(props.property?.location?.landmark, locale),
//         latitude: props.property?.location?.latitude ?? undefined,
//         longitude: props.property?.location?.longitude ?? undefined,
//       } as any, // ⚠️ Utilisation temporaire de 'as any' pour l'objet location si le Zod est trop complexe à typer.
//       // Sinon, vous devez typer `location: Partial<AddPropertyInputType['location']>`

      
      
      
     
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
//   const [progress, setProgress] = useState(0);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { user } = useKindeBrowserClient();

//   // 1. Assurez-vous que l'interface utilise le type d'entrée (string pour les IDs/prix)
//   const onSubmit: SubmitHandler<AddPropertyFormInputType> = async (data) => {
//     // Ici, data.price est une string, data.cityId est une string.
//     // Vous pouvez effectuer les actions serveur avec des strings, ou utiliser la transformation Zod.

//     // Si vous avez besoin de la valeur transformée (number), vous devez la recalculer ici.
//     // Ex: const validatedData = getAddPropertyFormSchema(t).parse(data);

//     // --- Laissez le type d'entrée pour la compatibilité du handler ---
//     try {
//       // 2. TENTER DE PARSER/VALIDER TOUTES LES DONNÉES EN UTILISANT LE SCHÉMA ZOD FINAL
//       // Cette étape effectue les transformations string -> number et les validations finales
//       const validatedData = getAddPropertyFormSchema(t).parse(data);

//       // 3. UTILISER LES DONNÉES VALIDÉES ET NUMÉRISÉES pour les actions serveur
//       setIsSubmitting(true);
//       setProgress(10); // Started

//       // Translate name, description, and landmark (10% -> 40%)
//       const nameFR = data.name || "";
//       const descriptionFR = data.description || "";
//       const landmarkFR = data.location.landmark || "";

//       // Translate to all target languages in parallel
//       const [
//         nameEN, nameAR, namePT,
//         descriptionEN, descriptionAR, descriptionPT,
//         landmarkEN, landmarkAR, landmarkPT
//       ] = await Promise.all([
//         translateField(nameFR, "en"),
//         translateField(nameFR, "ar"),
//         translateField(nameFR, "pt"),
//         translateField(descriptionFR, "en"),
//         translateField(descriptionFR, "ar"),
//         translateField(descriptionFR, "pt"),
//         translateField(landmarkFR, "en"),
//         translateField(landmarkFR, "ar"),
//         translateField(landmarkFR, "pt"),
//       ]);

//       setProgress(40); // Translation done

//       // Prepare multilingual data with 4 languages
//       const multilingualData = {
//         ...data,
//         name: { fr: nameFR, en: nameEN, ar: nameAR, pt: namePT },
//         description: { fr: descriptionFR, en: descriptionEN, ar: descriptionAR, pt: descriptionPT },
//         location: {
//           ...data.location,
//           landmark: { fr: landmarkFR, en: landmarkEN, ar: landmarkAR, pt: landmarkPT }
//         }
//       };

//       // Upload Images (40% -> 80%)
//       const totalImages = images.length;
//       let uploadedCount = 0;

//       const imageUrls = await Promise.all(
//         images.map(async (img) => {
//           const base64 = await fileToBase64(img);
//           const url = await uploadImagesToWebp(
//             base64,
//             img.name,
//             "propertyImages"
//           );
//           uploadedCount++;
//           const imageProgress = Math.round((uploadedCount / (totalImages || 1)) * 40);
//           setProgress(40 + imageProgress);
//           return url;
//         })
//       );

//       if (images.length === 0) setProgress(80);

//       // Saving to DB (80% -> 100%)
//       if (isEdit && props.property) {
//         const deletedImages = props.property?.images.filter(
//           (item) => !savedImagesUrl.includes(item)
//         );

//         const deletedImageIDs = deletedImages.map((item) => item.id);
//         const deletedImageURLs = deletedImages
//           .map((item) => item.url.split("/").at(-1))
//           .filter((item) => item !== undefined);
//         await removeImages(deletedImageURLs as string[], "propertyImages");

//         const deletedVideosIDs = props.property?.videos
//           .filter(
//             (item) => !savedVideosUrl.some((saved) => saved.id === item.id)
//           )
//           .map((item) => item.id);
//         //  Passez validatedData (qui contient les NOMBRES) à l'action d'édition
//         // AVANT (Cause l'erreur si props.property?.id est un number)
//         // await editProperty(props.property?.id, ...);

//         // APRÈS (Conversion explicite en string)
//         await editProperty(
//           String(props.property?.id), // ✅ Conversion explicite de l'ID en STRING
//           // data,
//           // validatedData, // Utiliser validatedData (où cityId, price, etc. sont des NOMBRES)
          
//           multilingualData as any,
//           imageUrls,
//           deletedImageIDs,
//           videos,
//           deletedVideosIDs
//         );

//         toast.success(t("propertyEdited"));
//       } else {
//         // await saveProperty(data, imageUrls, videos, user?.id!);
//         // await saveProperty(validatedData, imageUrls, videos, user?.id!);
//         await saveProperty(multilingualData as any, imageUrls, videos, user?.id!);
//         toast.success(t("propertyAdded"));
//       }

//       setProgress(100);
//     } catch (error) {
//       console.error({ error });
//       toast.error(t("error") || "An error occurred");
//     } finally {
//       setIsSubmitting(false);
//       setProgress(0);
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
//           {/* ÉTAPE BASIC : Utilise maintenant les listes traduites */}
//           <Basic
//             className={cn({ hidden: step !== 0 })}
//             next={() => setStep((prev) => prev + 1)}
//             types={props.types}
//             statuses={props.statuses}
//           />
//           {/* ÉTAPE LOCATION : Passe les listes de pays/villes traduites */}
//           <Location
//             next={() => setStep((prev) => prev + 1)}
//             prev={() => setStep((prev) => prev - 1)}
//             className={cn({ hidden: step !== 1 })}
//             // ✅ CORRECTION : Assurer que les listes sont des tableaux vides si undefined
//             countries={props.countries || []} // 🎯 NOUVEAU
//             cities={props.cities || []} // 🎯 NOUVEAU
//           />
//           <Features
//             next={() => setStep((prev) => prev + 1)}
//             prev={() => setStep((prev) => prev - 1)}
//             className={cn({ hidden: step !== 2 })}
//           />
//           {/* ÉTAPE PICTURE : Utilise les limites passées par props */}
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
//               // Vérification basée sur la nouvelle prop photoLimit
//               if (newImages.length > props.photoLimit) {
//                 toast.error(
//                   t("photoLimitExceeded", {
//                     limit: props.photoLimit || t("unlimited"),
//                   })
//                 );
//                 return;
//               }
//               setImages(newImages);
//             }}
//             maxImages={props.photoLimit}
//             isPremium={
//               props.planDetails?.namePlan?.toLowerCase() === "diamant" || false
//             }
//             // Utilisation de la prop shortVideoLimit
//             maxVideos={props.shortVideoLimit}
//             setVideos={(newVideos) => {
//               // Vérification basée sur la nouvelle prop shortVideoLimit
//               if (newVideos.length > props.shortVideoLimit) {
//                 toast.error(
//                   t("videoLimitExceeded", {
//                     limit: props.shortVideoLimit || "0",
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

//       {/* Loading Progress Bar Percentage Overlay */}
//       {isSubmitting && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex flex-col items-center justify-center p-4">
//           <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full flex flex-col items-center gap-4">
//             <h3 className="text-xl font-bold text-gray-800">
//               {t("processing")}
//             </h3>
//             <p className="text-gray-600 text-center text-sm">
//               {progress < 40 ? t("translating") : progress < 80 ? t("uploadingImages") : t("saving")}
//             </p>
//             <div className="w-full flex flex-col gap-2">
//               <Progress
//                 size="lg"
//                 value={progress}
//                 color="primary"
//                 showValueLabel={true}
//                 className="w-full"
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddPropertyForm;



/////////////////////////////////////////////////
// 14/12/2025 pour s adapter au nouveau prisma feature/multlingual-countries
// et nouveau fichier de schéma Zod (src/lib/schemas/property2.ts) et nouveau Server Action (src/lib/actions/property2.ts)
/////////////////////////////////////////////////

"use client";

import React, { useState, useCallback } from "react";
import Stepper from "./Stepper";
// Importez vos sous-composants existants (Basic, Location, Features, Picture, Contact)
import Basic from "./basic"; 
import Location from "./Location"; 
import Features from "./Features"; 
import Picture from "./Picture"; 
import Contact from "./Contact"; 

import { useTranslations, useLocale } from "next-intl";
import { Prisma, PropertyImage, PropertyVideo, SubscriptionPlan } from "@prisma/client";
import { Button, cn } from "@nextui-org/react";
import { z } from "zod";

// 🚨 NOUVEAU : Importation du schéma et du type de l'action Server
import { PropertyFormInputType, PropertyFormSchema } from "@/lib/schemas/property2"; 
import { createPropertyAction, editPropertyAction } from "@/lib/actions/property2"; // Assurez-vous d'avoir editPropertyAction

// ✅ Alias de compatibilité pour l'ancien type utilisé dans d'autres composants
export type AddPropertyInputType = PropertyFormInputType;
// ⚠️ NOTE : Votre schéma doit être le `PropertyFormSchema` unique (plus de getAddPropertyFormSchema(t))

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Importations des fonctions d'Upload/Translation existantes
import { removeImages, uploadImagesToWebp } from "@/lib/upload";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import fileToBase64 from "@/lib/fileToBase64";
import { translateField } from "@/lib/translation-helper";
import { Progress } from "@nextui-org/react";

// --- TYPES MISES À JOUR ---

// Structure des données traduites (reçues de AddPropertyClient)
interface TranslatedClientItem {
    id: number;
    code: string;
    name: string; // Le nom traduit du type/statut/ville/pays
}

// Type de l'objet de propriété complet pour l'édition
type PropertyWithRelations = Prisma.PropertyGetPayload<{
    include: {
        location: true;
        contact: true;
        feature: true;
        images: true;
        videos: true;
    };
}>;

interface Props {
    types: TranslatedClientItem[];
    statuses: TranslatedClientItem[];
    countries: TranslatedClientItem[];
    cities: TranslatedClientItem[];
    photoLimit: number;
    shortVideoLimit: number;
    
    property?: PropertyWithRelations; // Utilisation du type complet
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

// --- COMPOSANT PRINCIPAL ---

const AddPropertyForm = ({ isEdit = false, ...props }: Props) => {
    const t = useTranslations("AddPropertyForm");
    const router = useRouter();
    const locale = useLocale();

    // Fonction d'aide pour extraire la traduction
    const getLocalizedText = useCallback((field: any, locale: string): string => {
        if (!field) return "";
        if (typeof field === "string") return field;
        if (typeof field === "object" && field !== null) {
            // Utiliser la locale, sinon 'fr', sinon la première valeur trouvée
            return (
                field[locale] || field.fr || field.en || Object.values(field)[0] || ""
            );
        }
        return String(field);
    }, []);

    // Définition des étapes (inchangé)
    const steps = [
        { label: t("steps.basic") },
        { label: t("steps.location") },
        { label: t("steps.features") },
        { label: t("steps.photos") },
        { label: t("steps.contact") },
    ];

    // --- LOGIQUE DE VALEURS PAR DÉFAUT POUR L'ÉDITION ---
    // Cette logique est essentielle pour mapper les objets DB (JSON/Number) aux strings du formulaire.
    
    // Remarque : Le `PropertyFormSchema` définit le type d'entrée (`AddPropertyFormInputType`) en strings,
    // ce qui est nécessaire pour les champs de sélection et les champs numériques qui peuvent être vides.
    
    const defaultValues: Partial<PropertyFormInputType> = {
        // Champs Simples (IDs et Prix) : DB Number -> Form String
        typeId: props.property?.typeId ? String(props.property.typeId) : "",
        statusId: props.property?.statusId ? String(props.property.statusId) : "",
        price: props.property?.price ? String(props.property.price) : "0", 
        currency: props.property?.currency ?? "XOF",
        
        // Champs Multilingues (DB JSON -> Form String)
        // Nous devons extraire la valeur pour la locale actuelle
        name: { 
            [locale]: getLocalizedText(props.property?.name, locale) || "",
            // Ajouter d'autres locales vides pour le Zod si nécessaire, sinon le Zod devra s'adapter
        } as any, // ⚠️ Le typage direct peut être difficile, `as any` est temporaire ici
        description: { 
            [locale]: getLocalizedText(props.property?.description, locale) || "",
        } as any, // C'est un objet, pas une string !
        
        // Relations Imbriquées :
        contact: {
            ...props.property?.contact,
            // Si le nom du contact est multilingue dans votre DB, vous devez le localiser ici :
            name: getLocalizedText(props.property?.contact?.name, locale) || "", 
            // Les autres champs (phone, email) sont des strings simples.
        } as any, 
        
        // Localisation
        location: {
            ...props.property?.location,
            cityId: props.property?.location?.cityId ? String(props.property.location.cityId) : "",
            landmark: { 
                 [locale]: getLocalizedText(props.property?.location?.landmark, locale) || "",
            } as any,
        } as any,
        
        // Caractéristiques (Features) : DB Number/Boolean -> Form Number/Boolean
        feature: {
            ...props.property?.feature,
            // Les valeurs nulles de la DB peuvent nécessiter une valeur par défaut ici (ex: 0, false)
            bedrooms: props.property?.feature?.bedrooms ?? 1,
            bathrooms: props.property?.feature?.bathrooms ?? 1,
            area: props.property?.feature?.area ?? 0,
            hasSwimmingPool: props.property?.feature?.hasSwimmingPool ?? false,
            // ... autres features
        } as any,
        
        // Médias (Les URL DB sont gérées par les states locaux savedImagesUrl/savedVideosUrl)
        images: [{ url: "", caption: "", isMain: false, displayOrder: 0 }], // Valeur par défaut pour RHF
        videos: [],
    };


    const methods = useForm<PropertyFormInputType>({
        // ⚠️ Utiliser PropertyFormSchema directement (la validation par Server Action est plus stricte)
        resolver: zodResolver(PropertyFormSchema), 
        defaultValues: defaultValues as PropertyFormInputType,
    });

    const [step, setStep] = useState(0);
    const [images, setImages] = useState<File[]>([]); // Nouvelles images à uploader
    const [videos, setVideos] = useState<string[]>([]); // Nouvelles URLs de vidéos à ajouter
    
    // URLs et IDs déjà enregistrés (pour l'édition)
    const [savedImagesUrl, setSavedImagesUrl] = useState<PropertyImage[]>(
        props.property?.images ?? []
    );
    const [savedVideosUrl, setSavedVideosUrl] = useState<PropertyVideo[]>(
        props.property?.videos ?? []
    );
    
    const [progress, setProgress] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useKindeBrowserClient();


    // --- GESTION DE LA SOUMISSION AVEC SERVER ACTION ---
    const onSubmit: SubmitHandler<PropertyFormInputType> = async (data) => {

        //  S'assurer que les données sont transformées (strings -> numbers)
    const transformedData = PropertyFormSchema.parse(data);
        if (!user?.id) {
            toast.error(t("authRequired"));
            return;
        }
        
        setIsSubmitting(true);
        setProgress(10); // Started
        let result: { success: boolean, message?: string, errors?: any }; // Type de retour de Server Action
        
        try {
            
          
            

// Définition d'un type qui autorise l'accès par chaîne
type MultilingualObject = { [key: string]: string | undefined | null };
// Caster les champs pour l'indexation
const nameObj = data.name as MultilingualObject;
const descriptionObj = data.description as MultilingualObject;
const landmarkObj = data.location?.landmark as MultilingualObject | undefined;

// 1. TRADUCTION DES CHAMPS FR vers MULTILINGUE (Client-Side)
            const nameFR = nameObj[locale] || "";
const descriptionFR = descriptionObj[locale] || "";
// Vérifier l'objet avant d'accéder
const landmarkFR = landmarkObj?.[locale] || "";
            
            // Lancer les traductions en parallèle
            const [
                nameEN, nameAR, namePT,
                descriptionEN, descriptionAR, descriptionPT,
                landmarkEN, landmarkAR, landmarkPT
            ] = await Promise.all([
                // NOTE : Il faut s'assurer que `translateField` gère bien les requêtes concurrentes.
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

            // 2. PRÉPARATION DU PAYLOAD MULTILINGUE
            const multilingualData = {
                ...data, // Contient les strings des IDs/prix
                name: { fr: nameFR, en: nameEN, ar: nameAR, pt: namePT },
                description: { fr: descriptionFR, en: descriptionEN, ar: descriptionAR, pt: descriptionPT },
                location: {
                    ...data.location,
                    landmark: { fr: landmarkFR, en: landmarkEN, ar: landmarkAR, pt: landmarkPT }
                } as any, // Nécessaire pour forcer le typage JSONB
            };

            // 3. UPLOAD D'IMAGES (Client-Side)
            const totalImages = images.length;
            let uploadedCount = 0;

            const newImageUrls = await Promise.all(
                images.map(async (img) => {
                    const base64 = await fileToBase64(img);
                    const url = await uploadImagesToWebp(
                        base64,
                        img.name,
                        "propertyImages"
                    );
                    uploadedCount++;
                    // Mise à jour de la progression
                    const imageProgress = Math.round((uploadedCount / (totalImages || 1)) * 40);
                    setProgress(40 + imageProgress);
                    // Retourner l'objet complet attendu par la Server Action
                    return { url, caption: "", isMain: false, displayOrder: 0 }; 
                })
            );
            
            if (images.length === 0) setProgress(80);

            // 4. ASSEMBLAGE DU PAYLOAD FINAL (Pour la Server Action)
            const finalImages = [
                // Images existantes (doivent être du format PropertyImageSchema)
                ...savedImagesUrl.map(img => ({ 
                    url: img.url, 
                    caption: img.caption|| undefined, 
                    isMain: img.isMain, 
                    displayOrder: img.displayOrder 
                })), 
                // Nouvelles images uploadées
                ...newImageUrls, 
            ];
            
            const finalVideos = [
                // Vidéos existantes (doivent être du format simple d'URL)
                ...savedVideosUrl.map(v => ({ url: v.url })), 
                // Nouvelles URLs
                ...videos.map(url => ({ url }))
            ];
            
            // Payload Final pour la Server Action
            const finalPayload = {
                ...multilingualData, // Contient déjà typeId, statusId, price (string), et les objets multilingues
                
                // On passe les images et vidéos finales
                images: finalImages,
                videos: finalVideos,
            };

            // 5. SAUVEGARDE DB VIA SERVER ACTION
            if (isEdit && props.property) {
                // Pour l'édition, nous devons identifier les médias supprimés
                const deletedImageIDs = props.property.images
                    .filter(item => !savedImagesUrl.some(saved => saved.id === item.id))
                    .map(item => item.id);
                
                const deletedVideoIDs = props.property.videos
                    .filter(item => !savedVideosUrl.some(saved => saved.id === item.id))
                    .map(item => item.id);
                
                // 🚨 Appeler la Server Action d'édition dédiée
                result = await editPropertyAction(
                    String(props.property.id), // L'ID de la propriété à éditer
                    finalPayload,
                    deletedImageIDs,
                    deletedVideoIDs
                );

            } else {
                // Création : Appeler la Server Action de création
                result = await createPropertyAction(finalPayload);
            }

            setProgress(100);

            // 6. GESTION DU RÉSULTAT
            if (result.success) {
                toast.success(t(isEdit ? "propertyEdited" : "propertyAdded"));
                if (!isEdit) methods.reset();
                router.push("/user/properties");
                router.refresh();
            } else {
                // Gérer les erreurs de validation Zod retournées par le serveur
                if (result.errors) {
                    Object.entries(result.errors as Record<string, string[]>).forEach(([path, messages]: [string, string[]]) => { 
                        // Utiliser la fonction setValue ou setError de RHF
                        methods.setError(path as keyof PropertyFormInputType, {
                            type: "server",
                            message: messages[0] || t("validationError"),
                        });
                    });
                }
                toast.error(result.message || t("error"));
            }

        } catch (error) {
            console.error("Erreur générale dans onSubmit:", error);
            toast.error(t("error") || "An error occurred");
        } finally {
            setIsSubmitting(false);
            setProgress(0);
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
                        // Afficher une erreur générique en cas d'échec de validation client
                        toast.error(t("validationError"));
                        // Revenir à l'étape du premier champ en erreur (optionnel)
                        const firstErrorField = Object.keys(errors).find(key => errors[key as keyof PropertyFormInputType]);
                        if (firstErrorField) {
                            // Implémenter la logique pour changer `step` en fonction du champ
                            // Exemple : si l'erreur est dans 'location', setStep(1)
                            if (firstErrorField.startsWith("location")) setStep(1);
                            else if (firstErrorField.startsWith("feature")) setStep(2);
                            // ...
                        }
                    })}
                >
                    {/* ÉTAPE BASIC */}
                    <Basic
                        className={cn({ hidden: step !== 0 })}
                        next={() => methods.trigger(["typeId", "statusId", "price", "name", "description"]).then(isValid => isValid && setStep(1))}
                        types={props.types}
                        statuses={props.statuses}
                    />
                    {/* ÉTAPE LOCATION */}
                    <Location
                        next={() => methods.trigger(["location.countryId", "location.cityId", "location.streetAddress"]).then(isValid => isValid && setStep(2))}
                        prev={() => setStep((prev) => prev - 1)}
                        className={cn({ hidden: step !== 1 })}
                        countries={props.countries || []} 
                        cities={props.cities || []} 
                    />
                    {/* ÉTAPE FEATURES */}
                    <Features
                        next={() => methods.trigger("feature").then(isValid => isValid && setStep(3))}
                        prev={() => setStep((prev) => prev - 1)}
                        className={cn({ hidden: step !== 2 })}
                    />
                    {/* ÉTAPE PICTURE */}
                    <Picture
                        next={() => setStep((prev) => prev + 1)} // Aucune validation Zod majeure ici
                        prev={() => setStep((prev) => prev - 1)}
                        className={cn({ hidden: step !== 3 })}
                        images={images}
                        // Props pour l'édition de médias
                        {...(props.property && {
                            savedImagesUrl: savedImagesUrl,
                            setSavedImageUrl: setSavedImagesUrl,
                            savedVideosUrl: savedVideosUrl,
                            setSavedVideoUrl: setSavedVideosUrl,
                        })}
                        setImages={(newImages) => {
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
                        maxVideos={props.shortVideoLimit}
                        setVideos={(newVideos) => {
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
                    {/* ÉTAPE CONTACT */}
                    <Contact
                        prev={() => setStep((prev) => prev - 1)}
                        className={cn({ hidden: step !== 4 })}
                    />
                    
                    {/* BOUTON SUBMIT FINAL */}
                    {step === 4 && (
                        <div className="flex justify-end mt-6">
                            <Button
                                type="submit"
                                color="primary"
                                size="lg"
                                className="font-semibold px-10"
                                isLoading={isSubmitting}
                                isDisabled={isSubmitting}
                            >
                                {t(isEdit ? "saveChanges" : "submitButton")}
                            </Button>
                        </div>
                    )}
                    
                </form>
            </FormProvider>

            {/* Loading Progress Bar Percentage Overlay (inchangé) */}
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