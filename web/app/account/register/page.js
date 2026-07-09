'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Layout from '@/components/layout/Layout'
import { useAuth } from '@/context/AuthProvider'

export default function RegisterPage() {
  const router = useRouter()
  const { register, login } = useAuth()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')
    try {
      await register({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
      })
      await login({ email: form.email, password: form.password })
      router.push('/account/bookings')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dark-home account-page">
      <Layout headerStyle={1} footerStyle={1}>
        <section className="account">
          <div className="container">
            <div className="account__main-tab-box">
              <h3 className="account__title">Create Account</h3>
              <p className="account__subtitle">Register to view bookings and book services faster.</p>
              <form className="account__form" onSubmit={handleSubmit}>
                {error ? <p className="account__message account__message--error">{error}</p> : null}
                <div className="account__form-input-box">
                  <input placeholder="First Name" value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)} required />
                </div>
                <div className="account__form-input-box">
                  <input placeholder="Last Name" value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)} required />
                </div>
                <div className="account__form-input-box">
                  <input type="email" placeholder="Email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required />
                </div>
                <div className="account__form-input-box">
                  <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
                </div>
                <div className="account__form-input-box">
                  <input type="password" placeholder="Password" value={form.password} onChange={(e) => updateField('password', e.target.value)} required />
                </div>
                <div className="account__form-input-box">
                  <input type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} required />
                </div>
                <div className="account__form-btn-box">
                  <button type="submit" className="thm-btn account__form-btn" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create Account'}
                  </button>
                </div>
                <div className="account__form-forgot-password">
                  <Link href="/account/login">Already have an account? Sign in</Link>
                </div>
              </form>
            </div>
          </div>
        </section>
      </Layout>
    </div>
  )
}
