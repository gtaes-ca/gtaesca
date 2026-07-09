
'use client'
import Link from "next/link"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const swiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    slidesPerView: 1,
    spaceBetween: 0,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
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
        <section className="main-slider-three">
            <Swiper {...swiperOptions} className="main-slider-three__carousel owl-carousel owl-theme">
                <SwiperSlide>
                <div className="item">
                    <div className="main-slider-three__bg"
                        style={{ backgroundImage: 'url(assets/images/backgrounds/slider-3-1.jpg)' }} >
                    </div>
                    <div className="main-slider-three__shape-1">
                        <img src="assets/images/shapes/main-slider-three-shape-1.png" alt=""/>
                    </div>
                    <div className="main-slider-three__shape-2">
                        <img src="assets/images/shapes/main-slider-three-shape-2.png" alt=""/>
                    </div>
                    <div className="main-slider-three__shape-3">
                        <img src="assets/images/shapes/main-slider-three-shape-3.png" alt="" className="img-bounce" />
                    </div>
                    <div className="container">
                        <div className="main-slider-three__content">
                            <div className="main-slider-three__sub-title-box">
                                <p className="main-slider-three__sub-title">Best Repairs</p>
                            </div>
                            <h2 className="main-slider-three__title">We Are Experts At <br/> Cell Phone Repair!</h2>
                            <p className="main-slider-three__text">We have been operating for over a decade, providing
                                top-notch services We have been <br/> operating for over a decade lenitive antique
                                corrupt quo quad molestation</p>
                            <div className="main-slider-three__btn-box">
                                <Link href="services" className="main-slider-three__btn thm-btn">Repair My Device</Link>
                            </div>
                        </div>
                    </div>
                </div>
                </SwiperSlide>
                <SwiperSlide>
                <div className="item">
                    <div className="main-slider-three__bg"
                        style={{ backgroundImage: 'url(assets/images/backgrounds/slider-3-2.jpg)' }} >
                    </div>
                    <div className="main-slider-three__shape-1">
                        <img src="assets/images/shapes/main-slider-three-shape-1.png" alt=""/>
                    </div>
                    <div className="main-slider-three__shape-2">
                        <img src="assets/images/shapes/main-slider-three-shape-2.png" alt=""/>
                    </div>
                    <div className="main-slider-three__shape-3">
                        <img src="assets/images/shapes/main-slider-three-shape-3.png" alt="" className="img-bounce" />
                    </div>
                    <div className="container">
                        <div className="main-slider-three__content">
                            <div className="main-slider-three__sub-title-box">
                                <p className="main-slider-three__sub-title">Best Repairs</p>
                            </div>
                            <h2 className="main-slider-three__title">We Are Experts At <br/> Cell Phone Repair!</h2>
                            <p className="main-slider-three__text">We have been operating for over a decade, providing
                                top-notch services We have been <br/> operating for over a decade lenitive antique
                                corrupt quo quad molestation</p>
                            <div className="main-slider-three__btn-box">
                                <Link href="services" className="main-slider-three__btn thm-btn">Repair My Device</Link>
                            </div>
                        </div>
                    </div>
                </div>
                </SwiperSlide>
                <SwiperSlide>
                <div className="item">
                    <div className="main-slider-three__bg"
                        style={{ backgroundImage: 'url(assets/images/backgrounds/slider-3-3.jpg)' }} >
                    </div>
                    <div className="main-slider-three__shape-1">
                        <img src="assets/images/shapes/main-slider-three-shape-1.png" alt=""/>
                    </div>
                    <div className="main-slider-three__shape-2">
                        <img src="assets/images/shapes/main-slider-three-shape-2.png" alt=""/>
                    </div>
                    <div className="main-slider-three__shape-3">
                        <img src="assets/images/shapes/main-slider-three-shape-3.png" alt="" className="img-bounce" />
                    </div>
                    <div className="container">
                        <div className="main-slider-three__content">
                            <div className="main-slider-three__sub-title-box">
                                <p className="main-slider-three__sub-title">Best Repairs</p>
                            </div>
                            <h2 className="main-slider-three__title">We Are Experts At <br/> Cell Phone Repair!</h2>
                            <p className="main-slider-three__text">We have been operating for over a decade, providing
                                top-notch services We have been <br/> operating for over a decade lenitive antique
                                corrupt quo quad molestation</p>
                            <div className="main-slider-three__btn-box">
                                <Link href="services" className="main-slider-three__btn thm-btn">Repair My Device</Link>
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
