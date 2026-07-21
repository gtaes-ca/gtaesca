'use client'

import Layout from '@/components/layout/Layout'
import LegalBanner from '@/components/sections/legal/LegalBanner'
import LegalContent from '@/components/sections/legal/LegalContent'

export default function PrivacyPage() {
    return (
        <Layout headerStyle={1} footerStyle={1}>
            <LegalBanner pageKey="privacy" fallbackTitle="Privacy Policy" />
            <LegalContent pageKey="privacy" />
        </Layout>
    )
}
