'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useState } from 'react'
export default function Faq() {
    const [isActive, setIsActive] = useState({
        status: false,
        key: 1,
    })

    const handleToggle = (key) => {
        if (isActive.key === key) {
            setIsActive({
                status: false,
            })
        } else {
            setIsActive({
                status: true,
                key,
            })
        }
    }
    return (
        <>
        <Layout headerStyle={2} footerStyle={1} breadcrumbTitle="faq">
        {/*Faq Page Start*/}
        <section className="faq-page">
            <div className="container">
                <div className="row">
                    <div className="col-xl-6">
                        <div className="faq-page__left">
                            <div className="faq-one__right">
                                <div className="accrodion-grp faq-one-accrodion" data-grp-name="faq-one-accrodion-1">
                                    <div className={isActive.key == 1 ? "accrodion active" : "accrodion"} onClick={() => handleToggle(1)}>
                                        <div className="accrodion-title">
                                            <h4>Why is my air conditioner not cooling properly ?</h4>
                                        </div>
                                        <div className="accrodion-content">
                                            <div className="inner">
                                                <p>It is a long established fact that a reader will be distr acted
                                                    bioiiy
                                                    the rea dablea content of a page when looking at its layout Thoiie
                                                    point
                                                </p>
                                            </div>{/* /.inner */}
                                        </div>
                                    </div>
                                    <div className={isActive.key == 2 ? "accrodion active" : "accrodion"} onClick={() => handleToggle(2)}>
                                        <div className="accrodion-title">
                                            <h4>How often should I service my air conditioner ?</h4>
                                        </div>
                                        <div className="accrodion-content">
                                            <div className="inner">
                                                <p>It is a long established fact that a reader will be distr acted
                                                    bioiiy
                                                    the rea dablea content of a page when looking at its layout Thoiie
                                                    point
                                                </p>
                                            </div>{/* /.inner */}
                                        </div>
                                    </div>
                                    <div className={isActive.key == 3 ? "accrodion active" : "accrodion"} onClick={() => handleToggle(3)}>
                                        <div className="accrodion-title">
                                            <h4>Why is my AC making strange noises ?</h4>
                                        </div>
                                        <div className="accrodion-content">
                                            <div className="inner">
                                                <p>It is a long established fact that a reader will be distr acted
                                                    bioiiy
                                                    the rea dablea content of a page when looking at its layout Thoiie
                                                    point
                                                </p>
                                            </div>{/* /.inner */}
                                        </div>
                                    </div>
                                    <div className={isActive.key == 4 ? "accrodion active" : "accrodion"} onClick={() => handleToggle(4)}>
                                        <div className="accrodion-title">
                                            <h4>Why is my cell Phone not working properly ?</h4>
                                        </div>
                                        <div className="accrodion-content">
                                            <div className="inner">
                                                <p>It is a long established fact that a reader will be distr acted
                                                    bioiiy
                                                    the rea dablea content of a page when looking at its layout Thoiie
                                                    point
                                                </p>
                                            </div>{/* /.inner */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="faq-page__right">
                            <div className="faq-one__right">
                                <div className="accrodion-grp faq-one-accrodion" data-grp-name="faq-one-accrodion-2">
                                    <div className={isActive.key == 5 ? "accrodion active" : "accrodion"} onClick={() => handleToggle(5)}>
                                        <div className="accrodion-title">
                                            <h4>Why is my air conditioner not cooling properly ?</h4>
                                        </div>
                                        <div className="accrodion-content">
                                            <div className="inner">
                                                <p>It is a long established fact that a reader will be distr acted
                                                    bioiiy
                                                    the rea dablea content of a page when looking at its layout Thoiie
                                                    point
                                                </p>
                                            </div>{/* /.inner */}
                                        </div>
                                    </div>
                                    <div className={isActive.key == 6 ? "accrodion active" : "accrodion"} onClick={() => handleToggle(6)}>
                                        <div className="accrodion-title">
                                            <h4>How often should I service my air conditioner ?</h4>
                                        </div>
                                        <div className="accrodion-content">
                                            <div className="inner">
                                                <p>It is a long established fact that a reader will be distr acted
                                                    bioiiy
                                                    the rea dablea content of a page when looking at its layout Thoiie
                                                    point
                                                </p>
                                            </div>{/* /.inner */}
                                        </div>
                                    </div>
                                    <div className={isActive.key == 7 ? "accrodion active" : "accrodion"} onClick={() => handleToggle(7)}>
                                        <div className="accrodion-title">
                                            <h4>Why is my AC making strange noises ?</h4>
                                        </div>
                                        <div className="accrodion-content">
                                            <div className="inner">
                                                <p>It is a long established fact that a reader will be distr acted
                                                    bioiiy
                                                    the rea dablea content of a page when looking at its layout Thoiie
                                                    point
                                                </p>
                                            </div>{/* /.inner */}
                                        </div>
                                    </div>
                                    <div className={isActive.key == 8 ? "accrodion active" : "accrodion"} onClick={() => handleToggle(8)}>
                                        <div className="accrodion-title">
                                            <h4>Why is my cell Phone not working properly ?</h4>
                                        </div>
                                        <div className="accrodion-content">
                                            <div className="inner">
                                                <p>It is a long established fact that a reader will be distr acted
                                                    bioiiy
                                                    the rea dablea content of a page when looking at its layout Thoiie
                                                    point
                                                </p>
                                            </div>{/* /.inner */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/*Faq Page End*/}

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