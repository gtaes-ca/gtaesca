'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { resolveCmsAssetUrl } from '@/lib/cms'
import { serviceDetailPath } from '@/lib/paths'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const FEATURED_SERVICES_ICON = 'icon-setting'

function truncateText(text, maxLength = 90) {
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
            <section className="services-two services-page services-page--compact">
                <div className="container">
                    <p className="mb-0">Loading services...</p>
                </div>
            </section>
        )
    }

    return (
        <section className="services-two services-page services-page--compact">
            <div className="container">
                {services.length === 0 ? (
                    <p className="mb-0">No services are available right now.</p>
                ) : (
                    <div className="row services-page__grid">
                        {services.map((service) => {
                            const detailLink = serviceDetailPath(service)
                            const imageUrl = resolveCmsAssetUrl(service.image)
                            return (
                                <div
                                    key={service.id}
                                    className="col-xl-4 col-lg-6 col-md-6"
                                >
                                    <article className="services-page__card">
                                        <div className="services-page__card-media">
                                            {imageUrl ? (
                                                <img src={imageUrl} alt={service.name} />
                                            ) : (
                                                <div className="services-page__card-fallback" aria-hidden="true">
                                                    <span className={FEATURED_SERVICES_ICON} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="services-page__card-body">
                                            <h3 className="services-page__card-title">
                                                <Link href={detailLink}>{service.name}</Link>
                                            </h3>
                                            {service.description ? (
                                                <p className="services-page__card-text">
                                                    {truncateText(service.description)}
                                                </p>
                                            ) : null}
                                            <Link href={detailLink} className="services-page__card-more">
                                                Learn More<span className="icon-arrow-right" aria-hidden="true" />
                                            </Link>
                                        </div>
                                    </article>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}
