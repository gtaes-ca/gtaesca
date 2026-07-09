import Link from "next/link"

export default function Footer3() {
    return (
        <>
       
        <footer className="site-footer-three">
            <div className="site-footer-three__shape-1 float-bob-x">
                <img src="assets/images/shapes/site-footer-three-shape-1.png" alt=""/>
            </div>
            <div className="site-footer-three__shape-2 float-bob-y">
                <img src="assets/images/shapes/site-footer-three-shape-2.png" alt=""/>
            </div>
            <div className="container">
                <div className="site-footer-three__top">
                    <div className="row">
                        <div className="col-xl-3 col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="100ms">
                            <div className="footer-widget-two__column footer-widget-three__about">
                                <div className="footer-widget-three__title-box">
                                    <h3 className="footer-widget-three__title">Open Hours</h3>
                                </div>
                                <div className="footer-widget-three__about-content">
                                    <p>Every day: 10 am to 7 pm</p>
                                    <p>Sun: 11 am to 6 pm</p>
                                    <h4>4517 Washington Ave. <br/> Manchester, 95</h4>
                                    <Link href="#" className="footer-widget-three__about-google-map">Google Map <span
                                            className="icon-arrow-right"></span></Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-5 col-md-6 wow fadeInUp" data-wow-delay="200ms">
                            <div className="footer-widget-two__column footer-widget-two__social">
                                <div className="footer-widget-three__title-box">
                                    <h3 className="footer-widget-three__title">Our Social</h3>
                                </div>
                                <h3 className="footer-widget-three__social-text">Your Brightest <br/> Choice in Repairs</h3>
                                <div className="site-footer-three__social">
                                    <Link href="#"><i className="icon-facebook"></i></Link>
                                    <Link href="#"><i className="icon-xpa"></i></Link>
                                    <Link href="#"><i className="icon-link-in"></i></Link>
                                    <Link href="#"><i className="icon-instagram"></i></Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="300ms">
                            <div className="footer-widget-two__column footer-widget-three__newsletter">
                                <div className="footer-widget-three__title-box">
                                    <h3 className="footer-widget-three__title">Subscribe</h3>
                                </div>
                                <p className="footer-widget-three__newsletter-text">Get the latest updates & exclusive
                                    content to your inbox.</p>
                                <form className="footer-widget-three__newsletter-form mc-form"
                                    >
                                    <div className="footer-widget-three__newsletter-form-input-box">
                                        <input type="email" placeholder="Enter email address..." name="EMAIL"/>
                                    </div>
                                    <button type="submit"
                                        className="thm-btn footer-widget-three__newsletter-btn">Subscribe</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="site-footer-three__bottom">
                <div className="container">
                    <div className="site-footer-three__bottom-inner">
                        <p className="site-footer-three__bottom-text">Copyright 2024. All rights reserved</p>
                        <div className="site-footer-three__logo">
                            <Link href="/"><img src="assets/images/resources/footer-logo-1.png" alt=""/></Link>
                        </div>
                        <ul className="list-unstyled site-footer-three__bottom-menu">
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
