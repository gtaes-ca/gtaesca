// import PortfolioFilter from ""
import dynamic from 'next/dynamic'
const PortfolioFilter = dynamic(() => import('@/components/elements/PortfolioFilter'), {
    ssr: false,
})

export default function Projects() {
    return (
        <>
        {/*Project Two Start */}
        <section className="project-two">
            <div className="container">
                <div className="section-title-two text-center">
                    <div className="section-title-two__tagline-box">
                        <span className="section-title-two__tagline">Our Project</span>
                    </div>
                    <div className="section-title-two__title-box sec-title-animation animation-style1">
                        <h2 className="section-title-two__title title-animation">We Have Completed Our<br/> Commercial
                            Project</h2>
                    </div>
                </div>
                <PortfolioFilter/>
            </div>
        </section>
        {/*Project Two End */}
        </>
    )
}
