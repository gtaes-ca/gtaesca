import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function Error404() {

    return (
        <>
            <Layout headerStyle={2} footerStyle={1} breadcrumbTitle="Page Not Found">
            {/*Error Page Start*/}
            <section className="error-page">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="error-page__inner">
                                <div className="error-page__title-box">
                                    <h2 className="error-page__title">404</h2>
                                </div>
                                <h3 className="error-page__tagline">Sorry we can't find that page!</h3>
                                <p className="error-page__text">The page you are looking for was never existed.</p>
                                <form className="error-page__form">
                                    <div className="error-page__form-input">
                                        <input type="search" placeholder="Search here"/>
                                        <button type="submit"><i className="icon-search-interface-symbol"></i></button>
                                    </div>
                                </form>
                                <Link href="/" className="thm-btn error-page__btn">Back to home</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*Error Page End*/}

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
