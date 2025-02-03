// "use client";

// import { Image } from "@nextui-org/react";
// import { useState } from "react";

// interface ImageThumbnailsProps {
//   images: string[];
// }

// const ImageThumbnails = ({ images }: ImageThumbnailsProps) => {
//   const [currentImage, setCurrentImage] = useState(images[0]); // Image principale

//   return (
//     <div>
//       {/* Slider avec l'image principale */}
//       <div className="rounded-2xl overflow-hidden shadow-lg">
//         <Image
//           src={currentImage}
//           alt="Image principale"
//           className="w-full h-[600] object-cover"
//         />
//       </div>

//       {/* Vignettes */}
//       <div className="mt-4 flex gap-2 overflow-x-auto">
//         {images.map((img, index) => (
//           <button
//             key={index}
//             className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border ${
//               currentImage === img
//                 ? "border-blue-500 ring-2 ring-blue-500"
//                 : "border-gray-200"
//             }`}
//             onClick={() => setCurrentImage(img)}
//           >
//             <Image
//               src={img}
//               alt={`Vignette ${index + 1}`}
//               className="w-full h-full object-cover"
//             />
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ImageThumbnails;

// "use client";

// import { Image } from "@nextui-org/react";
// import { useState } from "react";
// import NextImage from "next/image";

// interface ImageThumbnailsProps {
//   images: string[];
// }

// const ImageThumbnails = ({ images }: ImageThumbnailsProps) => {
//   const [currentImage, setCurrentImage] = useState(images[0]); // Image principale

//   return (
//     <div>
//       {/* Slider avec l'image principale */}
//       <div className="rounded-2xl overflow-hidden shadow-lg">
//         <Image
//           //   as={NextImage}
//           src={currentImage}
//           //   width={300}
//           //   height={600}
//           alt="Image principale"
//           style={{
//             width: "100%",
//             height: "600px",
//             maxHeight: "600px",
//             objectFit: "cover",
//           }}
//         />
//       </div>

//       {/* Vignettes */}
//       <div className="mt-4 flex gap-2 overflow-x-auto">
//         {images.map((img, index) => (
//           <button
//             key={index}
//             className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border ${
//               currentImage === img
//                 ? "border-blue-500 ring-2 ring-blue-500"
//                 : "border-gray-200"
//             }`}
//             onClick={() => setCurrentImage(img)}
//           >
//             <Image
//               //   as={NextImage}
//               width={200}
//               height={200}
//               src={img}
//               alt={`Vignette ${index + 1}`}
//               //   style={{
//               //     width: "100%",
//               //     height: "100%",
//               //     objectFit: "cover",
//               //   }}
//             />
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ImageThumbnails;

"use client";

import { Image } from "@nextui-org/react";
import { useState } from "react";

interface ImageThumbnailsProps {
  images: string[];
}

const ImageThumbnails = ({ images }: ImageThumbnailsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Index de l'image actuelle

  // Fonction pour changer d'image
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative">
      {/* Slider avec l'image principale */}
      <div className="rounded-2xl overflow-hidden shadow-lg relative">
        <Image
          src={images[currentIndex]}
          alt="Image principale"
          style={{
            width: "100%",
            height: "600px",
            maxHeight: "600px",
            objectFit: "cover",
          }}
        />

        {/* Flèche gauche */}
        <button
          onClick={handlePrev}
          className="z-10 absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
          aria-label="Image précédente"
        >
          ❮
        </button>

        {/* Flèche droite */}
        <button
          onClick={handleNext}
          className="z-10 absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
          aria-label="Image suivante"
        >
          ❯
        </button>
      </div>

      {/* Vignettes */}
      <div className="mt-4 flex gap-2 overflow-x-auto">
        {images.map((img, index) => (
          <button
            key={index}
            className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border ${
              currentIndex === index
                ? "border-blue-500 ring-2 ring-blue-500"
                : "border-gray-200"
            }`}
            onClick={() => setCurrentIndex(index)}
          >
            <Image
              src={img}
              alt={`Vignette ${index + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageThumbnails;
