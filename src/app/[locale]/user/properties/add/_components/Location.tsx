import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import {
  Button,
  Card,
  Input,
  Select,
  SelectItem,
  Textarea,
  cn,
} from "@nextui-org/react";
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { AddPropertyInputType } from "./AddPropertyForm";
import { AFRICAN_FRANCOPHONE_COUNTRIES } from "@/data/countries";
import { useTranslations } from "next-intl";

interface Props {
  next: () => void;
  prev: () => void;
  className?: string;
}

const Location = (props: Props) => {
  const t = useTranslations("PropertyForm.Location");
  const {
    register,
    formState: { errors },
    trigger,
    setValue,
    watch,
    control,
  } = useFormContext<AddPropertyInputType>();

  const selectedCountry = watch("location.state");

  const handleNext = async () => {
    if (
      await trigger([
        "location.city",
        "location.state",
      ])
    ) {
      props.next();
    }
  };

  return (
    <Card
      className={cn(
        "p-4 grid grid-cols-1 md:grid-cols-2 gap-4",
        props.className
      )}
    >
      <Input
        {...register("location.streetAddress")}
        label={t("address")}
        placeholder={t("address")}
        errorMessage={errors.location?.streetAddress?.message}
        isInvalid={!!errors.location?.streetAddress}
        className="col-span-1 md:col-span-2"
      />

      <Input
        {...register("location.zip")}
        label={t("zipCode")}
        placeholder={t("zipCode")}
        errorMessage={errors.location?.zip?.message}
        isInvalid={!!errors.location?.zip}
      />

      <Controller
        name="location.state"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            label={t("country")}
            placeholder={t("chooseCountry")}
            selectedKeys={field.value ? [field.value] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0];
              field.onChange(value ? value.toString() : "");
            }}
            errorMessage={errors.location?.state?.message}
            isInvalid={!!errors.location?.state}
          >
            {AFRICAN_FRANCOPHONE_COUNTRIES.map((country) => (
              <SelectItem key={country.name} value={country.name}>
                {country.name}
              </SelectItem>
            ))}
          </Select>
        )}
      />

      <Input
        {...register("location.city")}
        label={t("city")}
        placeholder={t("city")}
        errorMessage={errors.location?.city?.message}
        isInvalid={!!errors.location?.city}
      />

      <Input
        {...register("location.region")}
        label={t("region")}
        placeholder={t("region")}
        errorMessage={errors.location?.region?.message}
        isInvalid={!!errors.location?.region}
        className="col-span-1 md:col-span-2"
      />

      <Textarea
        {...register("location.landmark")}
        label={t("additionalInfo")}
        placeholder={t("additionalInfo")}
        errorMessage={errors.location?.landmark?.message}
        isInvalid={!!errors.location?.landmark}
        className="col-span-1 md:col-span-2"
      />

      <div className="flex flex-col md:flex-row justify-center col-span-1 md:col-span-2 gap-4 mt-4">
        <Button
          onClick={props.prev}
          startContent={<ChevronLeftIcon className="w-6" />}
          color="primary"
          className="w-full md:w-36"
        >
          {t("previous")}
        </Button>
        <Button
          onClick={handleNext}
          endContent={<ChevronRightIcon className="w-6" />}
          color="primary"
          className="w-full md:w-36"
        >
          {t("next")}
        </Button>
      </div>
    </Card>
  );
};

export default Location;
