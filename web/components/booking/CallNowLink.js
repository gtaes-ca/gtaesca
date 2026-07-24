'use client'

import { toTelHref } from '@/lib/cms'
import { useContactDetails } from '@/hooks/useContactDetails'

export default function CallNowLink({ className, children = 'Call Now' }) {
  const { phone } = useContactDetails()
  const href = toTelHref(phone)

  if (!href) return null

  return (
    <a href={href} className={className}>
      <span className="thm-btn__icon icon-phone-call" aria-hidden="true" />
      <span className="thm-btn__label">{children}</span>
    </a>
  )
}
