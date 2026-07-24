import Layout from "@/components/layout/Layout"
import About from "@/components/sections/home1/About"
import Banner from "@/components/sections/home1/Banner"
import HomeServicesGallery from "@/components/sections/home1/HomeServicesGallery"
import Service from "@/components/sections/home1/Service"
import Servicetwo from "@/components/sections/home1/Servicetwo"

export default function Home() {
    return (
        <Layout headerStyle={1} footerStyle={1}>
                <Banner />
                <Service />
                <About />
                <Servicetwo />
                <HomeServicesGallery />
            </Layout>
    )
}
