import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function Home() {

    return (
        <>
        <Layout headerStyle={2} footerStyle={1} breadcrumbTitle="Blog List">
        {/*Blog Page Start*/}
        <section className="blog-list">
            <div className="container">
                <div className="row">
                    <div className="col-xl-8 col-lg-7">
                        <div className="blog-list__left">
                            {/*Blog Page Single Start*/}
                            <div className="blog-list__single">
                                <div className="blog-list__img">
                                    <img src="assets/images/blog/blog-list-1-1.jpg" alt=""/>
                                    <div className="blog-list__date">
                                        <p>12<br/>Nov</p>
                                    </div>
                                </div>
                                <div className="blog-list__content">
                                    <div className="blog-list__user-and-meta">
                                        <div className="blog-list__user">
                                            <p><span className="icon-user"></span>By Admin</p>
                                        </div>
                                        <ul className="blog-list__meta list-unstyled">
                                            <li>
                                                <Link href="#"><span className="icon-speech-bubbles"></span>Comments (05)</Link>
                                            </li>
                                            <li>
                                                <Link href="#"><span className="icon-clock"></span>4 Min Read</Link>
                                            </li>
                                        </ul>
                                    </div>
                                    <h3 className="blog-list__title"><Link href="#">Elase They Endures Pains to Avoid The Worse
                                            Pains Taken </Link></h3>
                                    <p className="blog-list__text">Out enigma ad minim veniam, quis nostrud exercitation
                                        ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute inure dolor
                                        in the reprehenderit in voluptate velit esse cillum dolore eu fugiat null
                                        pariatur. Excepteur snit occaecat cupidatat non proident, sunt in culpa qui
                                        officia deserunt mollit anim id est laborum.</p>
                                    <Link href="#" className="blog-list__read-more">Learn More<span
                                            className="icon-arrow-right"></span></Link>
                                </div>
                            </div>
                            {/*Blog Page Single End*/}
                            {/*Blog Page Single Start*/}
                            <div className="blog-list__single">
                                <div className="blog-list__img">
                                    <img src="assets/images/blog/blog-list-1-2.jpg" alt=""/>
                                    <div className="blog-list__date">
                                        <p>12<br/>Nov</p>
                                    </div>
                                </div>
                                <div className="blog-list__content">
                                    <div className="blog-list__user-and-meta">
                                        <div className="blog-list__user">
                                            <p><span className="icon-user"></span>By Admin</p>
                                        </div>
                                        <ul className="blog-list__meta list-unstyled">
                                            <li>
                                                <Link href="#"><span className="icon-speech-bubbles"></span>Comments (05)</Link>
                                            </li>
                                            <li>
                                                <Link href="#"><span className="icon-clock"></span>4 Min Read</Link>
                                            </li>
                                        </ul>
                                    </div>
                                    <h3 className="blog-list__title"><Link href="#">Secure to Other Greater Pleasures, or The
                                            Selection Point. </Link></h3>
                                    <p className="blog-list__text">Out enigma ad minim veniam, quis nostrud exercitation
                                        ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute inure dolor
                                        in the reprehenderit in voluptate velit esse cillum dolore eu fugiat null
                                        pariatur. Excepteur snit occaecat cupidatat non proident, sunt in culpa qui
                                        officia deserunt mollit anim id est laborum.</p>
                                    <Link href="#" className="blog-list__read-more">Learn More<span
                                            className="icon-arrow-right"></span></Link>
                                </div>
                            </div>
                            {/*Blog Page Single End*/}
                            {/*Blog Page Single Start*/}
                            <div className="blog-list__single">
                                <div className="blog-list__img">
                                    <img src="assets/images/blog/blog-list-1-3.jpg" alt=""/>
                                    <div className="blog-list__date">
                                        <p>12<br/>Nov</p>
                                    </div>
                                </div>
                                <div className="blog-list__content">
                                    <div className="blog-list__user-and-meta">
                                        <div className="blog-list__user">
                                            <p><span className="icon-user"></span>By Admin</p>
                                        </div>
                                        <ul className="blog-list__meta list-unstyled">
                                            <li>
                                                <Link href="#"><span className="icon-speech-bubbles"></span>Comments (05)</Link>
                                            </li>
                                            <li>
                                                <Link href="#"><span className="icon-clock"></span>4 Min Read</Link>
                                            </li>
                                        </ul>
                                    </div>
                                    <h3 className="blog-list__title"><Link href="#">The Selection Point Erase in Certain
                                            Circumstances And Owing </Link></h3>
                                    <p className="blog-list__text">Out enigma ad minim veniam, quis nostrud exercitation
                                        ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute inure dolor
                                        in the reprehenderit in voluptate velit esse cillum dolore eu fugiat null
                                        pariatur. Excepteur snit occaecat cupidatat non proident, sunt in culpa qui
                                        officia deserunt mollit anim id est laborum.</p>
                                    <Link href="#" className="blog-list__read-more">Learn More<span
                                            className="icon-arrow-right"></span></Link>
                                </div>
                            </div>
                            {/*Blog Page Single End*/}
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-5">
                        <div className="sidebar">
                            <div className="sidebar__single sidebar__search">
                                <form action="#" className="sidebar__search-form">
                                    <input type="search" placeholder="Search here"/>
                                    <button type="submit"><i className="icon-search-interface-symbol"></i></button>
                                </form>
                            </div>
                            <div className="sidebar__single sidebar__all-category">
                                <h3 className="sidebar__title">Categories</h3>
                                <ul className="sidebar__all-category-list list-unstyled">
                                    <li>
                                        <Link href="#">Industrial service<span>(04)</span></Link>
                                    </li>
                                    <li className="active">
                                        <Link href="#">residential service<span>(06)</span></Link>
                                    </li>
                                    <li>
                                        <Link href="#">Commercial services<span>(02)</span></Link>
                                    </li>
                                    <li>
                                        <Link href="#">power solution<span>(04)</span></Link>
                                    </li>
                                    <li>
                                        <Link href="#">upgrade old wiring<span>(07)</span></Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="sidebar__single sidebar__post">
                                <h3 className="sidebar__title">Our Latest Post</h3>
                                <ul className="sidebar__post-list list-unstyled">
                                    <li>
                                        <div className="sidebar__post-image">
                                            <img src="assets/images/blog/lp-1-1.jpg" alt=""/>
                                        </div>
                                        <div className="sidebar__post-content">
                                            <p className="sidebar__post-date">02 June 2024</p>
                                            <h3>
                                                <Link href="blog-details">Greater Pleasures or The Selection</Link>
                                            </h3>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="sidebar__post-image">
                                            <img src="assets/images/blog/lp-1-2.jpg" alt=""/>
                                        </div>
                                        <div className="sidebar__post-content">
                                            <p className="sidebar__post-date">02 June 2024</p>
                                            <h3>
                                                <Link href="blog-details">He pleasures to secure greater</Link>
                                            </h3>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="sidebar__post-image">
                                            <img src="assets/images/blog/lp-1-3.jpg" alt=""/>
                                        </div>
                                        <div className="sidebar__post-content">
                                            <p className="sidebar__post-date">02 June 2024</p>
                                            <h3>
                                                <Link href="blog-details">worse pains to the selection point.</Link>
                                            </h3>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="sidebar__single sidebar__tags">
                                <h3 className="sidebar__title">Popular Tags</h3>
                                <div className="sidebar__tags-list">
                                    <Link href="#">Growth Accelerator</Link>
                                    <Link href="#">Management</Link>
                                    <Link href="#">Analysis</Link>
                                    <Link href="#">Planning</Link>
                                    <Link href="#">Advisory Service</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/*Blog Page End*/}


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