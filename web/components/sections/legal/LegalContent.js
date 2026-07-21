'use client'

import { useEffect, useState } from 'react'
import { DEFAULT_LEGAL_CONTENT } from '@/lib/cms'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function LegalContent({ pageKey }) {
    const [content, setContent] = useState(DEFAULT_LEGAL_CONTENT[pageKey] || { title: '', introText: '', lastUpdated: '', sections: [] })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        async function loadContent() {
            try {
                const res = await fetch(`${API_URL}/api/web-content/${pageKey}/content`)
                if (!res.ok) return
                const data = await res.json()
                if (cancelled) return
                if (data.content) {
                    setContent({
                        ...data.content,
                        sections: Array.isArray(data.content.sections) ? data.content.sections : [],
                    })
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
    }, [pageKey])

    if (loading) {
        return (
            <section className="legal-page">
                <div className="container">
                    <p className="mb-0">Loading...</p>
                </div>
            </section>
        )
    }

    return (
        <section className="legal-page">
            <div className="container">
                <div className="legal-page__inner">
                    <div className="legal-page__header">
                        <h2>{content.title}</h2>
                        {content.lastUpdated ? (
                            <p className="legal-page__updated">Last updated: {content.lastUpdated}</p>
                        ) : null}
                        {content.introText ? (
                            <p className="legal-page__intro">{content.introText}</p>
                        ) : null}
                    </div>
                    <div className="legal-page__sections">
                        {content.sections.map((section) => (
                            <article key={section.id} className="legal-page__section">
                                {section.heading ? (
                                    <h3>{section.heading}</h3>
                                ) : null}
                                {section.body ? (
                                    <p>{section.body}</p>
                                ) : null}
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
