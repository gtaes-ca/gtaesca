'use client'

import Link from "next/link"
import { useMemo } from "react"
import { useAuth } from "@/context/AuthProvider"
import { useBookingChannel } from "@/hooks/useBookingChannel"
import { assetUrl } from "@/lib/assets"

const LOGO_SRC = assetUrl('assets/images/resources/logo-1.png')

const BASE_NAV_ITEMS = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Team', href: '/team', bookingOnly: true },
    { label: 'Residential', href: '/residential' },
    { label: 'Commercial', href: '/commercial' },
    { label: 'Service Areas', href: '/service-areas' },
    { label: 'FAQ', href: '/faq' },
    { labelKey: 'book', href: '/book' },
    { label: 'Contact', href: '/contact' },
]

const MobileMenu = ({ handleMobileMenu }) => {
    const { isAuthenticated, sessionChecked } = useAuth()
    const { label: bookLabel, href: bookHref, isWhatsAppMode, loaded: channelLoaded } = useBookingChannel()

    const menuItems = useMemo(() => {
        const navItems = BASE_NAV_ITEMS
            .filter((item) => {
                if (!item.bookingOnly) return true
                return channelLoaded && !isWhatsAppMode
            })
            .map((item) => {
                if (item.labelKey === 'book') {
                    return { label: bookLabel, href: bookHref }
                }
                return item
            })

        if (!sessionChecked || !channelLoaded || isWhatsAppMode) {
            return navItems
        }

        return [
            ...navItems,
            {
                label: isAuthenticated ? 'My Bookings' : 'Sign In',
                href: isAuthenticated ? '/account/bookings' : '/account/login?redirectTo=/account/bookings',
            },
        ]
    }, [bookHref, bookLabel, channelLoaded, isAuthenticated, isWhatsAppMode, sessionChecked])

    return (
        <div className="mobile-nav__wrapper">
            <div className="mobile-nav__overlay mobile-nav__toggler" onClick={handleMobileMenu} />
            <div className="mobile-nav__content">
                <span className="mobile-nav__close mobile-nav__toggler" onClick={handleMobileMenu}>
                    <i className="fa fa-times"></i>
                </span>

                <div className="logo-box">
                    <Link href="/" aria-label="logo image">
                        <img src={LOGO_SRC} width="150" alt="GTA Electric Services" className="site-logo" />
                    </Link>
                </div>

                <div className="mobile-nav__container">
                    <div className="collapse navbar-collapse show clearfix" id="navbarSupportedContent">
                        <ul className="main-menu__list">
                            {menuItems.map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} onClick={handleMobileMenu}>{item.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MobileMenu
