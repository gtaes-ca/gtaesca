'use client'

import Link from 'next/link'
import { useEffect, useCallback, useState } from 'react'
import { DEFAULT_SERVICE_CATEGORY_GALLERY, hasGalleryImage, resolveCmsAssetUrl } from '@/lib/cms'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function ServicesGallery({ pageKey = 'residential' }) {
    const [content, setContent] = useState(DEFAULT_SERVICE_CATEGORY_GALLERY)
    const [activeIndex, setActiveIndex] = useState(null)

    useEffect(() => {
        let cancelled = false

        async function loadGallery() {
            try {
                const res = await fetch(`${API_URL}/api/web-content/${pageKey}/gallery`)
                if (!res.ok) return
                const data = await res.json()
                if (cancelled) return
                if (data.content) {
                    setContent({
                        ...DEFAULT_SERVICE_CATEGORY_GALLERY,
                        ...data.content,
                        items: Array.isArray(data.content.items) ? data.content.items : [],
                    })
                }
            } catch {
                // Keep defaults on failure
            }
        }

        loadGallery()
        return () => {
            cancelled = true
        }
    }, [pageKey])

    const visibleItems = content.items.filter((item) => hasGalleryImage(item.image))
    const isOpen = activeIndex !== null && visibleItems[activeIndex]
    const activeItem = isOpen ? visibleItems[activeIndex] : null

    const closePreview = useCallback(() => {
        setActiveIndex(null)
    }, [])

    const showPrev = useCallback(() => {
        setActiveIndex((current) => {
            if (current === null || !visibleItems.length) return current
            return (current - 1 + visibleItems.length) % visibleItems.length
        })
    }, [visibleItems.length])

    const showNext = useCallback(() => {
        setActiveIndex((current) => {
            if (current === null || !visibleItems.length) return current
            return (current + 1) % visibleItems.length
        })
    }, [visibleItems.length])

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

    if (!visibleItems.length) {
        return null
    }

    return (
        <section className="services-gallery">
            <div className="container">
                <div className="services-gallery__header">
                    <div className="section-title text-center">
                        {content.tagline ? (
                            <div className="section-title__tagline-box">
                                <span className="section-title__tagline">{content.tagline}</span>
                            </div>
                        ) : null}
                        {(content.titleLine1 || content.titleLine2) ? (
                            <div className="section-title__title-box">
                                <h2 className="section-title__title">
                                    {content.titleLine1}
                                    {content.titleLine2 ? (
                                        <>
                                            <br/>{content.titleLine2}
                                        </>
                                    ) : null}
                                </h2>
                            </div>
                        ) : null}
                    </div>
                    {content.buttonText && content.buttonLink ? (
                        <div className="services-gallery__btn-box text-center">
                            <Link href={content.buttonLink} className="thm-btn">
                                {content.buttonText}
                            </Link>
                        </div>
                    ) : null}
                </div>

                <div className="services-gallery__thumbs" role="list">
                    {visibleItems.map((item, index) => (
                        <button
                            key={`${item.title}-${index}`}
                            type="button"
                            role="listitem"
                            className="services-gallery__thumb"
                            onClick={() => setActiveIndex(index)}
                            aria-label={item.title ? `View ${item.title}` : `View gallery image ${index + 1}`}
                        >
                            <img
                                src={resolveCmsAssetUrl(item.image)}
                                alt={item.title || `Gallery image ${index + 1}`}
                            />
                        </button>
                    ))}
                </div>
            </div>

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

                    {visibleItems.length > 1 ? (
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
                            {activeIndex + 1} / {visibleItems.length}
                        </p>
                    </div>
                </div>
            ) : null}
        </section>
    )
}
