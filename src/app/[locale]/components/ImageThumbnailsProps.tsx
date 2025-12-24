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

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageThumbnailsProps {
  images: string[];
}

const ImageThumbnails = ({ images }: ImageThumbnailsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-[500px] sm:h-[600px] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-4">
      {/* Main Image Display */}
      <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg overflow-hidden bg-muted group">
        <Image
          src={images[currentIndex]}
          alt={`Property image ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority={currentIndex === 0}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
        />

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              onClick={handlePrev}
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 z-10",
                "opacity-0 group-hover:opacity-100 transition-opacity",
                "bg-background/80 backdrop-blur-sm hover:bg-background"
              )}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleNext}
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 z-10",
                "opacity-0 group-hover:opacity-100 transition-opacity",
                "bg-background/80 backdrop-blur-sm hover:bg-background"
              )}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden border-2 transition-all",
                currentIndex === index
                  ? "border-primary ring-2 ring-primary ring-offset-2 scale-105"
                  : "border-border hover:border-primary/50 opacity-70 hover:opacity-100"
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageThumbnails;
