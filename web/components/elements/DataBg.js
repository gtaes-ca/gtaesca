import { useEffect } from 'react'

export default function DataBg() {
    useEffect(() => {
        const elements = document.querySelectorAll('[data-bg]')

        elements.forEach((element) => {
            element.style.backgroundImage = `url(${element.getAttribute('data-bg')})`
            element.classList.add('has-bg-overlay')
            const position = window.getComputedStyle(element).position
            if (position === 'static') {
                element.style.position = 'relative'
            }
        })
    }, [])
    return (
        <>

        </>
    )
}
