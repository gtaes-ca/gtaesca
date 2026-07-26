'use client'

import { useEffect, useState } from 'react'
import { resolveCmsAssetUrl } from '@/lib/cms'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const DEFAULT_CONTENT = {
  title: 'Licensed & Certified',
  esaLicenseNumber: '',
  items: [],
}

function isEsaItem(item) {
  const label = String(item?.label || '').toLowerCase()
  const image = String(item?.image || '').toLowerCase()
  return label.includes('esa') || image.includes('esa')
}

export default function AboutCredentials() {
  const [content, setContent] = useState(DEFAULT_CONTENT)

  useEffect(() => {
    let cancelled = false

    async function loadCredentials() {
      try {
        const res = await fetch(`${API_URL}/api/web-content/about/credentials`)
        if (!res.ok) return
        const data = await res.json()
        if (cancelled || !data.content) return
        setContent({
          title: data.content.title || '',
          esaLicenseNumber: data.content.esaLicenseNumber || '',
          items: Array.isArray(data.content.items) ? data.content.items : [],
        })
      } catch {
        // Keep defaults on failure
      }
    }

    loadCredentials()
    return () => {
      cancelled = true
    }
  }, [])

  if (!content.title && !content.items.length) {
    return null
  }

  const licenseNumber = String(content.esaLicenseNumber || '')
    .trim()
    .replace(/^esa\s*licen[sc]e[d]?\s*/i, '')
    .trim()
    .split(/\r?\n/)[0]
    .trim()

  return (
    <section className="about-page-credentials">
      <div className="container">
        {content.title ? (
          <div className="about-page-credentials__header text-center">
            <h2 className="about-page-credentials__title">{content.title}</h2>
          </div>
        ) : null}

        {content.items.length ? (
          <div className="row about-page-credentials__grid justify-content-center">
            {content.items.map((item) => {
              const imageUrl = resolveCmsAssetUrl(item.image)
              const showLicense = Boolean(licenseNumber) && isEsaItem(item)
              return (
                <div className="col-md-6 col-lg-5" key={`${item.label}-${item.image}`}>
                  <div className="about-page-credentials__item">
                    <div className="about-page-credentials__card">
                      {imageUrl ? (
                        <img src={imageUrl} alt={item.label || 'Credential'} />
                      ) : null}
                    </div>
                    {item.label ? (
                      <p className="about-page-credentials__label">{item.label}</p>
                    ) : null}
                    {showLicense ? (
                      <p className="about-page-credentials__license">{licenseNumber}</p>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        ) : null}
      </div>
    </section>
  )
}
