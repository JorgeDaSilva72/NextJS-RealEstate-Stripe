// import { nextui } from "@nextui-org/react";
// import type { Config } from "tailwindcss";

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
//     },
//   },
//   darkMode: "class",
//   plugins: [nextui()],
// };
// export default config;
import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

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
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;
