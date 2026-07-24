'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

function ServiceDetailsRedirect() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    useEffect(() => {
        let cancelled = false

        async function redirect() {
            if (!id) {
                router.replace('/residential')
                return
            }

            try {
                const res = await fetch(`${API_URL}/api/services/items/${id}`)
                if (cancelled) return

                if (res.ok) {
                    const data = await res.json()
                    if (data.service?.slug) {
                        router.replace(`/services/${data.service.slug}`)
                        return
                    }
                }
            } catch {
                // Fall through to list page
            }

            if (!cancelled) {
                router.replace('/residential')
            }
        }

        redirect()
        return () => {
            cancelled = true
        }
    }, [id, router])

    return (
        <section className="service-details">
            <div className="container">
                <p className="mb-0">Redirecting...</p>
            </div>
        </section>
    )
}

export default function ServiceDetailsRedirectPage() {
    return (
        <Suspense fallback={(
            <section className="service-details">
                <div className="container">
                    <p className="mb-0">Redirecting...</p>
                </div>
            </section>
        )}>
            <ServiceDetailsRedirect />
        </Suspense>
    )
}
