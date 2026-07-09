'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function Home() {

    return (
        <>
        <Layout headerStyle={2} footerStyle={4} breadcrumbTitle="Shop Details">
        {/*Start Scrolling Text1*/}
        <section className="scrolling-text1">
            <div className="scrolling-title">
                <ul className="marquee_mode">
                    <li>Product Details</li>
                    <li>Product Details</li>
                    <li>Product Details</li>
                    <li>Product Details</li>
                </ul>
            </div>
        </section>
        {/*End Scrolling Text1*/}

        {/*Start Shop Details Page1*/}
        <section className="shop-details-page1">
            <div className="big-title">shop</div>
            <div className="container">
                <div className="row">

                    {/*Start Shop Details Page1 Img*/}
                    <div className="col-xl-5">
                        <div className="shop-details-page1__img">
                            <div className="shop-details-page1__img-inner">
                                <img src="assets/images/shop/product-details-img-1.jpg" alt="Image"/>
                                <div className="overlay-icon">
                                    <Link className="lightbox-image" data-fancybox="gallery"
                                        href="assets/images/shop/product-details-img-1.jpg">
                                        <i className="icon-search-interface-symbol" ></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*End Shop Details Page1 Img*/}

                    {/*Start Shop Details Page1 Content*/}
                    <div className="col-xl-7">
                        <div className="shop-details-page1__content">
                            <div className="shop-details-page1__title">
                                <h6>Electrical</h6>
                                <h2>Air conditioners Repair</h2>
                            </div>
                            <div className="shop-details-page1__value">
                                <h3>$200.00 <del>$260.00</del></h3>
                            </div>
                            <div className="shop-details-page1__text">
                                <p>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                                    Ipsum has been the industry's standard dummy text ever since the 1500s, when an
                                    unknown printer took a galley of type and scrambled it to make a type specimen book
                                </p>
                            </div>
                            <div className="shop-details-page1__product">
                                <ul>
                                    <li>
                                        <div className="title">
                                            <h5>Author</h5>
                                            <span>:</span>
                                        </div>
                                        <p>Darby</p>
                                    </li>
                                    <li>
                                        <div className="title">
                                            <h5>Language</h5>
                                            <span>:</span>
                                        </div>
                                        <p>English</p>
                                    </li>
                                    <li>
                                        <div className="title">
                                            <h5>Services</h5>
                                            <span>:</span>
                                        </div>
                                        <p>Free Shipping, 7 Days Replacement, Cash On <br/>Delivery Available</p>
                                    </li>
                                </ul>
                            </div>

                            <div className="product-quantity-box-outer">
                                <div className="product-quantity-box">
                                    <div className="input-box">
                                        <input className="quantity-spinner" type="text" name="quantity"/>
                                    </div>
                                    <div className="right">
                                        <div className="cart-box">
                                            <button className="thm-btn" type="submit">
                                                <span className="txt">Add to Cart</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="shop-details-page1__wishlist-btn">
                                <Link href="#"><span className="fa fa fa-heart"></span> Add to Wishlist</Link>
                            </div>

                            <div className="shop-details-page1__description">
                                <div className="inner-title">
                                    <h3>Product Details</h3>
                                </div>
                                <p>It is a long established fact that a reader will be distracted by the readable
                                    content of a page when looking at its layout. The point of using Lorem Ipsum is that
                                    it has a more-or-less normal distribution of letters, as opposed to using 'Content
                                    here, content here', making it look like readable English. Many desktop publishing
                                    packages and web page editors now use Lorem Ipsum as their default model text, and a
                                    search for 'lorem ipsum' will uncover many web sites still in their infancy. Various
                                    versions have evolved over the years, sometimes by accident, sometimes on purpose
                                </p>
                            </div>

                            <div className="shop-details-page1__reviews">
                                <div className="title-box">
                                    <h2>Product Reviews</h2>
                                </div>

                                <ul>
                                    <li>
                                        <div className="inner">
                                            <div className="img-box">
                                                <img src="assets/images/shop/product-review1.jpg" alt=""/>
                                            </div>
                                            <div className="content-box">
                                                <h3>Marshall <span>Mar 21, 2023</span></h3>
                                                <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It
                                                    has roots in a piece of erature from 45 BC,
                                                    making it over 2000 years old.</p>
                                            </div>
                                        </div>
                                    </li>

                                    <li>
                                        <div className="inner">
                                            <div className="img-box">
                                                <img src="assets/images/shop/product-review2.jpg" alt=""/>
                                            </div>
                                            <div className="content-box">
                                                <h3>Cashel <span>Mar 21, 2021</span></h3>
                                                <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It
                                                    has roots in a piece of erature from 45 BC,
                                                    making it over 2000 years old.</p>
                                            </div>
                                        </div>
                                    </li>

                                    <li>
                                        <div className="inner">
                                            <div className="img-box">
                                                <img src="assets/images/shop/product-review3.jpg" alt=""/>
                                            </div>
                                            <div className="content-box">
                                                <h3>Everest <span>Mar 20, 2021</span></h3>
                                                <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It
                                                    has roots in a piece of erature from 45 BC,
                                                    making it over 2000 years old.</p>
                                            </div>
                                        </div>
                                    </li>

                                </ul>
                            </div>

                            <div className="shop-details-page1__form">
                                <div className="title-box">
                                    <h2>Your Comments</h2>
                                    <p>Email will not be published. Required fields are marked <span>*</span></p>
                                </div>

                                <form id="contact-form" name="contact_form" className="default-form2"
                                    action="assets/inc/sendmail.php" method="post">
                                    <div className="row">
                                        <div className="col-xl-6 col-lg-12 col-md-12">
                                            <div className="input-box">
                                                <input type="text" name="ffname" placeholder="Name *"
                                                    required=""/>
                                            </div>
                                        </div>

                                        <div className="col-xl-6 col-lg-12 col-md-12">
                                            <div className="input-box">
                                                <input type="email" name="email" placeholder="Email *"
                                                    required=""/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-xl-12 col-lg-12 col-md-12">
                                            <div className="input-box">
                                                <textarea name="form_message" id="formMessage" placeholder="Comments"
                                                    required="" aria-required="true"></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="product-form-box-checkbox">
                                                <div className="inner">
                                                    <input type="checkbox" name="remember" id="tag"/>
                                                    <label><span></span>Save my details in this browser for
                                                        the next time I comment.</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-xl-12">
                                            <div className="button-box">
                                                <button className="thm-btn" type="submit"
                                                    data-loading-text="Please wait...">
                                                    <span className="txt">Submit Now</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/*End Shop Details Page1 Content*/}

                </div>
            </div>
        </section>
        {/*End Shop Details Page1*/}
        {/*Start Related Products One*/}
        <section className="related-products-one">
            <div className="container">
                <div className="inner-title">
                    <h3>Related Products</h3>
                </div>
                <div className="row">

                    {/*Start single shop item*/}
                    <div className="col-xl-4 col-lg-6 col-md-6">
                        <div className="shop-page-one-single">
                            <div className="img-box">
                                <img src="assets/images/shop/product-v1-1.jpg" alt="Image"/>
                                <div className="overlay-icon clearfix">
                                    <Link href="shop">
                                        <i className="fa fa fa-heart"></i>
                                    </Link>
                                    <Link href="shop">
                                        <i className=" fa fa fa-plus"></i>
                                    </Link>
                                </div>
                                <div className="rate-box">
                                    <h4>$40.00</h4>
                                </div>
                            </div>
                            <div className="content-box">
                                <div className="title">
                                    <h3><Link href="shop">Digital multimeter</Link></h3>
                                </div>
                                <div className="bottom-box">
                                    <ul className="rating-icon clearfix">
                                        <li><i className="fa fa fa-star"></i></li>
                                        <li><i className="fa fa fa-star"></i></li>
                                        <li><i className="fa fa fa-star"></i></li>
                                        <li><i className="fa fa fa-star"></i></li>
                                        <li><i className="fa fa fa-star"></i></li>
                                    </ul>
                                    <div className="btn-box">
                                        <Link href="shop">
                                            <i className="fa fa fa-cart-plus"></i>
                                            Add to Cart
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*End single shop item*/}

                    {/*Start single shop item*/}
                    <div className="col-xl-4 col-lg-6 col-md-6">
                        <div className="shop-page-one-single">
                            <div className="img-box">
                                <img src="assets/images/shop/product-v1-4.jpg" alt=" Image" />
                                <div className="overlay-icon clearfix">
                                    <Link href="shop">
                                        <i className="fa fa fa-heart"></i>
                                    </Link>
                                    <Link href="shop">
                                        <i className=" fa fa fa-plus"></i>
                                    </Link>
                                </div>
                                <div className="rate-box">
                                    <h4>$40.00</h4>
                                </div>
                            </div>
                            <div className="content-box">
                                <div className="title">
                                    <h3><Link href="shop">Cutting Pliers</Link></h3>
                                </div>
                                <div className="bottom-box">
                                    <ul className="rating-icon clearfix">
                                        <li><i className="fa fa fa-star"></i></li>
                                        <li><i className="fa fa fa-star"></i></li>
                                        <li><i className="fa fa fa-star"></i></li>
                                        <li><i className="fa fa fa-star"></i></li>
                                        <li className="color"><i className="fa fa fa-star"></i></li>
                                    </ul>
                                    <div className="btn-box">
                                        <Link href="shop">
                                            <i className="fa fa fa-cart-plus"></i>
                                            Add to Cart
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*End single shop item*/}

                    {/*Start single shop item*/}
                    <div className="col-xl-4 col-lg-6 col-md-6">
                        <div className="shop-page-one-single">
                            <div className="img-box">
                                <img src="assets/images/shop/product-v1-5.jpg" alt="Image"/>
                                <div className="overlay-icon clearfix">
                                    <Link href="shop">
                                        <i className="fa fa fa-heart"></i>
                                    </Link>
                                    <Link href="shop">
                                        <i className=" fa fa fa-plus"></i>
                                    </Link>
                                </div>
                                <div className="rate-box">
                                    <h4>$40.00</h4>
                                </div>
                            </div>
                            <div className="content-box">
                                <div className="title">
                                    <h3><Link href="shop">Air conditioners Repair</Link></h3>
                                </div>
                                <div className="bottom-box">
                                    <ul className="rating-icon clearfix">
                                        <li><i className="fa fa fa-star"></i></li>
                                        <li><i className="fa fa fa-star"></i></li>
                                        <li><i className="fa fa fa-star"></i></li>
                                        <li><i className="fa fa fa-star"></i></li>
                                        <li><i className="fa fa fa-star"></i></li>
                                    </ul>
                                    <div className="btn-box">
                                        <Link href="shop">
                                            <i className="fa fa fa-cart-plus"></i>
                                            Add to Cart
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*End single shop item*/}


                </div>
            </div>
        </section>
        {/*End Related Products One*/}
        </Layout>
        </>
    )
}