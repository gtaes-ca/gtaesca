'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBookingChannel } from '@/hooks/useBookingChannel'

/**
 * Renders children only in full booking mode. Redirects to home in WhatsApp mode.
 */
export default function BookingOnlyGate({ children, fallback = null }) {
  const router = useRouter()
  const { isWhatsAppMode, loaded } = useBookingChannel()

  useEffect(() => {
    if (loaded && isWhatsAppMode) {
      router.replace('/')
    }
  }, [isWhatsAppMode, loaded, router])

  if (!loaded || isWhatsAppMode) {
    return fallback
  }

  return children
}
