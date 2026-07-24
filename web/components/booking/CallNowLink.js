'use client'

import { toTelHref } from '@/lib/cms'
import { useContactDetails } from '@/hooks/useContactDetails'

export default function CallNowLink({ className, children = 'Call Now' }) {
  const { phone } = useContactDetails()
  const href = toTelHref(phone)

  if (!href) return null

  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}
