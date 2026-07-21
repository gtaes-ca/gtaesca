'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/context/AuthProvider'
import {
  addDaysToDateStr,
  bookingFetch,
  buildWhatsAppBookingMessage,
  formatBookingSlot,
  formatDuration,
  getDateStrInTimezone,
  openWhatsAppBooking,
} from '@/lib/booking'

const STEPS = [
  { key: 'service', label: 'Service' },
  { key: 'area', label: 'Service Area' },
  { key: 'technician', label: 'Technician' },
  { key: 'schedule', label: 'Date & Time' },
  { key: 'auth', label: 'Sign In' },
  { key: 'details', label: 'Your Details' },
  { key: 'review', label: 'Review' },
]

const GTA_TAB = 'gta'
const NEARBY_TAB = 'nearby'
const SERVICE_PAGE_SIZE = 4

const defaultClient = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  notes: '',
}

function TechnicianAvatar({ member }) {
  const initials = `${member.firstName?.[0] || ''}${member.lastName?.[0] || ''}`.toUpperCase()
  return <div className="booking-wizard__avatar" aria-hidden="true">{initials}</div>
}

export default function BookingWizard({ initialServiceIds = [] }) {
  const router = useRouter()
  const { user, isAuthenticated, sessionChecked, login, register } = useAuth()

  const [step, setStep] = useState(0)
  const [catalog, setCatalog] = useState({ categories: [], locations: { gta: [], nearby: [] }, bookingSettings: null })
  const [loadingCatalog, setLoadingCatalog] = useState(true)
  const [technicians, setTechnicians] = useState([])
  const [loadingTechnicians, setLoadingTechnicians] = useState(false)
  const [slots, setSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [selectedServiceIds, setSelectedServiceIds] = useState(initialServiceIds.map(String))
  const [serviceSearch, setServiceSearch] = useState('')
  const [servicePage, setServicePage] = useState(1)
  const [areaTab, setAreaTab] = useState(GTA_TAB)
  const [selectedLocationId, setSelectedLocationId] = useState('')
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [client, setClient] = useState({ ...defaultClient })
  const [clientLookupMessage, setClientLookupMessage] = useState('')

  const [authMode, setAuthMode] = useState('login')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const loadCatalog = useCallback(async () => {
    setLoadingCatalog(true)
    setError('')
    try {
      const data = await bookingFetch('/api/bookings/catalog')
      setCatalog(data)
    } catch {
      setError('Failed to load services. Please try again.')
    } finally {
      setLoadingCatalog(false)
    }
  }, [])

  useEffect(() => {
    loadCatalog()
  }, [loadCatalog])

  useEffect(() => {
    if (!user) return
    setClient((prev) => ({
      ...prev,
      email: user.email || prev.email,
      firstName: user.firstName || prev.firstName,
      lastName: user.lastName || prev.lastName,
      phone: user.phone || prev.phone,
    }))
  }, [user])

  const selectedServices = useMemo(() => {
    const items = []
    for (const category of catalog.categories || []) {
      for (const service of category.services || []) {
        if (selectedServiceIds.includes(String(service.id))) {
          items.push({ ...service, categoryId: category.id, categoryName: category.name })
        }
      }
    }
    return items
  }, [catalog.categories, selectedServiceIds])

  const totalDurationMinutes = useMemo(
    () => selectedServices.reduce((sum, service) => sum + (service.durationMinutes || 0), 0),
    [selectedServices]
  )

  const allCatalogServices = useMemo(
    () => (catalog.categories || []).flatMap((category) =>
      (category.services || []).map((service) => ({
        ...service,
        categoryId: category.id,
        categoryName: category.name,
      }))
    ),
    [catalog.categories]
  )

  const filteredCatalogServices = useMemo(() => {
    const query = serviceSearch.trim().toLowerCase()
    if (!query) return allCatalogServices
    return allCatalogServices.filter((service) =>
      service.name.toLowerCase().includes(query)
      || service.categoryName.toLowerCase().includes(query)
      || service.description?.toLowerCase().includes(query)
    )
  }, [allCatalogServices, serviceSearch])

  const serviceTotalPages = Math.max(1, Math.ceil(filteredCatalogServices.length / SERVICE_PAGE_SIZE))

  const paginatedCatalogServices = useMemo(() => {
    const start = (servicePage - 1) * SERVICE_PAGE_SIZE
    return filteredCatalogServices.slice(start, start + SERVICE_PAGE_SIZE)
  }, [filteredCatalogServices, servicePage])

  const paginatedServicesByCategory = useMemo(() => {
    const grouped = new Map()
    for (const service of paginatedCatalogServices) {
      if (!grouped.has(service.categoryId)) {
        grouped.set(service.categoryId, {
          id: service.categoryId,
          name: service.categoryName,
          services: [],
        })
      }
      grouped.get(service.categoryId).services.push(service)
    }
    return Array.from(grouped.values())
  }, [paginatedCatalogServices])

  useEffect(() => {
    setServicePage(1)
  }, [serviceSearch])

  useEffect(() => {
    if (servicePage > serviceTotalPages) {
      setServicePage(serviceTotalPages)
    }
  }, [servicePage, serviceTotalPages])

  const areaLocations = catalog.locations?.[areaTab] || []
  const selectedLocation = areaLocations.find((l) => String(l.id) === selectedLocationId)
  const selectedTechnician = technicians.find((member) => member.id === selectedTechnicianId)

  const bookingSettings = catalog.bookingSettings || {
    startHour: 8,
    endHour: 18,
    lookaheadDays: 30,
    timezone: 'America/Toronto',
    workingDays: [1, 2, 3, 4, 5],
    bookingMode: 'full',
  }

  const isWhatsAppMode = bookingSettings.bookingMode === 'whatsapp'

  const activeSteps = useMemo(() => {
    if (isWhatsAppMode || loadingCatalog) {
      return STEPS.filter((item) => item.key !== 'auth')
    }
    return STEPS
  }, [isWhatsAppMode, loadingCatalog])

  const currentStep = activeSteps[step] || activeSteps[0]

  useEffect(() => {
    setStep((current) => Math.min(current, Math.max(activeSteps.length - 1, 0)))
  }, [activeSteps.length])

  const minDate = useMemo(
    () => getDateStrInTimezone(bookingSettings.timezone),
    [bookingSettings.timezone]
  )
  const maxDate = useMemo(
    () => addDaysToDateStr(minDate, bookingSettings.lookaheadDays),
    [minDate, bookingSettings.lookaheadDays]
  )

  const loadTechnicians = useCallback(async () => {
    if (!selectedServiceIds.length) return
    setLoadingTechnicians(true)
    setError('')
    try {
      const data = await bookingFetch(`/api/bookings/technicians?serviceIds=${selectedServiceIds.join(',')}`)
      const members = data.technicians || []
      setTechnicians(members)
      setSelectedTechnicianId((prev) => (prev && members.some((m) => m.id === prev) ? prev : ''))
    } catch {
      setError('Failed to load available technicians')
    } finally {
      setLoadingTechnicians(false)
    }
  }, [selectedServiceIds])

  const loadSlots = useCallback(async () => {
    if (!selectedTechnicianId || !selectedDate || !selectedServiceIds.length) return
    setLoadingSlots(true)
    setError('')
    try {
      const params = new URLSearchParams({
        technicianUserId: selectedTechnicianId,
        date: selectedDate,
        serviceIds: selectedServiceIds.join(','),
      })
      const data = await bookingFetch(`/api/bookings/availability?${params}`)
      const newSlots = data.slots || []
      setSlots(newSlots)
      setSelectedSlot((prev) => (prev && newSlots.includes(prev) ? prev : ''))
    } catch {
      setError('Failed to load available time slots')
    } finally {
      setLoadingSlots(false)
    }
  }, [selectedTechnicianId, selectedDate, selectedServiceIds])

  const toggleService = (serviceId) => {
    const id = String(serviceId)
    setSelectedServiceIds((prev) => (
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    ))
    setSelectedTechnicianId('')
    setSelectedSlot('')
    setSlots([])
  }

  const lookupClient = useCallback(async (email) => {
    const trimmed = email?.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setClientLookupMessage('')
      return
    }
    try {
      const data = await bookingFetch(`/api/bookings/client-lookup?email=${encodeURIComponent(trimmed)}`)
      if (data.found && data.customer) {
        setClient((prev) => ({
          ...prev,
          firstName: data.customer.firstName || prev.firstName,
          lastName: data.customer.lastName || prev.lastName,
          phone: data.customer.phone || prev.phone,
          address: data.customer.address || prev.address,
        }))
        if (data.isActivated) {
          setClientLookupMessage('Existing account found — details prefilled.')
        } else {
          setClientLookupMessage('We found a previous booking for this email. Details were prefilled.')
        }
      } else {
        setClientLookupMessage('')
      }
    } catch {
      setClientLookupMessage('')
    }
  }, [])

  useEffect(() => {
    if (currentStep?.key === 'technician' && selectedServiceIds.length) loadTechnicians()
  }, [currentStep?.key, selectedServiceIds, loadTechnicians])

  useEffect(() => {
    if (currentStep?.key === 'schedule' && selectedTechnicianId && selectedDate) loadSlots()
  }, [currentStep?.key, selectedTechnicianId, selectedDate, loadSlots])

  const skipAuthStep = (index) => {
    const stepKey = activeSteps[index]?.key
    if (stepKey === 'auth' && (isAuthenticated || isWhatsAppMode)) {
      return index < activeSteps.length - 1 ? index + 1 : index
    }
    return index
  }

  const canNext = () => {
    switch (currentStep?.key) {
      case 'service':
        return selectedServiceIds.length > 0
      case 'area':
        return Boolean(selectedLocationId)
      case 'technician':
        return Boolean(selectedTechnicianId)
      case 'schedule':
        return Boolean(selectedSlot)
      case 'auth':
        return sessionChecked && isAuthenticated
      case 'details':
        return client.firstName.trim() && client.lastName.trim() && client.email.trim()
      default:
        return true
    }
  }

  const goNext = () => {
    if (!canNext()) return
    setError('')
    setStep((current) => skipAuthStep(Math.min(current + 1, activeSteps.length - 1)))
  }

  const goBack = () => {
    setError('')
    setStep((current) => {
      let prev = Math.max(current - 1, 0)
      if (activeSteps[prev]?.key === 'auth' && (isAuthenticated || isWhatsAppMode)) {
        prev = Math.max(prev - 1, 0)
      }
      return prev
    })
  }

  const handleAuthLogin = async (e) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')
    try {
      await login({
        email: loginForm.email,
        password: loginForm.password,
      })
    } catch (err) {
      setAuthError(err.message || 'Login failed')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleAuthRegister = async (e) => {
    e.preventDefault()
    if (registerForm.password.length < 8) {
      setAuthError('Password must be at least 8 characters')
      return
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setAuthError('Passwords do not match')
      return
    }
    setAuthLoading(true)
    setAuthError('')
    try {
      await register({
        email: registerForm.email,
        password: registerForm.password,
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        phone: registerForm.phone,
      })
      await login({
        email: registerForm.email,
        password: registerForm.password,
      })
    } catch (err) {
      setAuthError(err.message || 'Registration failed')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedSlot) {
      setError('Please go back and select a time slot before submitting.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      if (isWhatsAppMode) {
        const whatsappNumber = bookingSettings.companyWhatsappNumber
        if (!whatsappNumber) {
          throw new Error('WhatsApp booking is not configured. Please contact us directly.')
        }
        const message = buildWhatsAppBookingMessage({
          services: selectedServices,
          location: selectedLocation,
          technician: selectedTechnician,
          scheduledAt: selectedSlot,
          client,
          notes: client.notes,
          timezone: bookingSettings.timezone,
        })
        openWhatsAppBooking(whatsappNumber, message)
        router.push('/book/confirmation?whatsapp=1')
        return
      }

      const data = await bookingFetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          serviceIds: selectedServiceIds.map(Number),
          serviceLocationId: Number(selectedLocationId),
          technicianUserId: selectedTechnicianId,
          scheduledAt: selectedSlot,
          clientFirstName: client.firstName.trim(),
          clientLastName: client.lastName.trim(),
          clientEmail: client.email.trim(),
          clientPhone: client.phone.trim(),
          clientAddress: client.address.trim(),
          notes: client.notes.trim(),
        }),
      })
      const reference = data.booking?.referenceCode || data.referenceCode
      router.push(`/book/confirmation?ref=${encodeURIComponent(reference || '')}`)
    } catch (err) {
      setError(err.message || 'Failed to submit booking')
    } finally {
      setSubmitting(false)
    }
  }

  const progress = ((step + 1) / activeSteps.length) * 100
  const servicePageFrom = filteredCatalogServices.length === 0
    ? 0
    : (servicePage - 1) * SERVICE_PAGE_SIZE + 1
  const servicePageTo = Math.min(servicePage * SERVICE_PAGE_SIZE, filteredCatalogServices.length)

  const stepNavDisabled = loadingCatalog || (currentStep?.key === 'auth' && !sessionChecked)
  const isReviewStep = currentStep?.key === 'review'

  const renderStepNav = (className) => (
    <div className={className}>
      <button
        type="button"
        className="booking-wizard__btn booking-wizard__btn--ghost"
        onClick={goBack}
        disabled={step === 0 || submitting}
      >
        Back
      </button>
      {isReviewStep ? (
        <button
          type="button"
          className="booking-wizard__btn thm-btn"
          onClick={handleSubmit}
          disabled={submitting || !selectedSlot}
        >
          {submitting ? (isWhatsAppMode ? 'Opening WhatsApp...' : 'Submitting...') : (isWhatsAppMode ? 'Send via WhatsApp' : 'Submit Booking')}
        </button>
      ) : (
        <button
          type="button"
          className="booking-wizard__btn thm-btn"
          onClick={goNext}
          disabled={!canNext() || stepNavDisabled}
        >
          Continue
        </button>
      )}
    </div>
  )

  const renderStepAction = (direction) => {
    if (direction === 'prev') {
      return (
        <button
          type="button"
          className="booking-wizard__step-action booking-wizard__step-action--prev"
          onClick={goBack}
          disabled={step === 0 || submitting}
          aria-label="Previous step"
        >
          <span className="icon-angle-left" aria-hidden="true" />
        </button>
      )
    }

    return (
      <button
        type="button"
        className="booking-wizard__step-action booking-wizard__step-action--next"
        onClick={isReviewStep ? handleSubmit : goNext}
        disabled={isReviewStep ? (submitting || !selectedSlot) : (!canNext() || stepNavDisabled)}
        aria-label={isReviewStep ? 'Submit booking' : 'Next step'}
      >
        <span className={isReviewStep ? 'icon-check' : 'icon-angle-right'} aria-hidden="true" />
      </button>
    )
  }

  return (
    <div className="booking-wizard">
      <div className="booking-wizard__header">
        <h1 className="booking-wizard__title">Book a Service</h1>
        <p className="booking-wizard__subtitle">Step {step + 1} of {activeSteps.length} — {currentStep?.label}</p>
        <div className="booking-wizard__steps-toolbar">
          {renderStepAction('prev')}
          <div className="booking-wizard__steps">
            {activeSteps.map((item, idx) => {
              const isInMobileWindow = idx >= step - 1 && idx <= step + 1
              return (
                <div
                  key={item.key}
                  className={[
                    'booking-wizard__step-indicator',
                    idx <= step ? 'is-active' : '',
                    idx === step ? 'is-current' : '',
                    !isInMobileWindow ? 'is-hidden-mobile' : '',
                  ].filter(Boolean).join(' ')}
                >
                  <span>{idx + 1}</span>
                  <small>{item.label}</small>
                </div>
              )
            })}
          </div>
          {renderStepAction('next')}
        </div>
        <div className="booking-wizard__progress">
          <div className="booking-wizard__progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="booking-wizard__body">
        {error ? <div className="booking-wizard__alert booking-wizard__alert--error">{error}</div> : null}

        {loadingCatalog ? (
          <p className="booking-wizard__loading">Loading services...</p>
        ) : (
          <>
            {currentStep?.key === 'service' && (
              <div className="booking-wizard__panel">
                <h2>Choose services</h2>
                <p className="booking-wizard__help">Select one or more services. Duration and pricing are combined for scheduling.</p>
                <input
                  type="search"
                  className="booking-wizard__search"
                  placeholder="Search services or categories..."
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                />
                {filteredCatalogServices.length === 0 ? (
                  <p className="booking-wizard__empty">No services match your search.</p>
                ) : (
                  <div className="booking-wizard__service-groups">
                    {paginatedServicesByCategory.map((category) => (
                      <div key={category.id} className="booking-wizard__service-group">
                        <h3>{category.name}</h3>
                        <div className="booking-wizard__service-list">
                          {category.services.map((service) => {
                            const checked = selectedServiceIds.includes(String(service.id))
                            return (
                              <button
                                key={service.id}
                                type="button"
                                className={`booking-wizard__service-card ${checked ? 'is-selected' : ''}`}
                                onClick={() => toggleService(service.id)}
                              >
                                <span className="booking-wizard__service-check">{checked ? '✓' : ''}</span>
                                <span className="booking-wizard__service-content">
                                  <strong>{service.name}</strong>
                                  <span>{formatDuration(service.durationMinutes)}</span>
                                  {service.description ? <small>{service.description}</small> : null}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {filteredCatalogServices.length > 0 ? (
                  <div className="booking-wizard__pagination">
                    <span>Showing {servicePageFrom}-{servicePageTo} of {filteredCatalogServices.length}</span>
                    <div>
                      <button type="button" disabled={servicePage <= 1} onClick={() => setServicePage((p) => Math.max(1, p - 1))}>Previous</button>
                      <button type="button" disabled={servicePage >= serviceTotalPages} onClick={() => setServicePage((p) => Math.min(serviceTotalPages, p + 1))}>Next</button>
                    </div>
                  </div>
                ) : null}
                {selectedServices.length > 0 ? (
                  <div className="booking-wizard__summary-inline">
                    <strong>{selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected</strong>
                    <span>Total duration: {formatDuration(totalDurationMinutes)}</span>
                  </div>
                ) : null}
              </div>
            )}

            {currentStep?.key === 'area' && (
              <div className="booking-wizard__panel">
                <h2>Select service area</h2>
                <p className="booking-wizard__help">Choose the coverage community for this job.</p>
                <div className="booking-wizard__tabs">
                  <button type="button" className={areaTab === GTA_TAB ? 'is-active' : ''} onClick={() => { setAreaTab(GTA_TAB); setSelectedLocationId('') }}>GTA</button>
                  <button type="button" className={areaTab === NEARBY_TAB ? 'is-active' : ''} onClick={() => { setAreaTab(NEARBY_TAB); setSelectedLocationId('') }}>Nearby</button>
                </div>
                <div className="booking-wizard__location-grid">
                  {areaLocations.map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      className={`booking-wizard__location-card ${String(loc.id) === selectedLocationId ? 'is-selected' : ''}`}
                      onClick={() => setSelectedLocationId(String(loc.id))}
                    >
                      <strong>{loc.name}</strong>
                      {loc.parentName ? <span>{loc.parentName}</span> : null}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep?.key === 'technician' && (
              <div className="booking-wizard__panel">
                <h2>Choose technician</h2>
                <p className="booking-wizard__help">
                  Showing technicians qualified for all {selectedServices.length} selected service{selectedServices.length > 1 ? 's' : ''}.
                </p>
                {loadingTechnicians ? (
                  <p className="booking-wizard__loading">Loading technicians...</p>
                ) : technicians.length === 0 ? (
                  <p className="booking-wizard__empty">No technicians available for this service.</p>
                ) : (
                  <div className="booking-wizard__technician-list">
                    {technicians.map((member) => (
                      <button
                        key={member.id}
                        type="button"
                        className={`booking-wizard__technician-card ${selectedTechnicianId === member.id ? 'is-selected' : ''}`}
                        onClick={() => setSelectedTechnicianId(member.id)}
                      >
                        <TechnicianAvatar member={member} />
                        <span>
                          <strong>{member.firstName} {member.lastName}</strong>
                          <small>{member.yearsExperience} yrs experience</small>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep?.key === 'schedule' && (
              <div className="booking-wizard__panel">
                <h2>Date & time</h2>
                <p className="booking-wizard__help">
                  Combined appointment: {formatDuration(totalDurationMinutes)}
                </p>
                <label className="booking-wizard__field">
                  <span>Date</span>
                  <input
                    type="date"
                    min={minDate}
                    max={maxDate}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </label>
                {selectedDate ? (
                  loadingSlots ? (
                    <p className="booking-wizard__loading">Loading time slots...</p>
                  ) : slots.length === 0 ? (
                    <p className="booking-wizard__empty">No available slots on this date. Try another day.</p>
                  ) : (
                    <div className="booking-wizard__slot-grid">
                      {slots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          className={`booking-wizard__slot ${selectedSlot === slot ? 'is-selected' : ''}`}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          {formatBookingSlot(slot, bookingSettings.timezone)}
                        </button>
                      ))}
                    </div>
                  )
                ) : null}
              </div>
            )}

            {currentStep?.key === 'auth' && !isWhatsAppMode && (
              <div className="booking-wizard__panel">
                <h2>Sign in to continue</h2>
                <p className="booking-wizard__help">
                  A customer account is required to complete your booking online.
                </p>

                {!sessionChecked ? (
                  <p className="booking-wizard__loading">Checking your session...</p>
                ) : isAuthenticated ? (
                  <div className="booking-wizard__auth-success">
                    <p>
                      Signed in as <strong>{user.firstName} {user.lastName}</strong>
                    </p>
                    <p className="booking-wizard__help">{user.email}</p>
                  </div>
                ) : (
                  <>
                    <div className="booking-wizard__tabs">
                      <button
                        type="button"
                        className={authMode === 'login' ? 'is-active' : ''}
                        onClick={() => { setAuthMode('login'); setAuthError('') }}
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        className={authMode === 'register' ? 'is-active' : ''}
                        onClick={() => { setAuthMode('register'); setAuthError('') }}
                      >
                        Create Account
                      </button>
                    </div>

                    {authError ? (
                      <div className="booking-wizard__alert booking-wizard__alert--error">{authError}</div>
                    ) : null}

                    {authMode === 'login' ? (
                      <form className="booking-wizard__auth-form" onSubmit={handleAuthLogin}>
                        <label className="booking-wizard__field booking-wizard__field--full">
                          <span>Email</span>
                          <input
                            type="email"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                            required
                          />
                        </label>
                        <label className="booking-wizard__field booking-wizard__field--full">
                          <span>Password</span>
                          <input
                            type="password"
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                            required
                          />
                        </label>
                        <button type="submit" className="booking-wizard__btn thm-btn" disabled={authLoading}>
                          {authLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                      </form>
                    ) : (
                      <form className="booking-wizard__auth-form" onSubmit={handleAuthRegister}>
                        <div className="booking-wizard__form-grid">
                          <label className="booking-wizard__field">
                            <span>First Name</span>
                            <input
                              value={registerForm.firstName}
                              onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                              required
                            />
                          </label>
                          <label className="booking-wizard__field">
                            <span>Last Name</span>
                            <input
                              value={registerForm.lastName}
                              onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                              required
                            />
                          </label>
                          <label className="booking-wizard__field booking-wizard__field--full">
                            <span>Email</span>
                            <input
                              type="email"
                              value={registerForm.email}
                              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                              required
                            />
                          </label>
                          <label className="booking-wizard__field booking-wizard__field--full">
                            <span>Phone (optional)</span>
                            <input
                              value={registerForm.phone}
                              onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                            />
                          </label>
                          <label className="booking-wizard__field">
                            <span>Password</span>
                            <input
                              type="password"
                              value={registerForm.password}
                              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                              required
                            />
                          </label>
                          <label className="booking-wizard__field">
                            <span>Confirm Password</span>
                            <input
                              type="password"
                              value={registerForm.confirmPassword}
                              onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                              required
                            />
                          </label>
                        </div>
                        <button type="submit" className="booking-wizard__btn thm-btn" disabled={authLoading}>
                          {authLoading ? 'Creating account...' : 'Create Account & Continue'}
                        </button>
                      </form>
                    )}
                  </>
                )}
              </div>
            )}

            {currentStep?.key === 'details' && (
              <div className="booking-wizard__panel">
                <h2>Your details</h2>
                {clientLookupMessage ? (
                  <div className="booking-wizard__alert booking-wizard__alert--info">{clientLookupMessage}</div>
                ) : null}
                <div className="booking-wizard__form-grid">
                  <label className="booking-wizard__field booking-wizard__field--full">
                    <span>Email</span>
                    <input type="email" value={client.email} onChange={(e) => setClient({ ...client, email: e.target.value })} onBlur={(e) => lookupClient(e.target.value)} required />
                  </label>
                  <label className="booking-wizard__field">
                    <span>First Name</span>
                    <input value={client.firstName} onChange={(e) => setClient({ ...client, firstName: e.target.value })} required />
                  </label>
                  <label className="booking-wizard__field">
                    <span>Last Name</span>
                    <input value={client.lastName} onChange={(e) => setClient({ ...client, lastName: e.target.value })} required />
                  </label>
                  <label className="booking-wizard__field">
                    <span>Phone</span>
                    <input value={client.phone} onChange={(e) => setClient({ ...client, phone: e.target.value })} />
                  </label>
                  <label className="booking-wizard__field booking-wizard__field--full">
                    <span>Service Address</span>
                    <input value={client.address} onChange={(e) => setClient({ ...client, address: e.target.value })} />
                  </label>
                  <label className="booking-wizard__field booking-wizard__field--full">
                    <span>Notes</span>
                    <textarea rows={3} value={client.notes} onChange={(e) => setClient({ ...client, notes: e.target.value })} />
                  </label>
                </div>
              </div>
            )}

            {currentStep?.key === 'review' && (
              <div className="booking-wizard__panel">
                <h2>Review booking</h2>
                <div className="booking-wizard__review">
                  <p><strong>Services:</strong></p>
                  <ul>
                    {selectedServices.map((service) => (
                      <li key={service.id}>
                        {service.name} ({service.categoryName}) — {formatDuration(service.durationMinutes)}
                      </li>
                    ))}
                  </ul>
                  <p><strong>Area:</strong> {selectedLocation?.label}</p>
                  <p><strong>Technician:</strong> {selectedTechnician?.firstName} {selectedTechnician?.lastName}</p>
                  <p><strong>Scheduled:</strong> {formatBookingSlot(selectedSlot, bookingSettings.timezone)}</p>
                  <p><strong>Client:</strong> {client.firstName} {client.lastName}</p>
                  <p><strong>Email:</strong> {client.email}</p>
                  <p><strong>Phone:</strong> {client.phone || '—'}</p>
                  <p><strong>Address:</strong> {client.address || '—'}</p>
                  {!isWhatsAppMode ? (
                    <p><strong>Booking type:</strong> <span className="booking-source-badge booking-source-badge--web">Web Booking</span></p>
                  ) : null}
                </div>
                <p className="booking-wizard__help">
                  {isWhatsAppMode ? (
                    <>Tap below to send your booking request via WhatsApp. Our team will confirm availability.</>
                  ) : (
                    <>This will be submitted as a <strong>Web Booking</strong>. A confirmation email will be sent to {client.email}.</>
                  )}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {renderStepNav('booking-wizard__footer')}
    </div>
  )
}
