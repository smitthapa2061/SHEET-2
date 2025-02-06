module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Make sure this includes your JSX/TSX files
  ],
  theme: {
    extend: {
      skew: {
        15: "15deg", // Add 15 degrees
        20: "20deg", // Add 20 degrees
        30: "30deg", // Add 30 degrees
        "-15": "-15deg", // Add negative 15 degrees
        "-20": "-20deg", // Add negative 20 degrees
      },
      fontFamily: {
        "bebas-neue": ["Bebas Neue", "sans-serif"],
        "gemunu-libre": ["Gemunu Libre", "sans-serif"],
        teko: ["Teko", "sans-serif"], // Fixed the closing brace issue here
      },
      scale: {
        200: "2", // 200% scale (2x)
        300: "3", // 300% scale (3x)
        1000: "5", // 500% scale (5x)
      },
    },
  },
  plugins: [],
};
