'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthProvider'
import { useBookingChannel } from '@/hooks/useBookingChannel'

export default function AccountNav() {
  const { isAuthenticated, sessionChecked } = useAuth()
  const { isWhatsAppMode, loaded: channelLoaded } = useBookingChannel()

  if (!sessionChecked || !channelLoaded || isWhatsAppMode) {
    return null
  }

  if (isAuthenticated) {
    return (
      <div className="main-menu__account-nav">
        <Link href="/account/bookings" className="main-menu__account-link">
          My Bookings
        </Link>
      </div>
    )
  }

  return (
    <div className="main-menu__account-nav">
      <Link href="/account/login" className="main-menu__account-link">
        Sign In
      </Link>
    </div>
  )
}
