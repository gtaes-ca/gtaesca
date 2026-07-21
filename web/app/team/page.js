'use client'

import Layout from '@/components/layout/Layout'
import TeamBanner from '@/components/sections/team/TeamBanner'
import TeamGrid from '@/components/sections/team/TeamGrid'

export default function TeamPage() {
    return (
        <div className="team-page">
            <Layout headerStyle={1} footerStyle={1}>
                <TeamBanner />
                <TeamGrid />
            </Layout>
        </div>
    )
}
