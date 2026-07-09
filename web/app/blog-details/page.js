import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function Home() {

    return (
        <>
        <Layout headerStyle={2} footerStyle={1} breadcrumbTitle="News Details">
    
        {/*Blog Details Start*/}
        <section className="blog-details">
            <div className="container">
                <div className="row">
                    <div className="col-xl-8 col-lg-7">
                        <div className="blog-details__left">
                            <div className="blog-details__img">
                                <img src="assets/images/blog/blog-details-img-1.jpg" alt=""/>
                                <div className="blog-details__date">
                                    <p>12<br/>Nov</p>
                                </div>
                            </div>
                            <div className="blog-details__content">
                                <div className="blog-details__user-and-meta">
                                    <div className="blog-details__user">
                                        <p><span className="icon-user"></span>By Admin</p>
                                    </div>
                                    <ul className="blog-details__meta list-unstyled">
                                        <li>
                                            <Link href="#"><span className="icon-speech-bubbles"></span>Comments (05)</Link>
                                        </li>
                                        <li>
                                            <Link href="#"><span className="icon-clock"></span>4 Min Read</Link>
                                        </li>
                                    </ul>
                                </div>
                                <h3 className="blog-details__title">Elase They Endures Pains to Avoid The Worse Pains Taken
                                </h3>
                                <p className="blog-details__text-1">Out enigma ad minim veniam, quis nostrud exercitation
                                    ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute inure dolor in
                                    the reprehenderit in voluptate velit esse cillum dolore eu fugiat null pariatur.
                                    Excepteur snit occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                                    mollit anim id est laborum.</p>
                                <p className="blog-details__text-2">The wise man therefore always holds in these matters to
                                    this principle of selection. He rejects pleasures to secure other greater pleasures,
                                    or else he endures pains to avoid worse pains to the selection point.</p>
                                <div className="blog-details__author-box">
                                    <h4 className="blog-details__author-text">“Sed do eiusmod tempor incididunt labore et
                                        dolore magna aliqua. Uther enim minim veniam, quis nostrud exercitation ullamco
                                        laboris nisi aliquip commodo consequat. Duis aute irure dolor in reprehenderit
                                        in voluptate”</h4>
                                    <p className="blog-details__author-name">Kane Williamson<span> / CEO</span></p>
                                </div>
                                <h3 className="blog-details__title-2">Sundress Pains to Avoid The Worse Pains </h3>
                                <p className="blog-details__text-3">Out enigma ad minim veniam, quis nostrud exercitation
                                    ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute inure dolor in
                                    the reprehenderit in voluptate velit esse cillum dolore eu fugiat null pariatur.
                                    Excepteur snit occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                                    mollit anim id est laborum.</p>
                                <div className="blog-details__img-box">
                                    <div className="row">
                                        <div className="col-xl-6">
                                            <div className="blog-details__img-box-img">
                                                <img src="assets/images/blog/blog-details-img-box-img-1.jpg" alt=""/>
                                            </div>
                                        </div>
                                        <div className="col-xl-6">
                                            <div className="blog-details__img-box-img">
                                                <img src="assets/images/blog/blog-details-img-box-img-2.jpg" alt=""/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="blog-details__tag-and-share">
                                    <div className="blog-details__tag">
                                        <h3 className="blog-details__tag-title">Tags :</h3>
                                        <ul className="blog-details__tag-list list-unstyled">
                                            <li>
                                                <Link href="#">Analysis</Link>
                                            </li>
                                            <li>
                                                <Link href="#">Planning</Link>
                                            </li>
                                            <li>
                                                <Link href="#">Management</Link>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="blog-details__share-box">
                                        <h3 className="blog-details__share-title">Share :</h3>
                                        <div className="blog-details__share">
                                            <Link href="#"><span className="icon-facebook"></span></Link>
                                            <Link href="#"><span className="icon-xpa"></span></Link>
                                            <Link href="#"><span className="icon-link-in"></span></Link>
                                            <Link href="#"><span className="icon-instagram"></span></Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="comment-one">
                                    <div className="comment-one__single">
                                        <div className="comment-one__image">
                                            <img src="assets/images/blog/comment-1-1.jpg" alt=""/>
                                        </div>
                                        <div className="comment-one__content">
                                            <h3>Theresa Webb</h3>
                                            <span>02 June 2024 at 03:30 pm</span>
                                            <p>The wise man therefore always holds in these matters to this principle of
                                                selection. He rejects pleasures to secure other greater pleasures, or
                                                else he endures pains to avoid worse pains to the selection point. But
                                                in certain to all this circumstances</p>
                                            <div className="comment-one__btn-box">
                                                <Link href="blog-details" className="comment-one__btn"><span
                                                        className="icon-share-alt"></span>Reply</Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="comment-one__single">
                                        <div className="comment-one__image">
                                            <img src="assets/images/blog/comment-1-2.jpg" alt=""/>
                                        </div>
                                        <div className="comment-one__content">
                                            <h3>Cameron Williamson</h3>
                                            <span>02 June 2024 at 03:30 pm</span>
                                            <p>The wise man therefore always holds in these matters to this principle of
                                                selection. He rejects pleasures to secure other greater pleasures, or
                                                else he endures pains to avoid worse pains to the selection point. But
                                                in certain to all this circumstances</p>
                                            <div className="comment-one__btn-box">
                                                <Link href="blog-details" className="comment-one__btn"><span
                                                        className="icon-share-alt"></span>Reply</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="comment-form">
                                    <h3 className="comment-form__title">Leave A Comment</h3>
                                    <p className="comment-form__text">By using form u agree with the message sorage, you can
                                        contact us directly now</p>
                                    <form action="assets/inc/sendemail.php"
                                        className="comment-one__form contact-form-validated" >
                                        <div className="row">
                                            <div className="col-xl-6">
                                                <div className="comment-form__input-box">
                                                    <input type="text" placeholder="Your Name" name="name"/>
                                                </div>
                                            </div>
                                            <div className="col-xl-6">
                                                <div className="comment-form__input-box">
                                                    <input type="email" placeholder="Your Email" name="EMAIL"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-xl-12">
                                                <div className="comment-form__input-box text-message-box">
                                                    <textarea name="message"
                                                        placeholder="Write your messege"></textarea>
                                                </div>
                                                <div className="comment-form__btn-box">
                                                    <button type="submit" className="thm-btn comment-form__btn">submit
                                                        now</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="result"></div>
                                </div>
                            </div>
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
        {/*Blog Details End*/}


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