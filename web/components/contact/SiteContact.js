'use client'

import Link from 'next/link'
import { toTelHref } from '@/lib/cms'
import { useContactDetails } from '@/hooks/useContactDetails'

export function SitePhoneLink({ className, phone: phoneProp }) {
  const details = useContactDetails()
  const phone = phoneProp ?? details.phone
  if (!phone) return null
  const href = toTelHref(phone)
  if (!href) return <span className={className}>{phone}</span>
  return (
    <Link href={href} className={className}>
      {phone}
    </Link>
  )
}

export function SiteEmailLink({ className, email: emailProp }) {
  const details = useContactDetails()
  const email = emailProp ?? details.email
  if (!email) return null
  return (
    <Link href={`mailto:${email}`} className={className}>
      {email}
    </Link>
  )
}

export function SiteAddress({ className, as: Tag = 'p', address: addressProp }) {
  const details = useContactDetails()
  const address = addressProp ?? details.address
  if (!address) return null
  return <Tag className={className}>{address}</Tag>
}

/** Sidebar “Get Started Today” contact points */
export function GetStartedContactPoints() {
  const { phone, email, address } = useContactDetails()

  if (!phone && !email && !address) return null

  return (
    <ul className="project-details__get-started-points list-unstyled">
      {phone ? (
        <li>
          <div className="icon">
            <span className="icon-call"></span>
          </div>
          <p>
            <Link href={toTelHref(phone)}>{phone}</Link>
          </p>
        </li>
      ) : null}
      {email ? (
        <li>
          <div className="icon">
            <span className="icon-envelope"></span>
          </div>
          <p>
            <Link href={`mailto:${email}`}>{email}</Link>
          </p>
        </li>
      ) : null}
      {address ? (
        <li>
          <div className="icon">
            <span className="icon-location"></span>
          </div>
          <p>{address}</p>
        </li>
      ) : null}
    </ul>
  )
}

/** CTA “Make a call” number */
export function CtaCallNumber({ headingTag: Heading = 'h4' }) {
  const { phone } = useContactDetails()
  if (!phone) return null
  return (
    <Heading>
      <Link href={toTelHref(phone)}>{phone}</Link>
    </Heading>
  )
}
