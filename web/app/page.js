import Layout from "@/components/layout/Layout"
import About from "@/components/sections/home1/About"
import Banner from "@/components/sections/home1/Banner"
import Coverage from "@/components/sections/home1/Coverage"
import Service from "@/components/sections/home1/Service"
import Servicetwo from "@/components/sections/home1/Servicetwo"
import Testimonial from "@/components/sections/home1/Testimonial"

export default function Home() {
    return (
        <Layout headerStyle={1} footerStyle={1}>
                <Banner />
                <Service />
                <About />
                <Servicetwo />
                <Coverage />
                <Testimonial />
            </Layout>
    )
}
