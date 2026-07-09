
import Link from "next/link"
import Menu from "../Menu"
import MobileMenu from "../MobileMenu"

export default function Header2({ scroll, handleMobileMenu }) {
    return (
        <>

        <header className="main-header-two">
            <div className="main-menu-two__top">
                <div className="container">
                    <div className="main-menu-two__top-inner">
                        <div className="main-menu-two__top-left">
                            <div className="main-menu-two__social">
                                <Link href="#"><i className="icon-facebook"></i></Link>
                                <Link href="#"><i className="icon-xpa"></i></Link>
                                <Link href="#"><i className="icon-link-in"></i></Link>
                                <Link href="#"><i className="icon-instagram"></i></Link>
                            </div>
                            <p className="main-menu-two__text">Welcome to Our Car Repair Agency</p>
                        </div>
                        <ul className="list-unstyled main-menu-two__contact-list">
                            <li>
                                <div className="icon">
                                    <i className="icon-location"></i>
                                </div>
                                <div className="text">
                                    <p>12 Green Road, 05 New York</p>
                                </div>
                            </li>
                            <li>
                                <div className="icon">
                                    <i className="icon-envelope"></i>
                                </div>
                                <div className="text">
                                    <p><Link href="mailto:info@fonisa24.com">example@gamil.com</Link>
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <nav className="main-menu main-menu-two">
                <div className="main-menu-two__wrapper">
                    <div className="container">
                        <div className="main-menu-two__wrapper-inner">
                            <div className="main-menu-two__left">
                                <div className="main-menu-two__logo">
                                    <Link href="/"><img src="assets/images/resources/logo-1.png" alt=""/></Link>
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
                                            <h5><Link href="tel:00554755242">00 55 475 5242</Link></h5>
                                        </div>
                                    </div>
                                    <div className="main-menu-two__btn-box">
                                        <Link href="/book" className="main-menu-two__btn thm-btn">Book a Service</Link>
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
                                    <Link href="/"><img src="assets/images/resources/logo-1.png" alt=""/></Link>
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
                                            <h5><Link href="tel:00554755242">00 55 475 5242</Link></h5>
                                        </div>
                                    </div>
                                    <div className="main-menu-two__btn-box">
                                        <Link href="/book" className="main-menu-two__btn thm-btn">Book a Service</Link>
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
