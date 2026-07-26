'use client'

import { useEffect, useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const DEFAULT_CONTENT = {
  tagline: 'Our Values',
  title: 'What We Stand For',
  items: [],
}

export default function AboutValues() {
  const [content, setContent] = useState(DEFAULT_CONTENT)

  useEffect(() => {
    let cancelled = false

    async function loadValues() {
      try {
        const res = await fetch(`${API_URL}/api/web-content/about/values`)
        if (!res.ok) return
        const data = await res.json()
        if (cancelled || !data.content) return
        setContent({
          tagline: data.content.tagline || '',
          title: data.content.title || '',
          items: Array.isArray(data.content.items) ? data.content.items : [],
        })
      } catch {
        // Keep defaults on failure
      }
    }

    loadValues()
    return () => {
      cancelled = true
    }
  }, [])

  if (!content.title && !content.items.length) {
    return null
  }

  return (
    <section className="about-page-values">
      <div className="container">
        <div className="section-title text-center">
          {content.tagline ? (
            <div className="section-title__tagline-box">
              <span className="section-title__tagline">{content.tagline}</span>
            </div>
          ) : null}
          {content.title ? (
            <div className="section-title__title-box">
              <h2 className="section-title__title">{content.title}</h2>
            </div>
          ) : null}
        </div>

        {content.items.length ? (
          <div className="row about-page-values__grid">
            {content.items.map((item) => (
              <div className="col-lg-6" key={`${item.title}-${item.icon}`}>
                <article className="about-page-values__card">
                  <div className="about-page-values__card-top">
                    <div className="about-page-values__icon" aria-hidden="true">
                      <span className={item.icon || 'icon-check'} />
                    </div>
                    <h3 className="about-page-values__card-title">{item.title}</h3>
                  </div>
                  {item.text ? <p className="about-page-values__card-text">{item.text}</p> : null}
                </article>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
