'use client'

import { useEffect, useState } from 'react'
import {
  BOOKING_MODES,
  BOOK_SERVICE_CTA_LABEL,
  fetchPublicBookingSettings,
  getBookingCtaLabel,
  isWhatsAppBookingMode,
} from '@/lib/booking'

const DEFAULT_CHANNEL = {
  bookingMode: BOOKING_MODES.FULL,
  isWhatsAppMode: false,
  label: BOOK_SERVICE_CTA_LABEL,
  href: '/book',
}

export function useBookingChannel() {
  const [channel, setChannel] = useState(DEFAULT_CHANNEL)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadChannel() {
      try {
        const settings = await fetchPublicBookingSettings()
        if (cancelled) return
        const bookingMode = settings.bookingMode || BOOKING_MODES.FULL
        setChannel({
          bookingMode,
          isWhatsAppMode: isWhatsAppBookingMode(bookingMode),
          label: getBookingCtaLabel(bookingMode),
          href: '/book',
        })
      } catch {
        if (!cancelled) {
          setChannel(DEFAULT_CHANNEL)
        }
      } finally {
        if (!cancelled) {
          setLoaded(true)
        }
      }
    }

    loadChannel()
    return () => {
      cancelled = true
    }
  }, [])

  return { ...channel, loaded }
}
