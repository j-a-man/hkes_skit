import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pirata: ['var(--font-pirata)', 'cursive'],
        special: ['var(--font-special)', 'cursive'],
        noto: ['var(--font-noto)', 'sans-serif'],
        uncial: ['var(--font-uncial)', 'cursive'],
      },
    },
  },
  plugins: [],
}

export default config
