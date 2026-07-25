'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { resolveCmsAssetUrl } from '@/lib/cms'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const DEFAULT_CONTENT = {
  tagline: '',
  title: '',
  text1: '',
  text2: '',
  points: [],
  image: '',
  buttonText: '',
  buttonLink: '/contact',
}

export default function AboutIntro() {
  const [content, setContent] = useState(DEFAULT_CONTENT)

  useEffect(() => {
    let cancelled = false

    async function loadIntro() {
      try {
        const res = await fetch(`${API_URL}/api/web-content/about/intro`)
        if (!res.ok) return
        const data = await res.json()
        if (cancelled || !data.content) return
        setContent({
          tagline: data.content.tagline || '',
          title: data.content.title || '',
          text1: data.content.text1 || '',
          text2: data.content.text2 || '',
          points: Array.isArray(data.content.points) ? data.content.points : [],
          image: data.content.image || '',
          buttonText: data.content.buttonText || '',
          buttonLink: data.content.buttonLink || '/contact',
        })
      } catch {
        // Keep defaults on failure
      }
    }

    loadIntro()
    return () => {
      cancelled = true
    }
  }, [])

  const imageUrl = resolveCmsAssetUrl(content.image)

  return (
    <section className="about-page-intro">
      <div className="container">
        <div className="row align-items-center about-page-intro__row">
          <div className="col-lg-6">
            <div className="about-page-intro__content">
              {content.tagline ? (
                <div className="section-title__tagline-box">
                  <span className="section-title__tagline">{content.tagline}</span>
                </div>
              ) : null}
              {content.title ? (
                <h2 className="about-page-intro__title">{content.title}</h2>
              ) : null}
              {content.text1 ? (
                <p className="about-page-intro__text">{content.text1}</p>
              ) : null}
              {content.text2 ? (
                <p className="about-page-intro__text about-page-intro__text--muted">{content.text2}</p>
              ) : null}

              {content.points.length ? (
                <ul className="about-page-intro__points list-unstyled">
                  {content.points.map((point) => (
                    <li key={point}>
                      <span className="icon-check" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {content.buttonText ? (
                <div className="about-page-intro__btn">
                  <Link href={content.buttonLink || '/contact'} className="thm-btn">
                    {content.buttonText}
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="about-page-intro__media">
              {imageUrl ? (
                <img src={imageUrl} alt={content.title || 'About GTA Electric Services'} />
              ) : null}
              <div className="about-page-intro__media-accent" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
