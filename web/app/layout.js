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
    title: 'Erepair',
    description: 'Electrician Services & Electrical Repairs react next Js template',
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
