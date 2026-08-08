'use client'

import Link from "next/link"
import { useMemo, useState } from "react"
import { useAuth } from "@/context/AuthProvider"
import { useBookingChannel } from "@/hooks/useBookingChannel"
import { useNavServices } from "@/hooks/useNavServices"
import { assetUrl } from "@/lib/assets"
import { serviceDetailPath } from "@/lib/paths"

const LOGO_SRC = assetUrl('assets/images/resources/logo-1.png')

const BASE_NAV_ITEMS = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Team', href: '/team', bookingOnly: true },
    { label: 'Residential', href: '/residential', childrenKey: 'residential' },
    { label: 'Commercial', href: '/commercial', childrenKey: 'commercial' },
    { label: 'Service Areas', href: '/service-areas' },
    { label: 'FAQ', href: '/faq' },
    { labelKey: 'book', href: '/book' },
    { label: 'Contact', href: '/contact' },
]

const MobileMenu = ({ handleMobileMenu }) => {
    const { isAuthenticated, sessionChecked } = useAuth()
    const { label: bookLabel, href: bookHref, isWhatsAppMode, loaded: channelLoaded } = useBookingChannel()
    const { residential, commercial } = useNavServices()
    const [openKey, setOpenKey] = useState('')

    const serviceChildren = useMemo(() => ({
        residential,
        commercial,
    }), [residential, commercial])

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

    const handleToggle = (key) => {
        setOpenKey((current) => (current === key ? '' : key))
    }

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
                            {menuItems.map((item) => {
                                const children = item.childrenKey
                                    ? serviceChildren[item.childrenKey] || []
                                    : []
                                const isDropdown = Boolean(item.childrenKey)
                                const isOpen = openKey === item.href

                                if (!isDropdown) {
                                    return (
                                        <li key={item.href}>
                                            <Link href={item.href} onClick={handleMobileMenu}>{item.label}</Link>
                                        </li>
                                    )
                                }

                                return (
                                    <li
                                        key={item.href}
                                        className={isOpen ? 'dropdown dropdown--services current' : 'dropdown dropdown--services'}
                                    >
                                        <Link href={item.href} onClick={handleMobileMenu}>{item.label}</Link>
                                        <ul className="main-menu__services-panel" style={{ display: isOpen ? 'block' : 'none' }}>
                                            <li className="main-menu__services-panel-all">
                                                <Link href={item.href} onClick={handleMobileMenu}>
                                                    All {item.label} Services
                                                </Link>
                                            </li>
                                            {children.map((service) => (
                                                <li key={service.id || service.slug || service.name}>
                                                    <Link
                                                        href={serviceDetailPath(service)}
                                                        onClick={handleMobileMenu}
                                                    >
                                                        {service.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                        <button
                                            type="button"
                                            className={isOpen ? 'expanded open' : ''}
                                            aria-expanded={isOpen}
                                            aria-label={`Toggle ${item.label} submenu`}
                                            onClick={() => handleToggle(item.href)}
                                        >
                                            <span className="fa fa-angle-right" />
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MobileMenu
