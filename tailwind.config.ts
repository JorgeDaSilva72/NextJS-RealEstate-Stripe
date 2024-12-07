// import { nextui } from "@nextui-org/react";
// import type { Config } from "tailwindcss";
// import plugin from "tailwindcss/plugin";

// const config: Config = {
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//     "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {

//       backgroundImage: {
//         "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
//         "gradient-conic":
//           "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
//       },

//       animation: {
//         shine: "shine 1.5s linear infinite",
//         glow: "glow 1.5s infinite alternate",
//         fadeDown: "fadeDown 0.5s ease-out", // ajout 0.5s est la durée par défaut
//       },
//       keyframes: {
//         shine: {
//           "0%": { backgroundPosition: "-200%" },
//           "50%": { backgroundPosition: "0%" },
//           "100%": { backgroundPosition: "200%" },
//         },
//         glow: {
//           "0%": { textShadow: "0 0 10px rgba(255, 255, 255, 0.5)" },
//           "100%": { textShadow: "0 0 20px rgba(255, 255, 255, 1)" },
//         },
//         fadeDown: {
//           "0%": { opacity: "0", transform: "translateY(-50px)" },
//           "100%": { opacity: "1", transform: "translateY(0)" },
//         },
//       },
//     },
//   },
//   darkMode: "class",
//   plugins: [
//     plugin(({ addUtilities }) => {
//       addUtilities({
//         ".scrollbar-hide": {
//           "&::-webkit-scrollbar": {
//             display: "none",
//           },
//           "scrollbar-width": "none",
//           "-ms-overflow-style": "none",
//         },
//       });
//     }),
//     nextui(),
//   ],
// };
// export default config;
// end ----------------------------
// Cedrico - changer le design de l'accueil

import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      animation: {
        shine: "shine 1.5s linear infinite",
        glow: "glow 1.5s infinite alternate",
        spin3D: "spin3D 3s linear infinite",
        shadowPulse: "shadowPulse 2s ease-out infinite",
        shadowPulseBlue: "shadowPulseBlue 2s ease-out infinite",
        fadeDown: "fadeDown 0.5s ease-out", // ajout 0.5s est la durée par défaut
      },
      keyframes: {
        shine: {
          "0%": { backgroundPosition: "-200%" },
          "50%": { backgroundPosition: "0%" },
          "100%": { backgroundPosition: "200%" },
        },
        glow: {
          "0%": { textShadow: "0 0 10px rgba(255, 255, 255, 0.5)" },
          "100%": { textShadow: "0 0 20px rgba(255, 255, 255, 1)" },
        },
        fadeDown: {
          "0%": { opacity: "0", transform: "translateY(-50px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        spin3D: {
          "0%": { transform: "rotatey(0deg)" },
          "100%": { transform: "rotatey(360deg)" },
        },
        shadowPulse: {
          "0%": { boxShadow: "0 0 0 0 rgba(255, 255, 255, 0.5)" },
          "50%": { boxShadow: "0 0 10px 5px rgba(255, 255, 255, 0.3)" },
          "100%": { boxShadow: "0 0 20px 10px rgba(255, 255, 255, 0)" },
        },
        shadowPulseBlue: {
          "0%": { boxShadow: "0 0 0 0 rgb(0,91,196, 0.5)" },
          "50%": { boxShadow: "0 0 10px 5px rgb(0,91,196, 0.3)" },
          "100%": { boxShadow: "0 0 20px 10px rgb(0,91,196, 0)" },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".scrollbar-hide": {
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "scrollbar-width": "none",
          "-ms-overflow-style": "none",
        },
      });
    }),
    nextui(),
  ],
};
export default config;
