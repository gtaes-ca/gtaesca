'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useState } from 'react'
export default function Home() {
    const [isActive, setIsActive] = useState({
        status: false,
        key: 1,
    })

    const handleToggle = (key) => {
        if (isActive.key === key) {
            setIsActive({
                status: false,
            })
        } else {
            setIsActive({
                status: true,
                key,
            })
        }
    }

    return (
        <>
        <Layout headerStyle={2} footerStyle={4} breadcrumbTitle="Checkout">
        {/*Start Checkout Page One*/}
        <section className="checkout-page-one">
            <div className="container">
                <div className="row">

                    <div className="col-xl-6 col-lg-6 col-md-6">
                        <div className="checkout-page-one__details">
                            <div className="checkout-page-one-title">
                                <h3>Billing details</h3>
                            </div>

                            <form className="billing_details_form">
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="billing_input_box">
                                            <div className="select-box">
                                                <select className="wide">
                                                    <option data-display="Select a country">Select a country</option>
                                                    <option value="1">Canada</option>
                                                    <option value="2">England</option>
                                                    <option value="3">Australia</option>
                                                    <option value="3">USA</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xl-6">
                                        <div className="billing_input_box">
                                            <input type="text" name="first_name" placeholder="First name"
                                                required=""/>
                                        </div>
                                    </div>
                                    <div className="col-xl-6">
                                        <div className="billing_input_box">
                                            <input type="text" name="last_name" placeholder="Last name"
                                                required=""/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="billing_input_box">
                                            <input type="text" name="company_name" placeholder="Company"/>
                                        </div>
                                    </div>
                                    <div className="col-xl-12">
                                        <div className="billing_input_box">
                                            <input type="text" name="Address" placeholder="Address"/>
                                        </div>
                                    </div>
                                    <div className="col-xl-12">
                                        <div className="billing_input_box">
                                            <input type="text" name="company_name"
                                                placeholder="Appartment, unit, etc. (optional)"/>
                                        </div>
                                    </div>
                                    <div className="col-xl-12">
                                        <div className="billing_input_box">
                                            <input type="text" name="Town/City" placeholder="Town / City"
                                                required=""/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xl-6">
                                        <div className="billing_input_box">
                                            <input type="text" name="State" placeholder="State" required=""/>
                                        </div>
                                    </div>
                                    <div className="col-xl-6">
                                        <div className="billing_input_box">
                                            <input name="form_zip" type="text" pattern="[0-9]*" placeholder="Zip code"/>
                                        </div>
                                    </div>
                                    <div className="col-xl-6">
                                        <div className="billing_input_box">
                                            <input name="email" type="email" placeholder="Email address"/>
                                        </div>
                                    </div>
                                    <div className="col-xl-6">
                                        <div className="billing_input_box">
                                            <input type="tel" name="form_phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                                required="" placeholder="Phone"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="checked-box">
                                            <input type="checkbox" name="skipper1" id="skipper"/>
                                            <label><span></span>Create an account?</label>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="col-xl-6 col-lg-6 col-md-6">
                        <div className="checkout-page-one__details checkout-page-one__details--2">
                            <div className="checkout-page-one-title">
                                <h3>Ship to a different address</h3>
                            </div>

                            <form className="billing_details_form">
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="billing_input_box">
                                            <div className="select-box">
                                                <select className="wide">
                                                    <option data-display="Select a country">Select a country</option>
                                                    <option value="1">Canada</option>
                                                    <option value="2">England</option>
                                                    <option value="3">Australia</option>
                                                    <option value="3">USA</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xl-6">
                                        <div className="billing_input_box">
                                            <input type="text" name="first_name" placeholder="First name"
                                                required=""/>
                                        </div>
                                    </div>
                                    <div className="col-xl-6">
                                        <div className="billing_input_box">
                                            <input type="text" name="last_name" placeholder="Last name"
                                                required=""/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="billing_input_box">
                                            <input type="text" name="company_name" placeholder="Company"/>
                                        </div>
                                    </div>
                                    <div className="col-xl-12">
                                        <div className="billing_input_box">
                                            <input type="text" name="Address" placeholder="Address"/>
                                        </div>
                                    </div>
                                    <div className="col-xl-12">
                                        <div className="billing_input_box">
                                            <input type="text" name="company_name"
                                                placeholder="Appartment, unit, etc. (optional)"/>
                                        </div>
                                    </div>
                                    <div className="col-xl-12">
                                        <div className="billing_input_box">
                                            <input type="text" name="Town/City" placeholder="Town / City"
                                                required=""/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xl-6">
                                        <div className="billing_input_box">
                                            <input type="text" name="State" placeholder="State" required=""/>
                                        </div>
                                    </div>
                                    <div className="col-xl-6">
                                        <div className="billing_input_box">
                                            <input name="form_zip" type="text" pattern="[0-9]*" placeholder="Zip code"/>
                                        </div>
                                    </div>
                                    <div className="col-xl-6">
                                        <div className="billing_input_box">
                                            <input name="email" type="email" placeholder="Email address"/>
                                        </div>
                                    </div>
                                    <div className="col-xl-6">
                                        <div className="billing_input_box">
                                            <input type="tel" name="form_phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                                required="" placeholder="Phone"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="ship_different_input">
                                            <textarea placeholder="Notes about order"
                                                name="form_order_notes"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>

                <div className="your_order">
                    <div className="title">
                        <h3>Your order</h3>
                    </div>
                    <div className="row">

                        <div className="col-xl-6 col-lg-6 col-md-6">
                            <div className="order_table_box">
                                <table className="order_table_detail">
                                    <thead className="order_table_head">
                                        <tr>
                                            <th>Product</th>
                                            <th className="right">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="pro__title">Product Name</td>
                                            <td className="pro__price">$20.00 USD</td>
                                        </tr>
                                        <tr>
                                            <td className="pro__title">Subtotal</td>
                                            <td className="pro__price">$30.00 USD</td>
                                        </tr>
                                        <tr>
                                            <td className="pro__title">Shipping</td>
                                            <td className="pro__price">$0.00 USD</td>
                                        </tr>
                                        <tr>
                                            <td className="pro__title">Total</td>
                                            <td className="pro__price">$50.00 USD</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="col-xl-6 col-lg-6 col-md-6">
                            <div className="checkout__payment">
                                <ul className="accordion-box-style1">
                                    {/*Start single accordion box*/}
                                    <li className={isActive.key == 1 ? "accordion accordion-block active" : "accordion accordion-block"} onClick={() => handleToggle(1)}>
                                        <div className="accord-btn">
                                            <h4>Direct bank transfer</h4>
                                        </div>
                                        <div className="accord-content">
                                            <div className="text">
                                                <p>
                                                    Make your payment directly into our bank account. Please
                                                    use your Order ID as the payment reference. Your order
                                                    wont be shipped until the funds have cleared.
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                    {/*End single accordion box*/}
                                    {/*Start single accordion box*/}
                                    <li className={isActive.key == 2 ? "accordion accordion-block active" : "accordion accordion-block"} onClick={() => handleToggle(2)}>
                                        <div className="accord-btn">
                                            <h4>Paypal payment</h4>
                                        </div>
                                        <div className="accord-content">
                                            <div className="text">
                                                <p>
                                                    Make your payment directly into our bank account. Please
                                                    use your Order ID as the payment reference. Your order
                                                    wont be shipped until the funds have cleared.
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                    {/*End single accordion box*/}
                                </ul>

                                <div className="text-right">
                                    <Link href="checkout" className="thm-btn"> <span></span> Place your order</Link>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/*End Checkout Page One*/}
        </Layout>
        </>
    )
}