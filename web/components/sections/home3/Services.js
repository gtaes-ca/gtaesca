'use client'
import Link from "next/link"
export default function Services() {
    return (
        <>
      
        {/*Services Four Start*/}
        <section className="services-four">
            <div className="services-four-shape-1 float-bob-x">
                <img src="assets/images/shapes/services-four-shape-1.png" alt=""/>
            </div>
            <div className="services-four-shape-2 float-bob-y">
                <img src="assets/images/shapes/services-four-shape-2.png" alt=""/>
            </div>
            <div className="container">
                <div className="section-title-three text-center sec-title-animation animation-style1">
                    <div className="section-title-three__tagline-box justify-content-center">
                        <div className="section-title-three__tagline-shape"></div>
                        <span className="section-title-three__tagline">Our Services</span>
                        <div className="section-title-three__tagline-shape"></div>
                    </div>
                    <h2 className="section-title-three__title title-animation">Our Efficient Solution</h2>
                </div>
                <div className="row">
                    {/*Services One Single Start*/}
                    <div className="col-xl-4 col-lg-4 wow fadeInUp" data-wow-delay="100ms">
                        <div className="services-four__single">
                            <div className="services-four__img">
                                <img src="assets/images/services/services-4-1.jpg" alt=""/>
                                <div className="services-four__icon">
                                    <span className="icon-laptop"></span>
                                </div>
                            </div>
                            <div className="services-four__content">
                                <h3 className="services-four__title"><Link href="services">Laptop Repair</Link></h3>
                                <p className="services-four__text">Duis aute irure dolor in repreh enderit in volup tate
                                    velit esse cillum dolore fugiat nulla dolor atur</p>
                                <div className="services-four__btn-box">
                                    <Link href="services" className="thm-btn services-four__btn">Repair Now</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Services One Single Start*/}
                    {/*Services One Single Start*/}
                    <div className="col-xl-4 col-lg-4 wow fadeInUp" data-wow-delay="200ms">
                        <div className="services-four__single">
                            <div className="services-four__img">
                                <img src="assets/images/services/services-4-2.jpg" alt=""/>
                                <div className="services-four__icon">
                                    <span className="icon-mobile-phone"></span>
                                </div>
                            </div>
                            <div className="services-four__content">
                                <h3 className="services-four__title"><Link href="services">Phone Repair</Link></h3>
                                <p className="services-four__text">Duis aute irure dolor in repreh enderit in volup tate
                                    velit esse cillum dolore fugiat nulla dolor atur</p>
                                <div className="services-four__btn-box">
                                    <Link href="services" className="thm-btn services-four__btn">Repair Now</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Services One Single Start*/}
                    {/*Services One Single Start*/}
                    <div className="col-xl-4 col-lg-4 wow fadeInUp" data-wow-delay="300ms">
                        <div className="services-four__single">
                            <div className="services-four__img">
                                <img src="assets/images/services/services-4-3.jpg" alt=""/>
                                <div className="services-four__icon">
                                    <span className="icon-tablet"></span>
                                </div>
                            </div>
                            <div className="services-four__content">
                                <h3 className="services-four__title"><Link href="services">Tablet Repair</Link></h3>
                                <p className="services-four__text">Duis aute irure dolor in repreh enderit in volup tate
                                    velit esse cillum dolore fugiat nulla dolor atur</p>
                                <div className="services-four__btn-box">
                                    <Link href="services" className="thm-btn services-four__btn">Repair Now</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Services One Single Start*/}
                </div>
            </div>
        </section>
        {/*Services Four End*/}
       
        </>
    )
}
