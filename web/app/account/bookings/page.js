'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import Layout from '@/components/layout/Layout'
import { useAuth } from '@/context/AuthProvider'
import { authFetch } from '@/lib/auth'
import { DEFAULT_BOOKING_TIMEZONE, formatBookingDateTime, formatBookingSource, formatCurrency } from '@/lib/booking'

const STATUS_LABEL = {
  pending: 'Pending',
  technician_assigned: 'Technician Assigned',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

function statusClass(status) {
  return `status-badge status-badge--${status}`
}

export default function CustomerBookingsPage() {
  const router = useRouter()
  const { isAuthenticated, sessionChecked, logout } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [timezone, setTimezone] = useState(DEFAULT_BOOKING_TIMEZONE)
  const [error, setError] = useState('')

  const loadBookings = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await authFetch('/api/customer/bookings')
      setBookings(data.bookings || [])
    } catch (err) {
      setError(err.message || 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!sessionChecked) return
    if (!isAuthenticated) {
      router.replace('/account/login?redirectTo=/account/bookings')
      return
    }
    loadBookings()
  }, [sessionChecked, isAuthenticated, router, loadBookings])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/bookings/settings`)
      .then((res) => res.json())
      .then((data) => setTimezone(data.settings?.timezone || DEFAULT_BOOKING_TIMEZONE))
      .catch(() => setTimezone(DEFAULT_BOOKING_TIMEZONE))
  }, [])

  if (!sessionChecked || !isAuthenticated) {
    return null
  }

  return (
    <div className="dark-home account-page">
      <Layout headerStyle={1} footerStyle={1}>
        <section className="account account--bookings">
          <div className="container">
            <div className="account__main-tab-box">
              <div className="account__bookings-header">
                <div>
                  <h3 className="account__title">My Bookings</h3>
                  <p className="account__subtitle">View your scheduled services and charges.</p>
                </div>
                <div className="account__bookings-actions">
                  <Link href="/book" className="thm-btn">Book a Service</Link>
                  <button type="button" className="booking-wizard__btn booking-wizard__btn--ghost" onClick={logout}>
                    Sign Out
                  </button>
                </div>
              </div>

              {loading ? (
                <p className="account__subtitle">Loading bookings...</p>
              ) : error ? (
                <p className="account__message account__message--error">{error}</p>
              ) : (
                <div className="booking-wizard">
                  <div className="booking-wizard__body" style={{ paddingTop: 0 }}>
                    <table className="customer-bookings-table">
                      <thead>
                        <tr>
                          <th>Reference</th>
                          <th>Source</th>
                          <th>Service</th>
                          <th>Scheduled</th>
                          <th>Status</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => (
                          <tr key={booking.id}>
                            <td><strong>{booking.referenceCode}</strong></td>
                            <td>
                              <span className={`booking-source-badge booking-source-badge--${booking.bookingSource || 'web'}`}>
                                {formatBookingSource(booking.bookingSource)}
                              </span>
                            </td>
                            <td>{booking.serviceName}</td>
                            <td>{formatBookingDateTime(booking.scheduledAt, timezone)}</td>
                            <td><span className={statusClass(booking.status)}>{STATUS_LABEL[booking.status] || booking.status}</span></td>
                            <td>{formatCurrency(booking.totalPrice ?? booking.servicePrice)}</td>
                          </tr>
                        ))}
                        {bookings.length === 0 ? (
                          <tr>
                            <td colSpan={6}>No bookings linked to your account yet.</td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </Layout>
    </div>
  )
}
