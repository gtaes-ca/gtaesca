'use client'

import { useEffect, useState } from 'react'
import {
  BOOKING_MODES,
  fetchPublicBookingSettings,
  getBookingCtaHref,
  getBookingCtaLabel,
  isWhatsAppBookingMode,
} from '@/lib/booking'

const BOOKING_MODE_CACHE_KEY = 'gtaes.bookingMode'

function readCachedBookingMode() {
  if (typeof window === 'undefined') return BOOKING_MODES.WHATSAPP
  try {
    const cached = window.sessionStorage.getItem(BOOKING_MODE_CACHE_KEY)
    if (cached === BOOKING_MODES.FULL || cached === BOOKING_MODES.WHATSAPP) {
      return cached
    }
  } catch {
    // ignore storage errors
  }
  return BOOKING_MODES.WHATSAPP
}

function channelFromMode(bookingMode) {
  return {
    bookingMode,
    isWhatsAppMode: isWhatsAppBookingMode(bookingMode),
    label: getBookingCtaLabel(bookingMode),
    href: getBookingCtaHref(bookingMode),
  }
}

export function useBookingChannel() {
  // Stable first paint: WhatsApp CTA ("Request a Free Quote") — no "Book a Service" flash
  const [channel, setChannel] = useState(() => channelFromMode(BOOKING_MODES.WHATSAPP))
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    // Prefer last known mode immediately (after hydration)
    setChannel(channelFromMode(readCachedBookingMode()))

    async function loadChannel() {
      try {
        const settings = await fetchPublicBookingSettings()
        if (cancelled) return
        const bookingMode = settings.bookingMode || BOOKING_MODES.FULL
        try {
          window.sessionStorage.setItem(BOOKING_MODE_CACHE_KEY, bookingMode)
        } catch {
          // ignore storage errors
        }
        setChannel(channelFromMode(bookingMode))
      } catch {
        if (!cancelled) {
          setChannel(channelFromMode(readCachedBookingMode()))
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
