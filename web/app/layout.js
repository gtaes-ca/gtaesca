import "@/node_modules/react-modal-video/css/modal-video.css"
import "public/assets/css/style.css"
import "public/assets/css/booking.css"
import 'swiper/css'
// import "swiper/css/navigation"
import "swiper/css/pagination"
import 'swiper/css/free-mode';
import { archivo, titilliumWeb, pacifico } from '@/lib/font'
import Providers from './providers'
export const metadata = {
    title: 'GTA Electric Services',
    description: 'Licensed residential and commercial electrical services across the Greater Toronto Area.',
    icons: {
        icon: [
            { url: '/assets/images/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/assets/images/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        ],
        apple: '/assets/images/favicons/apple-touch-icon.png',
        shortcut: '/favicon.ico',
    },
    manifest: '/assets/images/favicons/site.webmanifest',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${archivo.variable} ${titilliumWeb.variable} ${pacifico.variable}`}>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
