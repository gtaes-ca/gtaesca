'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  clearSession,
  fetchCurrentUser,
  getStoredSession,
  loginCustomer,
  logoutCustomer,
  registerCustomer,
  saveSession,
} from '@/lib/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [sessionChecked, setSessionChecked] = useState(false)

  const refreshUser = useCallback(async () => {
    const stored = getStoredSession()
    if (!stored?.token) {
      setUser(null)
      return null
    }
    try {
      const profile = await fetchCurrentUser()
      const next = { ...stored, ...profile }
      saveSession(next)
      setUser(next)
      return next
    } catch {
      clearSession()
      setUser(null)
      return null
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function init() {
      const stored = getStoredSession()
      if (!stored?.token) {
        if (!cancelled) {
          setUser(null)
          setSessionChecked(true)
        }
        return
      }
      try {
        const profile = await fetchCurrentUser()
        if (!cancelled) {
          const next = { ...stored, ...profile }
          saveSession(next)
          setUser(next)
        }
      } catch {
        if (!cancelled) {
          clearSession()
          setUser(null)
        }
      } finally {
        if (!cancelled) {
          setSessionChecked(true)
        }
      }
    }
    init()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (credentials) => {
    const session = await loginCustomer(credentials)
    setUser(session)
    return session
  }, [])

  const register = useCallback(async (payload) => {
    return registerCustomer(payload)
  }, [])

  const logout = useCallback(async () => {
    await logoutCustomer()
    setUser(null)
  }, [])

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user?.token),
    sessionChecked,
    login,
    register,
    logout,
    refreshUser,
  }), [user, sessionChecked, login, register, logout, refreshUser])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
