import Menu from "../Menu"
import Link from "next/link"
import MobileMenu from "../MobileMenu"
import BookServiceLink from "@/components/booking/BookServiceLink"
import { useAuth } from "@/context/AuthProvider"
import { useBookingChannel } from "@/hooks/useBookingChannel"
import { assetUrl } from "@/lib/assets"

const LOGO_SRC = assetUrl('assets/images/resources/logo-1.png')

export default function Header3({ scroll, handleMobileMenu  }) {
    const { isAuthenticated, sessionChecked } = useAuth()
    const { isWhatsAppMode, loaded: channelLoaded } = useBookingChannel()
    const showAccountLink = sessionChecked && channelLoaded && !isWhatsAppMode
    const accountHref = isAuthenticated ? "/account/bookings" : "/account/login?redirectTo=/account/bookings"
    const accountLabel = isAuthenticated ? "My Bookings" : "Sign In"

    return (
        <>
        
        <header className="main-header-three">
            <nav className="main-menu main-menu-three">
                <div className="main-menu-three__wrapper">
                    <div className="main-menu-three__wrapper-inner">
                        <div className="main-menu-three__left">
                            <div className="main-menu-three__logo">
                                <Link href="/"><img src={LOGO_SRC} alt="GTA Electric Services" className="site-logo"/></Link>
                            </div>
                            <div className="main-menu-three__main-menu-box">
                                <Link href="#" className="mobile-nav__toggler" onClick={handleMobileMenu}><i className="fa fa-bars"></i></Link>
                                <Menu />
                            </div>
                        </div>
                        <div className="main-menu-three__right">
                            <div className="main-menu-three__cart-btn-and-login-box">
                                <div className="main-menu-three__cart">
                                    <Link href="#"><span className="fas fa-shopping-cart"></span></Link>
                                </div>
                                <div className="main-menu-three__btn-box">
                                    <BookServiceLink className="main-menu-three__btn thm-btn" />
                                </div>
                                {showAccountLink ? (
                                    <div className="main-menu-three__login-box">
                                        <div className="main-menu-three__login-icon">
                                            <span className="icon-user"></span>
                                        </div>
                                        <p className="main-menu-three__login-text">
                                            <Link href={accountHref}>{accountLabel}</Link>
                                        </p>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
        <div className={`stricky-header stricked-menu main-menu main-menu-three ${scroll ? "stricky-fixed" : ""}`}>
            <div className="sticky-header__content">
                <div className="main-menu-three__wrapper">
                    <div className="main-menu-three__wrapper-inner">
                        <div className="main-menu-three__left">
                            <div className="main-menu-three__logo">
                                <Link href="/"><img src={LOGO_SRC} alt="GTA Electric Services" className="site-logo"/></Link>
                            </div>
                            <div className="main-menu-three__main-menu-box">
                                <Link href="#" className="mobile-nav__toggler" onClick={handleMobileMenu}><i className="fa fa-bars"></i></Link>
                                <Menu />
                            </div>
                        </div>
                        <div className="main-menu-three__right">
                            <div className="main-menu-three__cart-btn-and-login-box">
                                <div className="main-menu-three__cart">
                                    <Link href="#"><span className="fas fa-shopping-cart"></span></Link>
                                </div>
                                <div className="main-menu-three__btn-box">
                                    <BookServiceLink className="main-menu-three__btn thm-btn" />
                                </div>
                                {showAccountLink ? (
                                    <div className="main-menu-three__login-box">
                                        <div className="main-menu-three__login-icon">
                                            <span className="icon-user"></span>
                                        </div>
                                        <p className="main-menu-three__login-text">
                                            <Link href={accountHref}>{accountLabel}</Link>
                                        </p>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>{/* /.sticky-header__content */}
        </div>{/* /.stricky-header */}
        <MobileMenu handleMobileMenu={handleMobileMenu} />

        </>
    )
}
