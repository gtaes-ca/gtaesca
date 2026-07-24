'use client'

import Link from "next/link"
import Menu from "../Menu"
import MobileMenu from "../MobileMenu"
import BookServiceLink from "@/components/booking/BookServiceLink"
import { CtaCallNumber } from "@/components/contact/SiteContact"
import { assetUrl } from "@/lib/assets"

const LOGO_SRC = assetUrl('assets/images/resources/logo-1.png')

export default function Header2({ scroll, handleMobileMenu }) {
    return (
        <>

        <header className="main-header-two">
            <nav className="main-menu main-menu-two">
                <div className="main-menu-two__wrapper">
                    <div className="container">
                        <div className="main-menu-two__wrapper-inner">
                            <div className="main-menu-two__left">
                                <div className="main-menu-two__logo">
                                    <Link href="/"><img src={LOGO_SRC} alt="GTA Electric Services" className="site-logo"/></Link>
                                </div>
                                <div className="main-menu-two__main-menu-box">
                                    <Link href="#" className="mobile-nav__toggler" onClick={handleMobileMenu}><i className="fa fa-bars"></i></Link>
                                    <Menu />
                                </div>
                            </div>
                            <div className="main-menu-two__right">
                                <div className="main-menu-two__call-and-btn-box">
                                    <div className="main-menu-two__call">
                                        <div className="main-menu-two__call-icon">
                                            <span className="icon-phone-call"></span>
                                        </div>
                                        <div className="main-menu-two__call-number">
                                            <p>Make a call</p>
                                            <CtaCallNumber headingTag="h5" />
                                        </div>
                                    </div>
                                    <div className="main-menu-two__btn-box">
                                        <BookServiceLink className="main-menu-two__btn thm-btn" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
        <div className={`stricky-header stricked-menu main-menu main-menu-two ${scroll ? "stricky-fixed" : ""}`}>
            <div className="sticky-header__content">
                <div className="main-menu-two__wrapper">
                    <div className="container">
                        <div className="main-menu-two__wrapper-inner">
                            <div className="main-menu-two__left">
                                <div className="main-menu-two__logo">
                                    <Link href="/"><img src={LOGO_SRC} alt="GTA Electric Services" className="site-logo"/></Link>
                                </div>
                                <div className="main-menu-two__main-menu-box">
                                    <Link href="#" className="mobile-nav__toggler" onClick={handleMobileMenu}><i className="fa fa-bars"></i></Link>
                                    <Menu />
                                </div>
                            </div>
                            <div className="main-menu-two__right">
                                <div className="main-menu-two__call-and-btn-box">
                                    <div className="main-menu-two__call">
                                        <div className="main-menu-two__call-icon">
                                            <span className="icon-phone-call"></span>
                                        </div>
                                        <div className="main-menu-two__call-number">
                                            <p>Make a call</p>
                                            <CtaCallNumber headingTag="h5" />
                                        </div>
                                    </div>
                                    <div className="main-menu-two__btn-box">
                                        <BookServiceLink className="main-menu-two__btn thm-btn" />
                                    </div>
                                </div>
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
