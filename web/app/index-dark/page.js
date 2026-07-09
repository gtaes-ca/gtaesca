import Layout from "@/components/layout/Layout"
import About from "@/components/sections/home1/About"
import Banner from "@/components/sections/home1/Banner"
import Funfacts from "@/components/sections/home1/Funfacts"
import Service from "@/components/sections/home1/Service"
import Servicetwo from "@/components/sections/home1/Servicetwo"
import Video from "@/components/sections/home1/video"
import Brand from "@/components/sections/home1/Brand"
import Blog from "@/components/sections/home1/Blog"
import Testimonial from "@/components/sections/home1/Testimonial"
import Cta from "@/components/sections/home1/Cta"
import Pricing from "@/components/sections/home1/Pricing"
import Project from "@/components/sections/home1/Project"

export default function Home() {

    return (
        <>
            <div className="dark-home">
            <Layout headerStyle={1} footerStyle={1}>
                <Banner />
                <Service />
                <About />
                <Servicetwo />
                <Testimonial />
                <Brand />
                <Video/>
                <Funfacts />
                <Project />
                <Pricing />
                <Blog />
                <Cta />
            </Layout>
            </div>
        </>
    )
}