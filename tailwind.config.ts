import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FFF1F2",
          100: "#FFE4E6",
          200: "#FECDD3",
          300: "#FDA4AF",
          400: "#FB7185",
          500: "#EE2737", // Primary coral / hồng đỏ BabyMart
          600: "#D61E2C",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
        },
        price: "#EE2737", // Prominent red for prices
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F5F7FD", // Con Cung background #F5F7FD
          darker: "#EAEAEA",
        },
      },
      maxWidth: {
        container: "1200px",
      },
      borderRadius: {
        DEFAULT: "8px",
        md: "8px",
        lg: "10px",
        xl: "12px",
        "2xl": "15px",
        "3xl": "20px",
      },
      boxShadow: {
        subtle: "0 1px 4px rgba(0, 0, 0, 0.05)",
        card: "0 2px 10px rgba(0, 0, 0, 0.06)",
        hover: "0 6px 16px rgba(238, 39, 55, 0.12)",
      },
      fontFamily: {
        sans: ["var(--font-be-vietnam)", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
