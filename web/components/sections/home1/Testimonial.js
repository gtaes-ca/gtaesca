'use client'

import { useEffect, useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const DEFAULT_CONTENT = {
  tagline: '',
  titleLine1: '',
  titleLine2: '',
  items: [],
}

function formatTimestamp(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function StarRating({ rating = 5 }) {
  const filled = Math.min(5, Math.max(1, Number(rating) || 5))
  return (
    <div className="home-testimonials__rating" aria-label={`${filled} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`fas fa-star${star <= filled ? '' : ' is-empty'}`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export default function Testimonial() {
  const [content, setContent] = useState(DEFAULT_CONTENT)

  useEffect(() => {
    let cancelled = false

    async function loadTestimonials() {
      try {
        const res = await fetch(`${API_URL}/api/web-content/home/testimonials`)
        if (!res.ok) return
        const data = await res.json()
        if (cancelled || !data.content) return
        setContent({
          tagline: data.content.tagline || '',
          titleLine1: data.content.titleLine1 || '',
          titleLine2: data.content.titleLine2 || '',
          items: Array.isArray(data.content.items) ? data.content.items : [],
        })
      } catch {
        // Keep empty on failure
      }
    }

    loadTestimonials()
    return () => {
      cancelled = true
    }
  }, [])

  if (!content.items.length) return null

  return (
    <section className="testimonial-one home-testimonials">
      <div className="container">
        <div className="section-title text-center">
          {content.tagline ? (
            <div className="section-title__tagline-box">
              <span className="section-title__tagline">{content.tagline}</span>
            </div>
          ) : null}
          <div className="section-title__title-box sec-title-animation animation-style1">
            <h2 className="section-title__title title-animation">
              {content.titleLine1}
              {content.titleLine2 ? (
                <>
                  <br /> {content.titleLine2}
                </>
              ) : null}
            </h2>
          </div>
        </div>

        <div className="row home-testimonials__grid">
          {content.items.map((item, index) => (
            <div
              className="col-xl-4 col-lg-4 col-md-6"
              key={`testimonial-${index}-${item.clientName}`}
            >
              <article className="home-testimonials__card">
                <div className="home-testimonials__quote" aria-hidden="true">
                  <span className="icon-quote" />
                </div>
                <StarRating rating={item.rating} />
                <p className="home-testimonials__message">{item.message}</p>
                <div className="home-testimonials__meta">
                  <h3 className="home-testimonials__name">{item.clientName}</h3>
                  {item.timestamp ? (
                    <time className="home-testimonials__date" dateTime={item.timestamp}>
                      {formatTimestamp(item.timestamp)}
                    </time>
                  ) : null}
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
