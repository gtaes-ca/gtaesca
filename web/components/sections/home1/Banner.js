'use client'
import Link from "next/link"
import { Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { useEffect, useState } from 'react'
import { resolveCmsAssetUrl } from '@/lib/cms'
import { buildTelHref, fetchPublicBookingSettings } from '@/lib/booking'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const swiperOptions = {
    modules: [Pagination, Navigation],
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    navigation: {
        nextEl: '.h1n',
        prevEl: '.h1p',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
}

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

        loadSlider()
        loadCallNumber()
        return () => {
            cancelled = true
        }
    }, [])

    return (
        <section className="main-slider">
            <Swiper {...swiperOptions} className="main-slider__carousel owl-carousel owl-theme">
                {slides.map((slide, index) => (
                    <SwiperSlide key={`slide-${index}`}>
                        <div className="item">
                            <div
                                className="main-slider__bg"
                                style={slideBackgroundStyle(slide)}
                            />
                            <div className="container">
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
                                                Call Now
                                            </a>
                                        ) : null}
                                        <Link href={slide.buttonLink || '/about'} className="main-slider__btn thm-btn">
                                            {slide.buttonText || 'Learn More'}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    )
}
