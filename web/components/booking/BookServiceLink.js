'use client'

import Link from 'next/link'
import { useBookingChannel } from '@/hooks/useBookingChannel'

export default function BookServiceLink({ className, onClick, children }) {
  const { label, href } = useBookingChannel()

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children || label}
    </Link>
  )
}
