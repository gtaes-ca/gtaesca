import Link from "next/link"

export default function Footer2() {
    return (
        <>
            

        <footer className="site-footer-two">
            <div className="site-footer-two__bg-shape float-bob-y"
                style={{ backgroundImage: 'url(assets/images/shapes/site-footer-two-bg-shape.png)' }} ></div>
            <div className="container">
                <div className="site-footer-two__top">
                    <div className="row">
                        <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay="100ms">
                            <div className="footer-widget-two__column footer-widget-two__about">
                                <div className="footer-widget-two__logo">
                                    <Link href="/"><img src="assets/images/resources/footer-logo-2.png"
                                            alt=""/></Link>
                                </div>
                                <p className="footer-widget-two__about-text">Secure other greater pleasures, or else he
                                    endures<br/>
                                    pains to avoid worse pains selection </p>
                                <ul className="footer-widget-two__contact list-unstyled">
                                    <li>
                                        <div className="icon">
                                            <span className="icon-phone-call"></span>
                                        </div>
                                        <div className="content">
                                            <h3>Contact</h3>
                                            <p><Link href="tel:885747546027">(88) 574 7546 027</Link></p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <span className="icon-location"></span>
                                        </div>
                                        <div className="content">
                                            <h3>Location</h3>
                                            <p>4517 Washington Ave. Manchester, 95</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-xl-2 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay="200ms">
                            <div className="footer-widget-two__column footer-widget-two__usefull-link">
                                <div className="footer-widget-two__title-box">
                                    <h3 className="footer-widget-two__title">Our Company</h3>
                                </div>
                                <div className="footer-widget-two__link-box">
                                    <ul className="footer-widget-two__link list-unstyled">
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
                            <div className="footer-widget-two__column footer-widget-two__services">
                                <div className="footer-widget-two__title-box">
                                    <h3 className="footer-widget-two__title">Our Service</h3>
                                </div>
                                <ul className="footer-widget-two__link list-unstyled">
                                    <li><Link href="electric-panel-repair">Heating Service</Link></li>
                                    <li><Link href="installing-ceiling-fan">A/C Installation</Link></li>
                                    <li><Link href="maintenance-service">Dust Cleaning</Link></li>
                                    <li><Link href="maintenance-service">Colling Service</Link></li>
                                    <li><Link href="electric-panel-repair">A/C Repair</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay="400ms">
                            <div className="footer-widget-two__column footer-widget-two__newsletter">
                                <h3 className="footer-widget-two__newsletter-title">Subscribe To Our Newsletter To Get
                                    Latest Update</h3>
                                <form className="footer-widget-two__newsletter-form mc-form"
                                    >
                                    <div className="footer-widget-two__newsletter-form-input-box">
                                        <input type="email" placeholder="Enter email address..." name="EMAIL"/>
                                        <button type="submit" className="footer-widget-two__newsletter-btn"><span
                                                className="icon-send"></span></button>
                                    </div>
                                </form>
                                <div className="site-footer-two__social">
                                    <Link href="#"><i className="icon-facebook"></i></Link>
                                    <Link href="#"><i className="icon-xpa"></i></Link>
                                    <Link href="#"><i className="icon-link-in"></i></Link>
                                    <Link href="#"><i className="icon-instagram"></i></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="site-footer-two__bottom">
                <div className="container">
                    <div className="site-footer-two__bottom-inner">
                        <p className="site-footer-two__bottom-text">Copyright 2024. All rights reserved</p>
                        <ul className="list-unstyled site-footer-two__bottom-menu">
                            <li><Link href="contact">Support</Link></li>
                            <li><Link href="about">Terms and Condition</Link></li>
                            <li><Link href="about">Privacy and Policy</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
       
        </>
    )
}
