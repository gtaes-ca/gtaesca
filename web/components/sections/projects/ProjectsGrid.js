'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { DEFAULT_PROJECTS_GALLERY, resolveCmsAssetUrl } from '@/lib/cms'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const COLUMN_CLASSES = [
    'col-xl-6 col-lg-6 col-md-6',
    'col-xl-3 col-lg-6 col-md-6',
    'col-xl-3 col-lg-6 col-md-6',
    'col-xl-3 col-lg-6 col-md-6',
    'col-xl-3 col-lg-6 col-md-6',
    'col-xl-6 col-lg-6 col-md-6',
]

const ANIMATION_CLASSES = [
    'fadeInLeft',
    'fadeInUp',
    'fadeInRight',
    'fadeInLeft',
    'fadeInUp',
    'fadeInRight',
]

const ANIMATION_DELAYS = [
    '100ms',
    '300ms',
    '600ms',
    '900ms',
    '1000ms',
    '1100ms',
]

export default function ProjectsGrid() {
    const [content, setContent] = useState(DEFAULT_PROJECTS_GALLERY)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        async function loadGallery() {
            try {
                const res = await fetch(`${API_URL}/api/web-content/projects/gallery`)
                if (!res.ok) return
                const data = await res.json()
                if (cancelled) return
                if (data.content) {
                    setContent({
                        ...DEFAULT_PROJECTS_GALLERY,
                        ...data.content,
                        items: Array.isArray(data.content.items) ? data.content.items : [],
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

        loadGallery()
        return () => {
            cancelled = true
        }
    }, [])

    if (loading) {
        return (
            <section className="project-one projects-page">
                <div className="container">
                    <p className="mb-0">Loading projects...</p>
                </div>
            </section>
        )
    }

    return (
        <section className="project-one projects-page">
            <div className="container">
                <div className="project-one__top">
                    <div className="section-title text-left">
                        <div className="section-title__tagline-box">
                            <span className="section-title__tagline">{content.tagline}</span>
                        </div>
                        <div className="section-title__title-box sec-title-animation animation-style2">
                            <h2 className="section-title__title title-animation">
                                {content.titleLine1}
                                {content.titleLine2 ? (
                                    <>
                                        <br/>{content.titleLine2}
                                    </>
                                ) : null}
                            </h2>
                        </div>
                    </div>
                    {content.buttonText ? (
                        <div className="project-one__btn-box">
                            <Link href={content.buttonLink || '/projects'} className="project-one__btn thm-btn">
                                {content.buttonText}
                            </Link>
                        </div>
                    ) : null}
                </div>
                <div className="row">
                    {content.items.map((item, index) => {
                        const detailLink = item.link || `/project-details?id=${item.id}`
                        return (
                            <div
                                key={item.id || `${item.title}-${index}`}
                                className={`${COLUMN_CLASSES[index % COLUMN_CLASSES.length]} wow ${ANIMATION_CLASSES[index % ANIMATION_CLASSES.length]}`}
                                data-wow-delay={ANIMATION_DELAYS[index % ANIMATION_DELAYS.length]}
                            >
                                <div className="project-one__single">
                                    <div className="project-one__img-box">
                                        <div className="project-one__img">
                                            <img src={resolveCmsAssetUrl(item.image)} alt={item.title || ''}/>
                                            <div className="project-one__arrow">
                                                <Link href={detailLink}>
                                                    <span className="icon-arrow-right"></span>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="project-one__content">
                                            {item.subTitle ? (
                                                <p className="project-one__sub-title">{item.subTitle}</p>
                                            ) : null}
                                            <h3 className="project-one__title">
                                                <Link href={detailLink}>{item.title}</Link>
                                            </h3>
                                            {item.text ? (
                                                <p className="project-one__text">{item.text}</p>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
