'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { DEFAULT_TOPBAR, fetchTopbarContent, resolveCmsAssetUrl, hasGalleryImage } from '@/lib/cms'
import ProjectDetailsBanner from '@/components/sections/projects/ProjectDetailsBanner'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function ProjectDetailView({ projectSlug }) {
    const [project, setProject] = useState(null)
    const [topbar, setTopbar] = useState(DEFAULT_TOPBAR)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        let cancelled = false

        async function loadTopbar() {
            const content = await fetchTopbarContent()
            if (!cancelled) {
                setTopbar(content)
            }
        }

        loadTopbar()
        return () => {
            cancelled = true
        }
    }, [])

    useEffect(() => {
        let cancelled = false

        async function loadProject() {
            if (!projectSlug) {
                setNotFound(true)
                setLoading(false)
                return
            }

            setLoading(true)
            setNotFound(false)

            try {
                const res = await fetch(`${API_URL}/api/projects/slug/${encodeURIComponent(projectSlug)}`)
                if (cancelled) return

                if (res.status === 404) {
                    setProject(null)
                    setNotFound(true)
                    return
                }

                if (!res.ok) {
                    setProject(null)
                    setNotFound(true)
                    return
                }

                const data = await res.json()
                setProject(data.project || null)
                setNotFound(!data.project)
            } catch {
                if (!cancelled) {
                    setProject(null)
                    setNotFound(true)
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        loadProject()
        return () => {
            cancelled = true
        }
    }, [projectSlug])

    if (loading) {
        return (
            <>
                <ProjectDetailsBanner />
                <section className="project-details">
                    <div className="container">
                        <p className="mb-0">Loading project...</p>
                    </div>
                </section>
            </>
        )
    }

    if (notFound || !project) {
        return (
            <>
                <ProjectDetailsBanner projectTitle="Project Not Found" />
                <section className="project-details">
                    <div className="container">
                        <p className="mb-3">This project could not be found.</p>
                        <Link href="/projects" className="thm-btn">Back to Projects</Link>
                    </div>
                </section>
            </>
        )
    }

    const imageUrl = hasGalleryImage(project.image) ? resolveCmsAssetUrl(project.image) : ''
    const hasSidebarInfo = project.client || project.subTitle || project.date || project.location

    return (
        <>
            <ProjectDetailsBanner projectTitle={project.title} />
            <section className="project-details">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-8 col-lg-7">
                            <div className="project-details__left">
                                {imageUrl ? (
                                    <div className="project-details__img">
                                        <img src={imageUrl} alt={project.title}/>
                                    </div>
                                ) : null}
                                {project.text ? (
                                    <>
                                        <h3 className="project-details__title-1">About The Project Overview</h3>
                                        <p className="project-details__text-1">{project.text}</p>
                                    </>
                                ) : null}
                                {project.challengeText ? (
                                    <>
                                        <h3 className="project-details__title-2">The Project Challenge</h3>
                                        <p className="project-details__text-2">{project.challengeText}</p>
                                    </>
                                ) : null}
                                {project.resultText ? (
                                    <>
                                        <h3 className="project-details__title-3">The Result Of Our Project</h3>
                                        <p className="project-details__text-4">{project.resultText}</p>
                                    </>
                                ) : null}
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-5">
                            <div className="project-details__sidebar">
                                {hasSidebarInfo ? (
                                    <div className="project-details__information">
                                        <h3 className="project-details__information-title">Project Information</h3>
                                        <ul className="project-details__information-list list-unstyled">
                                            {project.client ? (
                                                <li>
                                                    <h4>Client :</h4>
                                                    <p>{project.client}</p>
                                                </li>
                                            ) : null}
                                            {project.subTitle ? (
                                                <li>
                                                    <h4>Category :</h4>
                                                    <p>{project.subTitle}</p>
                                                </li>
                                            ) : null}
                                            {project.date ? (
                                                <li>
                                                    <h4>date :</h4>
                                                    <p>{project.date}</p>
                                                </li>
                                            ) : null}
                                            {project.location ? (
                                                <li>
                                                    <h4>location :</h4>
                                                    <p>{project.location}</p>
                                                </li>
                                            ) : null}
                                        </ul>
                                    </div>
                                ) : null}
                                <div className="project-details__get-started">
                                    <h3 className="project-details__get-started-title">Get Started Today</h3>
                                    <ul className="project-details__get-started-points list-unstyled">
                                        {topbar.phone ? (
                                            <li>
                                                <div className="icon">
                                                    <span className="icon-call"></span>
                                                </div>
                                                <p><Link href={`tel:${String(topbar.phone).replace(/[^\d+]/g, '')}`}>{topbar.phone}</Link></p>
                                            </li>
                                        ) : null}
                                        {topbar.email ? (
                                            <li>
                                                <div className="icon">
                                                    <span className="icon-envelope"></span>
                                                </div>
                                                <p><Link href={`mailto:${topbar.email}`}>{topbar.email}</Link></p>
                                            </li>
                                        ) : null}
                                        {topbar.address ? (
                                            <li>
                                                <div className="icon">
                                                    <span className="icon-location"></span>
                                                </div>
                                                <p>{topbar.address}</p>
                                            </li>
                                        ) : null}
                                    </ul>
                                    <div className="project-details__get-started-btn-box">
                                        <Link href="/contact" className="project-details__get-started-btn thm-btn">get in touch</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
