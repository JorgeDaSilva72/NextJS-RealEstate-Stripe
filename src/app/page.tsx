// "use client";

// import { useRouter } from "next/navigation"; // Nouvelle API
// import { useState } from "react";
// import { ImagesSlider } from "./components/ImageSlider";

// const Hero = () => {
//   const router = useRouter();
//   const [searchQuery, setSearchQuery] = useState("");

//   // Fonction de redirection vers la page des résultats
//   const handleSearch = () => {
//     if (searchQuery.trim()) {
//       router.push(`/result?query=${encodeURIComponent(searchQuery)}`);
//     } else {
//       router.push("/result"); // Redirige sans requête si aucun texte n'est entré
//     }
//   };

//   const handlePricing = () => {
//     if (searchQuery.trim()) {
//       router.push(`/result?query=${encodeURIComponent(searchQuery)}`);
//     } else {
//       router.push("/user/subscription"); // Redirige sans requête si aucun texte n'est entré
//     }
//   };
//   const images = [
//     { url: "/Hero1.jpg" },
//     { url: "/Hero2.jpg" },
//     { url: "/Hero3.jpg" },
//     { url: "/Hero4.jpg" },
//     { url: "/Hero5.jpg" },
//   ];

//   return (
//     <>
//       <section
//         id="hero"
//         className="relative h-screen w-full flex items-center justify-center overflow-hidden"
//       >
//         {/* Background Image */}
//         {/* <div className="absolute inset-0 z-0">
//         <Image
//           src="/hero-image.jpg"
//           alt="Immobilier de rêve"
//           fill
//           style={{ objectFit: "cover" }}
//           className="opacity-80"
//           priority
//         />
//       </div> */}
//         {/* Slider en arrière-plan */}
//         <div className="absolute inset-0 z-0 h-full w-full">
//           <ImagesSlider
//             className="h-full w-full object-cover"
//             direction="down"
//             overlay={true}
//             autoplay={true}
//             overlayClassName=""
//             images={images.map((img) => img.url)}
//           />
//         </div>
//         {/* Overlay */}
//         {/* <div className="absolute inset-0 bg-black opacity-40"></div> */}

//         {/* Content */}
//         <div className="relative z-10 text-center text-white px-6 w-[80%] max-w-3xl">
//           <h1 className="text-3xl md:text-5xl font-bold mb-4">
//             Trouvez la propriété de vos rêves
//           </h1>
//           <p className="hidden lg:block text-lg md:text-xl mb-8">
//             Parcourez des centaines d&apos;annonces pour trouver l&apos;endroit
//             parfait où vivre
//           </p>

//           {/* Search Form */}
//           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//             {/* <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Rechercher dans les titres des annonces"
//               className="w-full sm:w-2/3 p-3 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//             /> */}
//             <button
//               onClick={handleSearch}
//               className="w-full sm:w-auto bg-transparent/50 lg:bg-primary-500 text-white py-3 px-6 rounded-md font-semibold hover:bg-primary-600 transition"
//             >
//               Explorer
//             </button>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default Hero;
// end --------------------
// Cedrico - changer le design de l'accueil

// "use client";

// import { useRouter } from "next/navigation"; // Nouvelle API
// import { useState } from "react";
// import { ImagesSlider } from "./components/ImageSlider";
// import PlaySVG from "./assets/svg/PlaySVG";

// const Hero = () => {
//   const router = useRouter();
//   const [searchQuery, setSearchQuery] = useState("");

//   // Fonction de redirection vers la page des résultats
//   const handleSearch = () => {
//     if (searchQuery.trim()) {
//       router.push(`/result?query=${encodeURIComponent(searchQuery)}`);
//     } else {
//       router.push("/result"); // Redirige sans requête si aucun texte n'est entré
//     }
//   };

//   const handlePricing = () => {
//     if (searchQuery.trim()) {
//       router.push(`/result?query=${encodeURIComponent(searchQuery)}`);
//     } else {
//       router.push("/user/subscription"); // Redirige sans requête si aucun texte n'est entré
//     }
//   };
//   const images = [
//     { url: "/Hero1.jpg" },
//     { url: "/Hero2.jpg" },
//     { url: "/Hero3.jpg" },
//     { url: "/Hero4.jpg" },
//     { url: "/Hero5.jpg" },
//   ];

//   return (
//     <>
//       <section
//         id="hero"
//         className="relative h-screen w-full flex items-center justify-center overflow-hidden"
//       >
//         {/* Background Image */}
//         {/* <div className="absolute inset-0 z-0">
//         <Image
//           src="/hero-image.jpg"
//           alt="Immobilier de rêve"
//           fill
//           style={{ objectFit: "cover" }}
//           className="opacity-80"
//           priority
//         />
//       </div> */}
//         {/* Slider en arrière-plan */}
//         <div className="absolute inset-0 z-0 h-full w-full">
//           <ImagesSlider
//             className="h-full w-full object-cover"
//             direction="down"
//             overlay={true}
//             autoplay={true}
//             overlayClassName=""
//             images={images.map((img) => img.url)}
//           />
//         </div>
//         {/* Overlay */}
//         {/* <div className="absolute inset-0 bg-black opacity-40"></div> */}

//         {/* Content */}
//         <div className="relative z-10 text-center text-white px-6 w-[80%] max-w-3xl flex flex-col items-center justify-center">
//           <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-4 font-extrabold tracking-wide">
//             Trouvez la propriété de vos rêves
//           </h1>
//           <p className="hidden md:block text-base sm:text-lg md:text-xl mb-6 font-medium whitespace-pre-line max-w-xl">
//             Parcourez des centaines d&apos;annonces pour trouver l&apos;endroit
//             parfait où vivre
//           </p>

//           {/* Search Form */}
//           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//             {/* <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Rechercher dans les titres des annonces"
//               className="w-full sm:w-2/3 p-3 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//             /> */}
//             <button
//               onClick={handleSearch}
//               className="text-[18px] tracking-[1px]  flex items-center justify-center gap-[10px] w-full sm:w-auto bg-transparent/50 lg:bg-primary-500 text-white py-2 px-3 rounded-md font-semibold hover:bg-primary-600 transition"
//             >
//               <span>Explorer</span>
//               <PlaySVG width="35" height="35" className="animate-spin3D" />
//             </button>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default Hero;

"use client";

import { useRouter } from "next/navigation"; // Nouvelle API
import { useState } from "react";
import { ImagesSlider } from "./components/ImageSlider";
import PlaySVG from "./assets/svg/PlaySVG";

const Hero = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Fonction de redirection vers la page des résultats
  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/result?query=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/result"); // Redirige sans requête si aucun texte n'est entré
    }
  };

  const handlePricing = () => {
    if (searchQuery.trim()) {
      router.push(`/result?query=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/user/subscription"); // Redirige sans requête si aucun texte n'est entré
    }
  };
  const images = [
    { url: "/Hero1.jpg" },
    { url: "/Hero2.jpg" },
    { url: "/Hero3.jpg" },
    { url: "/Hero4.jpg" },
    { url: "/Hero5.jpg" },
  ];

  return (
    <>
      <section
        id="hero"
        className="relative h-screen w-full flex items-center justify-center overflow-hidden"
      >
        {/* Background Image */}
        {/* <div className="absolute inset-0 z-0">
        <Image
          src="/hero-image.jpg"
          alt="Immobilier de rêve"
          fill
          style={{ objectFit: "cover" }}
          className="opacity-80"
          priority
        />
      </div> */}
        {/* Slider en arrière-plan */}
        <div className="absolute inset-0 z-0 h-full w-full">
          <ImagesSlider
            className="h-full w-full object-cover"
            direction="down"
            overlay={true}
            autoplay={true}
            overlayClassName=""
            images={images.map((img) => img.url)}
          />
        </div>
        {/* Overlay */}
        {/* <div className="absolute inset-0 bg-black opacity-40"></div> */}

        {/* Content */}
        <div className="relative z-10 text-center text-white px-6 w-[80%] max-w-3xl flex flex-col items-center justify-center">
          <h1 className="tracking-[1px] h-[300px] leading-tight mb-4 text-[55px] md:text-[60px] font-extrabold sm:leading-normal sm:h-auto sm:tracking-[5px] w-full">
            Trouvez la propriété de vos rêves
          </h1>
          <p className="hidden lg:block text-lg md:text-xl mb-8 w-[60%] font-medium whitespace-pre-line">
            Parcourez des centaines d&apos;annonces pour trouver l&apos;endroit
            parfait où vivre
          </p>

          {/* Search Form */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher dans les titres des annonces"
              className="w-full sm:w-2/3 p-3 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            /> */}
            <button
              onClick={handleSearch}
              className="text-[18px] tracking-[1px] flex items-center justify-center gap-[10px] w-full sm:w-auto bg-transparent/50 lg:bg-primary-500 text-white py-2 px-3 rounded-md font-semibold hover:bg-primary-600 transition"
            >
              <span>Explorer</span>
              <PlaySVG width="35" height="35" className="animate-spin3D" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
