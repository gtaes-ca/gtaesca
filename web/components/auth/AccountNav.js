'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthProvider'

export default function AccountNav() {
  const { user, isAuthenticated, sessionChecked } = useAuth()

  if (!sessionChecked) {
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
