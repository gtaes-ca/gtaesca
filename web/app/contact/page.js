'use client'

import Layout from '@/components/layout/Layout'
import ContactBanner from '@/components/sections/contact/ContactBanner'
import ContactBookingCta from '@/components/sections/contact/ContactBookingCta'
import ContactSection from '@/components/sections/contact/ContactSection'

export default function ContactPage() {
    return (
        <div className="contact-page">
            <Layout headerStyle={1} footerStyle={1}>
                <ContactBanner />
                <ContactBookingCta />
                <ContactSection />
            </Layout>
        </div>
    )
}
