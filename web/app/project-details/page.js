'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

function ProjectDetailsRedirect() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    useEffect(() => {
        let cancelled = false

        async function redirect() {
            if (!id) {
                router.replace('/projects')
                return
            }

            try {
                const res = await fetch(`${API_URL}/api/projects/items/${id}`)
                if (cancelled) return

                if (res.ok) {
                    const data = await res.json()
                    if (data.project?.slug) {
                        router.replace(`/projects/${data.project.slug}`)
                        return
                    }
                }
            } catch {
                // Fall through to list page
            }

            if (!cancelled) {
                router.replace('/projects')
            }
        }

        redirect()
        return () => {
            cancelled = true
        }
    }, [id, router])

    return (
        <section className="project-details">
            <div className="container">
                <p className="mb-0">Redirecting...</p>
            </div>
        </section>
    )
}

export default function ProjectDetailsRedirectPage() {
    return (
        <Suspense fallback={(
            <section className="project-details">
                <div className="container">
                    <p className="mb-0">Redirecting...</p>
                </div>
            </section>
        )}>
            <ProjectDetailsRedirect />
        </Suspense>
    )
}
