'use client'

import { useEffect, useRef, useState } from 'react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

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
  const prevRef = useRef(null)
  const nextRef = useRef(null)

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

  const enableLoop = content.items.length >= 6

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

        <div className="home-testimonials__slider-wrap">
          <button
            type="button"
            ref={prevRef}
            className="home-testimonials__nav home-testimonials__nav--prev"
            aria-label="Previous testimonials"
          >
            <span className="icon-angle-left" aria-hidden="true" />
          </button>
          <button
            type="button"
            ref={nextRef}
            className="home-testimonials__nav home-testimonials__nav--next"
            aria-label="Next testimonials"
          >
            <span className="icon-angle-right" aria-hidden="true" />
          </button>

          <Swiper
            key={`home-testimonials-${content.items.length}`}
            modules={[Autoplay, Navigation, Pagination]}
            className="home-testimonials__carousel"
            slidesPerView={1}
            slidesPerGroup={1}
            spaceBetween={24}
            loop={enableLoop}
            speed={700}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current
              swiper.params.navigation.nextEl = nextRef.current
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            breakpoints={{
              768: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 24,
              },
              1200: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                spaceBetween: 28,
              },
            }}
          >
            {content.items.map((item, index) => (
              <SwiperSlide key={`testimonial-${index}-${item.clientName}`}>
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
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}
