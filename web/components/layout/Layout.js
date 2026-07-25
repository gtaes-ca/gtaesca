
'use client'
import { useEffect, useState } from "react"
import BackToTop from '../elements/BackToTop'
import DataBg from "../elements/DataBg"
import SectionReveal from "../elements/SectionReveal"
import Breadcrumb from './Breadcrumb'
import Sidebar from "./Sidebar"
import Header1 from "./header/Header1"
import Header2 from './header/Header2'
import Header3 from "./header/Header3"
import Footer1 from './footer/Footer1'
import Footer2 from './footer/Footer2'
import Footer3 from "./footer/Footer3"
import Footer4 from "./footer/Footer4"

export default function Layout({ headerStyle, footerStyle, headTitle, breadcrumbTitle, children, wrapperCls }) {
    const [scroll, setScroll] = useState(0)
    // Mobile Menu
    const [isMobileMenu, setMobileMenu] = useState(false)
    const handleMobileMenu = () => {
        setMobileMenu(!isMobileMenu)
        !isMobileMenu ? document.body.classList.add("mobile-menu-visible") : document.body.classList.remove("mobile-menu-visible")
    }

    // Sidebar
    const [isSidebar, setSidebar] = useState(false)
    const handleSidebar = () => setSidebar(!isSidebar)

    useEffect(() => {
        const WOW = require('wowjs')
        window.wow = new WOW.WOW({
            live: false
        })
        window.wow.init()

        document.addEventListener("scroll", () => {
            const scrollCheck = window.scrollY > 100
            if (scrollCheck !== scroll) {
                setScroll(scrollCheck)
            }
        })
    }, [])
    return (
        <>
            <DataBg />
            <SectionReveal />
            <div className={`page-wrapper ${wrapperCls ? wrapperCls : ""}`} id="#top">
                {!headerStyle && <Header1 scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isSidebar={isSidebar} handleSidebar={handleSidebar} />}
                {headerStyle == 1 ? <Header1 scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isSidebar={isSidebar} handleSidebar={handleSidebar} /> : null}
                {headerStyle == 2 ? <Header2 scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isSidebar={isSidebar} handleSidebar={handleSidebar} /> : null}
                {headerStyle == 3 ? <Header3 scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isSidebar={isSidebar} handleSidebar={handleSidebar} /> : null}


                <Sidebar isSidebar={isSidebar} handleSidebar={handleSidebar} />

                {breadcrumbTitle && <Breadcrumb breadcrumbTitle={breadcrumbTitle} />}

                {children}

                {!footerStyle && < Footer1 />}
                {footerStyle == 1 ? < Footer1 /> : null}
                {footerStyle == 2 ? < Footer2 /> : null}
                {footerStyle == 3 ? < Footer3 /> : null}
                {footerStyle == 4 ? < Footer4 /> : null}
            </div>
            <BackToTop scroll={scroll} />
        </>
    )
}
