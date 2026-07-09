
import Layout from "@/components/layout/Layout"
import About from "@/components/sections/home2/About"
import Banner from "@/components/sections/home2/Banner"
import Blog from "@/components/sections/home2/Blog"
import Brand from "@/components/sections/home2/Brand"
import Contactcounter from "@/components/sections/home2/Contactcounter"
import Faq from "@/components/sections/home2/Faq"
import Projects from "@/components/sections/home2/Projects"
import Services from "@/components/sections/home2/Services"
import Team from "@/components/sections/home2/Team"
import Testimonial from "@/components/sections/home2/Testimonial"
export default function Home() {

    return (
        <>
            <Layout headerStyle={2} footerStyle={2}>
                <Banner />
                <Services />
                <About />
                <Contactcounter />
                <Projects />
                <Team />
                <Testimonial />
                <Faq />
                <Blog />
                <Brand />
            </Layout>
        </>
    )
}