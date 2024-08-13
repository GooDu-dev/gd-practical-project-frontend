import type { Config } from "tailwindcss";
import daisyui from 'daisyui';

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      white: "#ffffff",
      black: "#000000",
      p_bg: "#ECFFEF",
      p_white: "#F7FFF9",
      p_border: "#B0E4BC",
      p_text: "#54B56A",
      s_white: "#FFFCF7",
      s_border: "#FFC107",
      s_text: "FF6F00",
      p_dark: "#0A1D1D"
    }
  },
  plugins: [daisyui],
};
export default config;
