'use client'
import Link from "next/link"
import { Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { useEffect, useMemo, useState } from 'react'
import { resolveCmsAssetUrl } from '@/lib/cms'
import { buildTelHref, fetchPublicBookingSettings } from '@/lib/booking'
import { useContactDetails } from '@/hooks/useContactDetails'
import BookServiceLink from '@/components/booking/BookServiceLink'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

function buildSwiperOptions(slideCount) {
    return {
        modules: [Pagination],
        slidesPerView: 1,
        spaceBetween: 0,
        // Looping a single slide leaves Swiper without usable duplicates
        loop: slideCount > 1,
        // Grow with slide content so CTAs are never clipped
        autoHeight: true,
        // Re-measure when slides or fonts settle at different speeds per device
        observer: true,
        observeParents: true,
        resizeObserver: true,
        watchOverflow: true,
        pagination: {
            clickable: true,
        },
    }
}

const SOCIAL_ITEMS = [
    { key: 'facebook', icon: 'icon-facebook' },
    { key: 'twitter', icon: 'icon-xpa' },
    { key: 'linkedin', icon: 'icon-link-in' },
    { key: 'instagram', icon: 'icon-instagram' },
]

const DEFAULT_SPECIALTIES = [
    'Licensed & Insured electricians',
    'Residential & Commercial Expertise',
    'Transparent Qoute with no hidden fee',
]

function slideBackgroundStyle(slide) {
    const desktop = resolveCmsAssetUrl(slide.backgroundImage)
    const mobile = resolveCmsAssetUrl(slide.backgroundImageMobile || slide.backgroundImage)

    if (!desktop && !mobile) return undefined

    return {
        ...(mobile ? { '--slider-bg-mobile': `url("${mobile}")` } : {}),
        ...(desktop ? { '--slider-bg-desktop': `url("${desktop}")` } : {}),
    }
}

export default function Banner() {
    const [slides, setSlides] = useState([])
    const [callHref, setCallHref] = useState(null)
    const [specialties, setSpecialties] = useState(DEFAULT_SPECIALTIES)
    const contactDetails = useContactDetails()

    const socialLinks = useMemo(
        () => SOCIAL_ITEMS
            .map((item) => ({
                ...item,
                href: contactDetails.social?.[item.key] || '',
            }))
            .filter((item) => item.href),
        [contactDetails.social]
    )

    useEffect(() => {
        let cancelled = false

        async function loadSlider() {
            try {
                const res = await fetch(`${API_URL}/api/web-content/home/slider`)
                if (!res.ok) return
                const data = await res.json()
                if (cancelled) return
                if (Array.isArray(data.content?.slides)) {
                    setSlides(data.content.slides)
                }
            } catch {
                // leave empty on failure
            }
        }

        async function loadCallNumber() {
            try {
                const settings = await fetchPublicBookingSettings()
                if (cancelled) return
                setCallHref(buildTelHref(settings.companyWhatsappNumber))
            } catch {
                // Call Now stays hidden if settings unavailable
            }
        }

        async function loadSpecialties() {
            try {
                const res = await fetch(`${API_URL}/api/web-content/contact/settings`)
                if (!res.ok) return
                const data = await res.json()
                const items = data?.content?.specificationItems
                if (cancelled) return
                if (Array.isArray(items) && items.length) {
                    setSpecialties(items.map((item) => String(item || '').trim()).filter(Boolean))
                }
            } catch {
                // keep defaults on failure
            }
        }

        loadSlider()
        loadCallNumber()
        loadSpecialties()
        return () => {
            cancelled = true
        }
    }, [])

    useEffect(() => {
        const root = document.documentElement
        const header = document.querySelector('.main-header')

        const syncHeroOffset = () => {
            const headerHeight = header?.getBoundingClientRect().height || 0
            if (headerHeight > 0) {
                root.style.setProperty('--hero-header-offset', `${Math.ceil(headerHeight)}px`)
            }
        }

        syncHeroOffset()

        const resizeObserver = typeof ResizeObserver !== 'undefined' && header
            ? new ResizeObserver(syncHeroOffset)
            : null
        if (resizeObserver && header) {
            resizeObserver.observe(header)
        }

        window.addEventListener('resize', syncHeroOffset)
        window.addEventListener('orientationchange', syncHeroOffset)

        return () => {
            resizeObserver?.disconnect()
            window.removeEventListener('resize', syncHeroOffset)
            window.removeEventListener('orientationchange', syncHeroOffset)
        }
    }, [])

    if (!slides.length) {
        return <section className="main-slider" />
    }

    return (
        <section className="main-slider">
            <Swiper
                // Remount once the slide count is known so loop mode initializes
                key={`main-slider-${slides.length}`}
                {...buildSwiperOptions(slides.length)}
                className="main-slider__carousel owl-carousel owl-theme"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={`slide-${index}`}>
                        <div className="item">
                            <div
                                className="main-slider__bg"
                                style={slideBackgroundStyle(slide)}
                            />
                            <div className="container">
                                <div className="main-slider__layout">
                                    <div className="main-slider__content">
                                        <div className="main-slider__sub-title-box">
                                            <p className="main-slider__sub-title">{slide.subTitle}</p>
                                            <div className="main-slider__sub-title-shape"></div>
                                        </div>
                                        <h2 className="main-slider__title">
                                            {slide.titleLine1}
                                            {slide.titleLine2 ? (
                                                <>
                                                    <br />
                                                    {slide.titleLine2}
                                                </>
                                            ) : null}
                                        </h2>
                                        <p className="main-slider__text">{slide.text}</p>
                                        <div className="main-slider__btn-box">
                                            {callHref ? (
                                                <a href={callHref} className="main-slider__btn thm-btn">
                                                    <span className="thm-btn__icon icon-phone-call" aria-hidden="true" />
                                                    <span className="thm-btn__label">Call Now</span>
                                                </a>
                                            ) : null}
                                            <BookServiceLink className="main-slider__btn main-slider__btn--outline" />
                                        </div>
                                        {socialLinks.length ? (
                                            <div className="main-slider__social" aria-label="Social links">
                                                {socialLinks.map(({ key, icon, href }) => (
                                                    <Link
                                                        key={key}
                                                        href={href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        aria-label={key}
                                                    >
                                                        <i className={icon}></i>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : null}
                                    </div>

                                    {specialties.length ? (
                                        <ul className="main-slider__specialties list-unstyled" aria-label="Our specialties">
                                            {specialties.map((item, idx) => (
                                                <li key={`${idx}-${item}`}>- {item}</li>
                                            ))}
                                        </ul>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    )
}
