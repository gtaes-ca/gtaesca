'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Layout from '@/components/layout/Layout'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const reference = searchParams.get('ref')

  return (
    <section className="booking-page">
      <div className="container">
        <div className="booking-wizard">
          <div className="booking-confirmation">
            <h1>Booking Submitted</h1>
            <p>Thank you. Your web booking request has been received and is pending confirmation.</p>
            {reference ? (
              <p>Reference: <strong>{reference}</strong></p>
            ) : null}
            <p>A confirmation email has been sent with next steps.</p>
            <div className="booking-confirmation__actions">
              <Link href="/account/login" className="thm-btn">Sign In</Link>
              <Link href="/account/bookings" className="booking-wizard__btn booking-wizard__btn--ghost">My Bookings</Link>
              <Link href="/" className="booking-wizard__btn booking-wizard__btn--ghost">Back Home</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function BookingConfirmationPage() {
  return (
    <div className="dark-home book-page">
      <Layout headerStyle={1} footerStyle={1}>
        <Suspense fallback={<section className="booking-page"><div className="container"><p>Loading...</p></div></section>}>
          <ConfirmationContent />
        </Suspense>
      </Layout>
    </div>
  )
}
