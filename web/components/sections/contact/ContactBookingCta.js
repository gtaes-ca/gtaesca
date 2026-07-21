'use client'

import Link from 'next/link'
import { useBookingChannel } from '@/hooks/useBookingChannel'

export default function ContactBookingCta() {
  const { isWhatsAppMode, label, href, loaded } = useBookingChannel()

  if (!loaded || !isWhatsAppMode) {
    return null
  }

  return (
    <section className="contact-booking-cta">
      <div className="container">
        <div className="contact-booking-cta__inner">
          <div className="contact-booking-cta__content">
            <span className="contact-booking-cta__tag">WhatsApp Booking</span>
            <h3>Book your service via WhatsApp</h3>
            <p>
              Use our booking wizard to choose your services, preferred time, and contact details.
              We&apos;ll open WhatsApp so you can send the request directly to our team.
            </p>
          </div>
          <div className="contact-booking-cta__action">
            <Link href={href} className="thm-btn contact-booking-cta__btn">{label}</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
