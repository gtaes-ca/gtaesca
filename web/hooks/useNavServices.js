'use client'

import { useEffect, useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

async function fetchGroupServices(group) {
  const res = await fetch(`${API_URL}/api/services/list?group=${group}`)
  if (!res.ok) return []
  const data = await res.json()
  return (Array.isArray(data.services) ? data.services : [])
    .map((service) => ({
      id: service.id,
      name: String(service.name || '').trim(),
      slug: service.slug || '',
      categoryName: service.categoryName || '',
    }))
    .filter((service) => service.name)
}

export function useNavServices() {
  const [residential, setResidential] = useState([])
  const [commercial, setCommercial] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [residentialServices, commercialServices] = await Promise.all([
          fetchGroupServices('residential'),
          fetchGroupServices('commercial'),
        ])
        if (cancelled) return
        setResidential(residentialServices)
        setCommercial(commercialServices)
      } catch {
        if (!cancelled) {
          setResidential([])
          setCommercial([])
        }
      } finally {
        if (!cancelled) setLoaded(true)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { residential, commercial, loaded }
}
