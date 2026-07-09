'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import Layout from '@/components/layout/Layout'
import { activateCustomerAccount, fetchActivationPreview } from '@/lib/auth'

function ActivateForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const [preview, setPreview] = useState(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [previewError, setPreviewError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function loadPreview() {
      if (!token) {
        setPreviewError('Activation token is missing.')
        return
      }
      try {
        const data = await fetchActivationPreview(token)
        if (!cancelled) setPreview(data)
      } catch (err) {
        if (!cancelled) setPreviewError(err.message || 'Invalid activation link')
      }
    }
    loadPreview()
    return () => {
      cancelled = true
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')
    try {
      await activateCustomerAccount({ token, password })
      router.push('/account/login?activated=1')
    } catch (err) {
      setError(err.message || 'Activation failed')
    } finally {
      setLoading(false)
    }
  }

  if (previewError) {
    return (
      <div className="account__main-tab-box">
        <p className="account__message account__message--error">{previewError}</p>
        <Link href="/account/login" className="thm-btn">Go to Sign In</Link>
      </div>
    )
  }

  if (!preview) {
    return <p>Loading activation...</p>
  }

  return (
    <div className="account__main-tab-box">
      <h3 className="account__title">Activate Your Account</h3>
      <p className="account__subtitle">
        Welcome {preview.firstName} {preview.lastName}. Set a password for {preview.email}.
      </p>
      <form className="account__form" onSubmit={handleSubmit}>
        {error ? <p className="account__message account__message--error">{error}</p> : null}
        <div className="account__form-input-box">
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="account__form-input-box">
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <div className="account__form-btn-box">
          <button type="submit" className="thm-btn account__form-btn" disabled={loading}>
            {loading ? 'Activating...' : 'Activate Account'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function ActivatePage() {
  return (
    <div className="dark-home account-page">
      <Layout headerStyle={1} footerStyle={1}>
        <section className="account">
          <div className="container">
            <Suspense fallback={<p>Loading...</p>}>
              <ActivateForm />
            </Suspense>
          </div>
        </section>
      </Layout>
    </div>
  )
}
