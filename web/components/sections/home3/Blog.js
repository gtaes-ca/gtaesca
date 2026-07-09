import Link from "next/link"
export default function Blog() {
    return (
        <>
          
        {/*Blog Three Start*/}
        <div className="blog-three">
            <div className="blog-three-shape-1 float-bob-y"
                style={{ backgroundImage: 'url(assets/images/shapes/blog-three-shape-1.png)' }} >
            </div>
            <div className="container">
                <div className="section-title-three text-center sec-title-animation animation-style1">
                    <div className="section-title-three__tagline-box justify-content-center">
                        <div className="section-title-three__tagline-shape"></div>
                        <span className="section-title-three__tagline">From Our Blog</span>
                        <div className="section-title-three__tagline-shape"></div>
                    </div>
                    <h2 className="section-title-three__title title-animation">News And Articles</h2>
                </div>
                <div className="row">
                    {/*Blog One Single Start*/}
                    <div className="col-xl-4 col-lg-4 wow fadeInUp" data-wow-delay="100ms">
                        <div className="blog-three__single">
                            <div className="blog-three__img">
                                <img src="assets/images/blog/blog-3-1.jpg" alt=""/>
                                <div className="blog-three__plus">
                                    <Link href="blog-details"><i className="fa fa-plus"></i></Link>
                                </div>
                            </div>
                            <div className="blog-three__content">
                                <ul className="blog-three__meta list-unstyled">
                                    <li>
                                        <Link href="blog-details"><i className="fa fa-calendar-alt"></i>5 Jan 2024</Link>
                                    </li>
                                    <li>
                                        <Link href="blog-details"><i className="far fa-comments"></i>02 COMMENTS</Link>
                                    </li>
                                </ul>
                                <h3 className="blog-three__title"><Link href="blog-details">How To Fix Broken Back Glass
                                        On
                                        Your Phone</Link></h3>
                                <div className="blog-three__btn-box">
                                    <Link href="blog-details" className="thm-btn blog-three__btn">Read More</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Blog One Single End*/}
                    {/*Blog One Single Start*/}
                    <div className="col-xl-4 col-lg-4 wow fadeInUp" data-wow-delay="200ms">
                        <div className="blog-three__single">
                            <div className="blog-three__img">
                                <img src="assets/images/blog/blog-3-2.jpg" alt=""/>
                                <div className="blog-three__plus">
                                    <Link href="blog-details"><i className="fa fa-plus"></i></Link>
                                </div>
                            </div>
                            <div className="blog-three__content">
                                <ul className="blog-three__meta list-unstyled">
                                    <li>
                                        <Link href="blog-details"><i className="fa fa-calendar-alt"></i>5 Feb 2024</Link>
                                    </li>
                                    <li>
                                        <Link href="blog-details"><i className="far fa-comments"></i>02 COMMENTS</Link>
                                    </li>
                                </ul>
                                <h3 className="blog-three__title"><Link href="blog-details">How To Fix Broken Screen On
                                        Your
                                        Laptop</Link></h3>
                                <div className="blog-three__btn-box">
                                    <Link href="blog-details" className="thm-btn blog-three__btn">Read More</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Blog One Single End*/}
                    {/*Blog One Single Start*/}
                    <div className="col-xl-4 col-lg-4 wow fadeInUp" data-wow-delay="300ms">
                        <div className="blog-three__single">
                            <div className="blog-three__img">
                                <img src="assets/images/blog/blog-3-3.jpg" alt=""/>
                                <div className="blog-three__plus">
                                    <Link href="blog-details"><i className="fa fa-plus"></i></Link>
                                </div>
                            </div>
                            <div className="blog-three__content">
                                <ul className="blog-three__meta list-unstyled">
                                    <li>
                                        <Link href="blog-details"><i className="fa fa-calendar-alt"></i>5 Mar 2022</Link>
                                    </li>
                                    <li>
                                        <Link href="blog-details"><i className="far fa-comments"></i>02 COMMENTS</Link>
                                    </li>
                                </ul>
                                <h3 className="blog-three__title"><Link href="blog-details">What Is The Best Affordable
                                        Android Phone In 2022?</Link></h3>
                                <div className="blog-three__btn-box">
                                    <Link href="blog-details" className="thm-btn blog-three__btn">Read More</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Blog One Single End*/}
                </div>
            </div>
        </div>
        {/*Blog Three End*/}
        
        </>
    )
}
