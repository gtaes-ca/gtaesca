'use client'
export default function Process() {
    return (
        <>
        
        {/*Process One Start*/}
        <section className="process-one">
            <div className="process-one__bg jarallax" style={{ backgroundImage: 'url(assets/images/backgrounds/process-one-bg.jpg)' }} >
            </div>
            <div className="container">
                <div className="section-title-three text-center sec-title-animation animation-style1">
                    <div className="section-title-three__tagline-box justify-content-center">
                        <div className="section-title-three__tagline-shape"></div>
                        <span className="section-title-three__tagline">Working Process</span>
                        <div className="section-title-three__tagline-shape"></div>
                    </div>
                    <h2 className="section-title-three__title title-animation">See our 4 easy steps how
                        we works</h2>
                </div>
                <div className="row">
                    {/*Process One Single Start*/}
                    <div className="col-xl-3 col-lg-6 col-md-6">
                        <div className="process-one__single">
                            <div className="process-one__icon">
                                <span className="icon-ac1"></span>
                                <div className="process-one__count-box"></div>
                            </div>
                            <h3 className="process-one__title">Damage Device</h3>
                        </div>
                    </div>
                    {/*Process One Single End*/}
                    {/*Process One Single Start*/}
                    <div className="col-xl-3 col-lg-6 col-md-6">
                        <div className="process-one__single">
                            <div className="process-one__icon">
                                <span className="icon-send"></span>
                                <div className="process-one__count-box"></div>
                            </div>
                            <h3 className="process-one__title">Send it to Us</h3>
                        </div>
                    </div>
                    {/*Process One Single End*/}
                    {/*Process One Single Start*/}
                    <div className="col-xl-3 col-lg-6 col-md-6">
                        <div className="process-one__single">
                            <div className="process-one__icon">
                                <span className="icon-setting"></span>
                                <div className="process-one__count-box"></div>
                            </div>
                            <h3 className="process-one__title">Repair Device</h3>
                        </div>
                    </div>
                    {/*Process One Single End*/}
                    {/*Process One Single Start*/}
                    <div className="col-xl-3 col-lg-6 col-md-6">
                        <div className="process-one__single">
                            <div className="process-one__icon">
                                <span className="icon-services"></span>
                                <div className="process-one__count-box"></div>
                            </div>
                            <h3 className="process-one__title">Quick Return</h3>
                        </div>
                    </div>
                    {/*Process One Single End*/}
                </div>
            </div>
        </section>
        {/*Process One End*/}
        </>
    )
}
