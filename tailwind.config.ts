import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'lm-dark': '#1D1D1B',
        'lm-red': '#E9322D',
        'lm-white': '#FFFFFF',
        'lm-gray-light': '#F5F5F5',
        'lm-gray': '#6B6B6B',
        'lm-gray-border': '#D5D5D5',
        'lm-blue-link': '#1A5276',
      },
      fontFamily: {
        'serif': ['Georgia', 'Times New Roman', 'serif'],
        'sans': ['Helvetica Neue', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        'article': '680px',
        'content': '1200px',
      },
    },
  },
  plugins: [],
};
export default config;
