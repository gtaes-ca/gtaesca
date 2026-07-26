'use client'

import Layout from '@/components/layout/Layout'
import AboutBanner from '@/components/sections/about/AboutBanner'
import AboutIntro from '@/components/sections/about/AboutIntro'
import AboutValues from '@/components/sections/about/AboutValues'
import AboutCredentials from '@/components/sections/about/AboutCredentials'

export default function AboutPage() {
    return (
        <div className="about-page">
            <Layout headerStyle={1} footerStyle={1}>
                <AboutBanner />
                <AboutIntro />
                <AboutValues />
                <AboutCredentials />
            </Layout>
        </div>
    )
}
