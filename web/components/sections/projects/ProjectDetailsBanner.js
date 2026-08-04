'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import PageBannerCta from '@/components/layout/PageBannerCta'
import { DEFAULT_PROJECT_DETAILS_BANNER, resolveCmsAssetUrl } from '@/lib/cms'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function ProjectDetailsBanner({ projectTitle = '' }) {
    const [content, setContent] = useState(DEFAULT_PROJECT_DETAILS_BANNER)

    useEffect(() => {
        let cancelled = false

        async function loadBanner() {
            try {
                const res = await fetch(`${API_URL}/api/web-content/project-details/banner`)
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

        loadBanner()
        return () => {
            cancelled = true
        }
    }, [])

    const backgroundImage = resolveCmsAssetUrl(content.backgroundImage)
    const displayTitle = projectTitle || content.title

    return (
        <section className="page-header about-banner">
            {backgroundImage ? (
                <div
                    className="page-header__bg"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                    aria-hidden="true"
                />
            ) : null}
            <div className="container">
                <div className="page-header__inner">
                    <h3>{displayTitle}</h3>
                    <div className="thm-breadcrumb__inner">
                        <ul className="thm-breadcrumb list-unstyled">
                            <li><Link href="/">Home</Link></li>
                            <li><span className="icon-angle-right"></span></li>
                            <li><Link href="/projects">Projects</Link></li>
                            <li><span className="icon-angle-right"></span></li>
                            <li>{displayTitle}</li>
                        </ul>
                    </div>
                    <PageBannerCta />
                </div>
            </div>
        </section>
    )
}
