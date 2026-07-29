'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { DEFAULT_TOPBAR, fetchTopbarContent, resolveCmsAssetUrl } from '@/lib/cms'
import { serviceCategoryLabel, serviceCategoryPageKey, serviceCategoryPath, serviceDetailPath } from '@/lib/paths'
import ServiceDetailsBanner from '@/components/sections/services/ServiceDetailsBanner'
import ServicesGallery from '@/components/sections/services/ServicesGallery'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

function formatDuration(minutes) {
    const value = Number(minutes) || 0
    if (value < 60) return `${value} min`
    const hours = Math.floor(value / 60)
    const mins = value % 60
    if (!mins) return `${hours} hr`
    return `${hours} hr ${mins} min`
}

export default function ServiceDetailView({ serviceSlug }) {
    const [service, setService] = useState(null)
    const [allServices, setAllServices] = useState([])
    const [topbar, setTopbar] = useState(DEFAULT_TOPBAR)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        let cancelled = false

        async function loadTopbar() {
            const content = await fetchTopbarContent()
            if (!cancelled) {
                setTopbar(content)
            }
        }

        loadTopbar()
        return () => {
            cancelled = true
        }
    }, [])

    useEffect(() => {
        let cancelled = false

        async function loadServicesList() {
            try {
                const res = await fetch(`${API_URL}/api/services/list`)
                if (!res.ok) return
                const data = await res.json()
                if (!cancelled) {
                    setAllServices(Array.isArray(data.services) ? data.services : [])
                }
            } catch {
                // Ignore sidebar list failure
            }
        }

        loadServicesList()
        return () => {
            cancelled = true
        }
    }, [])

    useEffect(() => {
        let cancelled = false

        async function loadService() {
            if (!serviceSlug) {
                setNotFound(true)
                setLoading(false)
                return
            }

            setLoading(true)
            setNotFound(false)

            try {
                const res = await fetch(`${API_URL}/api/services/slug/${encodeURIComponent(serviceSlug)}`)
                if (cancelled) return

                if (res.status === 404) {
                    setService(null)
                    setNotFound(true)
                    return
                }

                if (!res.ok) {
                    setService(null)
                    setNotFound(true)
                    return
                }

                const data = await res.json()
                setService(data.service || null)
                setNotFound(!data.service)
            } catch {
                if (!cancelled) {
                    setService(null)
                    setNotFound(true)
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        loadService()
        return () => {
            cancelled = true
        }
    }, [serviceSlug])

    if (loading) {
        return (
            <>
                <ServiceDetailsBanner />
                <section className="service-details">
                    <div className="container">
                        <p className="mb-0">Loading service...</p>
                    </div>
                </section>
            </>
        )
    }

    if (notFound || !service) {
        return (
            <>
                <ServiceDetailsBanner serviceName="Service Not Found" />
                <section className="service-details">
                    <div className="container">
                        <p className="mb-3">This service could not be found.</p>
                        <Link href="/residential" className="thm-btn">Back to Residential</Link>
                    </div>
                </section>
            </>
        )
    }

    const descriptionParagraphs = service.description
        ? service.description.split(/\n\s*\n/).filter(Boolean)
        : []
    const categoryHref = serviceCategoryPath(service.categoryName)
    const categoryLabel = serviceCategoryLabel(service.categoryName)
    const relatedServices = allServices.filter((item) => {
        const itemIsCommercial = String(item.categoryName || '').toLowerCase().includes('commercial')
        const currentIsCommercial = String(service.categoryName || '').toLowerCase().includes('commercial')
        return itemIsCommercial === currentIsCommercial
    })

    return (
        <>
            <ServiceDetailsBanner serviceName={service.name} categoryName={service.categoryName} />
            <section className="service-details">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-8 col-lg-7">
                            <div className="service-details__left">
                                {service.image ? (
                                    <div className="service-details__img">
                                        <img src={resolveCmsAssetUrl(service.image)} alt={service.name}/>
                                    </div>
                                ) : null}
                                <h3 className="service-details__title-1">{service.name}</h3>
                                {descriptionParagraphs.length ? (
                                    descriptionParagraphs.map((paragraph, index) => (
                                        <p
                                            key={`${service.id}-paragraph-${index}`}
                                            className={index === 0 ? 'service-details__text-1' : 'service-details__text-2'}
                                        >
                                            {paragraph}
                                        </p>
                                    ))
                                ) : (
                                    <p className="service-details__text-1">Contact us for more information about this service.</p>
                                )}
                                {service.bullets && service.bullets.length ? (
                                    <ul className="service-details__points-list list-unstyled">
                                        {service.bullets.map((bullet, i) => (
                                            <li key={i}>
                                                <div className="icon">
                                                    <span className="icon-arrow-right"></span>
                                                </div>
                                                <p>{bullet}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                                <div className="mt-4">
                                    <Link href={categoryHref} className="thm-btn">
                                        Back to {categoryLabel}
                                    </Link>
                                </div>
                                <ServicesGallery
                                    pageKey={serviceCategoryPageKey(service.categoryName)}
                                    serviceId={String(service.id)}
                                    embedded
                                    sectionClassName="services-gallery--service-detail"
                                />
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-5">
                            <div className="service-details__sidebar">
                                <div className="project-details__information">
                                    <h3 className="project-details__information-title">Service Information</h3>
                                    <ul className="project-details__information-list list-unstyled">
                                        <li>
                                            <h4>Category :</h4>
                                            <p>{service.categoryName}</p>
                                        </li>
                                        {Number(service.durationMinutes) > 0 ? (
                                            <li>
                                                <h4>Duration :</h4>
                                                <p>{formatDuration(service.durationMinutes)}</p>
                                            </li>
                                        ) : null}
                                    </ul>
                                </div>
                                {relatedServices.length ? (
                                    <div className="service-details__services-box">
                                        <h3 className="service-details__services-title">{categoryLabel} Services</h3>
                                        <div className="service-details__services-list-wrap">
                                            <ul className="service-details__services-list list-unstyled">
                                                {relatedServices.map((item) => {
                                                    const isActive = item.slug === service.slug
                                                    return (
                                                        <li key={item.id} className={isActive ? 'active' : ''}>
                                                            <Link href={serviceDetailPath(item)}>
                                                                {item.name}
                                                                <span className="icon-arrow-right"></span>
                                                            </Link>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                ) : null}
                                <div className="project-details__get-started">
                                    <h3 className="project-details__get-started-title">Get Started Today</h3>
                                    <ul className="project-details__get-started-points list-unstyled">
                                        {topbar.phone ? (
                                            <li>
                                                <div className="icon">
                                                    <span className="icon-call"></span>
                                                </div>
                                                <p><Link href={`tel:${String(topbar.phone).replace(/[^\d+]/g, '')}`}>{topbar.phone}</Link></p>
                                            </li>
                                        ) : null}
                                        {topbar.email ? (
                                            <li>
                                                <div className="icon">
                                                    <span className="icon-envelope"></span>
                                                </div>
                                                <p><Link href={`mailto:${topbar.email}`}>{topbar.email}</Link></p>
                                            </li>
                                        ) : null}
                                        {topbar.address ? (
                                            <li>
                                                <div className="icon">
                                                    <span className="icon-location"></span>
                                                </div>
                                                <p>{topbar.address}</p>
                                            </li>
                                        ) : null}
                                    </ul>
                                    <div className="project-details__get-started-btn-box">
                                        <Link href="/contact" className="project-details__get-started-btn thm-btn">get in touch</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
