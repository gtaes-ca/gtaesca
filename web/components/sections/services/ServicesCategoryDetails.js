'use client'

import { useEffect, useState } from 'react'
import { DEFAULT_SERVICE_CATEGORY_DETAILS } from '@/lib/cms'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function ServicesCategoryDetails({ pageKey = 'residential' }) {
    const [content, setContent] = useState(DEFAULT_SERVICE_CATEGORY_DETAILS)

    useEffect(() => {
        let cancelled = false

        async function loadDetails() {
            try {
                const res = await fetch(`${API_URL}/api/web-content/${pageKey}/details`)
                if (!res.ok) return
                const data = await res.json()
                if (cancelled) return
                if (data.content) {
                    setContent(data.content)
                }
            } catch {
                // Keep defaults on failure
            }
        }

        loadDetails()
        return () => {
            cancelled = true
        }
    }, [pageKey])

    if (!content.tagline && !content.title && !content.text) {
        return null
    }

    return (
        <section className="services-category-details">
            <div className="container">
                <div className="section-title text-center">
                    {content.tagline ? (
                        <div className="section-title__tagline-box">
                            <span className="section-title__tagline">{content.tagline}</span>
                        </div>
                    ) : null}
                    {content.title ? (
                        <div className="section-title__title-box">
                            <h2 className="section-title__title">{content.title}</h2>
                        </div>
                    ) : null}
                    {content.text ? (
                        <p className="services-category-details__text">{content.text}</p>
                    ) : null}
                </div>
            </div>
        </section>
    )
}
