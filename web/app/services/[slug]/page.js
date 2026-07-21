'use client'

import { Suspense } from 'react'
import { useParams } from 'next/navigation'
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

export default function ServiceSlugPage() {
    const params = useParams()
    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug

    return (
        <div className="service-details-page">
            <Layout headerStyle={1} footerStyle={1}>
                <Suspense fallback={<ServiceDetailsFallback />}>
                    <ServiceDetailView serviceSlug={slug} />
                </Suspense>
            </Layout>
        </div>
    )
}
