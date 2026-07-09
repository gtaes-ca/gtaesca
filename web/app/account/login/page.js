'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import Layout from '@/components/layout/Layout'
import { useAuth } from '@/context/AuthProvider'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login({ email, password })
      const redirectTo = searchParams.get('redirectTo') || '/account/bookings'
      router.push(redirectTo)
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="account__form" onSubmit={handleSubmit}>
      {error ? <p className="account__message account__message--error">{error}</p> : null}
      <div className="account__form-input-box">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="account__form-input-box">
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <div className="account__form-btn-box">
        <button type="submit" className="thm-btn account__form-btn" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
      <div className="account__form-forgot-password">
        <Link href="/account/register">Create an account</Link>
      </div>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="dark-home account-page">
      <Layout headerStyle={1} footerStyle={1}>
        <section className="account">
          <div className="container">
            <div className="account__main-tab-box">
              <h3 className="account__title">Customer Sign In</h3>
              <p className="account__subtitle">View your service bookings and manage your account.</p>
              <Suspense fallback={<p>Loading...</p>}>
                <LoginForm />
              </Suspense>
            </div>
          </div>
        </section>
      </Layout>
    </div>
  )
}
