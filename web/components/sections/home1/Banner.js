
'use client'
import Link from "next/link"
import { Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { useEffect, useState } from 'react'
import { resolveCmsAssetUrl } from '@/lib/cms'

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

    return {
        '--slider-bg-desktop': `url(${desktop})`,
        '--slider-bg-mobile': `url(${mobile})`,
    }
}

export default function Banner() {
    const [slides, setSlides] = useState([])

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

        loadSlider()
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
