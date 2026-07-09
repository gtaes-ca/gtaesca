'use client'
import Link from "next/link"
import Layout from "@/components/layout/Layout"

export default function Home() {
    
    return (
        <>
        <Layout headerStyle={2} footerStyle={4} breadcrumbTitle="Cart">
        {/*Cart Page One Start*/}
        <section className="cart-page-one">
            <div className="container">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="cart-page-one-table">
                            <div className="cart-page-one-info">
                                <div className="left"><span>Your Cart:</span> 3 Items</div>
                                <div className="right">Total:<span> 15,797</span></div>
                            </div>

                            <div className="table-outer">

                                <table className="cart-table">
                                    <thead className="cart-header clearfix">
                                        <tr>
                                            <th className="prod-column">Product</th>
                                            <th className="hide-me"></th>
                                            <th>Quantity</th>
                                            <th className="price">Price</th>
                                            <th>Total</th>
                                            <th>Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="prod-column">
                                                <div className="column-box">
                                                    <div className="prod-thumb">
                                                        <Link href="#">
                                                            <img src="assets/images/shop/product-v1-sidebar-1.png"
                                                                alt="Image"/>
                                                        </Link>
                                                    </div>
                                                    <div className="title">
                                                        <h3 className="prod-title">
                                                            Digital multimeter
                                                        </h3>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="qty">
                                                <div className="input-box">
                                                    <input className="quantity-spinner" type="text" name="quantity"/>
                                                </div>
                                            </td>
                                            <td className="price">$23.00</td>
                                            <td className="sub-total">$30.00</td>
                                            <td>
                                                <div className="remove">
                                                    <i className="icon-plus"></i>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className="prod-column">
                                                <div className="column-box">
                                                    <div className="prod-thumb">
                                                        <Link href="#">
                                                            <img src="assets/images/shop/product-v1-sidebar-2.png"
                                                                alt="Image"/>
                                                        </Link>
                                                    </div>
                                                    <div className="title">
                                                        <h3 className="prod-title">
                                                            Air conditioners Repair
                                                        </h3>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="qty">
                                                <div className="input-box">
                                                    <input className="quantity-spinner" type="text" name="quantity"/>
                                                </div>
                                            </td>
                                            <td className="price">$39.00</td>
                                            <td className="sub-total">$117.00</td>
                                            <td>
                                                <div className="remove">
                                                    <i className="icon-plus"></i>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className="prod-column">
                                                <div className="column-box">
                                                    <div className="prod-thumb">
                                                        <Link href="#">
                                                            <img src="assets/images/shop/product-v1-sidebar-3.png"
                                                                alt="Image"/>
                                                        </Link>
                                                    </div>
                                                    <div className="title">
                                                        <h3 className="prod-title">
                                                            Instruments with toolbox
                                                        </h3>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="qty">
                                                <div className="input-box">
                                                    <input className="quantity-spinner" type="text" name="quantity"/>
                                                </div>
                                            </td>
                                            <td className="price">$42.00</td>
                                            <td className="sub-total">$120.00</td>
                                            <td>
                                                <div className="remove">
                                                    <i className="icon-plus"></i>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-12">
                        <div className="cart-page-one-bottom">
                            <div className="row">
                                <div className="col-xl-8 col-lg-6 col-md-6">
                                    <form action="#" className="default-form cart-cupon__form">
                                        <input type="text" placeholder="Enter Coupon Code......"
                                            className="cart-cupon__input"/>
                                        <button className="thm-btn" type="submit"><span></span>Apply
                                            Coupon</button>
                                    </form>
                                </div>
                                <div className="col-xl-4 col-lg-6 col-md-6">
                                    <ul className="cart-total list-unstyled">
                                        <li>
                                            <span>Subtotal</span>
                                            <span>$20.98 USD </span>
                                        </li>
                                        <li>
                                            <span>Shipping Cost</span>
                                            <span>$0.00 USD</span>
                                        </li>
                                        <li>
                                            <span>Total</span>
                                            <span className="cart-total-amount">$20.98 USD</span>
                                        </li>
                                    </ul>
                                    <div className="cart-page__buttons">
                                        <div className="cart-page__buttons-1">
                                            <Link href="cart" className="thm-btn cart-page__btn-1"><span></span>
                                                Update cart</Link>
                                        </div>
                                        <div className="cart-page__buttons-2">
                                            <Link href="checkout" className="thm-btn cart-page__btn-2"> <span></span>
                                                Checkout</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
        {/*Cart Page One End*/}
        </Layout>
        </>
    )
}