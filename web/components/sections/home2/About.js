'use client'
import Link from "next/link"
import { useState } from "react"
import ModalVideo from 'react-modal-video'
export default function About() {
    const [isOpen, setOpen] = useState(false)
    return (
        <>
        {/*About Two Start */}
        <section className="about-two">
            <div className="about-two__shape-1 img-bounce">
                <img src="assets/images/shapes/about-two-shape-1.png" alt=""/>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-xl-6">
                        <div className="about-two__left wow fadeInLeft" data-wow-delay="300ms">
                            <div className="section-title-two text-left">
                                <div className="section-title-two__tagline-box">
                                    <span className="section-title-two__tagline">About Us</span>
                                </div>
                                <div className="section-title-two__title-box sec-title-animation animation-style2">
                                    <h2 className="section-title-two__title title-animation">Heating & AC Installation
                                        Repair Company Since 2003</h2>
                                </div>
                            </div>
                            <p className="about-two__text">Velit esse quam nihil molestiae consequatur, vel qui dolorem eum
                                fugiat quo voluptas nulla pariatur. She says doloire ipsum quail dolor sit amen,
                                consectetur,</p>
                            <div className="about-two__points-box">
                                <ul className="about-two__points-list list-unstyled">
                                    <li>
                                        <div className="icon">
                                            <span className="icon-like"></span>
                                        </div>
                                        <h3 className="about-two__title"><Link href="services">Providing Awesome
                                                Service</Link></h3>
                                        <p className="about-two__points-text">Duis acute arura dolor in reprehenderit in<br/>
                                            voluptate velit esse cillum dolore
                                        </p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <span className="icon-services"></span>
                                        </div>
                                        <h3 className="about-two__title"><Link href="contact">24/7 Our Support</Link></h3>
                                        <p className="about-two__points-text">Duis acute arura dolor in reprehenderit in<br/>
                                            voluptate velit esse cillum dolore
                                        </p>
                                    </li>
                                </ul>
                            </div>
                            <div className="about-two__btn-box">
                                <Link href="about" className="about-two__btn thm-btn">More About Us</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="about-two__right wow fadeInRight" data-wow-delay="300ms">
                            <div className="about-two__right-top">
                                <div className="about-two__award-box">
                                    <div className="icon">
                                        <span className="icon-medal"></span>
                                    </div>
                                    <h3 className="about-two__award-title"><Link href="about">Best Awarded Company</Link>
                                    </h3>
                                    <p className="about-two__award-text">Lorem ipsum dolor sit amet, consetetur sadipscing
                                        elitr, sed</p>
                                </div>
                                <div className="about-two__video">
                                    <div className="about-two__video-img">
                                        <img src="assets/images/resources/about-two-video-img.jpg" alt=""/>
                                        <div className="about-two__video-link">
                                            <a onClick={() => setOpen(true)} className="video-popup">
                                                <div className="about-two__video-icon">
                                                    <span className="fas fa-play"></span>
                                                    <i className="ripple"></i>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="about-two__img wow fadeInUp" data-wow-delay="600ms">
                                <img src="assets/images/resources/about-two-img-1.jpg" alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/*About Two End */}
        <ModalVideo channel='youtube' autoplay isOpen={isOpen} videoId="Get7rqXYrbQ" onClose={() => setOpen(false)} />
        </>
    )
}
