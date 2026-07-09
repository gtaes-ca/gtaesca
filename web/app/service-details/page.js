'use client'

import { Suspense } from 'react'
import Layout from '@/components/layout/Layout'
import ServiceDetailView from '@/components/sections/services/ServiceDetailView'

function ServiceDetailsFallback() {
    return (
        <section className="service-details">
            <div className="container">
                <p className="mb-0">Loading service...</p>
            </div>
        </section>
    )
}

export default function ServiceDetailsPage() {
    return (
        <div className="dark-home service-details-page">
            <Layout headerStyle={1} footerStyle={1}>
                <Suspense fallback={<ServiceDetailsFallback />}>
                    <ServiceDetailView />
                </Suspense>
            </Layout>
        </div>
    )
}
