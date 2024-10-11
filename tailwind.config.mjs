import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,md,mdx}"],
  theme: {
    fontFamily: {
      default: ["Courier Prime", ...defaultTheme.fontFamily.mono],
    },

    colors: {
      white: '#f8f9fa',
      black: '#212529'
    },
  },
};
