'use client'

import { useEffect, useState } from 'react'
import { DEFAULT_TOPBAR, fetchContactDetails } from '@/lib/cms'

export function useContactDetails() {
  const [details, setDetails] = useState(DEFAULT_TOPBAR)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const content = await fetchContactDetails()
        if (!cancelled) {
          setDetails(content)
        }
      } catch {
        if (!cancelled) {
          setDetails(DEFAULT_TOPBAR)
        }
      } finally {
        if (!cancelled) {
          setLoaded(true)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { ...details, loaded }
}
