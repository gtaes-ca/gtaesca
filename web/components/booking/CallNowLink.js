'use client'

import { toTelHref } from '@/lib/cms'
import { useContactDetails } from '@/hooks/useContactDetails'

export default function CallNowLink({ className, children }) {
  const { phone } = useContactDetails()
  const href = toTelHref(phone)
  const label = String(children || phone || '').trim()

  if (!href || !label) return null

  return (
    <a href={href} className={className}>
      <span className="thm-btn__icon icon-phone-call" aria-hidden="true" />
      <span className="thm-btn__label">{label}</span>
    </a>
  )
}
