'use client'

import { Suspense } from 'react'
import Layout from '@/components/layout/Layout'
import TeamMemberDetails from '@/components/sections/team/TeamMemberDetails'

function TeamDetailsFallback() {
    return (
        <section className="team-details">
            <div className="container">
                <p className="mb-0">Loading team member...</p>
            </div>
        </section>
    )
}

export default function TeamDetailsPage() {
    return (
        <div className="team-details-page">
            <Layout headerStyle={1} footerStyle={1}>
                <Suspense fallback={<TeamDetailsFallback />}>
                    <TeamMemberDetails />
                </Suspense>
            </Layout>
        </div>
    )
}
