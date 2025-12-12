// 09-12-2025 commenté provisoirement car  le code  doit être retouché pour qu il fonctionne avec la nouvelle structure de la base de données mais comme cette page n a pas été bien défini on ne va pas plus loin

// "use client";
// import { useRef } from "react";
// import "./options.css";
// import { usePathname } from "next/navigation";
// import Link from "next/link";
// import useActive from "@/app/[locale]/hooks/useActive";

// export type TypeOptions = {
//   title: string;
//   url: string;
// }[];

// interface OptionsPropsType {
//   options: TypeOptions;
// }

// const Options = ({ options }: OptionsPropsType) => {
//   const optionRef = useRef<HTMLDivElement>(null);
//   const active = useActive();
//   const pathname = usePathname();

//   return (
//     <div
//       className="options-container flex justify-center items-center"
//       ref={optionRef}
//     >
//       {options.map((option, index) => (
//         <Link
//           href={option.url}
//           className={
//             (option.url == pathname ? "option active" : "option") +
//             " px-5 py-2 transition duration-200 ease-linear"
//           }
//           onClick={(e) => {
//             active(e, optionRef);
//           }}
//           key={index}
//         >
//           <span className="text-blue-500 font-semibold text-lg cursor-pointer">
//             {option.title}
//           </span>
//         </Link>
//       ))}
//     </div>
//   );
// };

// export default Options;
