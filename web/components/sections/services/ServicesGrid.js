'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { serviceDetailPath } from '@/lib/paths'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const FEATURED_SERVICES_ICON = 'icon-setting'

const ANIMATION_CLASSES = ['fadeInLeft', 'fadeInUp', 'fadeInRight']
const ANIMATION_DELAYS = ['100ms', '300ms', '500ms', '700ms', '900ms', '1100ms']

function truncateText(text, maxLength = 140) {
    if (!text || text.length <= maxLength) return text
    return `${text.slice(0, maxLength).trim()}...`
}

export default function ServicesGrid({ group = 'residential' }) {
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        async function loadServices() {
            try {
                const res = await fetch(`${API_URL}/api/services/list?group=${encodeURIComponent(group)}`)
                if (!res.ok) return
                const data = await res.json()
                if (cancelled) return
                setServices(Array.isArray(data.services) ? data.services : [])
            } catch {
                // Keep empty on failure
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        loadServices()
        return () => {
            cancelled = true
        }
    }, [group])

    if (loading) {
        return (
            <section className="services-two services-page">
                <div className="container">
                    <p className="mb-0">Loading services...</p>
                </div>
            </section>
        )
    }

    return (
        <section className="services-two services-page">
            <div className="services-two__shape-1 img-bounce">
                <img src="assets/images/shapes/services-two-shape-1.png" alt=""/>
            </div>
            <div className="container">
                {services.length === 0 ? (
                    <p className="mb-0">No services are available right now.</p>
                ) : (
                    <div className="row">
                        {services.map((service, index) => {
                            const detailLink = serviceDetailPath(service)
                            return (
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
                                            <Link href={detailLink}>{service.name}</Link>
                                        </h3>
                                        <p className="services-two__text">{truncateText(service.description)}</p>
                                        <Link href={detailLink} className="services-two__learn-more">
                                            Learn More<span className="icon-arrow-right"></span>
                                        </Link>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}
