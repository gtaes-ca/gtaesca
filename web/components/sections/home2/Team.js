'use client'
import Link from "next/link"
export default function Team() {
    return (
        <>
        {/*Team One Start */}
        <section className="team-one">
            <div className="container">
                <div className="team-one__top">
                    <div className="row">
                        <div className="col-xl-7 col-lg-7">
                            <div className="section-title-two text-left">
                                <div className="section-title-two__tagline-box">
                                    <span className="section-title-two__tagline">Best Team</span>
                                </div>
                                <div className="section-title-two__title-box sec-title-animation animation-style2">
                                    <h2 className="section-title-two__title title-animation">Meet Our Professional<br/> Team
                                        Member
                                    </h2>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-5 col-lg-5 wow fadeInRight" data-wow-delay="100ms">
                            <p className="team-one__text">The wise man therefore always holds in these matters to this
                                principle of selection. He rejects pleasures to secure other greater pleasures, or else
                                he endures pains to avoid worse pains to the selection point.</p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {/*Team One Single Start*/}
                    <div className="col-xl-4 col-lg-4 wow fadeInLeft" data-wow-delay="100ms">
                        <div className="team-one__single">
                            <div className="team-one__img-box">
                                <div className="team-one__img">
                                    <img src="assets/images/team/team-1-1.jpg" alt=""/>
                                </div>
                                <div className="team-one__content">
                                    <h3 className="team-one__title"><Link href="team-details">Wade Warren</Link></h3>
                                    <p className="team-one__sub-title">Electrician</p>
                                    <div className="team-one__social">
                                        <Link href="#"><span className="icon-facebook"></span></Link>
                                        <Link href="#"><span className="icon-xpa"></span></Link>
                                        <Link href="#"><span className="icon-link-in"></span></Link>
                                        <Link href="#"><span className="icon-instagram"></span></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Team One Single End*/}
                    {/*Team One Single Start*/}
                    <div className="col-xl-4 col-lg-4 wow fadeInUp" data-wow-delay="200ms">
                        <div className="team-one__single">
                            <div className="team-one__img-box">
                                <div className="team-one__img">
                                    <img src="assets/images/team/team-1-2.jpg" alt=""/>
                                </div>
                                <div className="team-one__content">
                                    <h3 className="team-one__title"><Link href="team-details">Darrell Steward</Link></h3>
                                    <p className="team-one__sub-title">Marketing Manager</p>
                                    <div className="team-one__social">
                                        <Link href="#"><span className="icon-facebook"></span></Link>
                                        <Link href="#"><span className="icon-xpa"></span></Link>
                                        <Link href="#"><span className="icon-link-in"></span></Link>
                                        <Link href="#"><span className="icon-instagram"></span></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Team One Single End*/}
                    {/*Team One Single Start*/}
                    <div className="col-xl-4 col-lg-4 wow fadeInRight" data-wow-delay="300ms">
                        <div className="team-one__single">
                            <div className="team-one__img-box">
                                <div className="team-one__img">
                                    <img src="assets/images/team/team-1-3.jpg" alt=""/>
                                </div>
                                <div className="team-one__content">
                                    <h3 className="team-one__title"><Link href="team-details">Warren Wade </Link></h3>
                                    <p className="team-one__sub-title">Co-founder</p>
                                    <div className="team-one__social">
                                        <Link href="#"><span className="icon-facebook"></span></Link>
                                        <Link href="#"><span className="icon-xpa"></span></Link>
                                        <Link href="#"><span className="icon-link-in"></span></Link>
                                        <Link href="#"><span className="icon-instagram"></span></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Team One Single End*/}
                </div>
            </div>
        </section>
        {/*Team One End */}
        
        </>
    )
}
