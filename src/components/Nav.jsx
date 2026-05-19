import { useEffect, useRef } from 'react'

const GITHUB_URL = 'https://github.com/keldevca/scroll-video'
const LINKEDIN_URL = 'https://www.linkedin.com/in/kellydev/'

export default function Nav() {
  const navRef = useRef(null)

  useEffect(() => {
    let raf = null
    const update = () => {
      raf = null
      const scrollable = document.body.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0
      const fade = Math.max(0, Math.min(1, 1 - (progress - 0.62) / 0.15))
      navRef.current.style.opacity = fade
      navRef.current.style.pointerEvents = fade > 0.05 ? 'auto' : 'none'
    }
    const onScroll = () => { if (raf === null) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
      if (raf !== null) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 text-white"
      style={{ willChange: 'opacity' }}
    >
      <a href="#" className="flex items-baseline font-serif leading-none">
        <span className="text-3xl font-bold">M</span>
        <span className="text-xl italic font-light mx-0.5 opacity-80">&amp;</span>
        <span className="text-3xl font-bold">P</span>
      </a>
      <ul className="hidden md:flex gap-10 text-sm uppercase tracking-widest">
        <li><a href="#" className="hover:opacity-60 transition">Collection</a></li>
        <li><a href="#" className="hover:opacity-60 transition">Lookbook</a></li>
        <li><a href="#" className="hover:opacity-60 transition">Atelier</a></li>
      </ul>
      <div className="flex gap-5 items-center">
        <a href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:opacity-60 transition">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
        </a>
        <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:opacity-60 transition">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
      </div>
    </nav>
  )
}
