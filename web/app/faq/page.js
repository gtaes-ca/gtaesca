'use client'

import Layout from '@/components/layout/Layout'
import FaqAccordion from '@/components/sections/faq/FaqAccordion'
import FaqBanner from '@/components/sections/faq/FaqBanner'

export default function FaqPage() {
    return (
        <Layout headerStyle={1} footerStyle={1}>
            <FaqBanner />
            <FaqAccordion />
        </Layout>
    )
}
