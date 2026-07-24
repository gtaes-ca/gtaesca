import { Roboto } from 'next/font/google'

export const roboto = Roboto({
    weight: ['300', '400', '500', '700', '900'],
    subsets: ['latin'],
    variable: '--erepair-font',
    display: 'swap',
    // Keep a stable family name fallback for CSS var usage across all pages
    fallback: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'],
})
