'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function Home() {

    return (
        <>
        <Layout headerStyle={2} footerStyle={4} breadcrumbTitle="Wishlist">
        {/*Cart Page One Start*/}
        <section className="cart-page-one">
            <div className="container">

                <div className="table-responsive-box">
                    <table className="wishlist-table">
                        <tbody>
                            <tr>
                                <td>
                                    <div className="product-box">
                                        <div className="img-box">
                                            <img src="assets/images/shop/wishlist-page-img-1.jpg" alt="Image"/>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="product-name-select-box">
                                        <div className="product-name">
                                            <h4>Electronic industrial</h4>
                                            <p>$70.00</p>
                                        </div>
                                        <div className="product-select">
                                            <Link href="wishlist" className="thm-btn wishlist-page__btn"> <span></span>
                                                Select Product</Link>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="cross-icon">
                                        <i className="icon-plus remove-icon"></i>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="product-box">
                                        <div className="img-box">
                                            <img src="assets/images/shop/wishlist-page-img-2.jpg" alt="Image"/>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="product-name-select-box">
                                        <div className="product-name">
                                            <h4>Electronic Allenkey Set</h4>
                                            <p>$60.00</p>
                                        </div>
                                        <div className="product-select">
                                            <Link href="wishlist" className="thm-btn wishlist-page__btn"> <span></span>
                                                Select Product</Link>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="cross-icon">
                                        <i className="icon-plus remove-icon"></i>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="product-box">
                                        <div className="img-box">
                                            <img src="assets/images/shop/wishlist-page-img-3.jpg" alt="Image"/>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="product-name-select-box">
                                        <div className="product-name">
                                            <h4>Digital multimeter</h4>
                                            <p>$65.00</p>
                                        </div>
                                        <div className="product-select">
                                            <Link href="wishlist" className="thm-btn wishlist-page__btn"> <span></span>
                                                Select Product</Link>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="cross-icon">
                                        <i className="icon-plus remove-icon"></i>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="product-box">
                                        <div className="img-box">
                                            <img src="assets/images/shop/wishlist-page-img-4.jpg" alt="Image"/>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="product-name-select-box">
                                        <div className="product-name">
                                            <h4>Cutting Pliers</h4>
                                            <p>$75.00</p>
                                        </div>
                                        <div className="product-select">
                                            <Link href="wishlist" className="thm-btn wishlist-page__btn"> <span></span>
                                                Select Product</Link>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="cross-icon">
                                        <i className="icon-plus remove-icon"></i>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="product-box">
                                        <div className="img-box">
                                            <img src="assets/images/shop/wishlist-page-img-5.jpg" alt="Image"/>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="product-name-select-box">
                                        <div className="product-name">
                                            <h4>Air conditioners Repair</h4>
                                            <p>$85.00</p>
                                        </div>
                                        <div className="product-select">
                                            <Link href="wishlist" className="thm-btn wishlist-page__btn"> <span></span>
                                                Select Product</Link>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="cross-icon">
                                        <i className="icon-plus remove-icon"></i>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="product-box">
                                        <div className="img-box">
                                            <img src="assets/images/shop/wishlist-page-img-6.jpg" alt="Image"/>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="product-name-select-box">
                                        <div className="product-name">
                                            <h4>Instruments with toolbox</h4>
                                            <p>$80.00</p>
                                        </div>
                                        <div className="product-select">
                                            <Link href="wishlist" className="thm-btn wishlist-page__btn"> <span></span>
                                                Select Product</Link>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="cross-icon">
                                        <i className="icon-plus remove-icon"></i>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="product-box">
                                        <div className="img-box">
                                            <img src="assets/images/shop/wishlist-page-img-7.jpg" alt="Image"/>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="product-name-select-box">
                                        <div className="product-name">
                                            <h4>Electric screwdriver</h4>
                                            <p>$50.00</p>
                                        </div>
                                        <div className="product-select">
                                            <Link href="wishlist" className="thm-btn wishlist-page__btn"> <span></span>
                                                Select Product</Link>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="cross-icon">
                                        <i className="icon-plus remove-icon"></i>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </section>
        {/*Cart Page One End*/}
        </Layout>
        </>
    )
}