import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FBF3EF",
        ink: "#2B1B1F",
        wine: "#6B2737",
        wine2: "#8A3348",
        coral: "#E8607A",
        coral2: "#F2879C",
        gold: "#C9A227",
        sand: "#EFE0D6",
        // Iltifot marketing sayti palitrasi
        rose: "#C97B86",
        rose2: "#B96872",
        blush: "#FBEDEA",
        cardRose: "#F3D2D3",
        cardPink: "#FBDDE6",
        cardBlue: "#DCE6F3",
        cardGreen: "#DCEEDC",
        cardAmber: "#F8E8C8",
        cardPurple: "#E7DCF3",
        cardTeal: "#D8EEE9",
        cardPeach: "#F7DED2",
        footerDark: "#1B1013",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        soft: "18px",
      },
      backgroundImage: {
        "sunset-fade":
          "linear-gradient(135deg, #FBF3EF 0%, #F6DCE0 45%, #F0C6CE 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
