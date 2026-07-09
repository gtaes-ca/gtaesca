'use client'

import Link from "next/link"
import { useEffect, useState } from 'react'
import { DEFAULT_TOPBAR } from '@/lib/cms'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const FOOTER_PAGES = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Team', href: '/team' },
    { label: 'Projects', href: '/projects' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
]

export default function Footer1() {
    const [content, setContent] = useState(DEFAULT_TOPBAR)

    useEffect(() => {
        let cancelled = false

        async function loadTopbar() {
            try {
                const res = await fetch(`${API_URL}/api/web-content/home/topbar`)
                if (!res.ok) return
                const data = await res.json()
                if (cancelled) return
                setContent({
                    ...DEFAULT_TOPBAR,
                    ...data.content,
                    social: {
                        ...DEFAULT_TOPBAR.social,
                        ...(data.content?.social || {}),
                    },
                })
            } catch {
                // Keep defaults on failure
            }
        }

        loadTopbar()
        return () => {
            cancelled = true
        }
    }, [])

    const socialLinks = [
        { key: 'facebook', icon: 'icon-facebook', href: content.social.facebook },
        { key: 'twitter', icon: 'icon-xpa', href: content.social.twitter },
        { key: 'linkedin', icon: 'icon-link-in', href: content.social.linkedin },
        { key: 'instagram', icon: 'icon-instagram', href: content.social.instagram },
    ]

    return (
        <>
        <footer className="site-footer">
            <div className="container">
                <div className="site-footer__top">
                    <div className="row">
                        <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay="100ms">
                            <div className="footer-widget__column footer-widget__about">
                                <div className="footer-widget__logo">
                                    <Link href="/"><img src="assets/images/resources/footer-logo-1.png" alt=""/></Link>
                                </div>
                                {socialLinks.some(({ href }) => href) ? (
                                    <div className="site-footer__social">
                                        {socialLinks.filter(({ href }) => href).map(({ key, icon, href }) => (
                                            <Link key={key} href={href} target="_blank" rel="noopener noreferrer">
                                                <i className={icon}></i>
                                            </Link>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay="200ms">
                            <div className="footer-widget__column footer-widget__usefull-link">
                                <div className="footer-widget__title-box">
                                    <h3 className="footer-widget__title">Pages</h3>
                                </div>
                                <div className="footer-widget__link-box">
                                    <ul className="footer-widget__link footer-widget__link--grid list-unstyled">
                                        {FOOTER_PAGES.map((page) => (
                                            <li key={page.href}>
                                                <Link href={page.href}>{page.label}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay="300ms">
                            <div className="footer-widget__column footer-widget__contact">
                                <div className="footer-widget__title-box">
                                    <h3 className="footer-widget__title">Contact us</h3>
                                </div>
                                <ul className="footer-widget__contact-list list-unstyled">
                                    {content.address ? (
                                        <li>
                                            <h3>Address</h3>
                                            <div className="content">
                                                <p>{content.address}</p>
                                            </div>
                                        </li>
                                    ) : null}
                                    {content.email ? (
                                        <li>
                                            <h3>Email</h3>
                                            <div className="content">
                                                <p>
                                                    <Link href={`mailto:${content.email}`}>{content.email}</Link>
                                                </p>
                                            </div>
                                        </li>
                                    ) : null}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="site-footer__bottom">
                <div className="container">
                    <div className="site-footer__bottom-inner">
                        <p className="site-footer__bottom-text">Copyright {new Date().getFullYear()}. All rights reserved</p>
                    </div>
                </div>
            </div>
        </footer>
        </>
    )
}
