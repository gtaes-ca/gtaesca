'use client'

import Link from "next/link"
import { useEffect, useMemo, useState } from 'react'
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const FEATURED_SERVICES_ICON = 'icon-setting'

const DEFAULT_CONTENT = {
    tagline: '',
    titleLine1: '',
    titleLine2: '',
    services: [],
    categories: [],
}

export default function Servicetwo() {
    const [content, setContent] = useState(DEFAULT_CONTENT)
    const [activeCategoryId, setActiveCategoryId] = useState(null)

    useEffect(() => {
        let cancelled = false

        async function loadFeaturedServices() {
            try {
                const res = await fetch(`${API_URL}/api/web-content/home/featured-services`)
                if (!res.ok) return
                const data = await res.json()
                if (cancelled) return
                if (data.content) {
                    const services = Array.isArray(data.content.services) ? data.content.services : []
                    const categories = Array.isArray(data.content.categories) ? data.content.categories : []
                    setContent({
                        ...data.content,
                        services,
                        categories,
                    })
                    setActiveCategoryId(categories[0]?.id ?? null)
                }
            } catch {
                // Keep defaults on failure
            }
        }

        loadFeaturedServices()
        return () => {
            cancelled = true
        }
    }, [])

    const visibleServices = useMemo(() => {
        if (!activeCategoryId) return content.services
        return content.services.filter((service) => service.categoryId === activeCategoryId)
    }, [activeCategoryId, content.services])

    const enableLoop = visibleServices.length > 3

    return (
        <>
        {/*Services Two Start */}
        <section className="services-two">
            <div className="services-two__shape-1 img-bounce">
                <img src="assets/images/shapes/services-two-shape-1.png" alt=""/>
            </div>
            <div className="container">
                <div className="section-title text-center">
                    <div className="section-title__tagline-box">
                        <span className="section-title__tagline">{content.tagline}</span>
                    </div>
                    <div className="section-title__title-box sec-title-animation animation-style1">
                        <h2 className="section-title__title title-animation">
                            {content.titleLine1}
                            {content.titleLine2 ? (
                                <>
                                    <br/> {content.titleLine2}
                                </>
                            ) : null}
                        </h2>
                    </div>
                </div>

                {content.categories.length > 0 ? (
                    <div className="services-two__categories" role="tablist" aria-label="Service categories">
                        {content.categories.map((category) => {
                            const isActive = category.id === activeCategoryId
                            return (
                                <button
                                    key={category.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActive}
                                    className={`services-two__category${isActive ? ' is-active' : ''}`}
                                    onClick={() => setActiveCategoryId(category.id)}
                                >
                                    {category.name}
                                </button>
                            )
                        })}
                    </div>
                ) : null}

                {visibleServices.length > 0 ? (
                    <Swiper
                        key={`featured-services-${activeCategoryId || 'all'}-${visibleServices.length}`}
                        modules={[Autoplay, Pagination]}
                        className="services-two__carousel"
                        slidesPerView={1}
                        spaceBetween={24}
                        loop={enableLoop}
                        speed={700}
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        pagination={{ clickable: true }}
                        breakpoints={{
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 24,
                            },
                            1200: {
                                slidesPerView: 3,
                                spaceBetween: 28,
                            },
                        }}
                    >
                        {visibleServices.map((service) => (
                            <SwiperSlide key={service.id}>
                                <div className="services-two__single">
                                    <div className="services-two__icon">
                                        <span className={FEATURED_SERVICES_ICON}></span>
                                    </div>
                                    <h3 className="services-two__title">
                                        <Link href={service.link}>{service.name}</Link>
                                    </h3>
                                    <p className="services-two__text">{service.description}</p>
                                    <Link href={service.link} className="services-two__learn-more">
                                        Learn More<span className="icon-arrow-right"></span>
                                    </Link>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : null}
            </div>
        </section>
        {/*Services Two End */}
    
        </>
    )
}
