'use client'

import Link from "next/link"
import { useEffect, useMemo, useState } from 'react'
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { resolveCmsAssetUrl } from '@/lib/cms'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const FEATURED_SERVICES_ICON = 'icon-setting'

const DEFAULT_HEADING = {
    tagline: 'What We Do',
    titleLine1: 'Featured Electrical Services',
    titleLine2: 'for Your Home & Business',
}

const FALLBACK_CARDS = [
    {
        key: 'residential',
        name: 'Residential',
        title: 'Residential Services',
        text: 'Licensed electrical work for homes across the Greater Toronto Area — repairs, upgrades, lighting, EV chargers, and more.',
        backgroundImage: '',
        link: '/residential',
    },
    {
        key: 'commercial',
        name: 'Commercial',
        title: 'Commercial Services',
        text: 'Reliable electrical solutions for offices, retail, warehouses, and commercial properties across the GTA.',
        backgroundImage: '',
        link: '/commercial',
    },
]

export default function Servicetwo() {
    const [heading, setHeading] = useState(DEFAULT_HEADING)
    const [categoryCards, setCategoryCards] = useState(FALLBACK_CARDS)
    const [services, setServices] = useState([])
    const [categories, setCategories] = useState([])
    const [activeCategoryId, setActiveCategoryId] = useState(null)

    useEffect(() => {
        let cancelled = false

        async function loadSection() {
            try {
                const [headingRes, featuredRes] = await Promise.all([
                    fetch(`${API_URL}/api/web-content/services/homepage-section`),
                    fetch(`${API_URL}/api/web-content/home/featured-services`),
                ])

                if (!cancelled && headingRes.ok) {
                    const headingData = await headingRes.json()
                    if (headingData.content) {
                        setHeading({
                            tagline: headingData.content.tagline || DEFAULT_HEADING.tagline,
                            titleLine1: headingData.content.titleLine1 || DEFAULT_HEADING.titleLine1,
                            titleLine2: headingData.content.titleLine2 || DEFAULT_HEADING.titleLine2,
                        })
                    }
                }

                if (!cancelled && featuredRes.ok) {
                    const featuredData = await featuredRes.json()
                    const content = featuredData.content || {}
                    if (Array.isArray(content.categoryCards) && content.categoryCards.length) {
                        setCategoryCards(content.categoryCards)
                    }
                    const nextServices = Array.isArray(content.services) ? content.services : []
                    const nextCategories = Array.isArray(content.categories) ? content.categories : []
                    setServices(nextServices)
                    setCategories(nextCategories)
                    setActiveCategoryId(nextCategories[0]?.id ?? null)
                }
            } catch {
                // Keep defaults on failure
            }
        }

        loadSection()
        return () => {
            cancelled = true
        }
    }, [])

    const visibleServices = useMemo(() => {
        if (!activeCategoryId) return services
        return services.filter((service) => service.categoryId === activeCategoryId)
    }, [activeCategoryId, services])

    const enableLoop = visibleServices.length > 3

    return (
        <section className="services-two services-two--categories">
            <div className="services-two__shape-1 img-bounce">
                <img src="assets/images/shapes/services-two-shape-1.png" alt="" />
            </div>
            <div className="container">
                <div className="section-title text-center">
                    {heading.tagline ? (
                        <div className="section-title__tagline-box">
                            <span className="section-title__tagline">{heading.tagline}</span>
                        </div>
                    ) : null}
                    <div className="section-title__title-box sec-title-animation animation-style1">
                        <h2 className="section-title__title title-animation">
                            {heading.titleLine1}
                            {heading.titleLine2 ? (
                                <>
                                    <br /> {heading.titleLine2}
                                </>
                            ) : null}
                        </h2>
                    </div>
                </div>

                <div className="row services-two__category-grid">
                    {categoryCards.map((card) => {
                        const backgroundImage = resolveCmsAssetUrl(card.backgroundImage)
                        return (
                            <div className="col-lg-6" key={card.key}>
                                <article
                                    className="services-two__category-card"
                                    style={
                                        backgroundImage
                                            ? { backgroundImage: `url("${backgroundImage}")` }
                                            : undefined
                                    }
                                >
                                    <div className="services-two__category-card-overlay" />
                                    <div className="services-two__category-card-content">
                                        <h3 className="services-two__category-card-title">
                                            <Link href={card.link}>{card.name || card.title}</Link>
                                        </h3>
                                        {card.text ? (
                                            <p className="services-two__category-card-text">{card.text}</p>
                                        ) : null}
                                        <Link href={card.link} className="services-two__category-card-more">
                                            Learn More<span className="icon-arrow-right" aria-hidden="true" />
                                        </Link>
                                    </div>
                                </article>
                            </div>
                        )
                    })}
                </div>

                {categories.length > 0 ? (
                    <div className="services-two__categories" role="tablist" aria-label="Featured service categories">
                        {categories.map((category) => {
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
                        {visibleServices.map((service) => {
                            const imageUrl = resolveCmsAssetUrl(service.image)
                            return (
                                <SwiperSlide key={service.id}>
                                    <div className="services-two__single services-two__single--photo">
                                        <div className="services-two__media">
                                            {imageUrl ? (
                                                <img src={imageUrl} alt={service.name} />
                                            ) : (
                                                <div className="services-two__media-fallback" aria-hidden="true">
                                                    <span className={FEATURED_SERVICES_ICON}></span>
                                                </div>
                                            )}
                                            <div className="services-two__media-overlay" aria-hidden="true" />
                                        </div>
                                        <div className="services-two__body">
                                            <h3 className="services-two__title">
                                                <Link href={service.link}>{service.name}</Link>
                                            </h3>
                                            <p className="services-two__text">{service.description}</p>
                                            <Link href={service.link} className="services-two__learn-more">
                                                Learn More<span className="icon-arrow-right"></span>
                                            </Link>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                ) : null}
            </div>
        </section>
    )
}
