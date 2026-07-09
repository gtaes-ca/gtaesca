import Menu from "../Menu"
import Link from "next/link"
import MobileMenu from "../MobileMenu"
export default function Header3({ scroll, handlePopup, handleMobileMenu  }) {
    return (
        <>
        
        <header className="main-header-three">
            <div className="main-menu-three__top">
                <div className="main-menu-three__top-inner">
                    <ul className="list-unstyled main-menu-three__contact-list">
                        <li>
                            <div className="icon">
                                <i className="icon-call"></i>
                            </div>
                            <div className="text">
                                <p> <span>Talk to us</span> <Link href="tel:9288006780">+92 ( 8800 ) - 6780</Link></p>
                            </div>
                        </li>
                        <li>
                            <div className="icon">
                                <i className="icon-envelope"></i>
                            </div>
                            <div className="text">
                                <p> <span>Mail us</span> <Link href="mailto:info@fonisa24.com">example@gamil.com</Link>
                                </p>
                            </div>
                        </li>
                    </ul>
                    <div className="main-menu-three__top-right">
                        <div className="main-menu-three__social">
                            <Link href="#"><i className="icon-facebook"></i></Link>
                            <Link href="#"><i className="icon-xpa"></i></Link>
                            <Link href="#"><i className="icon-link-in"></i></Link>
                            <Link href="#"><i className="icon-instagram"></i></Link>
                        </div>
                        <div className="main-menu-three__search-box">
                            <Link href="#" className="main-menu-three__search search-toggler">
                                <p className="main-menu-three__search-text">Search</p>
                                <span className="icon-search-interface-symbol" onClick={handlePopup}></span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <nav className="main-menu main-menu-three">
                <div className="main-menu-three__wrapper">
                    <div className="main-menu-three__wrapper-inner">
                        <div className="main-menu-three__left">
                            <div className="main-menu-three__logo">
                                <Link href="/"><img src="assets/images/resources/logo-1.png" alt=""/></Link>
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
                                    <Link href="/book" className="main-menu-three__btn thm-btn">Book a Service</Link>
                                </div>
                                <div className="main-menu-three__login-box">
                                    <div className="main-menu-three__login-icon">
                                        <span className="icon-user"></span>
                                    </div>
                                    <p className="main-menu-three__login-text">
                                        <Link href="/account/login">Sign In</Link>
                                    </p>
                                </div>
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
                                <Link href="/"><img src="assets/images/resources/logo-1.png" alt=""/></Link>
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
                                    <Link href="/book" className="main-menu-three__btn thm-btn">Book a Service</Link>
                                </div>
                                <div className="main-menu-three__login-box">
                                    <div className="main-menu-three__login-icon">
                                        <span className="icon-user"></span>
                                    </div>
                                    <p className="main-menu-three__login-text">
                                        <Link href="/account/login">Sign In</Link>
                                    </p>
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
