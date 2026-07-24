'use client'

import { useCallback, useEffect, useState } from 'react'
import { hasGalleryImage, resolveCmsAssetUrl } from '@/lib/cms'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const DEFAULT_HEADING = {
    tagline: 'Our Gallery',
    titleLine1: 'Featured Electrical Work',
    titleLine2: 'Across Homes & Businesses',
}

const COLUMN_CLASSES = [
    'col-xl-6 col-lg-6 col-md-6',
    'col-xl-3 col-lg-6 col-md-6',
    'col-xl-3 col-lg-6 col-md-6',
    'col-xl-3 col-lg-6 col-md-6',
    'col-xl-3 col-lg-6 col-md-6',
    'col-xl-6 col-lg-6 col-md-6',
]

const ANIMATION_CLASSES = [
    'fadeInLeft',
    'fadeInUp',
    'fadeInRight',
    'fadeInLeft',
    'fadeInUp',
    'fadeInRight',
]

const ANIMATION_DELAYS = [
    '100ms',
    '300ms',
    '600ms',
    '900ms',
    '1000ms',
    '1100ms',
]

async function fetchGallery(pageKey) {
    const res = await fetch(`${API_URL}/api/web-content/${pageKey}/gallery`)
    if (!res.ok) return { items: [] }
    const data = await res.json()
    return data.content || { items: [] }
}

export default function HomeServicesGallery() {
    const [items, setItems] = useState([])
    const [heading, setHeading] = useState(DEFAULT_HEADING)
    const [activeIndex, setActiveIndex] = useState(null)

    useEffect(() => {
        let cancelled = false

        async function loadGalleries() {
            try {
                const [residential, commercial] = await Promise.all([
                    fetchGallery('residential'),
                    fetchGallery('commercial'),
                ])
                if (cancelled) return

                const merged = [
                    ...(Array.isArray(residential.items) ? residential.items : []).map((item, index) => ({
                        ...item,
                        pageKey: 'residential',
                        _key: `residential-${index}-${item.image}`,
                    })),
                    ...(Array.isArray(commercial.items) ? commercial.items : []).map((item, index) => ({
                        ...item,
                        pageKey: 'commercial',
                        _key: `commercial-${index}-${item.image}`,
                    })),
                ].filter((item) => hasGalleryImage(item.image))

                setItems(merged)
                setHeading(DEFAULT_HEADING)
            } catch {
                // Keep empty on failure
            }
        }

        loadGalleries()
        return () => {
            cancelled = true
        }
    }, [])

    const isOpen = activeIndex !== null && items[activeIndex]
    const activeItem = isOpen ? items[activeIndex] : null

    const closePreview = useCallback(() => {
        setActiveIndex(null)
    }, [])

    const showPrev = useCallback(() => {
        setActiveIndex((current) => {
            if (current === null || !items.length) return current
            return (current - 1 + items.length) % items.length
        })
    }, [items.length])

    const showNext = useCallback(() => {
        setActiveIndex((current) => {
            if (current === null || !items.length) return current
            return (current + 1) % items.length
        })
    }, [items.length])

    useEffect(() => {
        if (!isOpen) return undefined

        const onKeyDown = (event) => {
            if (event.key === 'Escape') closePreview()
            if (event.key === 'ArrowLeft') showPrev()
            if (event.key === 'ArrowRight') showNext()
        }

        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', onKeyDown)

        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [isOpen, closePreview, showPrev, showNext])

    if (!items.length) {
        return null
    }

    return (
        <>
            <section className="project-one home-services-gallery">
                <div className="container">
                    <div className="project-one__top">
                        <div className="section-title text-center">
                            <div className="section-title__tagline-box">
                                <span className="section-title__tagline">{heading.tagline}</span>
                            </div>
                            <div className="section-title__title-box sec-title-animation animation-style1">
                                <h2 className="section-title__title title-animation">
                                    {heading.titleLine1}
                                    {heading.titleLine2 ? (
                                        <>
                                            <br/>{heading.titleLine2}
                                        </>
                                    ) : null}
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {items.map((item, index) => (
                            <div
                                key={item._key}
                                className={`${COLUMN_CLASSES[index % COLUMN_CLASSES.length]} wow ${ANIMATION_CLASSES[index % ANIMATION_CLASSES.length]}`}
                                data-wow-delay={ANIMATION_DELAYS[index % ANIMATION_DELAYS.length]}
                            >
                                <button
                                    type="button"
                                    className="project-one__single home-services-gallery__card"
                                    onClick={() => setActiveIndex(index)}
                                    aria-label={item.title ? `View ${item.title}` : `View gallery image ${index + 1}`}
                                >
                                    <div className="project-one__img-box">
                                        <div className="project-one__img">
                                            <img src={resolveCmsAssetUrl(item.image)} alt={item.title || ''}/>
                                            <div className="project-one__arrow">
                                                <span className="icon-arrow-right"></span>
                                            </div>
                                        </div>
                                        <div className="project-one__content">
                                            {item.subTitle ? (
                                                <p className="project-one__sub-title">{item.subTitle}</p>
                                            ) : (
                                                <p className="project-one__sub-title">
                                                    {item.pageKey === 'commercial' ? 'Commercial' : 'Residential'}
                                                </p>
                                            )}
                                            {item.title ? (
                                                <h3 className="project-one__title">{item.title}</h3>
                                            ) : null}
                                            {item.text ? (
                                                <p className="project-one__text">{item.text}</p>
                                            ) : null}
                                        </div>
                                    </div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {isOpen && activeItem ? (
                <div
                    className="services-gallery__lightbox"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Gallery preview"
                    onClick={closePreview}
                >
                    <button
                        type="button"
                        className="services-gallery__lightbox-close"
                        onClick={closePreview}
                        aria-label="Close preview"
                    >
                        <span className="fa fa-times" />
                    </button>

                    {items.length > 1 ? (
                        <>
                            <button
                                type="button"
                                className="services-gallery__lightbox-nav services-gallery__lightbox-nav--prev"
                                onClick={(event) => {
                                    event.stopPropagation()
                                    showPrev()
                                }}
                                aria-label="Previous image"
                            >
                                <span className="icon-angle-left" />
                            </button>
                            <button
                                type="button"
                                className="services-gallery__lightbox-nav services-gallery__lightbox-nav--next"
                                onClick={(event) => {
                                    event.stopPropagation()
                                    showNext()
                                }}
                                aria-label="Next image"
                            >
                                <span className="icon-angle-right" />
                            </button>
                        </>
                    ) : null}

                    <div
                        className="services-gallery__lightbox-stage"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <img
                            src={resolveCmsAssetUrl(activeItem.image)}
                            alt={activeItem.title || `Gallery image ${activeIndex + 1}`}
                        />
                        {(activeItem.title || activeItem.subTitle) ? (
                            <div className="services-gallery__lightbox-caption">
                                {activeItem.subTitle ? <p>{activeItem.subTitle}</p> : null}
                                {activeItem.title ? <h3>{activeItem.title}</h3> : null}
                            </div>
                        ) : null}
                        <p className="services-gallery__lightbox-count">
                            {activeIndex + 1} / {items.length}
                        </p>
                    </div>
                </div>
            ) : null}
        </>
    )
}
