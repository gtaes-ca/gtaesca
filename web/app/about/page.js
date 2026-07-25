'use client'

import Layout from '@/components/layout/Layout'
import AboutBanner from '@/components/sections/about/AboutBanner'
import AboutIntro from '@/components/sections/about/AboutIntro'
import AboutContact from '@/components/sections/about/AboutContact'

export default function AboutPage() {
    return (
        <div className="about-page">
            <Layout headerStyle={1} footerStyle={1}>
                <AboutBanner />
                <AboutIntro />
                <AboutContact />
            </Layout>
        </div>
    )
}
