'use client'

import Link from "next/link"
import { useMemo } from "react"
import { useBookingChannel } from "@/hooks/useBookingChannel"
import { useNavServices } from "@/hooks/useNavServices"
import { serviceDetailPath } from "@/lib/paths"

const NAV_ITEMS = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Team', href: '/team', bookingOnly: true },
    { label: 'Residential', href: '/residential', childrenKey: 'residential' },
    { label: 'Commercial', href: '/commercial', childrenKey: 'commercial' },
    { label: 'Service Areas', href: '/service-areas' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
]

export default function Menu() {
    const { isWhatsAppMode, loaded } = useBookingChannel()
    const { residential, commercial } = useNavServices()

    const serviceChildren = useMemo(() => ({
        residential,
        commercial,
    }), [residential, commercial])

    const items = useMemo(() => {
        if (!loaded) {
            return NAV_ITEMS.filter((item) => !item.bookingOnly)
        }
        if (isWhatsAppMode) {
            return NAV_ITEMS.filter((item) => !item.bookingOnly)
        }
        return NAV_ITEMS
    }, [isWhatsAppMode, loaded])

    return (
        <ul className="main-menu__list">
            {items.map((item) => {
                const children = item.childrenKey
                    ? serviceChildren[item.childrenKey] || []
                    : []
                const isDropdown = Boolean(item.childrenKey)

                if (!isDropdown) {
                    return (
                        <li key={item.href}>
                            <Link href={item.href}>{item.label}</Link>
                        </li>
                    )
                }

                return (
                    <li key={item.href} className="dropdown dropdown--services">
                        <Link href={item.href}>{item.label}</Link>
                        <ul className="main-menu__services-panel">
                            <li className="main-menu__services-panel-all">
                                <Link href={item.href}>All {item.label} Services</Link>
                            </li>
                            {children.map((service) => (
                                <li key={service.id || service.slug || service.name}>
                                    <Link href={serviceDetailPath(service)}>{service.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                )
            })}
        </ul>
    )
}
