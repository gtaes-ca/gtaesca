import Link from "next/link"
export default function Blog() {
    return (
        <>
        
        {/*Blog Two Start */}
        <section className="blog-two">
            <div className="container">
                <div className="blog-two__top">
                    <div className="section-title-two text-left">
                        <div className="section-title-two__tagline-box">
                            <span className="section-title-two__tagline">blog & News</span>
                        </div>
                        <div className="section-title-two__title-box sec-title-animation animation-style2">
                            <h2 className="section-title-two__title title-animation">Cool Solutions for Your
                                <br/> Hot Problems</h2>
                        </div>
                    </div>
                    <div className="blog-two__btn-box">
                        <Link href="blog" className="blog-two__btn thm-btn">View all Blog</Link>
                    </div>
                </div>
                <div className="row">
                    {/*Blog Two Single Start*/}
                    <div className="col-xl-4 col-lg-4 wow fadeInLeft" data-wow-delay="100ms">
                        <div className="blog-two__single">
                            <div className="blog-two__single-border"></div>
                            <div className="blog-two__img-box">
                                <div className="blog-two__img">
                                    <img src="assets/images/blog/blog-2-1.jpg" alt=""/>
                                </div>
                                <div className="blog-two__date">
                                    <p>22 Jun 2024</p>
                                </div>
                            </div>
                            <div className="blog-two__content">
                                <h3 className="blog-two__title"><Link href="blog-details">Elapse They Endures Pains to
                                        Avoid The Worse Pains Taken To Clean</Link></h3>
                                <p className="blog-two__text">Secure to other greater pleasures, or the selection point. But
                                    in certain circumstances</p>
                                <div className="blog-two__read-more">
                                    <Link href="blog-details">Read More<span className="icon-arrow-right"></span></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Blog Two Single End*/}
                    {/*Blog Two Single Start*/}
                    <div className="col-xl-4 col-lg-4 wow fadeInUp" data-wow-delay="200ms">
                        <div className="blog-two__single">
                            <div className="blog-two__single-border"></div>
                            <div className="blog-two__img-box">
                                <div className="blog-two__img">
                                    <img src="assets/images/blog/blog-2-2.jpg" alt=""/>
                                </div>
                                <div className="blog-two__date">
                                    <p>25 Jun 2024</p>
                                </div>
                            </div>
                            <div className="blog-two__content">
                                <h3 className="blog-two__title"><Link href="blog-details">Secure to Other Greater
                                        Pleasures, or The Selection Point. </Link></h3>
                                <p className="blog-two__text">Secure to other greater pleasures, or the selection point. But
                                    in certain circumstances</p>
                                <div className="blog-two__read-more">
                                    <Link href="blog-details">Read More<span className="icon-arrow-right"></span></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Blog Two Single End*/}
                    {/*Blog Two Single Start*/}
                    <div className="col-xl-4 col-lg-4 wow fadeInRight" data-wow-delay="300ms">
                        <div className="blog-two__single">
                            <div className="blog-two__img-box">
                                <div className="blog-two__img">
                                    <img src="assets/images/blog/blog-2-3.jpg" alt=""/>
                                </div>
                                <div className="blog-two__date">
                                    <p>29 Jun 2024</p>
                                </div>
                            </div>
                            <div className="blog-two__content">
                                <h3 className="blog-two__title"><Link href="blog-details">The Selection Point Erase in
                                        Certain Circumstances And Owing </Link></h3>
                                <p className="blog-two__text">Secure to other greater pleasures, or the selection point. But
                                    in certain circumstances</p>
                                <div className="blog-two__read-more">
                                    <Link href="blog-details">Read More<span className="icon-arrow-right"></span></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Blog Two Single End*/}
                </div>
            </div>
        </section>
        {/*Blog Two End */}
       
        </>
    )
}
