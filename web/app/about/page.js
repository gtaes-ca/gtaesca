'use client'

import Layout from '@/components/layout/Layout'
import AboutBanner from '@/components/sections/about/AboutBanner'
import AboutSection from '@/components/sections/shared/AboutSection'
import AboutContact from '@/components/sections/about/AboutContact'

export default function AboutPage() {
    return (
        <div className="about-page">
            <Layout headerStyle={1} footerStyle={1}>
                <AboutBanner />
                <AboutSection variant="about-four" />
                <AboutContact />
            </Layout>
        </div>
    )
}
