'use client'

import { useEffect, useMemo, useState } from 'react'
import { DEFAULT_FAQ_SETTINGS } from '@/lib/cms'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

function FaqColumn({ items, activeKey, onToggle, groupName }) {
    return (
        <div className="faq-one__right">
            <div className="accrodion-grp faq-one-accrodion" data-grp-name={groupName}>
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={activeKey === item.id ? 'accrodion active' : 'accrodion'}
                        onClick={() => onToggle(item.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                onToggle(item.id)
                            }
                        }}
                    >
                        <div className="accrodion-title">
                            <h4>{item.question}</h4>
                        </div>
                        <div className="accrodion-content">
                            <div className="inner">
                                <p>{item.answer}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function FaqAccordion() {
    const [settings, setSettings] = useState(DEFAULT_FAQ_SETTINGS)
    const [faqs, setFaqs] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeKey, setActiveKey] = useState(null)

    useEffect(() => {
        let cancelled = false

        async function loadContent() {
            try {
                const [settingsRes, faqsRes] = await Promise.all([
                    fetch(`${API_URL}/api/web-content/faq/settings`),
                    fetch(`${API_URL}/api/faqs?limit=100`),
                ])

                if (!cancelled) {
                    if (settingsRes.ok) {
                        const settingsData = await settingsRes.json()
                        if (settingsData.content) {
                            setSettings(settingsData.content)
                        }
                    }

                    if (faqsRes.ok) {
                        const faqsData = await faqsRes.json()
                        setFaqs(Array.isArray(faqsData.faqs) ? faqsData.faqs : [])
                    }
                }
            } catch {
                // Keep defaults on failure
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        loadContent()
        return () => {
            cancelled = true
        }
    }, [])

    const { leftColumn, rightColumn } = useMemo(() => {
        const midpoint = Math.ceil(faqs.length / 2)
        return {
            leftColumn: faqs.slice(0, midpoint),
            rightColumn: faqs.slice(midpoint),
        }
    }, [faqs])

    const handleToggle = (key) => {
        setActiveKey((current) => (current === key ? null : key))
    }

    if (loading) {
        return (
            <section className="faq-page">
                <div className="container">
                    <p className="text-muted mb-0">Loading FAQs...</p>
                </div>
            </section>
        )
    }

    return (
        <section className="faq-page">
            <div className="container">
                {(settings.tagline || settings.title || settings.introText) && (
                    <div className="row justify-content-center mb-5">
                        <div className="col-xl-8 text-center">
                            {settings.tagline ? (
                                <div className="section-title-two">
                                    <div className="section-title-two__tagline-box">
                                        <span className="section-title-two__tagline">{settings.tagline}</span>
                                    </div>
                                </div>
                            ) : null}
                            {settings.title ? (
                                <h2 className="section-title-two__title mb-3">{settings.title}</h2>
                            ) : null}
                            {settings.introText ? <p className="faq-one__text mb-0">{settings.introText}</p> : null}
                        </div>
                    </div>
                )}

                {faqs.length === 0 ? (
                    <p className="text-muted mb-0">No FAQs are available right now.</p>
                ) : (
                    <div className="row">
                        <div className="col-xl-6">
                            <div className="faq-page__left">
                                <FaqColumn
                                    items={leftColumn}
                                    activeKey={activeKey}
                                    onToggle={handleToggle}
                                    groupName="faq-one-accrodion-1"
                                />
                            </div>
                        </div>
                        <div className="col-xl-6">
                            <div className="faq-page__right">
                                <FaqColumn
                                    items={rightColumn}
                                    activeKey={activeKey}
                                    onToggle={handleToggle}
                                    groupName="faq-one-accrodion-2"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
