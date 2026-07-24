'use client'

import Layout from '@/components/layout/Layout'
import ServicesBanner from '@/components/sections/services/ServicesBanner'
import ServicesCategoryDetails from '@/components/sections/services/ServicesCategoryDetails'
import ServicesGallery from '@/components/sections/services/ServicesGallery'
import ServicesGrid from '@/components/sections/services/ServicesGrid'

export default function ResidentialServicesPage() {
    return (
        <div className="services-page residential-services-page">
            <Layout headerStyle={1} footerStyle={1}>
                <ServicesBanner pageKey="residential" />
                <ServicesCategoryDetails pageKey="residential" />
                <ServicesGrid group="residential" />
                <ServicesGallery pageKey="residential" />
            </Layout>
        </div>
    )
}
