'use client'

import Link from 'next/link'
import { useBookingChannel } from '@/hooks/useBookingChannel'

export default function BookServiceLink({ className, onClick, children }) {
  const { label, href } = useBookingChannel()

  return (
    <Link href={href} className={className} onClick={onClick}>
      <span className="thm-btn__label">{children || label}</span>
      <span className="thm-btn__icon icon-arrow-right" aria-hidden="true" />
    </Link>
  )
}
