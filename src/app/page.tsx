// "use client";

// import SearchForm from "./components/SearchForm";
// import dynamic from "next/dynamic";

// // Définition du type pour les images
// interface Image {
//   url: string;
// }

// const ImagesSlider = dynamic(() => import("./components/ImageSlider"), {
//   ssr: false,
// });

// const Hero: React.FC = () => {
//   const images: Image[] = [
//     { url: "/Hero1.jpg" },
//     { url: "/Hero2.jpg" },
//     { url: "/Hero3.jpg" },
//     { url: "/Hero4.jpg" },
//   ];

//   return (
//     <section
//       id="hero"
//       className="relative h-screen w-full flex items-center justify-center overflow-hidden"
//     >
//       <div className="absolute inset-0 z-0 h-full w-full">
//         <ImagesSlider
//           className="h-full w-full object-cover"
//           direction="down"
//           overlay={false}
//           autoplay={false}
//           overlayClassName=""
//           images={images.map((img) => img.url)}
//         />
//         {/* Overlay pour améliorer la lisibilité */}
//         <div className="absolute inset-0 bg-black bg-opacity-30"></div>
//       </div>

//       {/* <div className="relative z-10 text-center text-white px-6 w-[80%] max-w-6xl flex flex-col items-center justify-center"> */}
//       <div className="relative z-10 w-full text-center text-white px-6 flex flex-col items-center justify-center max-w-4xl bg-transparent backdrop-blur-sm rounded-lg p-4 ">
//         <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight mb-4 font-extrabold tracking-wide">
//           Trouvez la propriété de vos rêves
//         </h1>
//         <p className="hidden lg:block text-lg md:text-xl mb-8 w-[60%] font-medium whitespace-pre-line">
//           Parcourez des centaines d&apos;annonces pour trouver l&apos;endroit
//           parfait où vivre
//         </p>

//         <SearchForm />
//       </div>
//     </section>
//   );
// };

// export default Hero;

"use client";

import { useState, useEffect } from "react";
import SearchForm from "./components/SearchForm";
import dynamic from "next/dynamic";
import { cn } from "@nextui-org/theme";

interface Image {
  url: string;
}

const ImagesSlider = dynamic(() => import("./components/ImageSlider"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-300 h-full w-full" />,
});

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

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
          Trouvez la propriété de vos rêves
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
          Parcourez des centaines d&apos;annonces pour trouver l&apos;endroit
          parfait où vivre
        </p>

        {/* SearchForm avec animation */}
        <div
          className={cn(
            "w-full max-w-2xl",
            "transition-all duration-700 delay-300",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <SearchForm />
        </div>
      </div>
    </section>
  );
};

export default Hero;
