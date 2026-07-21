export default function BackToTop({ scroll }) {
    return (
        <>
            {scroll && (
                <a href="#top" className="scroll-to-target scroll-to-top" aria-label="Back to top">
                    <span className="fas fa-angle-up"></span>
                </a>
            )}
        </>
    )
}