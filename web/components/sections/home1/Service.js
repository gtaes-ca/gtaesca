'use client'

import Link from "next/link"
import { useEffect, useState } from 'react'
import { resolveCmsAssetUrl } from '@/lib/cms'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function Service() {
    const [items, setItems] = useState([])

    useEffect(() => {
        let cancelled = false

        async function loadServices() {
            try {
                const res = await fetch(`${API_URL}/api/web-content/home/services`)
                if (!res.ok) return
                const data = await res.json()
                if (cancelled) return
                if (Array.isArray(data.content?.items)) {
                    setItems(data.content.items)
                }
            } catch {
                // leave empty on failure
            }
        }

        loadServices()
        return () => {
            cancelled = true
        }
    }, [])

    return (
        <>
        {/*Services One Start */}
        <section className="services-one">
            <div className="container">
                <div className="services-one__inner">
                    <ul className="services-one__service-list list-unstyled">
                        {items.slice(0, 3).map((item, index) => (
                            <li
                                key={`${item.title}-${index}`}
                                className={index === 0 ? "wow fadeInLeft" : index === 1 ? "wow fadeInUp" : "wow fadeInRight"}
                                data-wow-delay={`${(index + 1) * 100}ms`}
                            >
                                <div className="services-one__single">
                                    <div className={`services-one__icon ${item.image ? 'services-one__icon--image' : ''}`}>
                                        {item.image ? (
                                            <img
                                                src={resolveCmsAssetUrl(item.image)}
                                                alt={item.title || 'Service feature'}
                                                className="services-one__icon-image"
                                            />
                                        ) : (
                                            <span className="icon-like"></span>
                                        )}
                                    </div>
                                    <h3 className="services-one__title"><Link href={item.link}>{item.title}</Link></h3>
                                    <p className="services-one__text">{item.text}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
       {/*Services One End */}
    
        </>
    )
}
