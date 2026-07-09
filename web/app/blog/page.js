'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function Home() {

    return (
        <>
        <Layout headerStyle={2} footerStyle={1} breadcrumbTitle="Blog">
        {/*Blog Page Start*/}
        <section className="blog-page">
            <div className="container">
                <div className="row">
                    {/*Blog One Single Start*/}
                    <div className="col-xl-4 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="100ms">
                        <div className="blog-one__single">
                            <div className="blog-one__img-box">
                                <div className="blog-one__img">
                                    <img src="assets/images/blog/blog-1-1.jpg" alt="@@title" />
                                    <img src="assets/images/blog/blog-1-1.jpg" alt="@@title" />
                                    <Link href="blog-details" className="blog-one__link"><span className="sr-only"></span></Link>
                                </div>
                                <div className="blog-one__date">
                                    <p>12<br/>Nov</p>
                                </div>
                            </div>
                            <div className="blog-one__content">
                                <div className="blog-one__user">
                                    <p><span className="icon-user"></span>By Admin</p>
                                </div>
                                <h3 className="blog-one__title"><Link href="blog-details">Elase They Endures Pains to
                                        Avoid The Worse Pains Taken </Link></h3>
                                <Link href="blog-details" className="blog-one__learn-more">Learn More<span
                                        className="icon-arrow-right"></span></Link>
                            </div>
                        </div>
                    </div>
                    {/*Blog One Single End*/}
                    {/*Blog One Single Start*/}
                    <div className="col-xl-4 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="300ms">
                        <div className="blog-one__single">
                            <div className="blog-one__img-box">
                                <div className="blog-one__img">
                                    <img src="assets/images/blog/blog-1-2.jpg" alt="@@title" />
                                    <img src="assets/images/blog/blog-1-2.jpg" alt="@@title" />
                                    <Link href="blog-details" className="blog-one__link"><span className="sr-only"></span></Link>
                                </div>
                                <div className="blog-one__date">
                                    <p>12<br/>Nov</p>
                                </div>
                            </div>
                            <div className="blog-one__content">
                                <div className="blog-one__user">
                                    <p><span className="icon-user"></span>By Admin</p>
                                </div>
                                <h3 className="blog-one__title"><Link href="blog-details">Regular maintenance cleaning or
                                        replacing air filters</Link></h3>
                                <Link href="blog-details" className="blog-one__learn-more">Learn More<span
                                        className="icon-arrow-right"></span></Link>
                            </div>
                        </div>
                    </div>
                    {/*Blog One Single End*/}
                    {/*Blog One Single Start*/}
                    <div className="col-xl-4 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="600ms">
                        <div className="blog-one__single">
                            <div className="blog-one__img-box">
                                <div className="blog-one__img">
                                    <img src="assets/images/blog/blog-1-3.jpg" alt="@@title" />
                                    <img src="assets/images/blog/blog-1-3.jpg" alt="@@title" />
                                    <Link href="blog-details" className="blog-one__link"><span className="sr-only"></span></Link>
                                </div>
                                <div className="blog-one__date">
                                    <p>12<br/>Nov</p>
                                </div>
                            </div>
                            <div className="blog-one__content">
                                <div className="blog-one__user">
                                    <p><span className="icon-user"></span>By Admin</p>
                                </div>
                                <h3 className="blog-one__title"><Link href="blog-details">Water leakage can be due to a
                                        clogged drain line</Link></h3>
                                <Link href="blog-details" className="blog-one__learn-more">Learn More<span
                                        className="icon-arrow-right"></span></Link>
                            </div>
                        </div>
                    </div>
                    {/*Blog One Single End*/}
                    {/*Blog One Single Start*/}
                    <div className="col-xl-4 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="900ms">
                        <div className="blog-one__single">
                            <div className="blog-one__img-box">
                                <div className="blog-one__img">
                                    <img src="assets/images/blog/blog-1-4.jpg" alt="@@title" />
                                    <img src="assets/images/blog/blog-1-4.jpg" alt="@@title" />
                                    <Link href="blog-details" className="blog-one__link"><span className="sr-only"></span></Link>
                                </div>
                                <div className="blog-one__date">
                                    <p>12<br/>Nov</p>
                                </div>
                            </div>
                            <div className="blog-one__content">
                                <div className="blog-one__user">
                                    <p><span className="icon-user"></span>By Admin</p>
                                </div>
                                <h3 className="blog-one__title"><Link href="blog-details">Elapse They Endures Pains to
                                        Avoid The Worse Pains Taken To Clean</Link></h3>
                                <Link href="blog-details" className="blog-one__learn-more">Learn More<span
                                        className="icon-arrow-right"></span></Link>
                            </div>
                        </div>
                    </div>
                    {/*Blog One Single End*/}
                    {/*Blog One Single Start*/}
                    <div className="col-xl-4 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="1200ms">
                        <div className="blog-one__single">
                            <div className="blog-one__img-box">
                                <div className="blog-one__img">
                                    <img src="assets/images/blog/blog-1-5.jpg" alt="@@title" />
                                    <img src="assets/images/blog/blog-1-5.jpg" alt="@@title" />
                                    <Link href="blog-details" className="blog-one__link"><span className="sr-only"></span></Link>
                                </div>
                                <div className="blog-one__date">
                                    <p>12<br/>Nov</p>
                                </div>
                            </div>
                            <div className="blog-one__content">
                                <div className="blog-one__user">
                                    <p><span className="icon-user"></span>By Admin</p>
                                </div>
                                <h3 className="blog-one__title"><Link href="blog-details">Secure to Other Greater
                                        Pleasures, or The Selection Point. </Link></h3>
                                <Link href="blog-details" className="blog-one__learn-more">Learn More<span
                                        className="icon-arrow-right"></span></Link>
                            </div>
                        </div>
                    </div>
                    {/*Blog One Single End*/}
                    {/*Blog One Single Start*/}
                    <div className="col-xl-4 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="1500ms">
                        <div className="blog-one__single">
                            <div className="blog-one__img-box">
                                <div className="blog-one__img">
                                    <img src="assets/images/blog/blog-1-6.jpg" alt="@@title" />
                                    <img src="assets/images/blog/blog-1-6.jpg" alt="@@title" />
                                    <Link href="blog-details" className="blog-one__link"><span className="sr-only"></span></Link>
                                </div>
                                <div className="blog-one__date">
                                    <p>12<br/>Nov</p>
                                </div>
                            </div>
                            <div className="blog-one__content">
                                <div className="blog-one__user">
                                    <p><span className="icon-user"></span>By Admin</p>
                                </div>
                                <h3 className="blog-one__title"><Link href="blog-details">The Selection Point Erase in
                                        Certain Circumstances And Owing </Link></h3>
                                <Link href="blog-details" className="blog-one__learn-more">Learn More<span
                                        className="icon-arrow-right"></span></Link>
                            </div>
                        </div>
                    </div>
                    {/*Blog One Single End*/}
                </div>
            </div>
        </section>
        {/*Blog Page End*/}

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