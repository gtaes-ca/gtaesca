'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { DEFAULT_HOME_ABOUT, resolveCmsAssetUrl } from '@/lib/cms'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function AboutSection({ variant = '' }) {
    const [content, setContent] = useState(DEFAULT_HOME_ABOUT)

    useEffect(() => {
        let cancelled = false

        async function loadAbout() {
            try {
                const res = await fetch(`${API_URL}/api/web-content/home/about`)
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

        loadAbout()
        return () => {
            cancelled = true
        }
    }, [])

    const sectionClassName = variant ? `about-one ${variant}` : 'about-one'

    return (
        <section className={sectionClassName}>
            <div className="about-one__shape-one float-bob-y">
                <img src="assets/images/shapes/about-one-shape-1.png" alt=""/>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-xl-6">
                        <div className="about-one__left wow slideInLeft" data-wow-delay="100ms" data-wow-duration="2500ms">
                            <div className="row">
                                <div className="col-xl-6">
                                    <div className="about-one__img-box-1">
                                        <div className="about-one__img-1">
                                            <img src={resolveCmsAssetUrl(content.image1)} alt=""/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-6">
                                    <div className="about-one__cirtified">
                                        <div className="icon">
                                            <span className="icon-check"></span>
                                        </div>
                                        <h3>
                                            {content.badgeLine1}
                                            {content.badgeLine1 && content.badgeLine2 ? <br/> : null}
                                            {content.badgeLine2 ? ` ${content.badgeLine2}` : null}
                                        </h3>
                                    </div>
                                    <div className="about-one__img-box-2">
                                        <div className="about-one__img-2">
                                            <img src={resolveCmsAssetUrl(content.image2)} alt=""/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="about-one__right wow fadeInRight" data-wow-delay="300ms">
                            <div className="section-title text-left">
                                <div className="section-title__tagline-box">
                                    <span className="section-title__tagline">{content.tagline}</span>
                                </div>
                                <div className="section-title__title-box sec-title-animation animation-style2">
                                    <h2 className="section-title__title title-animation">{content.title}</h2>
                                </div>
                            </div>
                            <p className="about-one__text-1">{content.text1}</p>
                            {content.text2 ? (
                                <p className="about-one__text-2">{content.text2}</p>
                            ) : null}
                            <div className="about-one__btn-box">
                                <Link href={content.buttonLink} className="about-one__btn thm-btn">{content.buttonText}</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
