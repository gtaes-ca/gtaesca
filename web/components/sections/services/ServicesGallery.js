'use client'

import Link from 'next/link'
import { useEffect, useCallback, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { DEFAULT_SERVICE_CATEGORY_GALLERY, hasGalleryImage, resolveCmsAssetUrl } from '@/lib/cms'
import { serviceCategoryLabel, serviceCategoryPath } from '@/lib/paths'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const WIDE_COL = 'col-xl-6 col-lg-6 col-md-6'
const NARROW_COL = 'col-xl-3 col-lg-6 col-md-6'

/** Homepage mosaic rhythm: wide, narrow×4, wide, … */
const SLOT_PATTERN = ['wide', 'narrow', 'narrow', 'narrow', 'narrow', 'wide']

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

function itemKey(item, index) {
    return `${item.serviceId || 'item'}-${item.image || item.title}-${index}`
}

/**
 * Place landscape images in wide mosaic slots and portrait in narrow slots,
 * so a portrait-first gallery is not forced into a landscape tile.
 */
function buildOrientationMosaic(items, orientations) {
    const landscape = []
    const portrait = []

    items.forEach((item, index) => {
        const key = itemKey(item, index)
        const entry = { item, sourceIndex: index, key }
        if (orientations[key] === 'portrait') {
            portrait.push(entry)
        } else {
            // landscape or still unknown — treat as landscape for homepage-style wide slots
            landscape.push(entry)
        }
    })

    const result = []
    let li = 0
    let pi = 0
    let slotIndex = 0

    while (li < landscape.length || pi < portrait.length) {
        const slot = SLOT_PATTERN[slotIndex % SLOT_PATTERN.length]

        if (slot === 'wide') {
            if (li < landscape.length) {
                result.push({ ...landscape[li++], columnClass: WIDE_COL })
            } else if (pi < portrait.length) {
                result.push({ ...portrait[pi++], columnClass: NARROW_COL })
            }
        } else if (pi < portrait.length) {
            result.push({ ...portrait[pi++], columnClass: NARROW_COL })
        } else if (li < landscape.length) {
            result.push({ ...landscape[li++], columnClass: NARROW_COL })
        }

        slotIndex += 1
    }

    return result
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
    const [orientations, setOrientations] = useState({})
    const [orientationsReady, setOrientationsReady] = useState(false)

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
                    setOrientationsReady(false)
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
            // Service detail pages: only images linked to this exact service
            if (serviceId != null && serviceId !== '') {
                return String(item.serviceId || '') === String(serviceId)
            }
            // Category pages (if shown): still require a linked service id
            return Boolean(item.serviceId)
        })
    }, [content.items, serviceId])

    // Preload natural dimensions so we can assign wide/narrow slots correctly
    useEffect(() => {
        let cancelled = false
        setOrientationsReady(false)

        if (!visibleItems.length) {
            setOrientationsReady(true)
            return undefined
        }

        const pending = visibleItems.map((item, index) => {
            const key = itemKey(item, index)
            const src = resolveCmsAssetUrl(item.image)
            if (!src) {
                return Promise.resolve({ key, orientation: 'landscape' })
            }

            return new Promise((resolve) => {
                const img = new window.Image()
                img.onload = () => {
                    const orientation = img.naturalHeight > img.naturalWidth ? 'portrait' : 'landscape'
                    resolve({ key, orientation })
                }
                img.onerror = () => resolve({ key, orientation: 'landscape' })
                img.src = src
            })
        })

        Promise.all(pending).then((results) => {
            if (cancelled) return
            const next = {}
            results.forEach(({ key, orientation }) => {
                next[key] = orientation
            })
            setOrientations(next)
            setOrientationsReady(true)
        })

        return () => {
            cancelled = true
        }
    }, [visibleItems])

    const layoutItems = useMemo(() => {
        if (!orientationsReady) return []
        return buildOrientationMosaic(visibleItems, orientations)
    }, [visibleItems, orientations, orientationsReady])

    const isOpen = activeIndex !== null && layoutItems[activeIndex]
    const activeItem = isOpen ? layoutItems[activeIndex].item : null
    const isServiceScoped = serviceId != null && serviceId !== ''

    const closePreview = useCallback(() => {
        setActiveIndex(null)
    }, [])

    const showPrev = useCallback(() => {
        setActiveIndex((current) => {
            if (current === null || !layoutItems.length) return current
            return (current - 1 + layoutItems.length) % layoutItems.length
        })
    }, [layoutItems.length])

    const showNext = useCallback(() => {
        setActiveIndex((current) => {
            if (current === null || !layoutItems.length) return current
            return (current + 1) % layoutItems.length
        })
    }, [layoutItems.length])

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

    if (!visibleItems.length || !orientationsReady) {
        return null
    }

    const categoryLabel = serviceCategoryLabel(pageKey)
    const categoryHref = serviceCategoryPath(pageKey)
    const Wrapper = embedded ? 'div' : 'section'
    const sectionClass = [
        'project-one',
        'home-services-gallery',
        embedded ? 'home-services-gallery--embedded' : '',
        sectionClassName,
    ].filter(Boolean).join(' ')

    return (
        <Wrapper className={sectionClass}>
            <div className={embedded ? '' : 'container'}>
                {showHeader ? (
                    <div className="project-one__top">
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
                                        <div className="section-title__title-box sec-title-animation animation-style1">
                                            <h2 className="section-title__title title-animation">
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
                    {layoutItems.map((entry, index) => {
                        const { item, columnClass, key } = entry
                        const imageUrl = resolveCmsAssetUrl(item.image)
                        const serviceLabel = item.serviceName || item.subTitle || (
                            pageKey === 'commercial' ? 'Commercial' : 'Residential'
                        )
                        const labelParts = [serviceLabel, item.title].filter(Boolean).join(' — ')
                        const orientation = orientations[key] || 'landscape'

                        return (
                            <div
                                className={`${columnClass} wow ${ANIMATION_CLASSES[index % ANIMATION_CLASSES.length]}`}
                                key={key}
                                data-wow-delay={ANIMATION_DELAYS[index % ANIMATION_DELAYS.length]}
                            >
                                <button
                                    type="button"
                                    className="project-one__single home-services-gallery__card"
                                    onClick={() => setActiveIndex(index)}
                                    aria-label={labelParts ? `View ${labelParts}` : `View gallery image ${index + 1}`}
                                >
                                    <div className="project-one__img-box">
                                        <div className={`project-one__img is-${orientation}`}>
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={item.title || serviceLabel || `Gallery image ${index + 1}`}
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
            </div>

            {isOpen && activeItem && typeof document !== 'undefined'
                ? createPortal(
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

                    {layoutItems.length > 1 ? (
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
                            {activeIndex + 1} / {layoutItems.length}
                        </p>
                    </div>
                    </div>,
                    document.body
                )
                : null}
        </Wrapper>
    )
}
