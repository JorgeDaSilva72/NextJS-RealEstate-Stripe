// "use client";

// import { useState, useEffect } from "react";
// import SearchForm from "./components/SearchForm";
// import dynamic from "next/dynamic";
// import { cn } from "@nextui-org/theme";
// import Link from "next/link";

// interface Image {
//   url: string;
// }

// const ImagesSlider = dynamic(() => import("./components/ImageSlider"), {
//   ssr: false,
//   loading: () => <div className="animate-pulse bg-gray-300 h-full w-full" />,
// });

// const Hero: React.FC = () => {
//   const [isLoaded, setIsLoaded] = useState(false);

//   const images: Image[] = [
//     { url: "/Hero1.jpg" },
//     { url: "/Hero2.jpg" },
//     { url: "/Hero3.jpg" },
//     { url: "/Hero4.jpg" },
//   ];

//   // Animation d'entrée
//   useEffect(() => {
//     setIsLoaded(true);
//   }, []);

//   return (
//     <section
//       id="hero"
//       className={cn(
//         "relative min-h-screen w-full flex items-center justify-center overflow-hidden",
//         "transition-opacity duration-700 ease-in-out",
//         !isLoaded ? "opacity-0" : "opacity-100"
//       )}
//     >
//       {/* Conteneur du slider */}
//       <div className="absolute inset-0 z-0">
//         <ImagesSlider
//           className="z-50 h-full w-full object-cover"
//           direction="down"
//           overlay={false}
//           autoplay={true}
//           overlayClassName=""
//           images={images.map((img) => img.url)}
//         />
//         {/* Overlay amélioré avec gradient */}
//         <div
//           className={cn(
//             "absolute inset-0",
//             "bg-gradient-to-b from-black/40 via-black/30 to-black/50",
//             "backdrop-blur-[2px]"
//           )}
//         />
//       </div>

//       {/* Contenu principal */}
//       <div
//         className={cn(
//           "relative z-10 w-full max-w-4xl mx-auto",
//           "px-6 py-8 md:py-12",
//           "flex flex-col items-center justify-center",
//           "text-center text-white",
//           "bg-black/20 backdrop-blur-sm rounded-xl",
//           "transition-transform duration-700 ease-out",
//           isLoaded ? "translate-y-0" : "translate-y-10"
//         )}
//       >
//         <h1
//           className={cn(
//             "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
//             "font-extrabold tracking-wide leading-tight",
//             "mb-4 md:mb-6",
//             "animate-fade-in"
//           )}
//         >
//           Trouvez la propriété de vos rêves
//         </h1>

//         <p
//           className={cn(
//             "text-base md:text-lg lg:text-xl",
//             "mb-8 max-w-2xl",
//             "font-medium",
//             "opacity-90",
//             "hidden lg:block"
//           )}
//         >
//           Parcourez des centaines d&apos;annonces pour trouver l&apos;endroit
//           parfait où vivre
//         </p>

//         {/* SearchForm avec animation
//         <div
//           className={cn(
//             "w-full max-w-2xl",
//             "transition-all duration-700 delay-300",
//             isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
//           )}
//         >
//           <SearchForm />
//         </div> */}

//         {/* Boutons */}
//         <div
//           className={cn(
//             "w-full max-w-2xl flex flex-col sm:flex-row justify-center gap-4",
//             "transition-all duration-700 delay-300",
//             isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
//           )}
//         >
//           <Link
//             href="/user/properties/add"
//             className={cn(
//               "w-full sm:w-auto px-6 py-3 text-lg font-semibold",
//               "bg-black/20 hover:bg-black/40 text-white",
//               "rounded-lg shadow-md transition-transform transform hover:scale-105"
//             )}
//           >
//             Déposer une annonce
//           </Link>
//           <Link
//             href="/result"
//             className={cn(
//               "w-full sm:w-auto px-6 py-3 text-lg font-semibold",
//               "bg-black/20 hover:bg-black/40 text-white",
//               "rounded-lg shadow-md transition-transform transform hover:scale-105"
//             )}
//           >
//             Rechercher une annonce
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { cn } from "@nextui-org/theme";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import PropertyCategoriesSlider from "@/components/ui/PropertyCategoriesSlider";
import FeaturedPropertiesSlider from "./components/FeaturedPropertiesSlider";
import { FooterSection } from "./components/footer";
import SectionHeader from "@/components/ui/SectionHeader";
import SearchFormWrapper from "@/components/ui/SearchFormWrapper";

interface Image {
  url: string;
}

const ImagesSlider = dynamic(() => import("./components/ImageSlider"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-300 h-full w-full" />,
});

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const t = useTranslations("hero");

  const images: Image[] = [
    { url: "/Hero1.jpg" },
    { url: "/Hero2.jpg" },
    { url: "/Hero3.jpg" },
    { url: "/Hero4.jpg" },
  ];

  // Animation d'entrée
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <section
        id="hero"
        className={cn(
          "relative min-h-screen w-full flex items-center justify-center overflow-hidden",
          "transition-opacity duration-700 ease-in-out",
          !isLoaded ? "opacity-0" : "opacity-100"
        )}
      >
        {/* Conteneur du slider */}
        <div className="absolute inset-0 z-0">
          <ImagesSlider
            className="z-50 h-full w-full object-cover"
            direction="down"
            overlay={false}
            autoplay={true}
            overlayClassName=""
            images={images.map((img) => img.url)}
          />
          {/* Overlay amélioré avec gradient */}
          <div
            className={cn(
              "absolute inset-0",
              "bg-gradient-to-b from-black/40 via-black/30 to-black/50",
              "backdrop-blur-[2px]"
            )}
          />
        </div>

        {/* Contenu principal */}
        <div
          className={cn(
            "relative z-10 w-full max-w-4xl mx-auto",
            "px-6 py-8 md:py-12",
            "flex flex-col items-center justify-center",
            "text-center text-white",
            "bg-black/20 backdrop-blur-sm rounded-xl",
            "transition-transform duration-700 ease-out",
            isLoaded ? "translate-y-0" : "translate-y-10"
          )}
        >
          <h1
            className={cn(
              "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
              "font-extrabold tracking-wide leading-tight",
              "mb-4 md:mb-6",
              "animate-fade-in"
            )}
          >
            {t("title")}
          </h1>

          <p
            className={cn(
              "text-base md:text-lg lg:text-xl",
              "mb-8 max-w-2xl",
              "font-medium",
              "opacity-90",
              "hidden lg:block"
            )}
          >
            {t("description")}
          </p>

          {/* Boutons */}
          <div
            className={cn(
              "w-full max-w-2xl flex flex-col sm:flex-row justify-center gap-4",
              "transition-all duration-700 delay-300",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <Link
              href="/user/properties/add"
              className={cn(
                "w-full sm:w-auto px-6 py-3 text-lg font-semibold",
                "bg-black/20 hover:bg-black/40 text-white",
                "rounded-lg shadow-md transition-transform transform hover:scale-105"
              )}
            >
              {t("postButton")}
            </Link>
            <Link
              href="/result"
              className={cn(
                "w-full sm:w-auto px-6 py-3 text-lg font-semibold",
                "bg-black/20 hover:bg-black/40 text-white",
                "rounded-lg shadow-md transition-transform transform hover:scale-105"
              )}
            >
              {t("searchButton")}
            </Link>
          </div>
        </div>
      </section>

      {/* <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8"
        aria-labelledby="search-title"
      >
        <SectionHeader
          id="search-title"
          title="Affinez votre recherche immobilière"
        />
        <div className="px-4">
          <SearchFormWrapper
            defaultValues={{
              ville: "",
              categorie: "Appartement",
              budget: "",
              chambres: "",
            }}
            defaultActiveTab={"Location meublée"}
            backgroundColor="bg-black"
          />
        </div>
      </section> */}

      {/* <PropertyCategoriesSlider /> */}
      {/* <FeaturedPropertiesSlider /> */}
      {/* <FooterSection /> */}
    </>
  );
};

export default Hero;
