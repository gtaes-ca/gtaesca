import Link from "next/link"
export default function Blog() {
    return (
        <>
        {/*Blog One Start*/}
        <section className="blog-one">
            <div className="container">
                <div className="blog-one__top">
                    <div className="section-title text-left">
                        <div className="section-title__tagline-box">
                            <span className="section-title__tagline">blog & News</span>
                        </div>
                        <div className="section-title__title-box sec-title-animation animation-style2">
                            <h2 className="section-title__title title-animation">Your Brightest Choice<br/> in Repairs</h2>
                        </div>
                    </div>
                    <div className="blog-one__btn-box">
                        <Link href="blog" className="blog-one__btn thm-btn">View all Blog</Link>
                    </div>
                </div>
                <div className="row">
                    {/*Blog One Single Start*/}
                    <div className="col-xl-4 col-lg-4 wow fadeInUp" data-wow-delay="100ms">
                        <div className="blog-one__single">
                            <div className="blog-one__img-box">
                                <div className="blog-one__img">
                                    <img src="assets/images/blog/blog-1-1.jpg" alt="@@title"/>
                                    <img src="assets/images/blog/blog-1-1.jpg" alt="@@title"/>
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
                    <div className="col-xl-4 col-lg-4 wow fadeInUp" data-wow-delay="300ms">
                        <div className="blog-one__single">
                            <div className="blog-one__img-box">
                                <div className="blog-one__img">
                                    <img src="assets/images/blog/blog-1-2.jpg" alt="@@title"/>
                                    <img src="assets/images/blog/blog-1-2.jpg" alt="@@title"/>
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
                    <div className="col-xl-4 col-lg-4 wow fadeInUp" data-wow-delay="600ms">
                        <div className="blog-one__single">
                            <div className="blog-one__img-box">
                                <div className="blog-one__img">
                                    <img src="assets/images/blog/blog-1-3.jpg" alt="@@title"/>
                                    <img src="assets/images/blog/blog-1-3.jpg" alt="@@title"/>
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
                </div>
            </div>
        </section>
        {/*Blog One End*/}
        </>
    )
}
