'use client'

import Layout from '@/components/layout/Layout'
import Coverage from '@/components/sections/home1/Coverage'
import ServiceAreasBanner from '@/components/sections/service-areas/ServiceAreasBanner'

export default function ServiceAreasPage() {
    return (
        <Layout headerStyle={1} footerStyle={1}>
            <ServiceAreasBanner />
            <Coverage forceVisible />
        </Layout>
    )
}
