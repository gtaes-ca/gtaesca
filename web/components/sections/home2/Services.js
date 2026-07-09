'use client'
import Link from "next/link"
export default function Services() {
    return (
        <>
        
        {/*Services Three Start */}
        <section className="service-three">
            <div className="service-three__shape-1 float-bob-y">
                <img src="assets/images/shapes/services-three-shape-1.png" alt=""/>
            </div>
            <div className="container">
                <div className="section-title-two text-center">
                    <div className="section-title-two__tagline-box">
                        <span className="section-title-two__tagline">Our Service</span>
                    </div>
                    <div className="section-title-two__title-box sec-title-animation animation-style1">
                        <h2 className="section-title-two__title title-animation">Keeping Your AC Running<br/> With Smoothly
                        </h2>
                    </div>
                </div>
                <div className="row">
                    {/*Services Three Single Start*/}
                    <div className="col-xl-4 col-lg-4 wow fadeInLeft" data-wow-delay="100ms">
                        <div className="service-three__single">
                            <div className="service-three__img-box">
                                <div className="service-three__img">
                                    <img src="assets/images/services/services-2-1.jpg" alt=""/>
                                </div>
                            </div>
                            <div className="service-three__content">
                                <div className="service-three__icon">
                                    <span className="icon-ac1"></span>
                                </div>
                                <h3 className="service-three__title"><Link href="installing-ceiling-fan">A/C
                                        Installation</Link></h3>
                                <p className="service-three__text">Velit esse quam nihil molestiae consequatur, vel dolorem
                                    eum fugiat quo voluptas nulla pariatur. She says doloire ipsum quail dolor</p>
                                <div className="service-three__read-more">
                                    <Link href="installing-ceiling-fan">Read More<span
                                            className="icon-arrow-right"></span></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Services Three Single End*/}
                    {/*Services Three Single Start*/}
                    <div className="col-xl-4 col-lg-4 wow fadeInUp" data-wow-delay="200ms">
                        <div className="service-three__single">
                            <div className="service-three__img-box">
                                <div className="service-three__img">
                                    <img src="assets/images/services/services-2-2.jpg" alt=""/>
                                </div>
                            </div>
                            <div className="service-three__content">
                                <div className="service-three__icon">
                                    <span className="icon-air-conditioning"></span>
                                </div>
                                <h3 className="service-three__title"><Link href="commercial-services">Heating Service</Link>
                                </h3>
                                <p className="service-three__text">Velit esse quam nihil molestiae consequatur, vel dolorem
                                    eum fugiat quo voluptas nulla pariatur. She says doloire ipsum quail dolor</p>
                                <div className="service-three__read-more">
                                    <Link href="commercial-services">Read More<span
                                            className="icon-arrow-right"></span></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Services Three Single End*/}
                    {/*Services Three Single Start*/}
                    <div className="col-xl-4 col-lg-4 wow fadeInRight" data-wow-delay="300ms">
                        <div className="service-three__single">
                            <div className="service-three__img-box">
                                <div className="service-three__img">
                                    <img src="assets/images/services/services-2-3.jpg" alt=""/>
                                </div>
                            </div>
                            <div className="service-three__content">
                                <div className="service-three__icon">
                                    <span className="icon-ac"></span>
                                </div>
                                <h3 className="service-three__title"><Link href="maintenance-service">Dust Cleaning</Link>
                                </h3>
                                <p className="service-three__text">Velit esse quam nihil molestiae consequatur, vel dolorem
                                    eum fugiat quo voluptas nulla pariatur. She says doloire ipsum quail dolor</p>
                                <div className="service-three__read-more">
                                    <Link href="maintenance-service">Read More<span
                                            className="icon-arrow-right"></span></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Services Three Single End*/}
                </div>
            </div>
        </section>
        {/*Services Three End */}
        
        </>
    )
}
