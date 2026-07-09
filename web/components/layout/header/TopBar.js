'use client'

import { useEffect, useState } from 'react'
import Link from "next/link"
import { DEFAULT_TOPBAR } from '@/lib/cms'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

function TopBarContent() {
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
        <div className="main-menu__top">
            <div className="main-menu__top-inner">
                <ul className="list-unstyled main-menu__contact-list">
                    <li>
                        <div className="icon">
                            <i className="icon-envelope"></i>
                        </div>
                        <div className="text">
                            <p>
                                <Link href={`mailto:${content.email}`}>{content.email}</Link>
                            </p>
                        </div>
                    </li>
                    <li>
                        <div className="icon">
                            <i className="icon-location"></i>
                        </div>
                        <div className="text">
                            <p>{content.address}</p>
                        </div>
                    </li>
                </ul>
                <div className="main-menu__top-right">
                    <div className="main-menu__social">
                        {socialLinks.filter(({ href }) => href).map(({ key, icon, href }) => (
                            <Link key={key} href={href} target="_blank" rel="noopener noreferrer">
                                <i className={icon}></i>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopBarContent
