'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function Pricing() {
   
    return (
        <>
        <Layout headerStyle={2} footerStyle={1} breadcrumbTitle="Price">
        {/*Pricing Two Start*/}
        <section className="pricing-two">
            <div className="pricing-two__shape-1 float-bob-y"
                style={{ backgroundImage: 'url(assets/images/shapes/pricing-two-shape-1.jpg)' }} ></div>
            <div className="container">
                <div className="section-title-three text-center sec-title-animation animation-style1">
                    <div className="section-title-three__tagline-box justify-content-center">
                        <div className="section-title-three__tagline-shape"></div>
                        <span className="section-title-three__tagline">Our Pricing</span>
                        <div className="section-title-three__tagline-shape"></div>
                    </div>
                    <h2 className="section-title-three__title title-animation">Lighting the Way to <br/>Quality Repairs</h2>
                </div>
                <div className="row">
                    {/*Pricing Two Single Start*/}
                    <div className="col-xl-4 col-lg-4">
                        <div className="pricing-two__single">
                            <div className="pricing-two__title-box">
                                <h3>Basic Plan</h3>
                                <p>Per Month</p>
                                <h2>$49</h2>
                            </div>
                            <div className="pricing-two__content">
                                <ul className="pricing-two__price-points list-unstyled">
                                    <li>
                                        <div className="icon">
                                            <span className="icon-check"></span>
                                        </div>
                                        <p>Mistakes To Avoid</p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <span className="icon-check"></span>
                                        </div>
                                        <p>Your Startup</p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <span className="icon-check"></span>
                                        </div>
                                        <p>Knew About Fonts</p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <span className="icon-check"></span>
                                        </div>
                                        <p>Winning Metric for Your Startup</p>
                                    </li>
                                </ul>
                                <div className="pricing-two__btn-box">
                                    <Link href="pricing" className="pricing-two__btn thm-btn">Choose Plan</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Pricing Two Single End*/}
                    {/*Pricing Two Single Start*/}
                    <div className="col-xl-4 col-lg-4">
                        <div className="pricing-two__single">
                            <div className="pricing-two__title-box">
                                <h3>Regular Plan</h3>
                                <p>6 Month</p>
                                <h2>$69</h2>
                            </div>
                            <div className="pricing-two__content">
                                <ul className="pricing-two__price-points list-unstyled">
                                    <li>
                                        <div className="icon">
                                            <span className="icon-check"></span>
                                        </div>
                                        <p>Mistakes To Avoid</p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <span className="icon-check"></span>
                                        </div>
                                        <p>Your Startup</p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <span className="icon-check"></span>
                                        </div>
                                        <p>Knew About Fonts</p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <span className="icon-check"></span>
                                        </div>
                                        <p>Winning Metric for Your Startup</p>
                                    </li>
                                </ul>
                                <div className="pricing-two__btn-box">
                                    <Link href="pricing" className="pricing-two__btn thm-btn">Choose Plan</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Pricing Two Single End*/}
                    {/*Pricing Two Single Start*/}
                    <div className="col-xl-4 col-lg-4">
                        <div className="pricing-two__single">
                            <div className="pricing-two__title-box">
                                <h3>Premium Plan</h3>
                                <p>Annual</p>
                                <h2>$99</h2>
                            </div>
                            <div className="pricing-two__content">
                                <ul className="pricing-two__price-points list-unstyled">
                                    <li>
                                        <div className="icon">
                                            <span className="icon-check"></span>
                                        </div>
                                        <p>Mistakes To Avoid</p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <span className="icon-check"></span>
                                        </div>
                                        <p>Your Startup</p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <span className="icon-check"></span>
                                        </div>
                                        <p>Knew About Fonts</p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <span className="icon-check"></span>
                                        </div>
                                        <p>Winning Metric for Your Startup</p>
                                    </li>
                                </ul>
                                <div className="pricing-two__btn-box">
                                    <Link href="pricing" className="pricing-two__btn thm-btn">Choose Plan</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Pricing Two Single End*/}
                </div>
            </div>
        </section>
        {/*Pricing Two End*/}

        {/*Pricing One Start*/}
        <section className="pricing-one pricing-three">
            <div className="pricing-one__shape-1">
                <img src="assets/images/shapes/pricing-one-shape-1.png" alt=""/>
            </div>
            <div className="container">
                <div className="section-title text-center">
                    <div className="section-title__tagline-box">
                        <span className="section-title__tagline">Our Pricing</span>
                    </div>
                    <div className="section-title__title-box sec-title-animation animation-style1">
                        <h2 className="section-title__title title-animation">Lighting the Way to <br/>Quality Repairs</h2>
                    </div>
                </div>
                <div className="row">
                    {/*Pricing One Single Start*/}
                    <div className="col-xl-4 col-lg-4 wow fadeInLeft" data-wow-delay="100ms">
                        <div className="pricing-one__single">
                            <div className="pricing-one__price-pack">
                                <div className="pricing-one__price-month">
                                    <h3>Basic Plan</h3>
                                    <p>Per Month</p>
                                </div>
                                <h2>$49</h2>
                            </div>
                            <div className="pricing-one__points-and-btn">
                                <ul className="pricing-one__price-points list-unstyled">
                                    <li>
                                        <div className="icon">
                                            <span className="icon-check"></span>
                                        </div>
                                        <p>Mistakes To Avoid</p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <span className="icon-check"></span>
                                        </div>
                                        <p>Your Startup</p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <span className="icon-check"></span>
                                        </div>
                                        <p>Knew About Fonts</p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <span className="icon-check"></span>
                                        </div>
                                        <p>Winning Metric for Your Startup</p>
                                    </li>
                                </ul>
                                <div className="pricing-one__btn-box">
                                    <Link href="pricing" className="pricing-one__btn thm-btn">Get Started</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Pricing One Single End*/}
                    {/*Pricing One Single Start*/}
                    <div className="col-xl-4 col-lg-4 wow fadeInUp" data-wow-delay="200ms">
                        <div className="pricing-one__single">
                            <div className="pricing-one__price-pack">
                                <div className="pricing-one__price-month">
                                    <h3>Regular Plan</h3>
                                    <p>6 Month</p>
                                </div>
                                <h2>$69</h2>
                            </div>
                            <div className="pricing-one__points-and-btn">
                                <ul className="pricing-one__price-points list-unstyled">
                                    <li>
                                        <div className="icon">
                                            <span className="icon-check"></span>
                                        </div>
                                        <p>Mistakes To Avoid</p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <span className="icon-check"></span>
                                        </div>
                                        <p>Your Startup</p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <span className="icon-check"></span>
                                        </div>
                                        <p>Knew About Fonts</p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <span className="icon-check"></span>
                                        </div>
                                        <p>Winning Metric for Your Startup</p>
                                    </li>
                                </ul>
                                <div className="pricing-one__btn-box">
                                    <Link href="pricing" className="pricing-one__btn thm-btn">Get Started</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Pricing One Single End*/}
                    {/*Pricing One Single Start*/}
                    <div className="col-xl-4 col-lg-4 wow fadeInRight" data-wow-delay="300ms">
                        <div className="pricing-one__single">
                            <div className="pricing-one__price-pack">
                                <div className="pricing-one__price-month">
                                    <h3>Premium Plan</h3>
                                    <p>Annual</p>
                                </div>
                                <h2>$99</h2>
                            </div>
                            <div className="pricing-one__points-and-btn">
                                <ul className="pricing-one__price-points list-unstyled">
                                    <li>
                                        <div className="icon">
                                            <span className="icon-check"></span>
                                        </div>
                                        <p>Mistakes To Avoid</p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <span className="icon-check"></span>
                                        </div>
                                        <p>Your Startup</p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <span className="icon-check"></span>
                                        </div>
                                        <p>Knew About Fonts</p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <span className="icon-check"></span>
                                        </div>
                                        <p>Winning Metric for Your Startup</p>
                                    </li>
                                </ul>
                                <div className="pricing-one__btn-box">
                                    <Link href="pricing" className="pricing-one__btn thm-btn">Get Started</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Pricing One Single End*/}
                </div>
            </div>
        </section>
        {/*Pricing One End*/}

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