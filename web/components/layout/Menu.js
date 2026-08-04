'use client'

import Link from "next/link"
import { useMemo } from "react"
import { useBookingChannel } from "@/hooks/useBookingChannel"

const NAV_ITEMS = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Team', href: '/team', bookingOnly: true },
    { label: 'Residential', href: '/residential' },
    { label: 'Commercial', href: '/commercial' },
    { label: 'Service Areas', href: '/service-areas' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
]

export default function Menu() {
    const { isWhatsAppMode, loaded } = useBookingChannel()

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
            {items.map((item) => (
                <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                </li>
            ))}
        </ul>
    )
}
