'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { resolveCmsAssetUrl } from '@/lib/cms'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const FALLBACK_IMAGE = 'assets/images/team/team-1-1.jpg'

const ANIMATION_DELAYS = ['100ms', '200ms', '300ms', '400ms', '500ms', '600ms']
const ANIMATION_CLASSES = ['fadeInLeft', 'fadeInUp', 'fadeInRight']

export default function TeamGrid() {
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        async function loadMembers() {
            try {
                const res = await fetch(`${API_URL}/api/team/members`)
                if (!res.ok) return
                const data = await res.json()
                if (cancelled) return
                setMembers(Array.isArray(data.members) ? data.members : [])
            } catch {
                if (!cancelled) {
                    setMembers([])
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        loadMembers()
        return () => {
            cancelled = true
        }
    }, [])

    if (loading) {
        return (
            <section className="team-page">
                <div className="container">
                    <p className="text-center mb-0">Loading team members...</p>
                </div>
            </section>
        )
    }

    if (!members.length) {
        return (
            <section className="team-page">
                <div className="container">
                    <p className="text-center mb-0">No team members are available yet.</p>
                </div>
            </section>
        )
    }

    return (
        <section className="team-page">
            <div className="container">
                <div className="row">
                    {members.map((member, index) => {
                        const imageUrl = resolveCmsAssetUrl(member.profileImageUrl) || FALLBACK_IMAGE
                        const animationClass = ANIMATION_CLASSES[index % ANIMATION_CLASSES.length]
                        const animationDelay = ANIMATION_DELAYS[index % ANIMATION_DELAYS.length]

                        return (
                            <div
                                key={member.id}
                                className={`col-xl-4 col-lg-4 col-md-6 wow ${animationClass}`}
                                data-wow-delay={animationDelay}
                            >
                                <div className="team-one__single">
                                    <div className="team-one__img-box">
                                        <div className="team-one__img">
                                            <img src={imageUrl} alt={member.fullName}/>
                                        </div>
                                        <div className="team-one__content">
                                            <h3 className="team-one__title">
                                                <Link href={`/team-details?id=${member.id}`}>{member.fullName}</Link>
                                            </h3>
                                            <p className="team-one__sub-title">{member.title}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
