import Link from "next/link"
import Menu from "../Menu"
import MobileMenu from "../MobileMenu"
import AccountNav from "@/components/auth/AccountNav"
import BookServiceLink from "@/components/booking/BookServiceLink"
import { assetUrl } from "@/lib/assets"

const LOGO_SRC = assetUrl('assets/images/resources/logo-1.png')

export default function Header1({ scroll, handleMobileMenu }) {
    return (
        <>
            <header className="main-header">
            <nav className="main-menu">
                <div className="main-menu__wrapper">
                    <div className="main-menu__wrapper-inner">
                        <div className="main-menu__left">
                            <div className="main-menu__logo">
                                <Link href="/"><img src={LOGO_SRC} alt="GTA Electric Services" className="site-logo"/></Link>
                            </div>
                            <div className="main-menu__main-menu-box">
                                <Link href="#" className="mobile-nav__toggler" onClick={handleMobileMenu}><i className="fa fa-bars"></i></Link>
                                <Menu />
                            </div>
                        </div>
                        <div className="main-menu__right">
                            <AccountNav />
                            <div className="main-menu__btn-box">
                                <BookServiceLink className="main-menu__btn thm-btn" />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>

        <div className={`stricky-header stricked-menu main-menu ${scroll ? "stricky-fixed" : ""}`}>
            <div className="sticky-header__content">
            <div className="main-menu__wrapper">
                    <div className="main-menu__wrapper-inner">
                        <div className="main-menu__left">
                            <div className="main-menu__logo">
                                <Link href="/"><img src={LOGO_SRC} alt="GTA Electric Services" className="site-logo"/></Link>
                            </div>
                            <div className="main-menu__main-menu-box">
                                <Link href="#" className="mobile-nav__toggler" onClick={handleMobileMenu}><i className="fa fa-bars"></i></Link>
                                <Menu />
                            </div>
                        </div>
                        <div className="main-menu__right">
                            <AccountNav />
                            <div className="main-menu__btn-box">
                                <BookServiceLink className="main-menu__btn thm-btn" />
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
