'use client'
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"


const swiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    slidesPerView: 5,
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
            slidesPerView: 2,
            
        },
        767: {
            slidesPerView: 3,
            
        },
        991: {
            slidesPerView: 3,
            
        },
        1199: {
            slidesPerView: 5,
            
        },
        1350: {
            slidesPerView: 5,
            
        },
    }



}



export default function Brand() {
    return (
        <>

        {/*Brand One Start*/}
        <section className="brand-one">
            <div className="container">
                <div className="brand-one__inner">
                    <Swiper {...swiperOptions} className="brand-one__carousel owl-theme owl-carousel">
                        <SwiperSlide>
                        {/*Brand One Single*/}
                        <div className="brand-one__single">
                            <div className="brand-one__img">
                                <img src="assets/images/brand/brand-1-1.png" alt=""/>
                            </div>
                        </div>
                        </SwiperSlide>
                        <SwiperSlide>
                        {/*Brand One Single*/}
                        <div className="brand-one__single">
                            <div className="brand-one__img">
                                <img src="assets/images/brand/brand-1-2.png" alt=""/>
                            </div>
                        </div>
                        </SwiperSlide>
                        <SwiperSlide>
                        {/*Brand One Single*/}
                        <div className="brand-one__single">
                            <div className="brand-one__img">
                                <img src="assets/images/brand/brand-1-3.png" alt=""/>
                            </div>
                        </div>
                        </SwiperSlide>
                        <SwiperSlide>
                        {/*Brand One Single*/}
                        <div className="brand-one__single">
                            <div className="brand-one__img">
                                <img src="assets/images/brand/brand-1-4.png" alt=""/>
                            </div>
                        </div>
                        </SwiperSlide>
                        <SwiperSlide>
                        {/*Brand One Single*/}
                        <div className="brand-one__single">
                            <div className="brand-one__img">
                                <img src="assets/images/brand/brand-1-5.png" alt=""/>
                            </div>
                        </div>
                        </SwiperSlide>
                        <SwiperSlide>
                        {/*Brand One Single*/}
                        <div className="brand-one__single">
                            <div className="brand-one__img">
                                <img src="assets/images/brand/brand-1-1.png" alt=""/>
                            </div>
                        </div>
                        </SwiperSlide>
                        <SwiperSlide>
                        {/*Brand One Single*/}
                        <div className="brand-one__single">
                            <div className="brand-one__img">
                                <img src="assets/images/brand/brand-1-2.png" alt=""/>
                            </div>
                        </div>
                        </SwiperSlide>
                        <SwiperSlide>
                        {/*Brand One Single*/}
                        <div className="brand-one__single">
                            <div className="brand-one__img">
                                <img src="assets/images/brand/brand-1-3.png" alt=""/>
                            </div>
                        </div>
                        </SwiperSlide>
                        <SwiperSlide>
                        {/*Brand One Single*/}
                        <div className="brand-one__single">
                            <div className="brand-one__img">
                                <img src="assets/images/brand/brand-1-4.png" alt=""/>
                            </div>
                        </div>
                        </SwiperSlide>
                        <SwiperSlide>
                        {/*Brand One Single*/}
                        <div className="brand-one__single">
                            <div className="brand-one__img">
                                <img src="assets/images/brand/brand-1-5.png" alt=""/>
                            </div>
                        </div>
                        </SwiperSlide>
                    </Swiper>
                    {/* If we need navigation buttons */}
                </div>
            </div>
        </section>
        {/*Brand One End*/}
        
        </>
    )
}
