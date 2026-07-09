
import Layout from "@/components/layout/Layout"
import About from "@/components/sections/home3/About"
import Banner from "@/components/sections/home3/Banner"
import Services from "@/components/sections/home3/Services"
import Blog from "@/components/sections/home3/Blog"
import Process from "@/components/sections/home3/Process"
import Skill from "@/components/sections/home3/Skill"
import Pricing from "@/components/sections/home3/Pricing"
export default function Home() {

    return (
        <>
            <Layout headerStyle={3} footerStyle={3}>
                <Banner />
                <About />
                <Services />
                <Process />
                <Skill />
                <Pricing />
                <Blog />
            </Layout>
        </>
    )
}