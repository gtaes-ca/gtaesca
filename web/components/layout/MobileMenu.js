'use client'

import Link from "next/link"

const NAV_ITEMS = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Team', href: '/team' },
    { label: 'Projects', href: '/projects' },
    { label: 'Services', href: '/services' },
    { label: 'Book a Service', href: '/book' },
    { label: 'Contact', href: '/contact' },
    { label: 'Sign In', href: '/account/login' },
]

const MobileMenu = ({ handleMobileMenu }) => {
    return (
        <div className="mobile-nav__wrapper">
            <div className="mobile-nav__overlay mobile-nav__toggler" onClick={handleMobileMenu} />
            <div className="mobile-nav__content">
                <span className="mobile-nav__close mobile-nav__toggler" onClick={handleMobileMenu}>
                    <i className="fa fa-times"></i>
                </span>

                <div className="logo-box">
                    <Link href="/" aria-label="logo image">
                        <img src="assets/images/resources/logo-1.png" width="150" alt="" />
                    </Link>
                </div>

                <div className="mobile-nav__container">
                    <div className="collapse navbar-collapse show clearfix" id="navbarSupportedContent">
                        <ul className="main-menu__list">
                            {NAV_ITEMS.map((item) => (
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
