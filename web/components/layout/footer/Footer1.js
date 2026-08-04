'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import BookServiceLink from '@/components/booking/BookServiceLink'
import CallNowLink from '@/components/booking/CallNowLink'
import { DEFAULT_TOPBAR, toTelHref } from '@/lib/cms'
import { assetUrl } from '@/lib/assets'
import { serviceDetailPath } from '@/lib/paths'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const FOOTER_LOGO_SRC = assetUrl('assets/images/resources/footer-logo-1.png')
const HASHMARK_LOGO_SRC = assetUrl('assets/images/brand/hashmark-light-logo.png')
const FOOTER_SERVICE_LIMIT = 6

const QUICK_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'Residential', href: '/residential' },
    { label: 'Commercial', href: '/commercial' },
    { label: 'Service Areas', href: '/service-areas' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
]

const ABOUT_TEXT =
    'Licensed and insured electrical contractors serving homeowners and businesses throughout the Greater Toronto Area and Ontario.'

const SOCIAL_ITEMS = [
    { key: 'facebook', icon: 'icon-facebook', label: 'Facebook' },
    { key: 'twitter', icon: 'icon-xpa', label: 'X' },
    { key: 'linkedin', icon: 'icon-link-in', label: 'LinkedIn' },
    { key: 'instagram', icon: 'icon-instagram', label: 'Instagram' },
]

export default function Footer1() {
    const [content, setContent] = useState(DEFAULT_TOPBAR)
    const [residential, setResidential] = useState([])
    const [commercial, setCommercial] = useState([])
    const [specificationItems, setSpecificationItems] = useState([])

    useEffect(() => {
        let cancelled = false

        async function loadFooterData() {
            try {
                const [topbarRes, residentialRes, commercialRes, contactSettingsRes] = await Promise.all([
                    fetch(`${API_URL}/api/web-content/home/topbar`),
                    fetch(`${API_URL}/api/services/list?group=residential`),
                    fetch(`${API_URL}/api/services/list?group=commercial`),
                    fetch(`${API_URL}/api/web-content/contact/settings`),
                ])

                if (topbarRes.ok) {
                    const data = await topbarRes.json()
                    if (!cancelled) {
                        setContent({
                            phone: data.content?.phone || '',
                            email: data.content?.email || '',
                            address: data.content?.address || '',
                            social: {
                                facebook: data.content?.social?.facebook || '',
                                twitter: data.content?.social?.twitter || '',
                                linkedin: data.content?.social?.linkedin || '',
                                instagram: data.content?.social?.instagram || '',
                            },
                        })
                    }
                }

                if (residentialRes.ok) {
                    const data = await residentialRes.json()
                    if (!cancelled) {
                        setResidential(
                            (Array.isArray(data.services) ? data.services : []).slice(0, FOOTER_SERVICE_LIMIT)
                        )
                    }
                }

                if (commercialRes.ok) {
                    const data = await commercialRes.json()
                    if (!cancelled) {
                        setCommercial(
                            (Array.isArray(data.services) ? data.services : []).slice(0, FOOTER_SERVICE_LIMIT)
                        )
                    }
                }

                if (contactSettingsRes.ok) {
                    const data = await contactSettingsRes.json()
                    const items = data?.content?.specificationItems
                    if (!cancelled && Array.isArray(items)) {
                        setSpecificationItems(items.map((x) => String(x || '').trim()).filter(Boolean))
                    }
                }
            } catch {
                // Keep defaults on failure
            }
        }

        loadFooterData()
        return () => {
            cancelled = true
        }
    }, [])

    const socialLinks = SOCIAL_ITEMS
        .map((item) => ({
            ...item,
            href: content.social?.[item.key] || '',
        }))
        .filter((item) => item.href)

    return (
        <footer className="site-footer site-footer--brand">
            <div className="site-footer__cta">
                <div className="container">
                    <div className="site-footer__cta-inner">
                        <div className="site-footer__cta-copy">
                            <h2 className="site-footer__cta-title">Ready to Work With Us?</h2>
                            <p className="site-footer__cta-text">
                                Contact us today for a free, no-obligation quote. We&apos;d be glad to help with your
                                project.
                            </p>
                        </div>
                        <div className="site-footer__cta-actions">
                            <CallNowLink className="site-footer__cta-btn site-footer__cta-btn--primary thm-btn" />
                            <BookServiceLink className="site-footer__cta-btn site-footer__cta-btn--outline" />
                        </div>
                    </div>

                    {specificationItems.length ? (
                        <div className="row mt-4">
                            <div className="col-12">
                                <ul className="footer-widget__specification list-unstyled">
                                    {specificationItems.map((item, idx) => (
                                        <li key={`${idx}-${item}`}>- {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : null}

                </div>
            </div>

            <div className="container">
                <div className="site-footer__top">
                    <div className="row site-footer__columns">
                        <div className="col-xl-3 col-lg-6 col-md-6">
                            <div className="footer-widget__column footer-widget__about">
                                <div className="footer-widget__logo">
                                    <Link href="/">
                                        <img src={FOOTER_LOGO_SRC} alt="GTA Electric Services" className="site-logo" />
                                    </Link>
                                </div>
                                <p className="footer-widget__about-text">{ABOUT_TEXT}</p>

                                <ul className="footer-widget__contact-inline list-unstyled">
                                    {content.phone ? (
                                        <li>
                                            <span className="icon-phone-call" aria-hidden="true" />
                                            <Link href={toTelHref(content.phone)}>{content.phone}</Link>
                                        </li>
                                    ) : null}
                                    {content.email ? (
                                        <li>
                                            <span className="icon-envelope" aria-hidden="true" />
                                            <Link href={`mailto:${content.email}`}>{content.email}</Link>
                                        </li>
                                    ) : null}
                                    {content.address ? (
                                        <li>
                                            <span className="icon-location" aria-hidden="true" />
                                            <span>{content.address}</span>
                                        </li>
                                    ) : null}
                                </ul>
                                {socialLinks.length ? (
                                    <div className="site-footer__social" aria-label="Social media">
                                        {socialLinks.map(({ key, icon, href, label }) => (
                                            <Link
                                                key={key}
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={label}
                                            >
                                                <i className={icon} aria-hidden="true" />
                                            </Link>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        <div className="col-xl-3 col-lg-6 col-md-6">
                            <div className="footer-widget__column footer-widget__usefull-link">
                                <div className="footer-widget__title-box">
                                    <h3 className="footer-widget__title">Quick Links</h3>
                                </div>
                                <ul className="footer-widget__link list-unstyled">
                                    {QUICK_LINKS.map((page) => (
                                        <li key={page.href}>
                                            <Link href={page.href}>{page.label}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="col-xl-3 col-lg-6 col-md-6">
                            <div className="footer-widget__column footer-widget__services">
                                <div className="footer-widget__title-box">
                                    <h3 className="footer-widget__title">Residential</h3>
                                </div>
                                <ul className="footer-widget__link list-unstyled">
                                    {residential.length ? (
                                        residential.map((service) => (
                                            <li key={service.id}>
                                                <Link href={serviceDetailPath(service)}>{service.name}</Link>
                                            </li>
                                        ))
                                    ) : (
                                        <li>
                                            <Link href="/residential">View Residential Services</Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div className="col-xl-3 col-lg-6 col-md-6">
                            <div className="footer-widget__column footer-widget__services footer-widget__services--commercial">
                                <div className="footer-widget__title-box">
                                    <h3 className="footer-widget__title">Commercial</h3>
                                </div>
                                <ul className="footer-widget__link list-unstyled">
                                    {commercial.length ? (
                                        commercial.map((service) => (
                                            <li key={service.id}>
                                                <Link href={serviceDetailPath(service)}>{service.name}</Link>
                                            </li>
                                        ))
                                    ) : (
                                        <li>
                                            <Link href="/commercial">View Commercial Services</Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="site-footer__bottom">
                <div className="container">
                    <div className="site-footer__bottom-inner">
                        <p className="site-footer__bottom-text">
                            Copyright {new Date().getFullYear()}. All rights reserved
                        </p>
                        <div className="site-footer__bottom-end">
                            <div className="site-footer__legal-links">
                                <Link href="/terms">Terms and Conditions</Link>
                                <Link href="/privacy">Privacy Policy</Link>
                            </div>
                            <div className="site-footer__hashmark">
                                <Link
                                    href="https://hashmark.tech"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="site-footer__hashmark-link"
                                    aria-label="Visit Hashmark"
                                >
                                    <span className="site-footer__hashmark-text">Hashmark</span>
                                    <img
                                        src={HASHMARK_LOGO_SRC}
                                        alt="Hashmark logo"
                                        className="site-footer__hashmark-logo"
                                        width={28}
                                        height={28}
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
