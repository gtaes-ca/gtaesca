'use client'

import { Suspense } from 'react'
import { useParams } from 'next/navigation'
import Layout from '@/components/layout/Layout'
import ProjectDetailView from '@/components/sections/projects/ProjectDetailView'

function ProjectDetailsFallback() {
    return (
        <section className="project-details">
            <div className="container">
                <p className="mb-0">Loading project...</p>
            </div>
        </section>
    )
}

export default function ProjectSlugPage() {
    const params = useParams()
    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug

    return (
        <div className="project-details-page">
            <Layout headerStyle={1} footerStyle={1}>
                <Suspense fallback={<ProjectDetailsFallback />}>
                    <ProjectDetailView projectSlug={slug} />
                </Suspense>
            </Layout>
        </div>
    )
}
