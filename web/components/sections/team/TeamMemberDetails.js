'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { resolveCmsAssetUrl } from '@/lib/cms'
import TeamDetailsBanner from '@/components/sections/team/TeamDetailsBanner'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const FALLBACK_IMAGE = 'assets/images/team/team-details-img-1.jpg'

export default function TeamMemberDetails() {
    const searchParams = useSearchParams()
    const memberId = searchParams.get('id')
    const [member, setMember] = useState(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        let cancelled = false

        async function loadMember() {
            if (!memberId) {
                setNotFound(true)
                setLoading(false)
                return
            }

            setLoading(true)
            setNotFound(false)

            try {
                const res = await fetch(`${API_URL}/api/team/members/${memberId}`)
                if (cancelled) return

                if (res.status === 404) {
                    setMember(null)
                    setNotFound(true)
                    return
                }

                if (!res.ok) {
                    setMember(null)
                    setNotFound(true)
                    return
                }

                const data = await res.json()
                setMember(data.member || null)
                setNotFound(!data.member)
            } catch {
                if (!cancelled) {
                    setMember(null)
                    setNotFound(true)
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        loadMember()
        return () => {
            cancelled = true
        }
    }, [memberId])

    if (loading) {
        return (
            <>
                <TeamDetailsBanner />
                <section className="team-details">
                    <div className="container">
                        <p className="mb-0">Loading team member...</p>
                    </div>
                </section>
            </>
        )
    }

    if (notFound || !member) {
        return (
            <>
                <TeamDetailsBanner memberName="Member Not Found" />
                <section className="team-details">
                    <div className="container">
                        <p className="mb-3">This team member could not be found.</p>
                        <Link href="/team" className="thm-btn">Back to Team</Link>
                    </div>
                </section>
            </>
        )
    }

    const imageUrl = resolveCmsAssetUrl(member.profileImageUrl) || FALLBACK_IMAGE
    const experienceLabel = member.yearsExperience > 0
        ? `${member.yearsExperience}+ years of experience`
        : null

    return (
        <>
            <TeamDetailsBanner memberName={member.fullName} />
            <section className="team-details">
                <div className="container">
                    <div className="team-details__inner">
                        <div className="row">
                            <div className="col-xl-5 col-lg-5">
                                <div className="team-details__left">
                                    <div className="team-details__img">
                                        <img src={imageUrl} alt={member.fullName}/>
                                    </div>
                                    {(member.email || member.phone) ? (
                                        <div className="team-details__contact-box">
                                            <h3 className="team-details__contact-title">Contact info</h3>
                                            <ul className="team-details__contact-list list-unstyled">
                                                {member.email ? (
                                                    <li>
                                                        <div className="icon">
                                                            <span className="icon-envelope"></span>
                                                        </div>
                                                        <p>
                                                            <Link href={`mailto:${member.email}`}>{member.email}</Link>
                                                        </p>
                                                    </li>
                                                ) : null}
                                                {member.phone ? (
                                                    <li>
                                                        <div className="icon">
                                                            <span className="icon-phone-call"></span>
                                                        </div>
                                                        <p>
                                                            <Link href={`tel:${member.phone}`}>{member.phone}</Link>
                                                        </p>
                                                    </li>
                                                ) : null}
                                            </ul>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="col-xl-7 col-lg-7">
                                <div className="team-details__right">
                                    <h3 className="team-details__title-1">{member.fullName}</h3>
                                    <p className="team-details__sub-title">{member.title}</p>
                                    {experienceLabel ? (
                                        <p className="team-details__experience">{experienceLabel}</p>
                                    ) : null}
                                    {member.bio ? (
                                        <p className="team-details__text-1">{member.bio}</p>
                                    ) : null}
                                    {member.expertise?.length ? (
                                        <>
                                            <h3 className="team-details__title-2">Professional Skills</h3>
                                            <ul className="team-details__skills-list list-unstyled">
                                                {member.expertise.map((item) => (
                                                    <li key={`${item.categoryName}-${item.name}`}>
                                                        <span className="team-details__skills-category">{item.categoryName}</span>
                                                        <span className="team-details__skills-name">{item.name}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    ) : null}
                                    {member.certifications ? (
                                        <>
                                            <h3 className="team-details__title-2">Certifications</h3>
                                            <p className="team-details__text-2">{member.certifications}</p>
                                        </>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
