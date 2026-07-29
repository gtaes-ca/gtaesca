'use client'

import Layout from '@/components/layout/Layout'
import ServicesBanner from '@/components/sections/services/ServicesBanner'
import ServicesCategoryDetails from '@/components/sections/services/ServicesCategoryDetails'
import ServicesGrid from '@/components/sections/services/ServicesGrid'

export default function CommercialServicesPage() {
    return (
        <div className="services-page commercial-services-page">
            <Layout headerStyle={1} footerStyle={1}>
                <ServicesBanner pageKey="commercial" />
                <ServicesCategoryDetails pageKey="commercial" />
                <ServicesGrid group="commercial" />
            </Layout>
        </div>
    )
}
