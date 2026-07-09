'use client'
import Link from "next/link"
import Layout from "@/components/layout/Layout"

export default function Home() {

    return (
        <>
        <Layout headerStyle={2} footerStyle={4} breadcrumbTitle="Shop">
        {/*Shop Page One Start*/}
        <section className="shop-page-one">
            <div className="container">
                <div className="row">

                    <div className="col-xl-8 col-lg-6 col-md-6">
                        <div className="shop-page-one-content">
                            {/*Start Shop items*/}
                            <div className="row">
                                <div className="col-xl-12">

                                    <div className="shop-page-top-info_inner">
                                        <div className="left-box">
                                            <p>Showing 1 - 9 of 30 results</p>
                                        </div>
                                        <div className="right-box">
                                            <div className="text">
                                                <p>Sort by:</p>
                                            </div>
                                            <div className="select-box">
                                                <select className="wide">
                                                    <option data-display="popularity">Popularity</option>
                                                    <option value="1">Popularity 01</option>
                                                    <option value="2">Popularity 02</option>
                                                    <option value="3">Popularity 03</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            {/*End Shop items*/}

                            <div className="row">

                                {/*Start single shop item*/}
                                <div className="col-xl-6">
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
                                <div className="col-xl-6">
                                    <div className="shop-page-one-single">
                                        <div className="img-box">
                                            <div className="discount">
                                                <h6>10% off</h6>
                                            </div>
                                            <img src="assets/images/shop/product-v1-2.jpg" alt="Image"/>
                                            <div className="overlay-icon clearfix">
                                                <Link href="shop">
                                                    <i className="fa fa fa-heart"></i>
                                                </Link>
                                                <Link href="shop">
                                                    <i className=" fa fa fa-plus"></i>
                                                </Link>
                                            </div>
                                            <div className="rate-box">
                                                <h4>$40.00 <del>$50.00</del></h4>
                                            </div>
                                        </div>
                                        <div className="content-box">
                                            <div className="title">
                                                <h3><Link href="shop">Electric screwdriver</Link></h3>
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
                                <div className="col-xl-6">
                                    <div className="shop-page-one-single">
                                        <div className="img-box">
                                            <div className="new">
                                                <h6>new</h6>
                                            </div>
                                            <img src="assets/images/shop/product-v1-3.jpg" alt="Image"/>
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
                                                <h3><Link href="shop">Multimeter parameters</Link></h3>
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
                                <div className="col-xl-6">
                                    <div className="shop-page-one-single">
                                        <div className="img-box">
                                            <img src="assets/images/shop/product-v1-4.jpg" alt=" Image"/>
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
                                <div className="col-xl-6">
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

                                {/*Start single shop item*/}
                                <div className="col-xl-6">
                                    <div className="shop-page-one-single">
                                        <div className="img-box">
                                            <div className="discount">
                                                <h6>10% off</h6>
                                            </div>
                                            <img src="assets/images/shop/product-v1-6.jpg" alt="Image"/>
                                            <div className="overlay-icon clearfix">
                                                <Link href="shop">
                                                    <i className="fa fa fa-heart"></i>
                                                </Link>
                                                <Link href="shop">
                                                    <i className=" fa fa fa-plus"></i>
                                                </Link>
                                            </div>
                                            <div className="rate-box">
                                                <h4>$40.00 <del>$50.00</del></h4>
                                            </div>
                                        </div>
                                        <div className="content-box">
                                            <div className="title">
                                                <h3><Link href="shop">Instruments with toolbox</Link></h3>
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
                                <div className="col-xl-6">
                                    <div className="shop-page-one-single">
                                        <div className="img-box">
                                            <div className="new">
                                                <h6>new</h6>
                                            </div>
                                            <img src="assets/images/shop/product-v1-3.jpg" alt="Image"/>
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
                                                <h3><Link href="shop">Multimeter parameters</Link></h3>
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
                                <div className="col-xl-6  col-lg-12">
                                    <div className="shop-page-one-single">
                                        <div className="img-box">
                                            <img src="assets/images/shop/product-v1-4.jpg" alt="Image"/>
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

                            </div>
                        </div>
                    </div>

                    {/*Start Shop Page One*/}
                    <div className="col-xl-4 col-lg-6 col-md-6">
                        <div className="shop-page-one-sidebar">
                            {/*Start Single Sidebar Box*/}
                            <div className="sidebar-search-box">
                                <form className="search-form" action="#">
                                    <input placeholder="Keyword..." type="text"/>
                                    <button type="submit">
                                        <i className="icon-search-interface-symbol"></i>
                                    </button>
                                </form>
                            </div>
                            {/*End Single Sidebar Box*/}

                            {/*Start Single Sidebar Box*/}
                            <div className="shop-widget-single">
                                <div className="title">
                                    <h3>Categories</h3>
                                    <div className="border-bx"></div>
                                </div>
                                <div className="shop-widget-single_category">
                                    <ul className="list-item clearfix">
                                        <li>
                                            <Link href="#">Electrical installation</Link>
                                        </li>
                                        <li>
                                            <Link href="#">Apprentice Electrician</Link>
                                        </li>
                                        <li>
                                            <Link href="#">Outlet Repairs</Link>
                                        </li>
                                        <li>
                                            <Link href="#">electrical systems</Link>
                                        </li>
                                        <li>
                                            <Link href="#">circuit breakers</Link>
                                        </li>
                                        <li>
                                            <Link href="#">Revolution Industries</Link>
                                        </li>
                                        <li>
                                            <Link href="#">Faulty switches</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {/*End Single Sidebar Box*/}

                            {/*Start Single Sidebar Box*/}
                            <div className="shop-widget-single">
                                <div className="title">
                                    <h3>Price Range</h3>
                                    <div className="border-bx"></div>
                                </div>
                                <div className="price-ranger">
                                    <div id="slider-range"></div>
                                    <div className="ranger-min-max-block">
                                        <div className="left clearfix">
                                            <span>Price:</span>
                                            <input type="text" className="min"/>
                                            <span className="hipen">-</span>
                                            <input type="text" className="max"/>
                                        </div>
                                        <div className="right">
                                            <input type="submit" value="Filter"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*End Single Sidebar Box*/}

                            {/*Start Single Sidebar Box*/}
                            <div className="shop-widget-single">
                                <div className="title">
                                    <h3>Popular Products</h3>
                                    <div className="border-bx"></div>
                                </div>
                                <ul className="popular-products-list clearfix">
                                    <li>
                                        <div className="popular-products-img">
                                            <img src="assets/images/shop/product-v1-sidebar-1.png" alt="Awesome Image" />
                                        </div>
                                        <div className="popular-products-content">
                                            <h3><Link href="#">Digital multimeters are superior to analog multimeters</Link>
                                            </h3>
                                            <h6>$20.00</h6>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="popular-products-img">
                                            <img src="assets/images/shop/product-v1-sidebar-2.png" alt="Awesome Image" />
                                        </div>
                                        <div className="popular-products-content">
                                            <h3><Link href="#">Air Conditioning Tonnage helps determine.</Link></h3>
                                            <h6>$40.00</h6>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="popular-products-img">
                                            <img src="assets/images/shop/product-v1-sidebar-3.png" alt="Awesome Image" />
                                        </div>
                                        <div className="popular-products-content">
                                            <h3><Link href="#">Helpful tools, insight, and encouragement</Link></h3>
                                            <h6>$18.00</h6>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            {/*End Single Sidebar Box*/}

                            {/*Start Single Sidebar Box*/}
                            <div className="shop-widget-single">
                                <div className="title">
                                    <h3>Product Tag</h3>
                                    <span className="border-bx"></span>
                                </div>
                                <ul className="product-tag clearfix">
                                    <li><Link href="#">Repair</Link></li>
                                    <li><Link href="#">Red Service</Link></li>
                                    <li><Link href="#">Equipment</Link></li>
                                    <li><Link href="#">Maintenance</Link></li>
                                    <li><Link href="#">equipment</Link></li>
                                    <li><Link href="#">Office</Link></li>
                                    <li><Link href="#">Ourdoor</Link></li>
                                    <li><Link href="#">labels </Link></li>
                                </ul>
                            </div>
                            {/*End Single Sidebar Box*/}

                        </div>
                    </div>
                    {/*End Shop Page One*/}

                </div>

                <ul className="styled-pagination pdtop30 clearfix">
                    <li className="arrow prev">
                        <Link href="#"><span className="icon-arrow-right left"></span></Link>
                    </li>
                    <li className="active"><Link href="#">1</Link></li>
                    <li><Link href="#">2</Link></li>
                    <li><Link href="#">3</Link></li>
                    <li className="arrow next">
                        <Link href="#"><span className="icon-arrow-right right"></span></Link>
                    </li>
                </ul>
            </div>
        </section>
        {/*Shop Page One End*/}
        </Layout>
        </>
    )
}