
import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function Home() {

    return (
        <>
        <Layout headerStyle={2} footerStyle={1} breadcrumbTitle="Project Details">
        {/*Project Details Start*/}
        <section className="project-details">
            <div className="container">
                <div className="row">
                    <div className="col-xl-8 col-lg-7">
                        <div className="project-details__left">
                            <div className="project-details__img">
                                <img src="assets/images/project/project-details-img-1.jpg" alt=""/>
                            </div>
                            <h3 className="project-details__title-1">About The Project Overview</h3>
                            <p className="project-details__text-1">Consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut laborer et dolore magna aliqua. Out enigma ad minim veniam, quis nostrud
                                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute inure
                                dolor in the reprehenderit in voluptate velit esse cillum dolore eu fugiat null
                                pariatur. Excepteur snit occaecat cupidatat non proident, sunt in culpa qui officia
                                deserunt mollit anim id est laborum.</p>
                            <h3 className="project-details__title-2">The Project Challenge</h3>
                            <p className="project-details__text-2">Out enigma ad minim veniam, quis nostrud exercitation
                                ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute inure dolor in the
                                reprehenderit in voluptate velit esse cillum dolore eu fugiat null pariatur. Excepteur
                                snit occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                                est laborum.</p>
                            <div className="project-details__text-and-img">
                                <p className="project-details__text-3">The wise man therefore always holds in these matters
                                    to this principle of selection. He rejects pleasures to secure other greater
                                    pleasures, or else he endures pains to avoid worse pains to the selection point. But
                                    in certain to all this circumstances</p>
                                <div className="project-details__text-img">
                                    <img src="assets/images/project/project-details-text-img.jpg" alt=""/>
                                </div>
                            </div>
                            <h3 className="project-details__title-3">The Result Of Our Project</h3>
                            <p className="project-details__text-4">Out enigma ad minim veniam, quis nostrud exercitation
                                ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute inure dolor in the
                                reprehenderit in voluptate velit esse cillum dolore eu fugiat null pariatur. Excepteur
                                snit occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                                est laborum.</p>
                            <div className="project-details__img-and-points">
                                <div className="project-details__points-img">
                                    <img src="assets/images/project/project-details-points-img.jpg" alt=""/>
                                </div>
                                <ul className="project-details__points list-unstyled">
                                    <li>
                                        <div className="icon">
                                            <span className="icon-arrow-right"></span>
                                        </div>
                                        <p>Fact that a reader will be distr acted bioiiy dablea </p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <span className="icon-arrow-right"></span>
                                        </div>
                                        <p>Acted bioiiy the rea dablea content of a page </p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <span className="icon-arrow-right"></span>
                                        </div>
                                        <p>When looking at its layout toile point</p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <span className="icon-arrow-right"></span>
                                        </div>
                                        <p>Bioiiy the rea dablea content of a page looking</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-5">
                        <div className="project-details__sidebar">
                            <div className="project-details__information">
                                <h3 className="project-details__information-title">Project Information</h3>
                                <ul className="project-details__information-list list-unstyled">
                                    <li>
                                        <h4>Client :</h4>
                                        <p>Jonathan Smith</p>
                                    </li>
                                    <li>
                                        <h4>Category :</h4>
                                        <p>Upgrade Old Wiring</p>
                                    </li>
                                    <li>
                                        <h4>date :</h4>
                                        <p>02 June 2024</p>
                                    </li>
                                    <li>
                                        <h4>location :</h4>
                                        <p>12 Green Road 05 New Yark</p>
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
        {/*Project Details End*/}


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