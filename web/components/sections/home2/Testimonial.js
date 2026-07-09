'use client'
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import Link from "next/link"

const swiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    slidesPerView: 2,
    spaceBetween: 30,
    
    loop: true,

    // Navigation
    navigation: {
        nextEl: '.srn',
        prevEl: '.srp',
    },

    // Pagination
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        320: {
            slidesPerView: 1,
            
        },
        575: {
            slidesPerView: 1,
            
        },
        767: {
            slidesPerView: 2,
            
        },
        991: {
            slidesPerView: 2,
            
        },
        1199: {
            slidesPerView: 2,
            
        },
        1350: {
            slidesPerView: 2,
            
        },
    }



}

export default function Testimonial() {
    return (
        <>
        {/*Testimonial Two Start */}
        <section className="testimonial-two">
            <div className="container">
                <Swiper {...swiperOptions} className="testimonial-two__carousel owl-theme owl-carousel">
                    <SwiperSlide>
                    {/*Testimonial One Single Start*/}
                    <div className="item">
                        <div className="testimonial-two__single">
                            <div className="testimonial-two__client-info">
                                <div className="testimonial-two__client-img">
                                    <img src="assets/images/testimonial/testimonial-2-1.jpg" alt=""/>
                                    <div className="testimonial-two__quote">
                                        <span className="icon-quote"></span>
                                    </div>
                                </div>
                                <h3><Link href="testimonials">Mitchel Satnar</Link></h3>
                                <p>Manager</p>
                            </div>
                            <p className="testimonial-two__text">The wise man therefore always holds in these design matters
                                to this principle of selection. He rejects pleasures to secure others designers greater
                                pleasures, or else he endures pains to avoid
                                worse pains to the selection point.</p>
                            <div className="testimonial-two__ratting">
                                <span className="fas fa-star"></span>
                                <span className="fas fa-star"></span>
                                <span className="fas fa-star"></span>
                                <span className="fas fa-star"></span>
                                <span className="fas fa-star"></span>
                            </div>
                        </div>
                    </div>
                    {/*Testimonial One Single End*/}
                    </SwiperSlide>
                    <SwiperSlide>
                    {/*Testimonial One Single Start*/}
                    <div className="item">
                        <div className="testimonial-two__single">
                            <div className="testimonial-two__client-info">
                                <div className="testimonial-two__client-img">
                                    <img src="assets/images/testimonial/testimonial-2-2.jpg" alt=""/>
                                    <div className="testimonial-two__quote">
                                        <span className="icon-quote"></span>
                                    </div>
                                </div>
                                <h3><Link href="testimonials">Tom latham</Link></h3>
                                <p>Manager</p>
                            </div>
                            <p className="testimonial-two__text">The wise man therefore always holds in these design matters
                                to this principle of selection. He rejects pleasures to secure others designers greater
                                pleasures, or else he endures pains to avoid
                                worse pains to the selection point.</p>
                            <div className="testimonial-two__ratting">
                                <span className="fas fa-star"></span>
                                <span className="fas fa-star"></span>
                                <span className="fas fa-star"></span>
                                <span className="fas fa-star"></span>
                                <span className="fas fa-star"></span>
                            </div>
                        </div>
                    </div>
                    {/*Testimonial One Single End*/}
                    </SwiperSlide>
                    <SwiperSlide>
                    {/*Testimonial One Single Start*/}
                    <div className="item">
                        <div className="testimonial-two__single">
                            <div className="testimonial-two__client-info">
                                <div className="testimonial-two__client-img">
                                    <img src="assets/images/testimonial/testimonial-2-3.jpg" alt=""/>
                                    <div className="testimonial-two__quote">
                                        <span className="icon-quote"></span>
                                    </div>
                                </div>
                                <h3><Link href="testimonials">Alisha Martin</Link></h3>
                                <p>Manager</p>
                            </div>
                            <p className="testimonial-two__text">The wise man therefore always holds in these design matters
                                to this principle of selection. He rejects pleasures to secure others designers greater
                                pleasures, or else he endures pains to avoid
                                worse pains to the selection point.</p>
                            <div className="testimonial-two__ratting">
                                <span className="fas fa-star"></span>
                                <span className="fas fa-star"></span>
                                <span className="fas fa-star"></span>
                                <span className="fas fa-star"></span>
                                <span className="fas fa-star"></span>
                            </div>
                        </div>
                    </div>
                    {/*Testimonial One Single End*/}
                    </SwiperSlide>
                </Swiper>
            </div>
        </section>
        {/*Testimonial Two End */}
            
        </>
    )
}
