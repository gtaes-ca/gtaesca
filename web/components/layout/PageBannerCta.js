'use client'

import { useEffect, useRef, useState } from 'react'
import BookServiceLink from '@/components/booking/BookServiceLink'
import CallNowLink from '@/components/booking/CallNowLink'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const DEFAULT_SPECIALTIES = [
  'Licensed & Insured electricians',
  'Residential & Commercial Expertise',
  'Transparent Qoute with no hidden fee',
]

export default function PageBannerCta() {
  const rootRef = useRef(null)
  const [specialties, setSpecialties] = useState(DEFAULT_SPECIALTIES)

  useEffect(() => {
    let cancelled = false

    async function loadSpecialties() {
      try {
        const res = await fetch(`${API_URL}/api/web-content/contact/settings`)
        if (!res.ok) return
        const data = await res.json()
        const items = data?.content?.specificationItems
        if (cancelled) return
        if (Array.isArray(items) && items.length) {
          setSpecialties(items.map((item) => String(item || '').trim()).filter(Boolean))
        }
      } catch {
        // keep defaults on failure
      }
    }

    loadSpecialties()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const banner = rootRef.current?.closest('.page-header')
    if (!banner) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      banner.classList.add('is-ready')
      return undefined
    }

    // Double rAF so the initial hidden styles paint before animating in
    let frame2 = 0
    const frame1 = window.requestAnimationFrame(() => {
      frame2 = window.requestAnimationFrame(() => {
        banner.classList.add('is-ready')
      })
    })

    return () => {
      window.cancelAnimationFrame(frame1)
      window.cancelAnimationFrame(frame2)
      banner.classList.remove('is-ready')
    }
  }, [])

  return (
    <div className="page-header__cta" ref={rootRef}>
      <div className="page-header__cta-actions">
        <CallNowLink className="page-header__cta-btn page-header__cta-btn--call thm-btn" />
        <BookServiceLink className="page-header__cta-btn page-header__cta-btn--outline thm-btn" />
      </div>
      {specialties.length ? (
        <ul className="page-header__specialties list-unstyled" aria-label="Our specialties">
          {specialties.map((item, idx) => (
            <li key={`${idx}-${item}`}>- {item}</li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
