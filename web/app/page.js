import Layout from "@/components/layout/Layout"
import About from "@/components/sections/home1/About"
import Banner from "@/components/sections/home1/Banner"
import Service from "@/components/sections/home1/Service"
import Servicetwo from "@/components/sections/home1/Servicetwo"
import Project from "@/components/sections/home1/Project"

export default function Home() {
    return (
        <Layout headerStyle={1} footerStyle={1}>
                <Banner />
                <Service />
                <About />
                <Servicetwo />
                <Project />
            </Layout>
    )
}
