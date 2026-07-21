'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { DEFAULT_CONTACT_PAGE_SETTINGS } from '@/lib/cms'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const EMPTY_FORM = {
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
}

function buildMapEmbedUrl(latitude, longitude, zoom) {
    return `https://maps.google.com/maps?q=${latitude},${longitude}&hl=en&z=${zoom}&output=embed`
}

export default function ContactSection() {
    const [settings, setSettings] = useState(DEFAULT_CONTACT_PAGE_SETTINGS)
    const [form, setForm] = useState(EMPTY_FORM)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [status, setStatus] = useState({ type: '', message: '' })

    useEffect(() => {
        let cancelled = false

        async function loadSettings() {
            try {
                const res = await fetch(`${API_URL}/api/web-content/contact/settings`)
                if (!res.ok) return
                const data = await res.json()
                if (cancelled) return
                if (data.content) {
                    setSettings(data.content)
                }
            } catch {
                // Keep defaults on failure
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        loadSettings()
        return () => {
            cancelled = true
        }
    }, [])

    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setStatus({ type: '', message: '' })

        try {
            const res = await fetch(`${API_URL}/api/contact/quote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            const data = await res.json()

            if (!res.ok) {
                setStatus({
                    type: 'error',
                    message: data.error || 'Failed to send message',
                })
                return
            }

            setForm(EMPTY_FORM)
            setStatus({
                type: 'success',
                message: data.message || 'Your message has been sent.',
            })
        } catch {
            setStatus({
                type: 'error',
                message: 'Failed to send message. Please try again.',
            })
        } finally {
            setSubmitting(false)
        }
    }

    const mapUrl = buildMapEmbedUrl(settings.latitude, settings.longitude, settings.mapZoom)

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
                                        <h3><Link href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</Link></h3>
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
                                <div className="contact-three__right">
                                    <h3 className="contact-three__form-title">{settings.formTitle}</h3>
                                    <form className="contact-three__form" onSubmit={handleSubmit}>
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
                                                    <input
                                                        type="text"
                                                        placeholder="Company"
                                                        name="company"
                                                        value={form.company}
                                                        onChange={(e) => updateField('company', e.target.value)}
                                                    />
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
                                                        type="submit"
                                                        className="thm-btn contact-three__btn"
                                                        disabled={submitting}
                                                    >
                                                        {submitting ? 'Please wait...' : 'send a message'}
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
