'use client'

import Layout from '@/components/layout/Layout'
import LegalBanner from '@/components/sections/legal/LegalBanner'
import LegalContent from '@/components/sections/legal/LegalContent'

export default function TermsPage() {
    return (
        <Layout headerStyle={1} footerStyle={1}>
            <LegalBanner pageKey="terms" fallbackTitle="Terms and Conditions" />
            <LegalContent pageKey="terms" />
        </Layout>
    )
}
