'use client'

import Link from "next/link"
import { useEffect, useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const FEATURED_SERVICES_ICON = 'icon-setting'

const DEFAULT_CONTENT = {
    tagline: '',
    titleLine1: '',
    titleLine2: '',
    services: [],
}

const ANIMATION_CLASSES = ['fadeInLeft', 'fadeInUp', 'fadeInRight']
const ANIMATION_DELAYS = ['100ms', '300ms', '500ms']

export default function Servicetwo() {
    const [content, setContent] = useState(DEFAULT_CONTENT)

    useEffect(() => {
        let cancelled = false

        async function loadFeaturedServices() {
            try {
                const res = await fetch(`${API_URL}/api/web-content/home/featured-services`)
                if (!res.ok) return
                const data = await res.json()
                if (cancelled) return
                if (data.content) {
                    setContent({
                        ...data.content,
                        services: Array.isArray(data.content.services) ? data.content.services : [],
                    })
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
                <div className="row">
                    {content.services.map((service, index) => (
                        <div
                            key={service.id}
                            className={`col-xl-4 col-lg-6 wow ${ANIMATION_CLASSES[index % ANIMATION_CLASSES.length]}`}
                            data-wow-delay={ANIMATION_DELAYS[index % ANIMATION_DELAYS.length]}
                        >
                            <div className="services-two__single">
                                <div className="services-two__icon">
                                    <span className={FEATURED_SERVICES_ICON}></span>
                                </div>
                                <p className="services-two__sub-title">{service.categoryName}</p>
                                <h3 className="services-two__title">
                                    <Link href={service.link}>{service.name}</Link>
                                </h3>
                                <p className="services-two__text">{service.description}</p>
                                <Link href={service.link} className="services-two__learn-more">
                                    Learn More<span className="icon-arrow-right"></span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        {/*Services Two End */}
    
        </>
    )
}
