'use client'

import Layout from '@/components/layout/Layout'
import ServicesBanner from '@/components/sections/services/ServicesBanner'
import ServicesGrid from '@/components/sections/services/ServicesGrid'

export default function ServicesPage() {
    return (
        <div className="services-page">
            <Layout headerStyle={1} footerStyle={1}>
                <ServicesBanner />
                <ServicesGrid />
            </Layout>
        </div>
    )
}
