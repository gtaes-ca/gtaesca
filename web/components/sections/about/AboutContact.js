'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import ModalVideo from 'react-modal-video'
import { DEFAULT_ABOUT_CONTACT, resolveCmsAssetUrl } from '@/lib/cms'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function AboutContact() {
    const [content, setContent] = useState(DEFAULT_ABOUT_CONTACT)
    const [isOpen, setOpen] = useState(false)

    useEffect(() => {
        let cancelled = false

        async function loadContact() {
            try {
                const res = await fetch(`${API_URL}/api/web-content/about/contact`)
                if (!res.ok) return
                const data = await res.json()
                if (cancelled) return
                if (data.content) {
                    setContent({
                        ...DEFAULT_ABOUT_CONTACT,
                        ...data.content,
                    })
                }
            } catch {
                // Keep defaults on failure
            }
        }

        loadContact()
        return () => {
            cancelled = true
        }
    }, [])

    const backgroundImage = resolveCmsAssetUrl(content.backgroundImage)

    return (
        <>
            <section className="video-one">
                <div className="video-one__sahpe-1">
                    <img src="assets/images/shapes/video-one-shape-1.png" alt=""/>
                </div>
                <div
                    className="video-one__bg wow slideInLeft"
                    data-wow-delay="100ms"
                    data-wow-duration="2500ms"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                >
                    <div className="video-one__video-link">
                        <a onClick={() => setOpen(true)} className="video-popup" role="button" tabIndex={0}>
                            <div className="video-one__video-icon">
                                <span className="fas fa-play"></span>
                                <i className="ripple"></i>
                            </div>
                        </a>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6"></div>
                        <div className="col-xl-6">
                            <div className="video-one__right wow fadeInRight" data-wow-delay="300ms">
                                <div className="section-title text-left">
                                    <div className="section-title__tagline-box">
                                        <span className="section-title__tagline">{content.tagline}</span>
                                    </div>
                                    <div className="section-title__title-box sec-title-animation animation-style2">
                                        <h2 className="section-title__title title-animation">{content.title}</h2>
                                    </div>
                                </div>
                                <p className="video-one__text-1">{content.text1}</p>
                                {content.text2 ? (
                                    <p className="video-one__text-2">{content.text2}</p>
                                ) : null}
                                <div className="video-one__btn-box">
                                    <Link href={content.primaryButtonLink} className="video-one__btn thm-btn">
                                        {content.primaryButtonText}
                                    </Link>
                                    <Link href={content.secondaryButtonLink} className="video-one__btn-two thm-btn">
                                        {content.secondaryButtonText}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <ModalVideo
                channel="youtube"
                autoplay
                isOpen={isOpen}
                videoId={content.videoId}
                onClose={() => setOpen(false)}
            />
        </>
    )
}
