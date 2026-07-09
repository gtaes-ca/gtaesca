'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DEFAULT_TOPBAR, fetchTopbarContent } from '@/lib/cms'
import ServiceDetailsBanner from '@/components/sections/services/ServiceDetailsBanner'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const FALLBACK_IMAGE = 'assets/images/services/service-details-img-1.jpg'

function formatPrice(price) {
    return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(price || 0)
}

function formatDuration(minutes) {
    const value = Number(minutes) || 0
    if (value < 60) return `${value} min`
    const hours = Math.floor(value / 60)
    const mins = value % 60
    if (!mins) return `${hours} hr`
    return `${hours} hr ${mins} min`
}

export default function ServiceDetailView() {
    const searchParams = useSearchParams()
    const serviceId = searchParams.get('id')
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
            if (!serviceId) {
                setNotFound(true)
                setLoading(false)
                return
            }

            setLoading(true)
            setNotFound(false)

            try {
                const res = await fetch(`${API_URL}/api/services/items/${serviceId}`)
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
    }, [serviceId])

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
                        <Link href="/services" className="thm-btn">Back to Services</Link>
                    </div>
                </section>
            </>
        )
    }

    const descriptionParagraphs = service.description
        ? service.description.split(/\n\s*\n/).filter(Boolean)
        : []

    return (
        <>
            <ServiceDetailsBanner serviceName={service.name} />
            <section className="service-details">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-8 col-lg-7">
                            <div className="service-details__left">
                                <div className="service-details__img">
                                    <img src={FALLBACK_IMAGE} alt={service.name}/>
                                </div>
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
                                <ul className="service-details__points-list list-unstyled">
                                    <li>
                                        <div className="icon">
                                            <span className="icon-arrow-right"></span>
                                        </div>
                                        <p>Licensed and insured electricians for safe, code-compliant work.</p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <span className="icon-arrow-right"></span>
                                        </div>
                                        <p>Transparent pricing with clear service scope before we begin.</p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <span className="icon-arrow-right"></span>
                                        </div>
                                        <p>Residential and commercial service across the Greater Toronto Area.</p>
                                    </li>
                                </ul>
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
                                        <li>
                                            <h4>Duration :</h4>
                                            <p>{formatDuration(service.durationMinutes)}</p>
                                        </li>
                                        <li>
                                            <h4>Starting at :</h4>
                                            <p>{formatPrice(service.price)}</p>
                                        </li>
                                    </ul>
                                </div>
                                {allServices.length ? (
                                    <div className="service-details__services-box">
                                        <h3 className="service-details__services-title">Our Services</h3>
                                        <ul className="service-details__services-list list-unstyled">
                                            {allServices.map((item) => {
                                                const isActive = String(item.id) === String(service.id)
                                                return (
                                                    <li key={item.id} className={isActive ? 'active' : ''}>
                                                        <Link href={`/service-details?id=${item.id}`}>
                                                            {item.name}
                                                            <span className="icon-arrow-right"></span>
                                                        </Link>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                ) : null}
                                <div className="project-details__get-started">
                                    <h3 className="project-details__get-started-title">Get Started Today</h3>
                                    <p className="project-details__get-started-text">
                                        Contact us for reliable electrical service across the Greater Toronto Area.
                                    </p>
                                    <ul className="project-details__get-started-points list-unstyled">
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
