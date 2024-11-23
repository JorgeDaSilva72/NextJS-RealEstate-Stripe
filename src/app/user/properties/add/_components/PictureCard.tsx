// import { TrashIcon } from "@heroicons/react/16/solid";
// import { Card, Image } from "@nextui-org/react";
// import React from "react";

// interface Props {
//   src: string;
//   index: number;
//   onDelete: (index: number) => void;
// }
// const PictureCard = ({ src, onDelete, index }: Props) => {
//   return (
//     <Card className="flex flex-col items-center">
//       <Image
//         src={src}
//         className="w-36 h-36 object-contain"
//         alt="property picture"
//       />
//       <button className="mb-2" onClick={() => onDelete(index)}>
//         <TrashIcon className="text-danger-400 w-4" />
//       </button>
//     </Card>
//   );
// };

// export default PictureCard;

import { TrashIcon } from "@heroicons/react/16/solid";
import { Card, Image } from "@nextui-org/react";
import React from "react";

interface Props {
  src: string; // URL de l'image ou de la vidéo
  index: number;
  onDelete: (index: number) => void;
}
const PictureCard = ({ src, onDelete, index }: Props) => {
  // Détection si le fichier est une vidéo (par exemple, basé sur l'extension)
  // const isVideo = /\.(mp4|webm|ogg)$/i.test(src);
  // const isVideo = src.includes("youtube.com") || src.includes("youtu.be");
  let isVideo = false;
  return (
    <Card className="flex flex-col items-center relative w-36 h-36">
      {isVideo ? (
        <video
          src={src}
          controls
          className="w-full h-full object-contain"
          // alt="property video"
        />
      ) : (
        <Image
          src={src}
          className="w-full h-full object-contain"
          alt="property picture"
        />
      )}
      <button
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
        onClick={() => onDelete(index)}
      >
        <TrashIcon className="text-danger-400 w-4" />
      </button>
    </Card>
  );
};

export default PictureCard;
