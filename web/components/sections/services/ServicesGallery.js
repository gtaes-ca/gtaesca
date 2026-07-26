'use client'

import Link from 'next/link'
import { useEffect, useCallback, useMemo, useState } from 'react'
import { DEFAULT_SERVICE_CATEGORY_GALLERY, hasGalleryImage, resolveCmsAssetUrl } from '@/lib/cms'
import { serviceCategoryLabel, serviceCategoryPath } from '@/lib/paths'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const COLUMN_CLASSES = [
    'col-xl-6 col-lg-6 col-md-6',
    'col-xl-3 col-lg-6 col-md-6',
    'col-xl-3 col-lg-6 col-md-6',
    'col-xl-3 col-lg-6 col-md-6',
    'col-xl-3 col-lg-6 col-md-6',
    'col-xl-6 col-lg-6 col-md-6',
]

export default function ServicesGallery({
    pageKey = 'residential',
    serviceId = null,
    showHeader = true,
    embedded = false,
    sectionClassName = '',
}) {
    const [content, setContent] = useState(DEFAULT_SERVICE_CATEGORY_GALLERY)
    const [activeIndex, setActiveIndex] = useState(null)
    const [orientations, setOrientations] = useState({})

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
                    setOrientations({})
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

    const rememberOrientation = useCallback((key, event) => {
        const { naturalWidth, naturalHeight } = event.currentTarget
        if (!naturalWidth || !naturalHeight) return
        const orientation = naturalHeight > naturalWidth ? 'portrait' : 'landscape'
        setOrientations((prev) => (
            prev[key] === orientation ? prev : { ...prev, [key]: orientation }
        ))
    }, [])

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
        <Wrapper className={`services-gallery services-gallery--project${embedded ? ' services-gallery--embedded' : ''}${sectionClassName ? ` ${sectionClassName}` : ''}`}>
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
                    </div>
                ) : null}

                <div className="row">
                    {visibleItems.map((item, index) => {
                        const imageUrl = resolveCmsAssetUrl(item.image)
                        const serviceLabel = item.serviceName || item.subTitle || categoryLabel
                        const columnClass = embedded
                            ? 'col-md-6'
                            : COLUMN_CLASSES[index % COLUMN_CLASSES.length]
                        const itemKey = `${item.serviceId || 'item'}-${item.image || item.title}-${index}`
                        const orientation = orientations[itemKey] || 'landscape'
                        const labelParts = [serviceLabel, item.title].filter(Boolean).join(' — ')

                        return (
                            <div
                                className={columnClass}
                                key={itemKey}
                            >
                                <button
                                    type="button"
                                    className="project-one__single home-services-gallery__card services-gallery__project-card"
                                    onClick={() => setActiveIndex(index)}
                                    aria-label={labelParts ? `View ${labelParts}` : `View gallery image ${index + 1}`}
                                >
                                    <div className="project-one__img-box">
                                        <div className={`project-one__img is-${orientation}`}>
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={item.title || serviceLabel || `Gallery image ${index + 1}`}
                                                    onLoad={(event) => rememberOrientation(itemKey, event)}
                                                />
                                            ) : null}
                                            <div className="project-one__arrow">
                                                <span className="icon-arrow-right" />
                                            </div>
                                        </div>
                                        <div className="project-one__content">
                                            {serviceLabel ? (
                                                <p className="project-one__sub-title">{serviceLabel}</p>
                                            ) : null}
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
                        {(activeItem.serviceName || activeItem.subTitle || activeItem.title) ? (
                            <div className="services-gallery__lightbox-caption">
                                {(activeItem.serviceName || activeItem.subTitle) ? (
                                    <p>{activeItem.serviceName || activeItem.subTitle}</p>
                                ) : null}
                                {activeItem.title ? <h3>{activeItem.title}</h3> : null}
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
