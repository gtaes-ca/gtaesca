'use client'

import Layout from '@/components/layout/Layout'
import ContactBanner from '@/components/sections/contact/ContactBanner'
import ContactSection from '@/components/sections/contact/ContactSection'

export default function ContactPage() {
    return (
        <div className="dark-home contact-page">
            <Layout headerStyle={1} footerStyle={1}>
                <ContactBanner />
                <ContactSection />
            </Layout>
        </div>
    )
}
