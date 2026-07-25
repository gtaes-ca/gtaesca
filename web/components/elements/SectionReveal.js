'use client'

import { useEffect } from 'react'

const SKIP_SELECTOR = [
  '.main-slider',
  '.page-header',
  '.home-coverage',
  '.mobile-menu',
  '.search-popup',
  '.stricky-header',
  '.sidebar-one',
].join(',')

const CARD_SELECTORS = [
  '.services-two__category-card',
  '.services-two__single',
  '.services-page__card',
  '.about-page-intro__content',
  '.about-page-intro__media',
  '.about-one__left',
  '.about-one__right',
  '.home-testimonials__card',
  '.project-one__single',
  '.home-services-gallery__card',
  '.testimonial-one__single',
].join(', ')

function shouldSkip(section) {
  if (!section || section.tagName !== 'SECTION') return true
  if (section.matches(SKIP_SELECTOR)) return true
  if (section.closest('.main-slider, .mobile-menu, .search-popup')) return true
  return false
}

function annotateItems(section) {
  const tagline = section.querySelector(
    '.section-title__tagline-box, .section-title-three__tagline, .section-title-two__tagline'
  )
  if (tagline) tagline.classList.add('section-reveal__tagline')

  const title =
    section.querySelector('.section-title__title-box') ||
    section.querySelector('.section-title__title, .section-title-three__title, .about-page-intro__title')
  if (title) title.classList.add('section-reveal__title')

  section.querySelectorAll(
    '.about-page-intro__text, .services-category-details__text, .about-one__text-1, .about-one__text-2, .about-page-intro__points, .about-page-intro__btn'
  ).forEach((node, index) => {
    if (index < 6) node.classList.add('section-reveal__text')
  })

  const cards = section.querySelectorAll(CARD_SELECTORS)
  if (cards.length) {
    cards.forEach((node, index) => {
      if (index > 36) return
      node.classList.add('section-reveal__item')
      node.style.setProperty('--reveal-index', String(index))
    })
    return
  }

  // Fallback for sections without known card classes
  section.querySelectorAll(
    ':scope > .container > .row > [class*="col-"], :scope > .container > .services-two__carousel, :scope > .container > .services-two__categories, :scope > .container > .row'
  ).forEach((node, index) => {
    if (index > 24) return
    node.classList.add('section-reveal__item')
    node.style.setProperty('--reveal-index', String(index))
  })
}

function prepareSection(section) {
  if (shouldSkip(section)) return false

  section.classList.add('section-reveal')
  annotateItems(section)
  return true
}

export default function SectionReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('section').forEach((section) => {
        section.classList.add('section-reveal', 'is-inview')
      })
      return undefined
    }

    const root = document.querySelector('.page-wrapper') || document.body

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-inview')
          observer.unobserve(entry.target)
        })
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -4% 0px',
      }
    )

    const observeSection = (section) => {
      if (!prepareSection(section)) return

      if (section.dataset.sectionRevealObserved === '1') {
        // Content may have loaded after first observe — keep annotations fresh
        return
      }
      section.dataset.sectionRevealObserved = '1'

      const rect = section.getBoundingClientRect()
      const inView = rect.top < window.innerHeight * 0.95 && rect.bottom > 20
      if (inView) {
        section.classList.add('is-inview')
        return
      }
      observer.observe(section)
    }

    const scan = () => {
      root.querySelectorAll('section').forEach(observeSection)
    }

    scan()

    let scheduled = false
    const scheduleScan = () => {
      if (scheduled) return
      scheduled = true
      window.requestAnimationFrame(() => {
        scheduled = false
        scan()
      })
    }

    const mutation = new MutationObserver(scheduleScan)
    mutation.observe(root, { childList: true, subtree: true })

    const timers = [200, 600, 1200, 2500, 4000].map((ms) => window.setTimeout(scan, ms))

    return () => {
      mutation.disconnect()
      observer.disconnect()
      timers.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  return null
}
