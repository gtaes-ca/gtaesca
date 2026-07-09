'use client'
import Link from "next/link"
import { useState } from 'react'
import ModalVideo from 'react-modal-video'

export default function About() {
    const [isOpen, setOpen] = useState(false)
    return (
        <>
        
        {/*About Three Start */}
        <section className="about-three">
            <div className="container">
                <div className="row">
                    <div className="col-xl-5 col-lg-6">
                        <div className="about-three__left">
                            
                            <div className="about-three__img-box">
                                <div className="about-three__img">
                                    <img src="assets/images/resources/about-3-1.jpg" alt=""/>
                                </div>
                                <div className="about-three__img-two">
                                    <img src="assets/images/resources/about-3-2.jpg" alt=""/>
                                    <div className="about-three__video-link">
                                        <a nClick={() => setOpen(true)} className="video-popup">
                                            <div className="about-three__video-icon">
                                                <span className="fa fa-play"></span>
                                                <i className="ripple"></i>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="about-three__shape-1 shapeMover">
                                <img src="assets/images/shapes/about-three-shape-1.png" alt=""/>
                            </div>
                            <div className="about-three__shape-2 float-bob-y">
                                <img src="assets/images/shapes/about-three-shape-2.png" alt=""/>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-7 col-lg-6">
                        <div className="about-three__right">
                            <div className="section-title-three text-left sec-title-animation animation-style2">
                                <div className="section-title-three__tagline-box">
                                    <div className="section-title-three__tagline-shape"></div>
                                    <span className="section-title-three__tagline">Quality Repair</span>
                                </div>
                                <h2 className="section-title-three__title title-animation">We Can Fix It Almost As Fast
                                    As You Can Break It.</h2>
                            </div>
                            <p className="about-three__text-1">Duis aute irure dolor in repreh enderit in volup tate velit
                                esse cillum dolore</p>
                            <ul className="list-unstyled about-three__points">
                                <li>
                                    <div className="icon">
                                        <span className="icon-like"></span>
                                    </div>
                                    <div className="text">
                                        <p>WE ALWAYS PUT QUALITY FIRST</p>
                                    </div>
                                </li>
                                <li>
                                    <div className="icon">
                                        <span className="icon-hands-on-experience"></span>
                                    </div>
                                    <div className="text">
                                        <p>CUSTOMER SATISFACTION IS ABSOLUTE</p>
                                    </div>
                                </li>
                                <li>
                                    <div className="icon">
                                        <span className="icon-project-complete"></span>
                                    </div>
                                    <div className="text">
                                        <p>FAST AND QUALITY WORK</p>
                                    </div>
                                </li>
                            </ul>
                            <p className="about-three__text-2">Duis aute irure dolor in repreh enderit in volup tate velit
                                esse cillum dolore eu fugiat nulla dolor atur with Lorem ipsum is simply free text
                                market web bites eius mod ut labore duis aute irure pari</p>
                            <Link href="contact" className="thm-btn">Contact Us</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/*About Three Start */}
        <ModalVideo channel='youtube' autoplay isOpen={isOpen} videoId="Get7rqXYrbQ" onClose={() => setOpen(false)} />
        
        </>
    )
}
