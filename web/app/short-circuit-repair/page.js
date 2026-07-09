
import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function Home() {

    return (
        <>
        <Layout headerStyle={2} footerStyle={1} breadcrumbTitle="Short circuit repair">
        {/*Service Details Start*/}
        <section className="service-details">
            <div className="container">
                <div className="row">
                    <div className="col-xl-8 col-lg-7">
                        <div className="service-details__left">
                            <div className="service-details__img">
                                <img src="assets/images/services/service-details-img-1.jpg" alt=""/>
                            </div>
                            <h3 className="service-details__title-1">Short circuit repair</h3>
                            <p className="service-details__text-1">Ut enim ad minim veniam, quis nostrud exercitation
                                ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                                sint occaecat cupidatat non proident, sunt in culpa</p>
                            <p className="service-details__text-2">Consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut laborer et dolore magna aliqua. Out enigma ad minim veniam, quis nostrud
                                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute inure
                                dolor in the reprehenderit in voluptate velit esse cillum dolore eu fugiat null
                                pariatur. Excepteur snit occaecat cupidatat non proident, sunt in culpa qui officia
                                deserunt mollit anim id est laborum.</p>
                            <ul className="service-details__points-list list-unstyled">
                                <li>
                                    <div className="icon">
                                        <span className="icon-arrow-right"></span>
                                    </div>
                                    <p>It is a long established fact that a reader will be distr acted bioiiy the rea
                                        dablea </p>
                                </li>
                                <li>
                                    <div className="icon">
                                        <span className="icon-arrow-right"></span>
                                    </div>
                                    <p>Distr acted bioiiy the rea dablea content of a page when looking at its layout
                                    </p>
                                </li>
                                <li>
                                    <div className="icon">
                                        <span className="icon-arrow-right"></span>
                                    </div>
                                    <p>Content of a page when looking at its layout toile point</p>
                                </li>
                                <li>
                                    <div className="icon">
                                        <span className="icon-arrow-right"></span>
                                    </div>
                                    <p>Reader will be distr acted bioiiy the rea dablea content of a page when looking
                                    </p>
                                </li>
                            </ul>
                            <div className="service-details__img-box">
                                <div className="row">
                                    <div className="col-xl-6">
                                        <div className="service-details__img-box-single">
                                            <div className="service-details__img-box-img">
                                                <img src="assets/images/services/service-details-img-box-img-1.jpg"
                                                    alt=""/>
                                            </div>
                                            <div className="service-details__img-box-content">
                                                <div className="service-details__img-box-content-icon-and-title">
                                                    <div className="service-details__img-box-content-icon">
                                                        <span className="icon-lamp"></span>
                                                    </div>
                                                    <h3 className="service-details__img-box-content-title">Quality Full Work
                                                    </h3>
                                                </div>
                                                <p className="service-details__img-box-content-text">Duis acute arura dolor
                                                    in
                                                    reprehenderit in voluptate velit esse cillum dolore Velit esse quam
                                                    nihil molestiae thos consequatur, Velia ease chillum dolore</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-6">
                                        <div className="service-details__img-box-single">
                                            <div className="service-details__img-box-img">
                                                <img src="assets/images/services/service-details-img-box-img-2.jpg"
                                                    alt=""/>
                                            </div>
                                            <div className="service-details__img-box-content">
                                                <div className="service-details__img-box-content-icon-and-title">
                                                    <div className="service-details__img-box-content-icon">
                                                        <span className="icon-chirger"></span>
                                                    </div>
                                                    <h3 className="service-details__img-box-content-title">100% Work
                                                        Satisfication</h3>
                                                </div>
                                                <p className="service-details__img-box-content-text">Duis acute arura dolor
                                                    in
                                                    reprehenderit in voluptate velit esse cillum dolore Velit esse quam
                                                    nihil molestiae thos consequatur, Velia ease chillum dolore</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-5">
                        <div className="service-details__sidebar">
                            <div className="service-details__services-box">
                                <h3 className="service-details__services-title">Our Service</h3>
                                <ul className="service-details__services-list list-unstyled">
                                    <li>
                                        <Link href="electric-panel-repair">Electric Panel Repair<span
                                                className="icon-arrow-right"></span></Link>
                                    </li>
                                    <li className="active">
                                        <Link href="short-circuit-repair">Short circuit repair<span
                                                className="icon-arrow-right"></span></Link>
                                    </li>
                                    <li>
                                        <Link href="commercial-services">Commercial services<span
                                                className="icon-arrow-right"></span></Link>
                                    </li>
                                    <li>
                                        <Link href="installing-ceiling-fan">installing a ceiling fan<span
                                                className="icon-arrow-right"></span></Link>
                                    </li>
                                    <li>
                                        <Link href="lighting-fixtures">Lighting & Fixtures<span
                                                className="icon-arrow-right"></span></Link>
                                    </li>
                                    <li>
                                        <Link href="maintenance-service">Maintenance Service<span
                                                className="icon-arrow-right"></span></Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="project-details__get-started">
                                <h3 className="project-details__get-started-title">Get Started Today</h3>
                                <p className="project-details__get-started-text">Pianissimos of dulcimers qui therefore
                                    always
                                    holds in these matters to this principle</p>
                                <ul className="project-details__get-started-points list-unstyled">
                                    <li>
                                        <div className="icon">
                                            <span className="icon-call"></span>
                                        </div>
                                        <p><Link href="tel:585858575084">+58 585 857 5084</Link></p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <span className="icon-envelope"></span>
                                        </div>
                                        <p><Link href="mailto:example@gmail.com">example@gmail.com</Link></p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <span className="icon-location"></span>
                                        </div>
                                        <p>4517 Washington Ave. Manchester,<br/> Kentucky 39495</p>
                                    </li>
                                </ul>
                                <div className="project-details__get-started-btn-box">
                                    <Link href="#" className="project-details__get-started-btn thm-btn">get in touch</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/*Service Details End*/}

        {/*CTA One Start*/}
        <section className="cta-one">
            <div className="container">
                <div className="cta-one__inner">
                    <div className="cta-one__img">
                        <img src="assets/images/resources/cta-one-img-1.png" alt=""/>
                    </div>
                    <div className="section-title text-left">
                        <div className="section-title__tagline-box">
                            <span className="section-title__tagline">Get To Know Us</span>
                        </div>
                        <div className="section-title__title-box sec-title-animation animation-style2">
                            <h2 className="section-title__title title-animation">Save Money With Specials<br/> Discount Offer
                            </h2>
                        </div>
                    </div>
                    <p className="cta-one__text">Pleasures to secure other greater pleasures, or else he endures pains<br/>
                        to avoid worse pains to the selection circumstances</p>
                    <div className="cta-one__btn-and-call-box">
                        <div className="cta-one__btn-box">
                            <Link href="contact" className="cta-one__btn thm-btn">Get Appointment</Link>
                        </div>
                        <div className="cta-one__call-box">
                            <div className="icon">
                                <span className="icon-call"></span>
                            </div>
                            <div className="content">
                                <p>Make a call</p>
                                <h4><Link href="tel:00554755242">00 55 475 5242</Link></h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/*CTA One End*/}   

        </Layout>
        </>
    )
}