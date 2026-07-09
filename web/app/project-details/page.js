'use client'

import { Suspense } from 'react'
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

export default function ProjectDetailsPage() {
    return (
        <div className="dark-home project-details-page">
            <Layout headerStyle={1} footerStyle={1}>
                <Suspense fallback={<ProjectDetailsFallback />}>
                    <ProjectDetailView />
                </Suspense>
            </Layout>
        </div>
    )
}
