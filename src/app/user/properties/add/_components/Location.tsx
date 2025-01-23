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
// import React, { useEffect, useCallback } from "react";
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

//   // Optimisation de getCurrentCountryCode avec useCallback
//   const getCurrentCountryCode = useCallback(() => {
//     const currentName = getValues().location?.state;
//     return (
//       Object.entries(SUPPORTED_COUNTRIES).find(
//         ([_, country]) => country.name.fr === currentName
//       )?.[0] || ""
//     );
//   }, [getValues]);

//   // Optimisation de getRegionsForCity avec useCallback
//   const getRegionsForCity = useCallback(() => {
//     const countryCode = getCurrentCountryCode();
//     const currentCity = getValues().location?.city;

//     if (!countryCode || !currentCity) return [];

//     const cityData = SUPPORTED_COUNTRIES[countryCode]?.cities.find(
//       (city) => city.name === currentCity
//     );

//     return cityData?.regions || [];
//   }, [getCurrentCountryCode, getValues]);

//   // Optimisation de getCurrentCities avec useCallback
//   const getCurrentCities = useCallback(() => {
//     const countryCode = getCurrentCountryCode();
//     return SUPPORTED_COUNTRIES[countryCode]?.cities || [];
//   }, [getCurrentCountryCode]);

//   // Optimisation de handleCountryChange avec useCallback
//   // Met à jour le pays dans le formulaire lorsque l'utilisateur change de pays.
//   // Réinitialise la ville et la région si elles ne sont pas compatibles avec le nouveau pays sélectionné.
//   const handleCountryChange = useCallback(
//     (code: string) => {
//       const countryName = SUPPORTED_COUNTRIES[code]?.name.fr || code;
//       setValue("location.state", countryName);

//       const currentCity = getValues().location?.city;
//       if (
//         !SUPPORTED_COUNTRIES[code]?.cities.some(
//           (city) => city.name === currentCity
//         )
//       ) {
//         setValue("location.city", "");
//         setValue("location.region", "");
//       }
//     },
//     [getValues, setValue]
//   );

//   // Met à jour la ville sélectionnée et vérifie si la région actuelle est toujours valide. Si non, elle la réinitialise.
//   // Optimisation de handleCityChange avec useCallback
//   const handleCityChange = useCallback(
//     (event: React.ChangeEvent<HTMLSelectElement>) => {
//       const cityName = event.target.value;
//       setValue("location.city", cityName);

//       const regions =
//         SUPPORTED_COUNTRIES[getCurrentCountryCode()]?.cities.find(
//           (city) => city.name === cityName
//         )?.regions || [];

//       const currentRegion = getValues().location?.region;
//       if (!regions.includes(currentRegion)) {
//         setValue("location.region", "");
//       }
//     },
//     [getCurrentCountryCode, getValues, setValue]
//   );

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

//   // Optimisation de handleNext avec useCallback
//   // const handleNext = useCallback(async () => {
//   //   if (
//   //     await trigger([
//   //       "location.streetAddress",
//   //       "location.city",
//   //       "location.state",
//   //       "location.zip",
//   //       "location.region",
//   //     ])
//   //   ) {
//   //     props.next();
//   //   }
//   // }, [trigger, props.next]);

//   // useEffect pour les valeurs initiales
//   // useEffect(() => {
//   //   console.log("Initial values:", {
//   //     country: getValues().location?.state,
//   //     city: getValues().location?.city,
//   //     region: getValues().location?.region,
//   //   });
//   // }, [getValues]);

//   // useEffect pour le chargement des régions
//   useEffect(() => {
//     if (selectedCity) {
//       const regions = getRegionsForCity();
//       // console.log("Available regions for city:", regions);
//       // console.log("Current selected region:", selectedRegion);
//     }
//   }, [selectedCity, selectedRegion, getRegionsForCity]);

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

// avec chatgpt

// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
// import { Button, Card, Input, Textarea, cn } from "@nextui-org/react";
// import React, { useEffect, useRef } from "react";
// import { useFormContext } from "react-hook-form";
// import { AddPropertyInputType } from "./AddPropertyForm";
// import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

// interface Props {
//   next: () => void;
//   prev: () => void;
//   className?: string;
// }

// const mapContainerStyle = {
//   width: "100%",
//   height: "400px",
// };

// const Location = (props: Props) => {
//   const {
//     register,
//     formState: { errors },
//     trigger,
//     setValue,
//     getValues,
//     watch,
//   } = useFormContext<AddPropertyInputType>();

//   const mapRef = useRef<google.maps.Map | null>(null);
//   const markerRef = useRef<google.maps.Marker | null>(null);

//   const defaultCenter = { lat: 34.0522, lng: -118.2437 }; // Default location (Los Angeles)
//   const selectedLat = watch("location.lat") || defaultCenter.lat;
//   const selectedLng = watch("location.lng") || defaultCenter.lng;

//   const handleMapClick = (event: google.maps.MapMouseEvent) => {
//     if (event.latLng) {
//       const { lat, lng } = event.latLng.toJSON();
//       setValue("location.lat", lat);
//       setValue("location.lng", lng);

//       if (markerRef.current) {
//         markerRef.current.setPosition({ lat, lng });
//       }
//     }
//   };

//   const handleNext = async () => {
//     if (
//       await trigger([
//         "location.streetAddress",
//         "location.city",
//         "location.state",
//         "location.zip",
//         "location.lat",
//         "location.lng",
//       ])
//     ) {
//       props.next();
//     }
//   };

//   return (
//     <LoadScript googleMapsApiKey="AIzaSyAuKKuhEvtLm4PoaN0tnuelSBs6eRTKxdk">
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

//         <Input
//           {...register("location.city")}
//           errorMessage={errors.location?.city?.message}
//           isInvalid={!!errors.location?.city}
//           label="Ville"
//           defaultValue={getValues().location?.city}
//         />

//         <Input
//           {...register("location.state")}
//           errorMessage={errors.location?.state?.message}
//           isInvalid={!!errors.location?.state}
//           label="Pays"
//           defaultValue={getValues().location?.state}
//         />

//         <GoogleMap
//           mapContainerStyle={mapContainerStyle}
//           center={{ lat: selectedLat, lng: selectedLng }}
//           zoom={10}
//           onClick={handleMapClick}
//           onLoad={(map) => (mapRef.current = map)}
//         >
//           <Marker
//             position={{ lat: selectedLat, lng: selectedLng }}
//             onLoad={(marker) => (markerRef.current = marker)}
//           />
//         </GoogleMap>

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
//     </LoadScript>
//   );
// };

// export default Location;

// import React, { useEffect, useRef, useState } from "react";
// import { useFormContext } from "react-hook-form";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// // Codes des pays d'Afrique pour Google Places
// const AFRICAN_COUNTRIES = [
//   "DZ",
//   "AO",
//   "BJ",
//   "BW",
//   "BF",
//   "BI",
//   "CM",
//   "CV",
//   "CF",
//   "TD",
//   "KM",
//   "CG",
//   "CD",
//   "DJ",
//   "EG",
//   "GQ",
//   "ER",
//   "ET",
//   "GA",
//   "GM",
//   "GH",
//   "GN",
//   "GW",
//   "CI",
//   "KE",
//   "LS",
//   "LR",
//   "LY",
//   "MG",
//   "MW",
//   "ML",
//   "MR",
//   "MU",
//   "MA",
//   "MZ",
//   "NA",
//   "NE",
//   "NG",
//   "RW",
//   "ST",
//   "SN",
//   "SC",
//   "SL",
//   "SO",
//   "ZA",
//   "SS",
//   "SD",
//   "SZ",
//   "TZ",
//   "TG",
//   "TN",
//   "UG",
//   "ZM",
//   "ZW",
// ].join(",");

// // Définition des types
// interface LocationFormData {
//   location: {
//     streetAddress: string;
//     city: string;
//     state: string;
//     zip: string;
//     landmark?: string;
//     lat?: number;
//     lng?: number;
//   };
// }

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
//   } = useFormContext<LocationFormData>();

//   const addressInputRef = useRef<HTMLInputElement>(null);
//   const [addressAutocomplete, setAddressAutocomplete] =
//     useState<google.maps.places.Autocomplete | null>(null);

//   useEffect(() => {
//     if (!addressInputRef.current || addressAutocomplete) return;

//     const autocomplete = new google.maps.places.Autocomplete(
//       addressInputRef.current,
//       {
//         fields: ["address_components", "formatted_address", "geometry"],
//         types: ["address"],
//       }
//     );

//     autocomplete.addListener("place_changed", () => {
//       const place = autocomplete.getPlace();

//       if (!place.address_components) return;

//       // Réinitialiser les valeurs
//       setValue("location.streetAddress", "");
//       setValue("location.city", "");
//       setValue("location.state", "");
//       setValue("location.zip", "");

//       // Extraire les composants de l'adresse
//       place.address_components.forEach((component) => {
//         const types = component.types;

//         if (types.includes("street_number") || types.includes("route")) {
//           setValue(
//             "location.streetAddress",
//             `${getValues().location?.streetAddress || ""} ${
//               component.long_name
//             }`.trim()
//           );
//         }

//         if (types.includes("locality") || types.includes("sublocality")) {
//           setValue("location.city", component.long_name);
//         }

//         if (types.includes("country")) {
//           setValue("location.state", component.long_name);
//         }

//         if (types.includes("postal_code")) {
//           setValue("location.zip", component.long_name);
//         }
//       });

//       // Sauvegarder les coordonnées
//       if (place.geometry?.location) {
//         setValue("location.lat", place.geometry.location.lat());
//         setValue("location.lng", place.geometry.location.lng());
//       }
//     });

//     setAddressAutocomplete(autocomplete);

//     return () => {
//       google.maps.event.clearInstanceListeners(autocomplete);
//     };
//   }, [setValue, getValues]);

//   const handleNext = async () => {
//     const isValid = await trigger([
//       "location.streetAddress",
//       "location.city",
//       "location.state",
//       "location.zip",
//     ]);
//     if (isValid) {
//       props.next();
//     }
//   };

//   // Helper pour accéder aux messages d'erreur
//   const getErrorMessage = (fieldName: keyof LocationFormData["location"]) => {
//     return errors.location?.[fieldName]?.message;
//   };

//   return (
//     <div className="w-full space-y-4 p-6 bg-white rounded-lg shadow">
//       {/* Champ d'autocomplétion d'adresse */}
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-gray-700">
//           Rechercher une adresse
//         </label>
//         <input
//           ref={addressInputRef}
//           type="text"
//           className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           placeholder="Commencez à taper une adresse..."
//         />
//       </div>

//       {/* Adresse */}
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-gray-700">
//           Adresse
//         </label>
//         <input
//           {...register("location.streetAddress")}
//           className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           placeholder="Adresse"
//         />
//         {getErrorMessage("streetAddress") && (
//           <p className="text-red-500 text-sm">
//             {getErrorMessage("streetAddress")}
//           </p>
//         )}
//       </div>

//       {/* Ville */}
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-gray-700">Ville</label>
//         <input
//           {...register("location.city")}
//           className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           placeholder="Ville"
//         />
//         {getErrorMessage("city") && (
//           <p className="text-red-500 text-sm">{getErrorMessage("city")}</p>
//         )}
//       </div>

//       {/* Code Postal */}
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-gray-700">
//           Code postal
//         </label>
//         <input
//           {...register("location.zip")}
//           className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           placeholder="Code postal"
//         />
//         {getErrorMessage("zip") && (
//           <p className="text-red-500 text-sm">{getErrorMessage("zip")}</p>
//         )}
//       </div>

//       {/* Pays */}
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-gray-700">Pays</label>
//         <input
//           {...register("location.state")}
//           className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           placeholder="Pays"
//         />
//         {getErrorMessage("state") && (
//           <p className="text-red-500 text-sm">{getErrorMessage("state")}</p>
//         )}
//       </div>

//       {/* Informations complémentaires */}
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-gray-700">
//           Informations complémentaires
//         </label>
//         <textarea
//           {...register("location.landmark")}
//           className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           rows={3}
//           placeholder="Points de repère, instructions spéciales..."
//         />
//       </div>

//       {/* Boutons de navigation */}
//       <div className="flex justify-between pt-4">
//         <button
//           onClick={props.prev}
//           className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <ChevronLeft className="w-4 h-4 mr-2" />
//           Précédent
//         </button>
//         <button
//           onClick={handleNext}
//           className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           Suivant
//           <ChevronRight className="w-4 h-4 ml-2" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Location;

// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
// import { Button, Card, Input, Textarea, cn } from "@nextui-org/react";
// import React, { useEffect, useState, useRef } from "react";
// import { useFormContext } from "react-hook-form";
// import { AddPropertyInputType } from "./AddPropertyForm";
// import { useLoadScript } from "@react-google-maps/api";
// import { AFRICAN_COUNTRIES_SUPPORTED_FOR_GOOGLE_MAPS } from "@/data/countries";

// interface Props {
//   next: () => void;
//   prev: () => void;
//   className?: string;
// }

// const libraries = ["places"];

// const Location = (props: Props) => {
//   const {
//     register,
//     formState: { errors },
//     trigger,
//     setValue,
//     watch,
//   } = useFormContext<AddPropertyInputType>();

//   const searchInputRef = useRef<HTMLInputElement>(null);
//   const [searchValue, setSearchValue] = useState("");

//   // Watch form values for updates
//   const streetAddress = watch("location.streetAddress");
//   const city = watch("location.city");
//   const state = watch("location.state");
//   const region = watch("location.region");
//   const zip = watch("location.zip");

//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
//     libraries: libraries as any,
//   });

//   const updateFormValues = (place: google.maps.places.PlaceResult) => {
//     let streetNumber = "";
//     let route = "";
//     let cityName = "";
//     let stateName = "";
//     let countryName = "";
//     let postalCode = "";

//     if (place.address_components) {
//       for (const component of place.address_components) {
//         const types = component.types;

//         if (types.includes("street_number")) {
//           streetNumber = component.long_name;
//         } else if (types.includes("route")) {
//           route = component.long_name;
//         } else if (types.includes("locality")) {
//           cityName = component.long_name;
//         } else if (types.includes("administrative_area_level_1")) {
//           stateName = component.long_name;
//         } else if (types.includes("country")) {
//           countryName = component.long_name;
//         } else if (types.includes("postal_code")) {
//           postalCode = component.long_name;
//         }
//       }
//     }

//     // Mise à jour synchrone des valeurs du formulaire
//     setValue("location.streetAddress", `${streetNumber} ${route}`.trim(), {
//       shouldValidate: true,
//       shouldDirty: true,
//     });
//     setValue("location.city", cityName, {
//       shouldValidate: true,
//       shouldDirty: true,
//     });
//     setValue("location.state", countryName, {
//       shouldValidate: true,
//       shouldDirty: true,
//     });
//     setValue("location.region", stateName, {
//       shouldValidate: true,
//       shouldDirty: true,
//     });
//     setValue("location.zip", postalCode, {
//       shouldValidate: true,
//       shouldDirty: true,
//     });

//     // if (place.geometry?.location) {
//     //   setValue("location.coordinates.lat", place.geometry.location.lat(), { shouldValidate: true, shouldDirty: true });
//     //   setValue("location.coordinates.lng", place.geometry.location.lng(), { shouldValidate: true, shouldDirty: true });
//     // }

//     // Mettre à jour la valeur de recherche avec l'adresse formatée
//     setSearchValue(place.formatted_address || "");
//   };

//   useEffect(() => {
//     if (!isLoaded || !searchInputRef.current) return;

//     const autocomplete = new google.maps.places.Autocomplete(
//       searchInputRef.current,
//       {
//         componentRestrictions: {
//           country: AFRICAN_COUNTRIES_SUPPORTED_FOR_GOOGLE_MAPS,
//         },
//         fields: ["address_components", "formatted_address", "geometry"],
//       }
//     );

//     autocomplete.addListener("place_changed", () => {
//       const place = autocomplete.getPlace();

//       if (!place.geometry) {
//         console.error("Aucun détail disponible pour cette adresse");
//         return;
//       }

//       updateFormValues(place);
//     });

//     return () => {
//       // Cleanup if needed
//       google.maps.event.clearInstanceListeners(autocomplete);
//     };
//   }, [isLoaded]);

//   const handleNext = async () => {
//     if (
//       await trigger([
//         "location.streetAddress",
//         "location.city",
//         "location.state",
//         // "location.zip",
//         // "location.region",
//       ])
//     ) {
//       props.next();
//     }
//   };

//   if (loadError) {
//     return <div>Erreur de chargement de Google Maps</div>;
//   }

//   return (
//     <Card
//       className={cn(
//         "p-2 grid grid-cols-1 md:grid-cols-2 gap-3",
//         props.className
//       )}
//     >
//       <div className="col-span-1 md:col-span-2">
//         <Input
//           ref={searchInputRef}
//           label="Rechercher une adresse"
//           placeholder="Entrez une adresse du Maroc"
//           value={searchValue}
//           onChange={(e) => setSearchValue(e.target.value)}
//           className="w-full"
//         />
//       </div>

//       <Input
//         value={streetAddress || ""}
//         label="Adresse"
//         isReadOnly
//         errorMessage={errors.location?.streetAddress?.message}
//         isInvalid={!!errors.location?.streetAddress}
//       />

//       <Input
//         value={zip || ""}
//         label="Code postal"
//         isReadOnly
//         errorMessage={errors.location?.zip?.message}
//         isInvalid={!!errors.location?.zip}
//       />

//       <Input
//         value={city || ""}
//         label="Ville"
//         isReadOnly
//         errorMessage={errors.location?.city?.message}
//         isInvalid={!!errors.location?.city}
//       />

//       <Input
//         value={state || ""}
//         label="Pays"
//         isReadOnly
//         errorMessage={errors.location?.state?.message}
//         isInvalid={!!errors.location?.state}
//       />

//       <Input
//         value={region || ""}
//         label="Région"
//         isReadOnly
//         className="col-span-1 md:col-span-2"
//         errorMessage={errors.location?.region?.message}
//         isInvalid={!!errors.location?.region}
//       />

//       <Textarea
//         {...register("location.landmark")}
//         label="Informations complémentaires"
//         className="col-span-1 md:col-span-2"
//         errorMessage={errors.location?.landmark?.message}
//         isInvalid={!!errors.location?.landmark}
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
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  RefObject,
  ChangeEvent,
} from "react";
import { useFormContext } from "react-hook-form";
import { AddPropertyInputType } from "./AddPropertyForm";
import { useLoadScript } from "@react-google-maps/api";
import { AFRICAN_FRANCOPHONE_COUNTRIES } from "@/data/countries";

interface Props {
  next: () => void;
  prev: () => void;
  className?: string;
}

interface LocationField {
  name: keyof AddPropertyInputType["location"];
  label: string;
  span?: number;
  isTextArea?: boolean;
  readonly?: boolean;
}

interface InputProps {
  ref: RefObject<HTMLInputElement>;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className: string;
  errorMessage?: string;
  isInvalid?: boolean;
  isLoading?: boolean;
}

const LocationInput: React.FC<{
  field: LocationField;
  value: string;
  error?: string;
}> = ({ field, value, error }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<AddPropertyInputType>();

  const Component = field.isTextArea ? Textarea : Input;

  if (field.name === "landmark") {
    return (
      <Component
        {...register("location.landmark")}
        label={field.label}
        className={cn(
          field.span === 2 ? "col-span-1 md:col-span-2" : "",
          field.isTextArea ? "min-h-[100px]" : ""
        )}
        errorMessage={error}
        isInvalid={!!error}
      />
    );
  }

  return (
    <Component
      value={value || ""}
      label={field.label}
      isReadOnly={true}
      className={cn(
        field.span === 2 ? "col-span-1 md:col-span-2" : "",
        field.isTextArea ? "min-h-[100px]" : ""
      )}
      errorMessage={error}
      isInvalid={!!error}
    />
  );
};

const Location = (props: Props) => {
  const {
    register,
    formState: { errors },
    trigger,
    setValue,
    watch,
  } = useFormContext<AddPropertyInputType>();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Configuration des champs de localisation
  const locationFields: LocationField[] = useMemo(
    () => [
      { name: "streetAddress", label: "Adresse" },
      { name: "zip", label: "Code postal" },
      { name: "city", label: "Ville" },
      { name: "state", label: "Pays" },
      { name: "region", label: "Région", span: 2 },
      {
        name: "landmark",
        label: "Informations complémentaires",
        span: 2,
        isTextArea: true,
      },
    ],
    []
  );

  // Watch form values for updates
  const locationValues = watch("location");

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"] as any,
  });

  const updateFormValues = async (place: google.maps.places.PlaceResult) => {
    setIsSearching(true);
    try {
      const addressMapping: Record<string, string> = {};

      if (place.address_components) {
        place.address_components.forEach((component) => {
          const value = component.long_name;
          if (component.types.includes("street_number")) {
            addressMapping.streetNumber = value;
          } else if (component.types.includes("route")) {
            addressMapping.route = value;
          } else if (component.types.includes("locality")) {
            addressMapping.city = value;
          } else if (component.types.includes("administrative_area_level_1")) {
            addressMapping.region = value;
          } else if (component.types.includes("country")) {
            addressMapping.state = value;
          } else if (component.types.includes("postal_code")) {
            addressMapping.zip = value;
          }
        });
      }

      // Mise à jour groupée des valeurs
      const updates = {
        "location.streetAddress": `${addressMapping.streetNumber || ""} ${
          addressMapping.route || ""
        }`.trim(),
        "location.city": addressMapping.city || "",
        "location.state": addressMapping.state || "",
        "location.region": addressMapping.region || "",
        "location.zip": addressMapping.zip || "",
      };

      Object.entries(updates).forEach(([key, value]) => {
        setValue(key as any, value, {
          shouldValidate: true,
          shouldDirty: true,
        });
      });

      setSearchValue(place.formatted_address || "");
      setSearchError(null);
    } catch (error) {
      setSearchError("Erreur lors de la mise à jour de l'adresse");
      console.error("Erreur lors de la mise à jour des valeurs:", error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (!isLoaded || !searchInputRef.current) return;

    // const autocomplete = new google.maps.places.Autocomplete(
    //   searchInputRef.current,
    //   {
    //     componentRestrictions: {
    //       country: AFRICAN_COUNTRIES_SUPPORTED_FOR_GOOGLE_MAPS,
    //     },
    //     fields: ["address_components", "formatted_address", "geometry"],
    //   }
    // );

    const autocomplete = new google.maps.places.Autocomplete(
      searchInputRef.current,
      {
        componentRestrictions: {
          country: [selectedCountry.toLowerCase()], // Google Maps API attend le code pays en minuscules
        },
        fields: ["address_components", "formatted_address", "geometry"],
      }
    );

    const placeChangedListener = autocomplete.addListener(
      "place_changed",
      () => {
        const place = autocomplete.getPlace();

        if (!place.geometry) {
          setSearchError("Aucun détail disponible pour cette adresse");
          return;
        }

        updateFormValues(place);
      }
    );

    return () => {
      google.maps.event.removeListener(placeChangedListener);
    };
  }, [isLoaded, selectedCountry]);

  const handleNext = async () => {
    type LocationPath = `location.${keyof AddPropertyInputType["location"]}`;

    const fieldsToValidate: LocationPath[] = [
      // "location.streetAddress",
      "location.city",
      "location.state",
    ];

    if (await trigger(fieldsToValidate)) {
      props.next();
    }
  };

  if (loadError) {
    return (
      <Card className={cn("p-6", props.className)}>
        <div className="text-center text-red-500">
          Erreur de chargement de Google Maps. Veuillez réessayer
          ultérieurement.
        </div>
      </Card>
    );
  }

  const getLocationValue = (fieldName: string) => {
    const location = watch("location");
    return location ? location[fieldName as keyof typeof location] || "" : "";
  };

  return (
    <Card
      className={cn(
        "p-4 grid grid-cols-1 md:grid-cols-2 gap-4",
        props.className
      )}
    >
      {/* Sélection du pays */}
      <div className="col-span-1 md:col-span-2 mb-4">
        <Select
          label="Sélectionnez un pays"
          placeholder="Choisissez un pays"
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            setSearchValue(""); // Réinitialiser la recherche d'adresse
          }}
        >
          {AFRICAN_FRANCOPHONE_COUNTRIES.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.name}
            </SelectItem>
          ))}
        </Select>
      </div>
      {/* <div className="col-span-1 md:col-span-2">
        <Input
          {...{
            ref: searchInputRef,
            label: "Rechercher une adresse",
            placeholder: "Adresse d'un pays africain francophone",
            value: searchValue,
            onChange: (e: any) => setSearchValue(e.target.value),
            className: "w-full",
            errorMessage: searchError,
            isInvalid: !!searchError,
            isLoading: isSearching,
          }}
        />
      </div> */}
      {/* Recherche d'adresse - désactivée tant qu'un pays n'est pas sélectionné */}
      <div className="col-span-1 md:col-span-2">
        <Input
          ref={searchInputRef}
          label="Rechercher une adresse"
          placeholder={
            selectedCountry
              ? `Rechercher une adresse`
              : "Veuillez d'abord sélectionner un pays"
          }
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full"
          errorMessage={searchError}
          isInvalid={!!searchError}
          // isLoading={isSearching}
          isDisabled={!selectedCountry}
        />
      </div>

      {locationFields.map((field) => (
        <LocationInput
          key={field.name}
          field={field}
          value={
            field.name === "landmark" ? "" : locationValues?.[field.name] || ""
          }
          error={errors.location?.[field.name]?.message}
        />
      ))}

      <div className="flex flex-col md:flex-row justify-center col-span-1 md:col-span-2 gap-4 mt-4">
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
          isLoading={isSearching}
        >
          Suivant
        </Button>
      </div>
    </Card>
  );
};

export default Location;
