'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Layout from '@/components/layout/Layout'
import BookingWizard from '@/components/booking/BookingWizard'

function BookPageContent() {
  const searchParams = useSearchParams()
  const serviceIdsParam = searchParams.get('serviceIds') || ''
  const initialServiceIds = serviceIdsParam
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)

  return (
    <section className="booking-page">
      <div className="container">
        <BookingWizard initialServiceIds={initialServiceIds} />
      </div>
    </section>
  )
}

export default function BookPage() {
  return (
    <div className="book-page">
      <Layout headerStyle={1} footerStyle={1}>
        <Suspense fallback={<section className="booking-page"><div className="container"><p>Loading booking...</p></div></section>}>
          <BookPageContent />
        </Suspense>
      </Layout>
    </div>
  )
}
