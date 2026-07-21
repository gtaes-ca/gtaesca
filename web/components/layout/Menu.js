import Link from "next/link"

const NAV_ITEMS = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Team', href: '/team' },
    { label: 'Projects', href: '/projects' },
    { label: 'Services', href: '/services' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
]

export default function Menu() {
    return (
        <ul className="main-menu__list">
            {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                </li>
            ))}
        </ul>
    )
}
