'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const DEFAULT_CONTENT = {
  tagline: '',
  titleLine1: '',
  titleLine2: '',
  text: '',
  gtaLabel: 'Greater Toronto Area',
  nearbyLabel: 'Nearby Areas',
  locations: { gta: [], nearby: [] },
}

export default function Coverage() {
  const sectionRef = useRef(null)
  const [content, setContent] = useState(DEFAULT_CONTENT)
  const [activeRegion, setActiveRegion] = useState('gta')
  const [isVisible, setIsVisible] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadCoverage() {
      try {
        const res = await fetch(`${API_URL}/api/web-content/home/coverage`)
        if (!res.ok) {
          if (!cancelled) {
            setContent({
              ...DEFAULT_CONTENT,
              tagline: 'Service Coverage',
              titleLine1: 'Areas We Serve Across the GTA',
              text: 'Licensed electrical service throughout the Greater Toronto Area and nearby communities.',
            })
            setLoaded(true)
          }
          return
        }
        const data = await res.json()
        if (cancelled) return

        if (data.content) {
          const next = {
            tagline: data.content.tagline || '',
            titleLine1: data.content.titleLine1 || '',
            titleLine2: data.content.titleLine2 || '',
            text: data.content.text || '',
            gtaLabel: data.content.gtaLabel || 'Greater Toronto Area',
            nearbyLabel: data.content.nearbyLabel || 'Nearby Areas',
            locations: {
              gta: Array.isArray(data.content.locations?.gta) ? data.content.locations.gta : [],
              nearby: Array.isArray(data.content.locations?.nearby) ? data.content.locations.nearby : [],
            },
          }
          setContent(next)

          if (!next.locations.gta.length && next.locations.nearby.length) {
            setActiveRegion('nearby')
          }
        }
      } catch {
        if (!cancelled) {
          setContent({
            ...DEFAULT_CONTENT,
            tagline: 'Service Coverage',
            titleLine1: 'Areas We Serve Across the GTA',
            text: 'Licensed electrical service throughout the Greater Toronto Area and nearby communities.',
          })
        }
      } finally {
        if (!cancelled) setLoaded(true)
      }
    }

    loadCoverage()
    return () => {
      cancelled = true
    }
  }, [])

  const categories = useMemo(
    () => [
      {
        key: 'gta',
        label: content.gtaLabel,
        items: content.locations.gta,
      },
      {
        key: 'nearby',
        label: content.nearbyLabel,
        items: content.locations.nearby,
      },
    ].filter((category) => category.items.length > 0),
    [content]
  )

  const hasContent = Boolean(content.titleLine1 || categories.length)

  useEffect(() => {
    if (!loaded || !hasContent) return undefined

    const node = sectionRef.current
    if (!node) return undefined

    // If already on screen (or section is tall), show immediately
    const rect = node.getBoundingClientRect()
    const inView = rect.top < window.innerHeight * 0.9 && rect.bottom > 0
    if (inView) {
      setIsVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -5% 0px',
      }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [loaded, hasContent])

  const activeItems = content.locations[activeRegion] || []

  if (!loaded) {
    return null
  }

  if (!hasContent) {
    return null
  }

  return (
    <section
      ref={sectionRef}
      className={`home-coverage${isVisible ? ' is-visible' : ''}`}
    >
      <div className="container">
        <div className="section-title text-center home-coverage__intro">
          {content.tagline ? (
            <div className="section-title__tagline-box home-coverage__anim home-coverage__anim--tagline">
              <span className="section-title__tagline">{content.tagline}</span>
            </div>
          ) : null}
          <div className="section-title__title-box home-coverage__anim home-coverage__anim--title">
            <h2 className="section-title__title">
              {content.titleLine1}
              {content.titleLine2 ? (
                <>
                  <br /> {content.titleLine2}
                </>
              ) : null}
            </h2>
          </div>
          {content.text ? (
            <p className="home-coverage__details home-coverage__anim home-coverage__anim--text">
              {content.text}
            </p>
          ) : null}
        </div>

        {categories.length ? (
          <>
            <div
              className="home-coverage__categories home-coverage__anim home-coverage__anim--categories"
              role="tablist"
              aria-label="Coverage areas"
            >
              {categories.map((category) => {
                const isActive = category.key === activeRegion
                return (
                  <button
                    key={category.key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`home-coverage__category${isActive ? ' is-active' : ''}`}
                    onClick={() => setActiveRegion(category.key)}
                  >
                    {category.label}
                  </button>
                )
              })}
            </div>

            <div className="home-coverage__chips" role="tabpanel">
              {activeItems.map((location, index) => (
                <span
                  key={location.id}
                  className="home-coverage__chip home-coverage__anim home-coverage__anim--chip"
                  style={{ '--chip-delay': `${Math.min(index, 18) * 45}ms` }}
                >
                  {location.label || location.name}
                </span>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}
