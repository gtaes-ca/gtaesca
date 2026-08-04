'use client'

import Link from 'next/link'
import { useBookingChannel } from '@/hooks/useBookingChannel'

export default function BookServiceLink({ className, onClick, children }) {
  const { label, href, loaded } = useBookingChannel()
  const text = String(children || label || '').trim()

  if (!text) return null

  return (
    <Link
      href={href}
      className={className}
      onClick={onClick}
      aria-busy={!loaded ? 'true' : undefined}
    >
      <span className="thm-btn__label">{text}</span>
      <span className="thm-btn__icon icon-arrow-right" aria-hidden="true" />
    </Link>
  )
}
