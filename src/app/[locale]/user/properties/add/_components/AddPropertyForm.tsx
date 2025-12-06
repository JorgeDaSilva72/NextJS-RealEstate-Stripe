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
import { Progress } from "@nextui-org/react";

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
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useKindeBrowserClient();

  const onSubmit: SubmitHandler<AddPropertyInputType> = async (data) => {
    try {
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
