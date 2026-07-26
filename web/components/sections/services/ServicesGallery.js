'use client'

import Link from 'next/link'
import { useEffect, useCallback, useMemo, useState } from 'react'
import { DEFAULT_SERVICE_CATEGORY_GALLERY, hasGalleryImage, resolveCmsAssetUrl } from '@/lib/cms'
import { serviceCategoryLabel, serviceCategoryPath } from '@/lib/paths'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

function truncateText(text, maxLength = 90) {
    if (!text || text.length <= maxLength) return text
    return `${text.slice(0, maxLength).trim()}...`
}

export default function ServicesGallery({
    pageKey = 'residential',
    serviceId = null,
    showHeader = true,
    embedded = false,
    sectionClassName = '',
}) {
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

    const visibleItems = useMemo(() => {
        return content.items.filter((item) => {
            if (!hasGalleryImage(item.image)) return false
            if (serviceId == null || serviceId === '') return true
            return String(item.serviceId || '') === String(serviceId)
        })
    }, [content.items, serviceId])

    const isOpen = activeIndex !== null && visibleItems[activeIndex]
    const activeItem = isOpen ? visibleItems[activeIndex] : null
    const isServiceScoped = serviceId != null && serviceId !== ''

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

    const categoryLabel = serviceCategoryLabel(pageKey)
    const categoryHref = serviceCategoryPath(pageKey)

    const Wrapper = embedded ? 'div' : 'section'
    const innerClassName = embedded ? 'services-gallery__embedded' : 'container'

    return (
        <Wrapper className={`services-gallery services-gallery--cards${embedded ? ' services-gallery--embedded' : ''}${sectionClassName ? ` ${sectionClassName}` : ''}`}>
            <div className={innerClassName}>
                {showHeader ? (
                    <div className="services-gallery__header">
                        <div className={`section-title${embedded ? '' : ' text-center'}`}>
                            {isServiceScoped ? (
                                <div className="section-title__title-box">
                                    <h2 className="section-title__title">Related Work</h2>
                                </div>
                            ) : (
                                <>
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
                                                        <br />{content.titleLine2}
                                                    </>
                                                ) : null}
                                            </h2>
                                        </div>
                                    ) : null}
                                </>
                            )}
                        </div>
                        {!isServiceScoped && content.buttonText && content.buttonLink ? (
                            <div className="services-gallery__btn-box text-center">
                                <Link href={content.buttonLink} className="thm-btn">
                                    {content.buttonText}
                                </Link>
                            </div>
                        ) : null}
                    </div>
                ) : null}

                <div className="row services-page__grid">
                    {visibleItems.map((item, index) => {
                        const imageUrl = resolveCmsAssetUrl(item.image)
                        const label = item.serviceName || item.subTitle || categoryLabel
                        return (
                            <div
                                className={embedded ? 'col-md-6' : 'col-xl-4 col-lg-6 col-md-6'}
                                key={`${item.serviceId || 'item'}-${item.title}-${index}`}
                            >
                                <article className="services-page__card">
                                    <button
                                        type="button"
                                        className="services-gallery__card-media-btn"
                                        onClick={() => setActiveIndex(index)}
                                        aria-label={item.title ? `View ${item.title}` : `View gallery image ${index + 1}`}
                                    >
                                        <div className="services-page__card-media">
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={item.title || `Gallery image ${index + 1}`}
                                                />
                                            ) : (
                                                <div className="services-page__card-fallback" aria-hidden="true">
                                                    <span className="icon-setting" />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                    <div className="services-page__card-body">
                                        {label ? (
                                            <p className="services-gallery__card-service">{label}</p>
                                        ) : null}
                                        {item.title ? (
                                            <h3 className="services-page__card-title">
                                                <button
                                                    type="button"
                                                    className="services-gallery__card-title-btn"
                                                    onClick={() => setActiveIndex(index)}
                                                >
                                                    {item.title}
                                                </button>
                                            </h3>
                                        ) : null}
                                        {item.text ? (
                                            <p className="services-page__card-text">
                                                {truncateText(item.text)}
                                            </p>
                                        ) : null}
                                        <button
                                            type="button"
                                            className="services-page__card-more"
                                            onClick={() => setActiveIndex(index)}
                                        >
                                            View Photo
                                            <span className="icon-arrow-right" aria-hidden="true" />
                                        </button>
                                    </div>
                                </article>
                            </div>
                        )
                    })}
                </div>

                {isServiceScoped ? (
                    <div className={`services-gallery__footer-link${embedded ? '' : ' text-center'}`}>
                        <Link href={categoryHref} className="thm-btn">
                            View All {categoryLabel} Gallery
                        </Link>
                    </div>
                ) : null}
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
                        {(activeItem.title || activeItem.subTitle || activeItem.serviceName) ? (
                            <div className="services-gallery__lightbox-caption">
                                {(activeItem.serviceName || activeItem.subTitle) ? (
                                    <p>{activeItem.serviceName || activeItem.subTitle}</p>
                                ) : null}
                                {activeItem.title ? <h3>{activeItem.title}</h3> : null}
                                {activeItem.text ? <p>{activeItem.text}</p> : null}
                            </div>
                        ) : null}
                        <p className="services-gallery__lightbox-count">
                            {activeIndex + 1} / {visibleItems.length}
                        </p>
                    </div>
                </div>
            ) : null}
        </Wrapper>
    )
}
