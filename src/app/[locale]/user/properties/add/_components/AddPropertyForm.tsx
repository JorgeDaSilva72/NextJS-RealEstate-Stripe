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

"use client";

import React, { useState } from "react";
import Stepper from "./Stepper";
import Basic from "./basic";
import Location from "./Location";
import Features from "./Features";
import Picture from "./Picture";
import Contact from "./Contact";
import { useTranslations } from "next-intl";

import {
  Prisma,
  PropertyImage,
  PropertyStatus,
  PropertyType,
  PropertyVideo,
  SubscriptionPlan,
} from "@prisma/client";
import { cn } from "@nextui-org/react";
import { z } from "zod";
// import { AddPropertyFormSchema } from "@/lib/zodSchema";
import { getAddPropertyFormSchema } from "@/lib/zodSchema";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { removeImages, uploadImages, uploadImagesToWebp } from "@/lib/upload";
import { editProperty, saveProperty } from "@/lib/actions/property";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import fileToBase64 from "@/lib/fileToBase64";
import { translateField } from "@/lib/translation-helper";

interface Props {
  types: PropertyType[];
  statuses: PropertyStatus[];
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

// export type AddPropertyInputType = z.infer<typeof AddPropertyFormSchema>;
export type AddPropertyInputType = z.infer<
  ReturnType<typeof getAddPropertyFormSchema>
>;
const AddPropertyForm = ({ isEdit = false, ...props }: Props) => {
  const t = useTranslations("AddPropertyForm");
  const router = useRouter();

  const steps = [
    { label: t("steps.basic") },
    { label: t("steps.location") },
    { label: t("steps.features") },
    { label: t("steps.photos") },
    { label: t("steps.contact") },
  ];

  const methods = useForm<AddPropertyInputType>({
    resolver: zodResolver(getAddPropertyFormSchema(t)),
    defaultValues: {
      contact: props.property?.contact ?? undefined,
      location: props.property?.location ?? undefined,
      description: props.property?.description ?? undefined,
      name: props.property?.name ?? undefined,
      price: props.property?.price ?? undefined,
      statusId: props.property?.statusId ?? undefined,
      typeId: props.property?.typeId ?? undefined,
      propertyFeature: {
        bedrooms: props.property?.feature?.bedrooms ?? 0,
        bathrooms: props.property?.feature?.bathrooms ?? 0,
        parkingSpots: props.property?.feature?.parkingSpots ?? 0,
        area: props.property?.feature?.area ?? 0,
        hasSwimmingPool: props.property?.feature?.hasSwimmingPool ?? false,
        hasGardenYard: props.property?.feature?.hasGardenYard ?? false,
        hasBalcony: props.property?.feature?.hasBalcony ?? false,
      },
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
  const [isTranslating, setIsTranslating] = useState(false);

  const { user } = useKindeBrowserClient();

  const onSubmit: SubmitHandler<AddPropertyInputType> = async (data) => {
    try {
      setIsTranslating(true);

      // Translate name and description from French to English, Arabic, and Portuguese
      const nameFR = data.name || "";
      const descriptionFR = data.description || "";

      // Translate to all target languages in parallel
      const [nameEN, nameAR, namePT, descriptionEN, descriptionAR, descriptionPT] = await Promise.all([
        translateField(nameFR, "en"),
        translateField(nameFR, "ar"),
        translateField(nameFR, "pt"),
        translateField(descriptionFR, "en"),
        translateField(descriptionFR, "ar"),
        translateField(descriptionFR, "pt"),
      ]);

      // Prepare multilingual data with 4 languages
      const multilingualData = {
        ...data,
        name: { fr: nameFR, en: nameEN, ar: nameAR, pt: namePT },
        description: { fr: descriptionFR, en: descriptionEN, ar: descriptionAR, pt: descriptionPT },
      };

      setIsTranslating(false);

      const imageUrls = await Promise.all(
        images.map(async (img) => {
          const base64 = await fileToBase64(img);
          const url = await uploadImagesToWebp(
            base64,
            img.name,
            "propertyImages"
          );
          return url;
        })
      );

      if (isEdit && props.property) {
        const deletedImages = props.property?.images.filter(
          (item) => !savedImagesUrl.includes(item)
        );

        const deletedImageIDs = deletedImages.map((item) => item.id);
        const deletedImageURLs = deletedImages
          .map((item) => item.url.split("/").at(-1))
          .filter((item) => item !== undefined);
        await removeImages(deletedImageURLs, "propertyImages");

        const deletedVideosIDs = props.property?.videos
          .filter(
            (item) => !savedVideosUrl.some((saved) => saved.id === item.id)
          )
          .map((item) => item.id);

        await editProperty(
          props.property?.id,
          multilingualData as any,
          imageUrls,
          deletedImageIDs,
          videos,
          deletedVideosIDs
        );

        toast.success(t("propertyEdited"));
      } else {
        await saveProperty(multilingualData as any, imageUrls, videos, user?.id!);
        toast.success(t("propertyAdded"));
      }
    } catch (error) {
      console.error({ error });
      toast.error(t("error") || "An error occurred");
    } finally {
      setIsTranslating(false);
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
          <Basic
            className={cn({ hidden: step !== 0 })}
            next={() => setStep((prev) => prev + 1)}
            types={props.types}
            statuses={props.statuses}
          />
          <Location
            next={() => setStep((prev) => prev + 1)}
            prev={() => setStep((prev) => prev - 1)}
            className={cn({ hidden: step !== 1 })}
          />
          <Features
            next={() => setStep((prev) => prev + 1)}
            prev={() => setStep((prev) => prev - 1)}
            className={cn({ hidden: step !== 2 })}
          />
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
              if (
                newImages.length > (props.planDetails?.photosPerAd || Infinity)
              ) {
                toast.error(
                  t("photoLimitExceeded", {
                    limit: props.planDetails?.photosPerAd || t("unlimited"),
                  })
                );
                return;
              }
              setImages(newImages);
            }}
            maxImages={props.planDetails?.photosPerAd || Infinity}
            isPremium={
              props.planDetails?.namePlan?.toLowerCase() === "diamant" || false
            }
            maxVideos={props.planDetails?.shortVideosPerAd || 0}
            setVideos={(newVideos) => {
              if (
                newVideos.length > (props.planDetails?.shortVideosPerAd || 0)
              ) {
                toast.error(
                  t("videoLimitExceeded", {
                    limit: props.planDetails?.shortVideosPerAd || "0",
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
    </div>
  );
};

export default AddPropertyForm;
