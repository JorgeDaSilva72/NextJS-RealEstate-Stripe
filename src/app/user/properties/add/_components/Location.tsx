// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
// import { Button, Card, Input, Textarea, cn } from "@nextui-org/react";
// import React from "react";
// import { useFormContext } from "react-hook-form";
// import { AddPropertyInputType } from "./AddPropertyForm";

// interface Props {
//   next: () => void;
//   prev: () => void;
//   className?: string;
// }
// const Location = (props: Props) => {
//   const {
//     register,
//     formState: { errors },
//     trigger,
//     getValues,
//   } = useFormContext<AddPropertyInputType>();

//   const handleNext = async () => {
//     if (
//       await trigger([
//         "location.streetAddress",
//         "location.city",
//         "location.state",
//         "location.zip",
//         "location.region",
//       ])
//     )
//       props.next();
//   };
//   return (
//     <Card
//       className={cn(
//         "p-2  grid grid-cols-1 md:grid-cols-2 gap-3",
//         props.className
//       )}
//     >
//       <Input
//         {...register("location.streetAddress")}
//         errorMessage={errors.location?.streetAddress?.message}
//         isInvalid={!!errors.location?.streetAddress}
//         label="Adresse"
//         name="location.streetAddress"
//         defaultValue={getValues().location?.streetAddress}
//       />

//       <Input
//         {...register("location.zip")}
//         errorMessage={errors.location?.zip?.message}
//         isInvalid={!!errors.location?.zip}
//         label="Numéro de boîte postale"
//         defaultValue={getValues().location?.zip}
//       />

//       <Input
//         {...register("location.city")}
//         errorMessage={errors.location?.city?.message}
//         isInvalid={!!errors.location?.city}
//         label="Ville"
//         defaultValue={getValues().location?.city}
//       />

//       <Input
//         {...register("location.state")}
//         errorMessage={errors.location?.state?.message}
//         isInvalid={!!errors.location?.state}
//         label="Etat"
//         defaultValue={getValues().location?.state}
//       />

//       <Input
//         {...register("location.region")}
//         errorMessage={errors.location?.region?.message}
//         isInvalid={!!errors.location?.region}
//         label="Région"
//         className="col-span-2"
//         defaultValue={getValues().location?.region}
//       />

//       <Textarea
//         {...register("location.landmark")}
//         errorMessage={errors.location?.landmark?.message}
//         isInvalid={!!errors.location?.landmark}
//         label="Informations complémentaires"
//         className="col-span-2"
//         defaultValue={getValues().location?.landmark}
//       />
//       <div className="flex justify-center col-span-2 gap-3">
//         <Button
//           onClick={props.prev}
//           startContent={<ChevronLeftIcon className="w-6" />}
//           color="primary"
//           className="w-36"
//         >
//           Précédent
//         </Button>
//         <Button
//           onClick={handleNext}
//           endContent={<ChevronRightIcon className="w-6" />}
//           color="primary"
//           className="w-36"
//         >
//           Suivant
//         </Button>
//       </div>
//     </Card>
//   );
// };

// export default Location;

// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
// import {
//   Button,
//   Card,
//   Input,
//   Select,
//   SelectItem,
//   Textarea,
//   cn,
// } from "@nextui-org/react";
// import React from "react";
// import { useFormContext } from "react-hook-form";
// import { AddPropertyInputType } from "./AddPropertyForm";
// import { citiesOfMorocco } from "@/app/data/cities";
// import { countries } from "@/app/data/countries";

// interface Props {
//   next: () => void;
//   prev: () => void;
//   className?: string;
// }

// const Location = (props: Props) => {
//   const {
//     register,
//     formState: { errors },
//     trigger,
//     setValue,
//     getValues,
//   } = useFormContext<AddPropertyInputType>();

//   const handleNext = async () => {
//     if (
//       await trigger([
//         "location.streetAddress",
//         "location.city",
//         "location.state",
//         "location.zip",
//         "location.region",
//       ])
//     ) {
//       props.next();
//     }
//   };

//   return (
//     <>
//       <Card
//         className={cn(
//           "p-2 grid grid-cols-1 md:grid-cols-2 gap-3",
//           props.className
//         )}
//       >
//         <Input
//           {...register("location.streetAddress")}
//           errorMessage={errors.location?.streetAddress?.message}
//           isInvalid={!!errors.location?.streetAddress}
//           label="Adresse"
//           name="location.streetAddress"
//           defaultValue={getValues().location?.streetAddress}
//         />

//         <Input
//           {...register("location.zip")}
//           errorMessage={errors.location?.zip?.message}
//           isInvalid={!!errors.location?.zip}
//           label="Numéro de boîte postale"
//           defaultValue={getValues().location?.zip}
//         />

//         {/* <Input
//         {...register("location.city")}
//         errorMessage={errors.location?.city?.message}
//         isInvalid={!!errors.location?.city}
//         label="Ville"
//         defaultValue={getValues().location?.city}
//       /> */}

//         {/* Select pour le pays */}

//         <Select
//           {...register("location.state")}
//           errorMessage={errors.location?.state?.message}
//           isInvalid={!!errors.location?.state}
//           label="Pays"
//           placeholder="Choisissez un pays"
//           // Plus besoin de conversion toString() car les IDs sont déjà des strings
//           value={getValues().location?.state || ""}
//           onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
//             const selectedId = event.target.value;
//             const country = countries.find(
//               (country) => country.id === selectedId // Comparaison directe car les deux sont des strings
//             );
//             if (country) {
//               setValue("location.state", country.id);
//             }
//           }}
//         >
//           {countries.map((country) => (
//             <SelectItem key={country.id} value={country.id}>
//               {country.value}
//             </SelectItem>
//           ))}
//         </Select>

//         {/* Select pour la ville */}

//         <Select
//           {...register("location.city")}
//           errorMessage={errors.location?.city?.message}
//           isInvalid={!!errors.location?.city}
//           label="Ville"
//           placeholder="Choisissez une ville"
//           // Plus besoin de conversion toString() car les IDs sont déjà des strings
//           value={getValues().location?.city || ""}
//           onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
//             const selectedId = event.target.value;
//             const city = citiesOfMorocco.find(
//               (city) => city.id === selectedId // Comparaison directe car les deux sont des strings
//             );
//             if (city) {
//               setValue("location.city", city.id);
//             }
//           }}
//         >
//           {citiesOfMorocco.map((city) => (
//             <SelectItem key={city.id} value={city.id}>
//               {city.value}
//             </SelectItem>
//           ))}
//         </Select>

//         {/* <Select
//           {...register("location.city")}
//           errorMessage={errors.location?.city?.message}
//           isInvalid={!!errors.location?.city}
//           label="Ville"
//           placeholder="Choisissez une ville"
//           // On utilise maintenant la value stockée dans la base de données
//           value={getValues().location?.city || ""}
//           onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
//             const selectedValue = event.target.value;
//             const city = citiesOfMorocco.find(
//               (city) => city.value === selectedValue
//             );
//             if (city) {
//               setValue("location.city", city.value); // On stocke la value plutôt que l'id
//             }
//           }}
//         >
//           {citiesOfMorocco.map((city) => (
//             // On utilise maintenant city.value comme value du SelectItem
//             <SelectItem key={city.id} value={city.value}>
//               {city.value}
//             </SelectItem>
//           ))}
//         </Select> */}
//         {/* <Input
//           {...register("location.state")}
//           errorMessage={errors.location?.state?.message}
//           isInvalid={!!errors.location?.state}
//           label="Etat"
//           defaultValue={getValues().location?.state}
//         /> */}

//         <Input
//           {...register("location.region")}
//           errorMessage={errors.location?.region?.message}
//           isInvalid={!!errors.location?.region}
//           label="Région"
//           className="col-span-1 md:col-span-2"
//           defaultValue={getValues().location?.region}
//         />

//         <Textarea
//           {...register("location.landmark")}
//           errorMessage={errors.location?.landmark?.message}
//           isInvalid={!!errors.location?.landmark}
//           label="Informations complémentaires"
//           className="col-span-1 md:col-span-2"
//           defaultValue={getValues().location?.landmark}
//         />

//         <div className="flex flex-col md:flex-row justify-center col-span-1 md:col-span-2 gap-3 mt-4">
//           <Button
//             onClick={props.prev}
//             startContent={<ChevronLeftIcon className="w-6" />}
//             color="primary"
//             className="w-full md:w-36"
//           >
//             Précédent
//           </Button>
//           <Button
//             onClick={handleNext}
//             endContent={<ChevronRightIcon className="w-6" />}
//             color="primary"
//             className="w-full md:w-36"
//           >
//             Suivant
//           </Button>
//         </div>
//       </Card>
//     </>
//   );
// };

// export default Location;

//----------------------------------------
// Integration plan gratuit

// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
// import {
//   Button,
//   Card,
//   Input,
//   Select,
//   SelectItem,
//   Textarea,
//   cn,
//   useDisclosure,
// } from "@nextui-org/react";
// import React, { useState } from "react";
// import { useFormContext } from "react-hook-form";
// import { AddPropertyInputType } from "./AddPropertyForm";
// import { citiesOfMorocco } from "@/data/cities";
// import { countries, SUPPORTED_COUNTRIES } from "@/data/countries";
// import { CountrySelector } from "@/app/components/CountrySelector";
// // import { getUserSub, numberOfSubInCity } from "@/lib/actions/subscription";
// // import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
// // import { useRouter } from "next/navigation";
// // import { toast } from "react-toastify";
// // import SubModal from "./SubModal";

// interface Props {
//   next: () => void;
//   prev: () => void;
//   className?: string;
// }

// const message =
//   "Votre abonnement gratuit ne vous permet pas d'ajouter une nouvelle annonce dans cette ville. Mettez à niveau votre abonnement pour continuer.";

// const Location = (props: Props) => {
//   const {
//     register,
//     formState: { errors },
//     trigger,
//     setValue,
//     getValues,
//   } = useFormContext<AddPropertyInputType>();
//   // const { user } = useKindeBrowserClient();
//   // const router = useRouter();
//   // const { onOpen, isOpen } = useDisclosure();

//   const handleNext = async () => {
//     // if (!user) return router.push("/");
//     // const userPlan = await getUserSub(user.id);
//     // if (userPlan?.plan.namePlan.toLocaleLowerCase() == "gratuit") {
//     //   const city = getValues().location.city;
//     //   const nbrSubFreeInTheCity = await numberOfSubInCity({
//     //     planId: userPlan.palnId,
//     //     city,
//     //   });
//     //   if (nbrSubFreeInTheCity >= 3) {
//     //     onOpen();
//     //     return;
//     //   }
//     // }
//     if (
//       await trigger([
//         "location.streetAddress",
//         "location.city",
//         "location.state",
//         "location.zip",
//         "location.region",
//       ])
//     ) {
//       props.next();
//     }
//   };

//   // const handleCountryChange = (value: string) => {
//   //   setValue("location.state", value);
//   // };

//   const handleCountryChange = (code: string) => {
//     const countryName = SUPPORTED_COUNTRIES[code]?.name.fr || code;
//     setValue("location.state", countryName);
//   };

//   const getCurrentCountryCode = () => {
//     const currentName = getValues().location?.state;
//     return (
//       Object.entries(SUPPORTED_COUNTRIES).find(
//         ([_, country]) => country.name.fr === currentName
//       )?.[0] || ""
//     );
//   };

//   return (
//     <>
//       {/* <SubModal isOpen={isOpen} modalMessage={message} /> */}
//       <Card
//         className={cn(
//           "p-2 grid grid-cols-1 md:grid-cols-2 gap-3",
//           props.className
//         )}
//       >
//         <Input
//           {...register("location.streetAddress")}
//           errorMessage={errors.location?.streetAddress?.message}
//           isInvalid={!!errors.location?.streetAddress}
//           label="Adresse"
//           name="location.streetAddress"
//           defaultValue={getValues().location?.streetAddress}
//         />

//         <Input
//           {...register("location.zip")}
//           errorMessage={errors.location?.zip?.message}
//           isInvalid={!!errors.location?.zip}
//           label="Numéro de boîte postale"
//           defaultValue={getValues().location?.zip}
//         />

//         {/* <Input
//         {...register("location.city")}
//         errorMessage={errors.location?.city?.message}
//         isInvalid={!!errors.location?.city}
//         label="Ville"
//         defaultValue={getValues().location?.city}
//       /> */}

//         {/* Select pour le pays */}

//         {/* <Select
//           {...register("location.state")}
//           errorMessage={errors.location?.state?.message}
//           isInvalid={!!errors.location?.state}
//           label="Pays"
//           placeholder="Choisissez un pays"
//           // Plus besoin de conversion toString() car les IDs sont déjà des strings
//           value={getValues().location?.state || ""}
//           onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
//             const selectedId = event.target.value;
//             const country = countries.find(
//               (country) => country.id === selectedId // Comparaison directe car les deux sont des strings
//             );
//             if (country) {
//               setValue("location.state", country.id);
//             }
//           }}
//         >
//           {countries.map((country) => (
//             <SelectItem key={country.id} value={country.id}>
//               {country.value}
//             </SelectItem>
//           ))}
//         </Select> */}
//         <div className="col-span-1">
//           <CountrySelector
//             // currentCountry={getValues().location?.state || ""}
//             currentCountry={getCurrentCountryCode()}
//             lang="fr"
//             onSelectionChange={handleCountryChange}
//             isInvalid={!!errors.location?.state}
//             errorMessage={errors.location?.state?.message}
//             disableNavigation
//             label="Pays"
//             containerClassName="w-full"
//             selectClassName="w-full"
//           />
//         </div>

//         {/* Select pour la ville */}

//         <Select
//           {...register("location.city")}
//           errorMessage={errors.location?.city?.message}
//           isInvalid={!!errors.location?.city}
//           label="Ville"
//           placeholder="Choisissez une ville"
//           // Plus besoin de conversion toString() car les IDs sont déjà des strings
//           value={getValues().location?.city || ""}
//           onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
//             const selectedId = event.target.value;
//             const city = citiesOfMorocco.find(
//               (city) => city.id === selectedId // Comparaison directe car les deux sont des strings
//             );
//             if (city) {
//               setValue("location.city", city.id);
//             }
//           }}
//         >
//           {citiesOfMorocco.map((city) => (
//             <SelectItem key={city.id} value={city.id}>
//               {city.value}
//             </SelectItem>
//           ))}
//         </Select>

//         {/* <Select
//           {...register("location.city")}
//           errorMessage={errors.location?.city?.message}
//           isInvalid={!!errors.location?.city}
//           label="Ville"
//           placeholder="Choisissez une ville"
//           // On utilise maintenant la value stockée dans la base de données
//           value={getValues().location?.city || ""}
//           onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
//             const selectedValue = event.target.value;
//             const city = citiesOfMorocco.find(
//               (city) => city.value === selectedValue
//             );
//             if (city) {
//               setValue("location.city", city.value); // On stocke la value plutôt que l'id
//             }
//           }}
//         >
//           {citiesOfMorocco.map((city) => (
//             // On utilise maintenant city.value comme value du SelectItem
//             <SelectItem key={city.id} value={city.value}>
//               {city.value}
//             </SelectItem>
//           ))}
//         </Select> */}
//         {/* <Input
//           {...register("location.state")}
//           errorMessage={errors.location?.state?.message}
//           isInvalid={!!errors.location?.state}
//           label="Etat"
//           defaultValue={getValues().location?.state}
//         /> */}

//         <Input
//           {...register("location.region")}
//           errorMessage={errors.location?.region?.message}
//           isInvalid={!!errors.location?.region}
//           label="Région"
//           className="col-span-1 md:col-span-2"
//           defaultValue={getValues().location?.region}
//         />

//         <Textarea
//           {...register("location.landmark")}
//           errorMessage={errors.location?.landmark?.message}
//           isInvalid={!!errors.location?.landmark}
//           label="Informations complémentaires"
//           className="col-span-1 md:col-span-2"
//           defaultValue={getValues().location?.landmark}
//         />

//         <div className="flex flex-col md:flex-row justify-center col-span-1 md:col-span-2 gap-3 mt-4">
//           <Button
//             onClick={props.prev}
//             startContent={<ChevronLeftIcon className="w-6" />}
//             color="primary"
//             className="w-full md:w-36"
//           >
//             Précédent
//           </Button>
//           <Button
//             onClick={handleNext}
//             endContent={<ChevronRightIcon className="w-6" />}
//             color="primary"
//             className="w-full md:w-36"
//           >
//             Suivant
//           </Button>
//         </div>
//       </Card>
//     </>
//   );
// };

// export default Location;

// end--------------------------------

// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
// import {
//   Button,
//   Card,
//   Input,
//   Select,
//   SelectItem,
//   Textarea,
//   cn,
// } from "@nextui-org/react";
// import React, { useEffect } from "react";
// import { useFormContext } from "react-hook-form";
// import { AddPropertyInputType } from "./AddPropertyForm";
// import { CountrySelector } from "@/app/components/CountrySelector";
// import { SUPPORTED_COUNTRIES } from "@/data/countries";

// interface Props {
//   next: () => void;
//   prev: () => void;
//   className?: string;
// }

// const Location = (props: Props) => {
//   const {
//     register,
//     formState: { errors },
//     trigger,
//     setValue,
//     getValues,
//     watch,
//   } = useFormContext<AddPropertyInputType>();

//   const selectedCountry = watch("location.state");
//   const selectedCity = watch("location.city");

//   const handleNext = async () => {
//     if (
//       await trigger([
//         "location.streetAddress",
//         "location.city",
//         "location.state",
//         "location.zip",
//         "location.region",
//       ])
//     ) {
//       props.next();
//     }
//   };

//   const handleCountryChange = (code: string) => {
//     const countryName = SUPPORTED_COUNTRIES[code]?.name.fr || code;
//     setValue("location.state", countryName);
//     setValue("location.city", "");
//     setValue("location.region", "");
//   };

//   const getCurrentCountryCode = () => {
//     const currentName = getValues().location?.state;
//     return (
//       Object.entries(SUPPORTED_COUNTRIES).find(
//         ([_, country]) => country.name.fr === currentName
//       )?.[0] || ""
//     );
//   };

//   const getCurrentCities = () => {
//     const countryCode = getCurrentCountryCode();
//     return SUPPORTED_COUNTRIES[countryCode]?.cities || [];
//   };

//   const getRegionsForCity = () => {
//     const countryCode = getCurrentCountryCode();
//     const currentCity = getValues().location?.city;

//     if (!countryCode || !currentCity) return [];

//     const cityData = SUPPORTED_COUNTRIES[countryCode]?.cities.find(
//       (city) => city.name === currentCity
//     );

//     return cityData?.regions || [];
//   };

//   // Mise à jour automatique de la région si une seule est disponible
//   useEffect(() => {
//     if (selectedCity) {
//       const regions = getRegionsForCity();
//       if (regions.length === 1) {
//         setValue("location.region", regions[0]);
//       }
//     }
//   }, [selectedCity]);

//   // Handler pour le changement de ville
//   const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const cityName = event.target.value;
//     setValue("location.city", cityName);
//     setValue("location.region", ""); // Réinitialiser la région
//   };

//   return (
//     <Card
//       className={cn(
//         "p-2 grid grid-cols-1 md:grid-cols-2 gap-3",
//         props.className
//       )}
//     >
//       <Input
//         {...register("location.streetAddress")}
//         errorMessage={errors.location?.streetAddress?.message}
//         isInvalid={!!errors.location?.streetAddress}
//         label="Adresse"
//         name="location.streetAddress"
//         defaultValue={getValues().location?.streetAddress}
//       />

//       <Input
//         {...register("location.zip")}
//         errorMessage={errors.location?.zip?.message}
//         isInvalid={!!errors.location?.zip}
//         label="Numéro de boîte postale"
//         defaultValue={getValues().location?.zip}
//       />

//       <div className="col-span-1">
//         <CountrySelector
//           currentCountry={getCurrentCountryCode()}
//           lang="fr"
//           onSelectionChange={handleCountryChange}
//           isInvalid={!!errors.location?.state}
//           errorMessage={errors.location?.state?.message}
//           disableNavigation
//           label="Pays"
//           containerClassName="w-full"
//           selectClassName="w-full"
//         />
//       </div>

//       <Select
//         {...register("location.city")}
//         errorMessage={errors.location?.city?.message}
//         isInvalid={!!errors.location?.city}
//         label="Ville"
//         placeholder="Choisissez une ville"
//         value={getValues().location?.city || ""}
//         onChange={handleCityChange}
//       >
//         {getCurrentCities().map((city) => (
//           <SelectItem key={city.name} value={city.name}>
//             {city.name}
//           </SelectItem>
//         ))}
//       </Select>

//       {getRegionsForCity().length > 0 && (
//         <Select
//           {...register("location.region")}
//           errorMessage={errors.location?.region?.message}
//           isInvalid={!!errors.location?.region}
//           label="Région"
//           placeholder="Choisissez une région"
//           className="col-span-1 md:col-span-2"
//           value={getValues().location?.region || ""}
//           isDisabled={!getValues().location?.city}
//         >
//           {getRegionsForCity().map((region) => (
//             <SelectItem key={region} value={region}>
//               {region}
//             </SelectItem>
//           ))}
//         </Select>
//       )}

//       <Textarea
//         {...register("location.landmark")}
//         errorMessage={errors.location?.landmark?.message}
//         isInvalid={!!errors.location?.landmark}
//         label="Informations complémentaires"
//         className="col-span-1 md:col-span-2"
//         defaultValue={getValues().location?.landmark}
//       />

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
//           onClick={handleNext}
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

// export default Location;

// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
// import {
//   Button,
//   Card,
//   Input,
//   Select,
//   SelectItem,
//   Textarea,
//   cn,
// } from "@nextui-org/react";
// import React, { useEffect } from "react";
// import { useFormContext } from "react-hook-form";
// import { AddPropertyInputType } from "./AddPropertyForm";
// import { CountrySelector } from "@/app/components/CountrySelector";
// import { SUPPORTED_COUNTRIES } from "@/data/countries";

// interface Props {
//   next: () => void;
//   prev: () => void;
//   className?: string;
// }

// const Location = (props: Props) => {
//   const {
//     register,
//     formState: { errors },
//     trigger,
//     setValue,
//     getValues,
//     watch,
//   } = useFormContext<AddPropertyInputType>();

//   const selectedCountry = watch("location.state");
//   const selectedCity = watch("location.city");
//   const selectedRegion = watch("location.region");

//   // Log pour déboguer les valeurs initiales
//   useEffect(() => {
//     console.log("Initial values:", {
//       country: getValues().location?.state,
//       city: getValues().location?.city,
//       region: getValues().location?.region,
//     });
//   }, []);

//   // Effet pour s'assurer que les régions sont chargées quand la ville est définie
//   useEffect(() => {
//     if (selectedCity) {
//       const regions = getRegionsForCity();
//       console.log("Available regions for city:", regions);
//       console.log("Current selected region:", selectedRegion);
//     }
//   }, [selectedCity, selectedRegion]);

//   const handleNext = async () => {
//     if (
//       await trigger([
//         "location.streetAddress",
//         "location.city",
//         "location.state",
//         "location.zip",
//         "location.region",
//       ])
//     ) {
//       props.next();
//     }
//   };

//   const handleCountryChange = (code: string) => {
//     const countryName = SUPPORTED_COUNTRIES[code]?.name.fr || code;
//     setValue("location.state", countryName);
//     // Ne pas réinitialiser city et region en mode édition si les valeurs correspondent
//     const currentCity = getValues().location?.city;
//     if (
//       !SUPPORTED_COUNTRIES[code]?.cities.some(
//         (city) => city.name === currentCity
//       )
//     ) {
//       setValue("location.city", "");
//       setValue("location.region", "");
//     }
//   };

//   const getCurrentCountryCode = () => {
//     const currentName = getValues().location?.state;
//     return (
//       Object.entries(SUPPORTED_COUNTRIES).find(
//         ([_, country]) => country.name.fr === currentName
//       )?.[0] || ""
//     );
//   };

//   const getCurrentCities = () => {
//     const countryCode = getCurrentCountryCode();
//     return SUPPORTED_COUNTRIES[countryCode]?.cities || [];
//   };

//   const getRegionsForCity = () => {
//     const countryCode = getCurrentCountryCode();
//     const currentCity = getValues().location?.city;

//     if (!countryCode || !currentCity) return [];

//     const cityData = SUPPORTED_COUNTRIES[countryCode]?.cities.find(
//       (city) => city.name === currentCity
//     );

//     return cityData?.regions || [];
//   };

//   // Handler pour le changement de ville
//   const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const cityName = event.target.value;
//     setValue("location.city", cityName);

//     // Conserver la région si elle est valide pour la nouvelle ville
//     const regions =
//       SUPPORTED_COUNTRIES[getCurrentCountryCode()]?.cities.find(
//         (city) => city.name === cityName
//       )?.regions || [];

//     const currentRegion = getValues().location?.region;
//     if (!regions.includes(currentRegion)) {
//       setValue("location.region", "");
//     }
//   };

//   return (
//     <Card
//       className={cn(
//         "p-2 grid grid-cols-1 md:grid-cols-2 gap-3",
//         props.className
//       )}
//     >
//       <Input
//         {...register("location.streetAddress")}
//         errorMessage={errors.location?.streetAddress?.message}
//         isInvalid={!!errors.location?.streetAddress}
//         label="Adresse"
//         name="location.streetAddress"
//         defaultValue={getValues().location?.streetAddress}
//       />

//       <Input
//         {...register("location.zip")}
//         errorMessage={errors.location?.zip?.message}
//         isInvalid={!!errors.location?.zip}
//         label="Numéro de boîte postale"
//         defaultValue={getValues().location?.zip}
//       />

//       <div className="col-span-1">
//         <CountrySelector
//           currentCountry={getCurrentCountryCode()}
//           lang="fr"
//           onSelectionChange={handleCountryChange}
//           isInvalid={!!errors.location?.state}
//           errorMessage={errors.location?.state?.message}
//           disableNavigation
//           label="Pays"
//           containerClassName="w-full"
//           selectClassName="w-full"
//         />
//       </div>

//       <Select
//         {...register("location.city")}
//         errorMessage={errors.location?.city?.message}
//         isInvalid={!!errors.location?.city}
//         label="Ville"
//         placeholder="Choisissez une ville"
//         defaultSelectedKeys={selectedCity ? [selectedCity] : undefined}
//         onChange={handleCityChange}
//       >
//         {getCurrentCities().map((city) => (
//           <SelectItem key={city.name} value={city.name}>
//             {city.name}
//           </SelectItem>
//         ))}
//       </Select>

//       {getRegionsForCity().length > 0 && (
//         <Select
//           {...register("location.region")}
//           errorMessage={errors.location?.region?.message}
//           isInvalid={!!errors.location?.region}
//           label="Région"
//           placeholder="Choisissez une région"
//           className="col-span-1 md:col-span-2"
//           defaultSelectedKeys={selectedRegion ? [selectedRegion] : undefined}
//           isDisabled={!selectedCity}
//         >
//           {getRegionsForCity().map((region) => (
//             <SelectItem key={region} value={region}>
//               {region}
//             </SelectItem>
//           ))}
//         </Select>
//       )}

//       <Textarea
//         {...register("location.landmark")}
//         errorMessage={errors.location?.landmark?.message}
//         isInvalid={!!errors.location?.landmark}
//         label="Informations complémentaires"
//         className="col-span-1 md:col-span-2"
//         defaultValue={getValues().location?.landmark}
//       />

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
//           onClick={handleNext}
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

// export default Location;

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
import React, { useEffect, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { AddPropertyInputType } from "./AddPropertyForm";
import { CountrySelector } from "@/app/components/CountrySelector";
import { SUPPORTED_COUNTRIES } from "@/data/countries";

interface Props {
  next: () => void;
  prev: () => void;
  className?: string;
}

const Location = (props: Props) => {
  const {
    register,
    formState: { errors },
    trigger,
    setValue,
    getValues,
    watch,
  } = useFormContext<AddPropertyInputType>();

  const selectedCountry = watch("location.state");
  const selectedCity = watch("location.city");
  const selectedRegion = watch("location.region");

  // Optimisation de getCurrentCountryCode avec useCallback
  const getCurrentCountryCode = useCallback(() => {
    const currentName = getValues().location?.state;
    return (
      Object.entries(SUPPORTED_COUNTRIES).find(
        ([_, country]) => country.name.fr === currentName
      )?.[0] || ""
    );
  }, [getValues]);

  // Optimisation de getRegionsForCity avec useCallback
  const getRegionsForCity = useCallback(() => {
    const countryCode = getCurrentCountryCode();
    const currentCity = getValues().location?.city;

    if (!countryCode || !currentCity) return [];

    const cityData = SUPPORTED_COUNTRIES[countryCode]?.cities.find(
      (city) => city.name === currentCity
    );

    return cityData?.regions || [];
  }, [getCurrentCountryCode, getValues]);

  // Optimisation de getCurrentCities avec useCallback
  const getCurrentCities = useCallback(() => {
    const countryCode = getCurrentCountryCode();
    return SUPPORTED_COUNTRIES[countryCode]?.cities || [];
  }, [getCurrentCountryCode]);

  // Optimisation de handleCountryChange avec useCallback
  // Met à jour le pays dans le formulaire lorsque l'utilisateur change de pays.
  // Réinitialise la ville et la région si elles ne sont pas compatibles avec le nouveau pays sélectionné.
  const handleCountryChange = useCallback(
    (code: string) => {
      const countryName = SUPPORTED_COUNTRIES[code]?.name.fr || code;
      setValue("location.state", countryName);

      const currentCity = getValues().location?.city;
      if (
        !SUPPORTED_COUNTRIES[code]?.cities.some(
          (city) => city.name === currentCity
        )
      ) {
        setValue("location.city", "");
        setValue("location.region", "");
      }
    },
    [getValues, setValue]
  );

  // Met à jour la ville sélectionnée et vérifie si la région actuelle est toujours valide. Si non, elle la réinitialise.
  // Optimisation de handleCityChange avec useCallback
  const handleCityChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const cityName = event.target.value;
      setValue("location.city", cityName);

      const regions =
        SUPPORTED_COUNTRIES[getCurrentCountryCode()]?.cities.find(
          (city) => city.name === cityName
        )?.regions || [];

      const currentRegion = getValues().location?.region;
      if (!regions.includes(currentRegion)) {
        setValue("location.region", "");
      }
    },
    [getCurrentCountryCode, getValues, setValue]
  );

  const handleNext = async () => {
    if (
      await trigger([
        "location.streetAddress",
        "location.city",
        "location.state",
        "location.zip",
        "location.region",
      ])
    ) {
      props.next();
    }
  };

  // Optimisation de handleNext avec useCallback
  // const handleNext = useCallback(async () => {
  //   if (
  //     await trigger([
  //       "location.streetAddress",
  //       "location.city",
  //       "location.state",
  //       "location.zip",
  //       "location.region",
  //     ])
  //   ) {
  //     props.next();
  //   }
  // }, [trigger, props.next]);

  // useEffect pour les valeurs initiales
  // useEffect(() => {
  //   console.log("Initial values:", {
  //     country: getValues().location?.state,
  //     city: getValues().location?.city,
  //     region: getValues().location?.region,
  //   });
  // }, [getValues]);

  // useEffect pour le chargement des régions
  useEffect(() => {
    if (selectedCity) {
      const regions = getRegionsForCity();
      // console.log("Available regions for city:", regions);
      // console.log("Current selected region:", selectedRegion);
    }
  }, [selectedCity, selectedRegion, getRegionsForCity]);

  return (
    <Card
      className={cn(
        "p-2 grid grid-cols-1 md:grid-cols-2 gap-3",
        props.className
      )}
    >
      <Input
        {...register("location.streetAddress")}
        errorMessage={errors.location?.streetAddress?.message}
        isInvalid={!!errors.location?.streetAddress}
        label="Adresse"
        name="location.streetAddress"
        defaultValue={getValues().location?.streetAddress}
      />

      <Input
        {...register("location.zip")}
        errorMessage={errors.location?.zip?.message}
        isInvalid={!!errors.location?.zip}
        label="Numéro de boîte postale"
        defaultValue={getValues().location?.zip}
      />

      <div className="col-span-1">
        <CountrySelector
          currentCountry={getCurrentCountryCode()}
          lang="fr"
          onSelectionChange={handleCountryChange}
          isInvalid={!!errors.location?.state}
          errorMessage={errors.location?.state?.message}
          disableNavigation
          label="Pays"
          containerClassName="w-full"
          selectClassName="w-full"
        />
      </div>

      <Select
        {...register("location.city")}
        errorMessage={errors.location?.city?.message}
        isInvalid={!!errors.location?.city}
        label="Ville"
        placeholder="Choisissez une ville"
        defaultSelectedKeys={selectedCity ? [selectedCity] : undefined}
        onChange={handleCityChange}
      >
        {getCurrentCities().map((city) => (
          <SelectItem key={city.name} value={city.name}>
            {city.name}
          </SelectItem>
        ))}
      </Select>

      {getRegionsForCity().length > 0 && (
        <Select
          {...register("location.region")}
          errorMessage={errors.location?.region?.message}
          isInvalid={!!errors.location?.region}
          label="Région"
          placeholder="Choisissez une région"
          className="col-span-1 md:col-span-2"
          defaultSelectedKeys={selectedRegion ? [selectedRegion] : undefined}
          isDisabled={!selectedCity}
        >
          {getRegionsForCity().map((region) => (
            <SelectItem key={region} value={region}>
              {region}
            </SelectItem>
          ))}
        </Select>
      )}

      <Textarea
        {...register("location.landmark")}
        errorMessage={errors.location?.landmark?.message}
        isInvalid={!!errors.location?.landmark}
        label="Informations complémentaires"
        className="col-span-1 md:col-span-2"
        defaultValue={getValues().location?.landmark}
      />

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
          onClick={handleNext}
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

export default Location;
