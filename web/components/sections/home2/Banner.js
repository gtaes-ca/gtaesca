
'use client'
import Link from "next/link"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const swiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    slidesPerView: 1,
    spaceBetween: 0,
    
    loop: true,

    // Navigation
    navigation: {
        nextEl: '.h1n',
        prevEl: '.h1p',
    },

    // Pagination
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },



}

export default function Banner() {
    return (
        <>

        {/* Main Slider Two Start */}
        <section className="main-slider-two">
            <Swiper {...swiperOptions} className="main-slider-two__carousel owl-carousel owl-theme">
                <SwiperSlide>
                <div className="item">
                    <div className="main-slider-two__shape-1"></div>
                    <div className="main-slider-two__shape-2"></div>
                    <div className="main-slider-two__img-box">
                        <div className="main-slider-two__img-box-inner">
                            <div className="main-slider-two__img">
                                <img src="assets/images/resources/main-slider-two-img-1-1.jpg" alt=""/>
                            </div>
                        </div>
                    </div>
                    <div className="main-slider-two__small-img">
                        <img src="assets/images/resources/main-slider-two-small-img-1-1.jpg" alt=""/>
                    </div>
                    <div className="container">
                        <div className="main-slider-two__content">
                            <div className="main-slider-two__sub-title-box">
                                <p className="main-slider-two__sub-title">Best Repairs</p>
                            </div>
                            <h2 className="main-slider-two__title">Cooling Comfort <br/> One Repair at Time <br/>
                                In Your Home</h2>
                            <p className="main-slider-two__text">We have been operating for over a decade, providing
                                top-notch services We have been <br/> operating for over a decade lenitive antique
                                corrupt quo quad molestation</p>
                            <div className="main-slider-two__btn-box">
                                <Link href="about" className="main-slider-two__btn thm-btn">More About Us</Link>
                            </div>
                        </div>
                    </div>
                </div>
                </SwiperSlide>
                <SwiperSlide>
                <div className="item">
                    <div className="main-slider-two__shape-1"></div>
                    <div className="main-slider-two__shape-2"></div>
                    <div className="main-slider-two__img-box">
                        <div className="main-slider-two__img-box-inner">
                            <div className="main-slider-two__img">
                                <img src="assets/images/resources/main-slider-two-img-1-2.jpg" alt=""/>
                            </div>
                        </div>
                    </div>
                    <div className="main-slider-two__small-img">
                        <img src="assets/images/resources/main-slider-two-small-img-1-2.jpg" alt=""/>
                    </div>
                    <div className="container">
                        <div className="main-slider-two__content">
                            <div className="main-slider-two__sub-title-box">
                                <p className="main-slider-two__sub-title">Best Repairs</p>
                            </div>
                            <h2 className="main-slider-two__title">Cooling Comfort <br/> One Repair at Time <br/>
                                In Your Home</h2>
                            <p className="main-slider-two__text">We have been operating for over a decade, providing
                                top-notch services We have been <br/> operating for over a decade lenitive antique
                                corrupt quo quad molestation</p>
                            <div className="main-slider-two__btn-box">
                                <Link href="about" className="main-slider-two__btn thm-btn">More About Us</Link>
                            </div>
                        </div>
                    </div>
                </div>
                </SwiperSlide>
                <SwiperSlide>
                <div className="item">
                    <div className="main-slider-two__shape-1"></div>
                    <div className="main-slider-two__shape-2"></div>
                    <div className="main-slider-two__img-box">
                        <div className="main-slider-two__img-box-inner">
                            <div className="main-slider-two__img">
                                <img src="assets/images/resources/main-slider-two-img-1-3.jpg" alt=""/>
                            </div>
                        </div>
                    </div>
                    <div className="main-slider-two__small-img">
                        <img src="assets/images/resources/main-slider-two-small-img-1-3.jpg" alt=""/>
                    </div>
                    <div className="container">
                        <div className="main-slider-two__content">
                            <div className="main-slider-two__sub-title-box">
                                <p className="main-slider-two__sub-title">Best Repairs</p>
                            </div>
                            <h2 className="main-slider-two__title">Cooling Comfort <br/> One Repair at Time <br/>
                                In Your Home</h2>
                            <p className="main-slider-two__text">We have been operating for over a decade, providing
                                top-notch services We have been <br/> operating for over a decade lenitive antique
                                corrupt quo quad molestation</p>
                            <div className="main-slider-two__btn-box">
                                <Link href="about" className="main-slider-two__btn thm-btn">More About Us</Link>
                            </div>
                        </div>
                    </div>
                </div>
                </SwiperSlide>
            </Swiper>
        </section>
        {/*Main Slider Start */}
       



        </>
    )
}
