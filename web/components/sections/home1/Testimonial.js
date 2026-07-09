'use client'
import Link from "next/link"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"


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
            slidesPerView: 1,
            
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
        {/*Testimonial One Start */}
        <section className="testimonial-one">
            <div className="container">
                <Swiper {...swiperOptions} className="testimonial-one__carousel owl-theme owl-carousel">
                    <SwiperSlide> 
                    {/*Testimonial One Single Start*/}
                    <div className="item">
                        <div className="testimonial-one__single">
                            <div className="testimonial-one__img">
                                <img src="assets/images/testimonial/testimonial-1-1.jpg" alt=""/>
                            </div>
                            <div className="testimonial-one__content">
                                <div className="testimonial-one__quote">
                                    <span className="icon-quote"></span>
                                </div>
                                <p className="testimonial-one__text">“Adipiscing elit, sed do eiusmod tempor incididunt ut
                                    labored etos dolore magna aliquant. Ut enim ad minim veniam nostrud exercitation
                                    ullamco laboris nisi ut aliquip</p>
                                <div className="testimonial-one__ratting">
                                    <span className="fas fa-star"></span>
                                    <span className="fas fa-star"></span>
                                    <span className="fas fa-star"></span>
                                    <span className="fas fa-star"></span>
                                    <span className="fas fa-star"></span>
                                </div>
                                <div className="testimonial-one__client-info">
                                    <h3><Link href="testimonials">Arlene McCoy</Link></h3>
                                    <p>Co-founder</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Testimonial One Single End*/}
                    </SwiperSlide>
                    <SwiperSlide>  
                    {/*Testimonial One Single Start*/}
                    <div className="item">
                        <div className="testimonial-one__single">
                            <div className="testimonial-one__img">
                                <img src="assets/images/testimonial/testimonial-1-2.jpg" alt=""/>
                            </div>
                            <div className="testimonial-one__content">
                                <div className="testimonial-one__quote">
                                    <span className="icon-quote"></span>
                                </div>
                                <p className="testimonial-one__text">“Adipiscing elit, sed do eiusmod tempor incididunt ut
                                    labored etos dolore magna aliquant. Ut enim ad minim veniam nostrud exercitation
                                    ullamco laboris nisi ut aliquip</p>
                                <div className="testimonial-one__ratting">
                                    <span className="fas fa-star"></span>
                                    <span className="fas fa-star"></span>
                                    <span className="fas fa-star"></span>
                                    <span className="fas fa-star"></span>
                                    <span className="fas fa-star"></span>
                                </div>
                                <div className="testimonial-one__client-info">
                                    <h3><Link href="testimonials">Wade Warrent</Link></h3>
                                    <p>Manager</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Testimonial One Single End*/}
                    </SwiperSlide> 
                    <SwiperSlide> 
                    {/*Testimonial One Single Start*/}
                    <div className="item">
                        <div className="testimonial-one__single">
                            <div className="testimonial-one__img">
                                <img src="assets/images/testimonial/testimonial-1-1.jpg" alt=""/>
                            </div>
                            <div className="testimonial-one__content">
                                <div className="testimonial-one__quote">
                                    <span className="icon-quote"></span>
                                </div>
                                <p className="testimonial-one__text">“Adipiscing elit, sed do eiusmod tempor incididunt ut
                                    labored etos dolore magna aliquant. Ut enim ad minim veniam nostrud exercitation
                                    ullamco laboris nisi ut aliquip</p>
                                <div className="testimonial-one__ratting">
                                    <span className="fas fa-star"></span>
                                    <span className="fas fa-star"></span>
                                    <span className="fas fa-star"></span>
                                    <span className="fas fa-star"></span>
                                    <span className="fas fa-star"></span>
                                </div>
                                <div className="testimonial-one__client-info">
                                    <h3><Link href="testimonials">Arlene McCoy</Link></h3>
                                    <p>Co-founder</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Testimonial One Single End*/}
                    </SwiperSlide>
                    <SwiperSlide>  
                    {/*Testimonial One Single Start*/}
                    <div className="item">
                        <div className="testimonial-one__single">
                            <div className="testimonial-one__img">
                                <img src="assets/images/testimonial/testimonial-1-2.jpg" alt=""/>
                            </div>
                            <div className="testimonial-one__content">
                                <div className="testimonial-one__quote">
                                    <span className="icon-quote"></span>
                                </div>
                                <p className="testimonial-one__text">“Adipiscing elit, sed do eiusmod tempor incididunt ut
                                    labored etos dolore magna aliquant. Ut enim ad minim veniam nostrud exercitation
                                    ullamco laboris nisi ut aliquip</p>
                                <div className="testimonial-one__ratting">
                                    <span className="fas fa-star"></span>
                                    <span className="fas fa-star"></span>
                                    <span className="fas fa-star"></span>
                                    <span className="fas fa-star"></span>
                                    <span className="fas fa-star"></span>
                                </div>
                                <div className="testimonial-one__client-info">
                                    <h3><Link href="testimonials">Wade Warrent</Link></h3>
                                    <p>Manager</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Testimonial One Single End*/}
                    </SwiperSlide>
                </Swiper> 
            </div>
        </section>
        {/*Testimonial One End */}
       

            
        </>
    )
}
