'use client'

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from 'react'
import { DEFAULT_CONTACT_PAGE_SETTINGS, toTelHref } from '@/lib/cms'
import {
    buildWhatsAppContactQuoteMessage,
    fetchPublicBookingSettings,
    openSmsMessage,
    openWhatsAppBooking,
} from '@/lib/booking'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const EMPTY_FORM = {
    name: '',
    email: '',
    phone: '',
    serviceIds: [],
    message: '',
}

function buildMapEmbedUrl(latitude, longitude, zoom) {
    return `https://maps.google.com/maps?q=${latitude},${longitude}&hl=en&z=${zoom}&output=embed`
}

export default function ContactSection() {
    const [settings, setSettings] = useState(DEFAULT_CONTACT_PAGE_SETTINGS)
    const [whatsappNumber, setWhatsappNumber] = useState('')
    const [form, setForm] = useState(EMPTY_FORM)
    const [categories, setCategories] = useState([])
    const [selectedCategoryId, setSelectedCategoryId] = useState('')
    const [servicesOpen, setServicesOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [submittingMode, setSubmittingMode] = useState('')
    const [status, setStatus] = useState({ type: '', message: '' })
    const servicesRef = useRef(null)
    const formRef = useRef(null)
    const submitting = Boolean(submittingMode)

    useEffect(() => {
        let cancelled = false

        async function loadPageData() {
            try {
                const [settingsRes, servicesRes, bookingRes] = await Promise.all([
                    fetch(`${API_URL}/api/web-content/contact/settings`),
                    fetch(`${API_URL}/api/services`),
                    fetchPublicBookingSettings().catch(() => ({})),
                ])

                if (settingsRes.ok) {
                    const data = await settingsRes.json()
                    if (!cancelled && data.content) {
                        setSettings(data.content)
                    }
                }

                if (servicesRes.ok) {
                    const data = await servicesRes.json()
                    if (!cancelled) {
                        setCategories(Array.isArray(data.categories) ? data.categories : [])
                    }
                }

                if (!cancelled) {
                    setWhatsappNumber(bookingRes?.companyWhatsappNumber || '')
                }
            } catch {
                // Keep defaults on failure
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        loadPageData()
        return () => {
            cancelled = true
        }
    }, [])

    useEffect(() => {
        if (!servicesOpen) return undefined

        const onPointerDown = (event) => {
            if (servicesRef.current && !servicesRef.current.contains(event.target)) {
                setServicesOpen(false)
            }
        }

        document.addEventListener('mousedown', onPointerDown)
        return () => document.removeEventListener('mousedown', onPointerDown)
    }, [servicesOpen])

    const flatServices = useMemo(
        () => categories.flatMap((category) => (
            (category.services || []).map((service) => ({
                ...service,
                categoryId: category.id,
                categoryName: category.name,
            }))
        )),
        [categories]
    )

    const selectedCategory = useMemo(
        () => categories.find((category) => String(category.id) === String(selectedCategoryId)) || null,
        [categories, selectedCategoryId]
    )

    const categoryServices = useMemo(
        () => (selectedCategory?.services || []),
        [selectedCategory]
    )

    const selectedServices = useMemo(
        () => flatServices.filter((service) => form.serviceIds.includes(service.id)),
        [flatServices, form.serviceIds]
    )

    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const handleCategoryChange = (categoryId) => {
        setSelectedCategoryId(categoryId)
        setServicesOpen(false)
    }

    const toggleService = (serviceId) => {
        setForm((prev) => {
            const exists = prev.serviceIds.includes(serviceId)
            return {
                ...prev,
                serviceIds: exists
                    ? prev.serviceIds.filter((id) => id !== serviceId)
                    : [...prev.serviceIds, serviceId],
            }
        })
    }

    const resetForm = () => {
        setForm(EMPTY_FORM)
        setSelectedCategoryId('')
        setServicesOpen(false)
    }

    const handleWhatsApp = async () => {
        if (!formRef.current?.reportValidity()) return

        setSubmittingMode('whatsapp')
        setStatus({ type: '', message: '' })

        try {
            if (!whatsappNumber) {
                setStatus({
                    type: 'error',
                    message: 'WhatsApp is not configured yet. Please call or email us directly.',
                })
                return
            }

            const message = buildWhatsAppContactQuoteMessage({
                name: form.name,
                email: form.email,
                phone: form.phone,
                services: selectedServices,
                message: form.message,
            })

            openWhatsAppBooking(whatsappNumber, message)
            resetForm()
            setStatus({
                type: 'success',
                message: 'WhatsApp opened with your quote request. Send the message to complete.',
            })
        } catch (error) {
            setStatus({
                type: 'error',
                message: error?.message || 'Failed to open WhatsApp. Please try again.',
            })
        } finally {
            setSubmittingMode('')
        }
    }

    const handleMessageClick = async () => {
        if (!formRef.current?.reportValidity()) return

        setSubmittingMode('message')
        setStatus({ type: '', message: '' })

        try {
            const smsNumber = whatsappNumber || settings.phone
            if (!smsNumber) {
                setStatus({
                    type: 'error',
                    message: 'Mobile number is not configured yet. Please call or email us directly.',
                })
                return
            }

            const message = buildWhatsAppContactQuoteMessage({
                name: form.name,
                email: form.email,
                phone: form.phone,
                services: selectedServices,
                message: form.message,
            })

            openSmsMessage(smsNumber, message)
            resetForm()
            setStatus({
                type: 'success',
                message: 'Messages opened with your quote request. Send the text to complete.',
            })
        } catch (error) {
            setStatus({
                type: 'error',
                message: error?.message || 'Failed to open Messages. Please try again.',
            })
        } finally {
            setSubmittingMode('')
        }
    }

    const handleEmailSubmit = async (e) => {
        e.preventDefault()
        setSubmittingMode('email')
        setStatus({ type: '', message: '' })

        try {
            const response = await fetch(`${API_URL}/api/contact/quote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    serviceIds: form.serviceIds,
                    services: selectedServices.map((service) => service.name),
                    message: form.message,
                }),
            })
            const data = await response.json().catch(() => ({}))
            if (!response.ok) {
                throw new Error(data.error || 'Failed to send email')
            }

            resetForm()
            setStatus({
                type: 'success',
                message: data.message || 'Your quote request has been emailed. We will get back to you soon.',
            })
        } catch (error) {
            setStatus({
                type: 'error',
                message: error?.message || 'Failed to send email. Please try again.',
            })
        } finally {
            setSubmittingMode('')
        }
    }

    const mapUrl = buildMapEmbedUrl(settings.latitude, settings.longitude, settings.mapZoom)
    const selectedInCategoryCount = categoryServices.filter((service) => form.serviceIds.includes(service.id)).length
    const servicesLabel = !selectedCategoryId
        ? 'Select a category first'
        : selectedInCategoryCount
            ? `${selectedInCategoryCount} service${selectedInCategoryCount > 1 ? 's' : ''} selected`
            : 'Select services'

    return (
        <>
            <section className="contact-two">
                <div className="container">
                    {loading ? (
                        <p className="mb-0">Loading contact details...</p>
                    ) : (
                        <div className="row">
                            {settings.phone ? (
                                <div className="col-xl-4 col-lg-4">
                                    <div className="contact-two__single">
                                        <div className="contact-two__icon">
                                            <span className="icon-call"></span>
                                        </div>
                                        <p>Contact Us</p>
                                        <h3><Link href={toTelHref(settings.phone)}>{settings.phone}</Link></h3>
                                    </div>
                                </div>
                            ) : null}
                            {settings.displayEmail ? (
                                <div className="col-xl-4 col-lg-4">
                                    <div className="contact-two__single">
                                        <div className="contact-two__icon">
                                            <span className="icon-envelope"></span>
                                        </div>
                                        <p>Mail Us</p>
                                        <h3><Link href={`mailto:${settings.displayEmail}`}>{settings.displayEmail}</Link></h3>
                                    </div>
                                </div>
                            ) : null}
                            {settings.address ? (
                                <div className="col-xl-4 col-lg-4">
                                    <div className="contact-two__single">
                                        <div className="contact-two__icon">
                                            <span className="icon-location"></span>
                                        </div>
                                        <p>Our Office Location</p>
                                        <h3>{settings.address}</h3>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
            </section>

            <section className="contact-three">
                <div className="container">
                    <div className="contact-three__inner">
                        <div className="row">
                            <div className="col-xl-6">
                                <div className="contact-three__left">
                                    <iframe
                                        title="Office location map"
                                        src={mapUrl}
                                        className="google-map__one"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            </div>
                            <div className="col-xl-6">
                                <div className="contact-three__right" id="quote">
                                    <h3 className="contact-three__form-title">{settings.formTitle}</h3>
                                    <form
                                        ref={formRef}
                                        className="contact-three__form"
                                        onSubmit={handleEmailSubmit}
                                    >
                                        <div className="row">
                                            <div className="col-xl-6 col-lg-6">
                                                <div className="contact-three__input-box">
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        placeholder="Your name"
                                                        value={form.name}
                                                        onChange={(e) => updateField('name', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xl-6 col-lg-6">
                                                <div className="contact-three__input-box">
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        placeholder="Your Email"
                                                        value={form.email}
                                                        onChange={(e) => updateField('email', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xl-6 col-lg-6">
                                                <div className="contact-three__input-box">
                                                    <input
                                                        type="text"
                                                        placeholder="Mobile"
                                                        name="phone"
                                                        value={form.phone}
                                                        onChange={(e) => updateField('phone', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xl-6 col-lg-6">
                                                <div className="contact-three__input-box">
                                                    <select
                                                        name="category"
                                                        value={selectedCategoryId}
                                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                                        aria-label="Service category"
                                                    >
                                                        <option value="">Select category</option>
                                                        {categories.map((category) => (
                                                            <option key={category.id} value={category.id}>
                                                                {category.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-xl-12">
                                                <div className="contact-three__input-box contact-three__services" ref={servicesRef}>
                                                    <button
                                                        type="button"
                                                        className={`contact-three__services-trigger${selectedInCategoryCount ? '' : ' is-placeholder'}`}
                                                        onClick={() => {
                                                            if (!selectedCategoryId) return
                                                            setServicesOpen((open) => !open)
                                                        }}
                                                        aria-expanded={servicesOpen}
                                                        aria-haspopup="listbox"
                                                        disabled={!selectedCategoryId}
                                                    >
                                                        <span>{servicesLabel}</span>
                                                        <i className={`fa ${servicesOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
                                                    </button>

                                                    {servicesOpen && selectedCategory ? (
                                                        <div className="contact-three__services-panel" role="listbox" aria-multiselectable="true">
                                                            {categoryServices.length === 0 ? (
                                                                <p className="contact-three__services-empty">No services in this category.</p>
                                                            ) : (
                                                                categoryServices.map((service) => {
                                                                    const checked = form.serviceIds.includes(service.id)
                                                                    return (
                                                                        <label key={service.id} className="contact-three__services-option">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={checked}
                                                                                onChange={() => toggleService(service.id)}
                                                                            />
                                                                            <span>{service.name}</span>
                                                                        </label>
                                                                    )
                                                                })
                                                            )}
                                                        </div>
                                                    ) : null}

                                                    {selectedServices.length ? (
                                                        <div className="contact-three__services-chips">
                                                            {selectedServices.map((service) => (
                                                                <span key={service.id} className="contact-three__services-chip">
                                                                    <small>{service.categoryName}</small>
                                                                    {service.name}
                                                                    <button
                                                                        type="button"
                                                                        aria-label={`Remove ${service.name}`}
                                                                        onClick={() => toggleService(service.id)}
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-xl-12">
                                                <div className="contact-three__input-box text-message-box">
                                                    <textarea
                                                        name="message"
                                                        placeholder="Message"
                                                        value={form.message}
                                                        onChange={(e) => updateField('message', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="contact-three__btn-box">
                                                    <button
                                                        type="button"
                                                        className="thm-btn contact-three__btn contact-three__btn--whatsapp"
                                                        disabled={submitting}
                                                        onClick={handleWhatsApp}
                                                    >
                                                        <i className="fab fa-whatsapp" aria-hidden="true" />
                                                        <span>
                                                            {submittingMode === 'whatsapp'
                                                                ? 'Opening...'
                                                                : 'WhatsApp'}
                                                        </span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="thm-btn contact-three__btn contact-three__btn--message"
                                                        disabled={submitting}
                                                        onClick={handleMessageClick}
                                                    >
                                                        <i className="fas fa-comment-dots" aria-hidden="true" />
                                                        <span>
                                                            {submittingMode === 'message' ? 'Opening...' : 'Message'}
                                                        </span>
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="thm-btn contact-three__btn contact-three__btn--email"
                                                        disabled={submitting}
                                                    >
                                                        <span className="icon-envelope" aria-hidden="true" />
                                                        <span>
                                                            {submittingMode === 'email' ? 'Sending...' : 'Email'}
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    {status.message ? (
                                        <p className={`ajax-response mb-0 ${status.type === 'error' ? 'error' : 'success'}`}>
                                            {status.message}
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
