'use client'

import Layout from '@/components/layout/Layout'
import ProjectsBanner from '@/components/sections/projects/ProjectsBanner'
import ProjectsGrid from '@/components/sections/projects/ProjectsGrid'

export default function ProjectsPage() {
    return (
        <div className="dark-home projects-page">
            <Layout headerStyle={1} footerStyle={1}>
                <ProjectsBanner />
                <ProjectsGrid />
            </Layout>
        </div>
    )
}
