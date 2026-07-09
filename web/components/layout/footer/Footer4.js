import Link from "next/link"

export default function Footer4() {
    return (
        <>
        {/*Site Footer Start*/}
        <footer className="site-footer site-footer--two">
            <div className="site-footer__shape-1 float-bob-x">
                <img src="assets/images/shapes/footer-shape-1.png" alt=""/>
            </div>
            <div className="container">
                <div className="site-footer__top">
                    <div className="row">
                        <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay="100ms">
                            <div className="footer-widget__column footer-widget__about">
                                <div className="footer-widget__logo">
                                    <Link href="/"><img src="assets/images/resources/footer-logo-1.png"
                                            alt=""/></Link>
                                </div>
                                <p className="footer-widget__about-text">Secure other greater pleasures, or else he
                                    endures<br/>
                                    pains to avoid worse pains to the selection point.<br/> But in certain circumstances
                                </p>
                                <div className="site-footer__social">
                                    <Link href="#"><i className="icon-facebook"></i></Link>
                                    <Link href="#"><i className="icon-xpa"></i></Link>
                                    <Link href="#"><i className="icon-link-in"></i></Link>
                                    <Link href="#"><i className="icon-instagram"></i></Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-2 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay="200ms">
                            <div className="footer-widget__column footer-widget__usefull-link">
                                <div className="footer-widget__title-box">
                                    <h3 className="footer-widget__title">Our Company</h3>
                                </div>
                                <div className="footer-widget__link-box">
                                    <ul className="footer-widget__link list-unstyled">
                                        <li><Link href="/">Home</Link></li>
                                        <li><Link href="about">About Us</Link></li>
                                        <li><Link href="services">Services</Link></li>
                                        <li><Link href="blog">Blog</Link></li>
                                        <li><Link href="contact">Contact</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay="300ms">
                            <div className="footer-widget__column footer-widget__services">
                                <div className="footer-widget__title-box">
                                    <h3 className="footer-widget__title">Our Service</h3>
                                </div>
                                <ul className="footer-widget__link list-unstyled">
                                    <li><Link href="electric-panel-repair">Electric Repair</Link></li>
                                    <li><Link href="lighting-fixtures">Lighting & Fixture</Link></li>
                                    <li><Link href="maintenance-service">European Lard Sration</Link></li>
                                    <li><Link href="maintenance-service">Electric Maintenance</Link></li>
                                    <li><Link href="installing-ceiling-fan">Colling Service</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay="400ms">
                            <div className="footer-widget__column footer-widget__contact">
                                <div className="footer-widget__title-box">
                                    <h3 className="footer-widget__title">Contact us</h3>
                                </div>
                                <ul className="footer-widget__contact-list list-unstyled">
                                    <li>
                                        <h3>Address</h3>
                                        <div className="content">
                                            <p>2972 Westheimer Rd. Santa <br/> Ana, Illinois 8548 </p>
                                        </div>
                                    </li>
                                    <li>
                                        <h3>Contact</h3>
                                        <div className="content">
                                            <p><Link href="tel:8528525285505">+85 2852 5285 505</Link></p>
                                            <p><Link href="mailto:example@gmail.com">example@gmail.com</Link></p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="site-footer__bottom">
                <div className="container">
                    <div className="site-footer__bottom-inner">
                        <p className="site-footer__bottom-text">Copyright 2024. All rights reserved</p>
                        <ul className="list-unstyled site-footer__bottom-menu">
                            <li><Link href="contact">Support</Link></li>
                            <li><Link href="about">Terms and Condition</Link></li>
                            <li><Link href="about">Privacy and Policy</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
        {/*Site Footer End*/}

        </>
    )
}
