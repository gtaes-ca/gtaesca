'use client'
import Isotope from "isotope-layout"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"

export default function PortfolioFilter() {
    // Isotope
    const isotope = useRef()
    const [filterKey, setFilterKey] = useState("*")
    useEffect(() => {
        setTimeout(() => {
            isotope.current = new Isotope(".filter-layout", {
                itemSelector: ".masonry-item",
                // layoutMode: "fitRows",
                percentPosition: true,
                masonry: {
                    columnWidth: ".masonry-item",
                },
                animationOptions: {
                    duration: 750,
                    easing: "linear",
                    queue: false,
                },
            })
        }, 1000)
    }, [])
    useEffect(() => {
        if (isotope.current) {
            filterKey === "*"
                ? isotope.current.arrange({ filter: `*` })
                : isotope.current.arrange({ filter: `.${filterKey}` })
        }
    }, [filterKey])
    const handleFilterKeyChange = useCallback((key) => () => {
        setFilterKey(key)
    },
        []
    )

    const activeBtn = (value) => (value === filterKey ? "filter active" : "filter")



    return (
        <>

            <div className="project-two__filter-box">
                <ul className="project-two__filter style1 post-filter list-unstyled clearfix">
                    <li className={activeBtn("*")} onClick={handleFilterKeyChange("*")}><span className="filter-text">All</span></li>
                    <li className={activeBtn("cat-1")} onClick={handleFilterKeyChange("cat-1")}><span className="filter-text">Installation</span></li>
                    <li className={activeBtn("cat-2")} onClick={handleFilterKeyChange("cat-2")}><span className="filter-text">Cleaning</span></li>
                    <li className={activeBtn("cat-3")} onClick={handleFilterKeyChange("cat-3")}><span className="filter-text">Repair</span></li>
                    <li className={activeBtn("cat-4")} onClick={handleFilterKeyChange("cat-4")}><span className="filter-text">Testing</span></li>
                </ul>
            </div>
            <div className="row filter-layout">
                
                {/*Project Two Single Start*/}
                <div className="col-xl-6 col-lg-6 col-md-6 masonry-item all cat-1">
                    <div className="project-two__single">
                        <div className="project-two__img-box">
                            <div className="project-two__img">
                                <img src="assets/images/project/project-2-1.jpg" alt=""/>
                                <div className="project-two__arrow">
                                    <Link href="assets/images/project/project-2-1.jpg" className="img-popup"><span
                                            className="icon-arrow-right"></span></Link>
                                </div>
                            </div>
                            <div className="project-two__content">
                                <p className="project-two__sub-title">cleaning service</p>
                                <h3 className="project-two__title"><Link href="project-details">A/C Installation</Link>
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
                {/*Project Two Single End*/}
                {/*Project Two Single Start*/}
                <div className="col-xl-6 col-lg-6 col-md-6 masonry-item all cat-2">
                    <div className="project-two__single">
                        <div className="project-two__img-box">
                            <div className="project-two__img">
                                <img src="assets/images/project/project-2-2.jpg" alt=""/>
                                <div className="project-two__arrow">
                                    <Link href="assets/images/project/project-2-1.jpg" className="img-popup"><span
                                            className="icon-arrow-right"></span></Link>
                                </div>
                            </div>
                            <div className="project-two__content">
                                <p className="project-two__sub-title">cleaning service</p>
                                <h3 className="project-two__title"><Link href="project-details">Heating Service</Link>
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
                {/*Project Two Single End*/}
                {/*Project Two Single Start*/}
                <div className="col-xl-6 col-lg-6 col-md-6 masonry-item all cat-3">
                    <div className="project-two__single">
                        <div className="project-two__img-box">
                            <div className="project-two__img">
                                <img src="assets/images/project/project-2-3.jpg" alt=""/>
                                <div className="project-two__arrow">
                                    <Link href="assets/images/project/project-2-1.jpg" className="img-popup"><span
                                            className="icon-arrow-right"></span></Link>
                                </div>
                            </div>
                            <div className="project-two__content">
                                <p className="project-two__sub-title">cleaning service</p>
                                <h3 className="project-two__title"><Link href="project-details">A/C Dust Cleaning</Link>
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
                {/*Project Two Single End*/}
                {/*Project Two Single Start*/}
                <div className="col-xl-6 col-lg-6 col-md-6 masonry-item all cat-4">
                    <div className="project-two__single">
                        <div className="project-two__img-box">
                            <div className="project-two__img">
                                <img src="assets/images/project/project-2-4.jpg" alt=""/>
                                <div className="project-two__arrow">
                                    <Link href="assets/images/project/project-2-1.jpg" className="img-popup"><span
                                            className="icon-arrow-right"></span></Link>
                                </div>
                            </div>
                            <div className="project-two__content">
                                <p className="project-two__sub-title">cleaning service</p>
                                <h3 className="project-two__title"><Link href="project-details">Awesome
                                        Service</Link>
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
                {/*Project Two Single End*/}
            </div>
        </>
    )
}
