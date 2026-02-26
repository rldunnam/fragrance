'use client'

import { useEffect, useState } from 'react'
import { User } from 'lucide-react'

export function FloatingHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-0 right-0 z-60 p-4">
      <button
        onClick={() => alert('button works')}
        className={[
          'flex items-center gap-2 rounded-full border px-3 py-1.5',
          'text-xs font-medium tracking-wide transition-all duration-300',
          scrolled
            ? 'border-gold/30 bg-surface/80 backdrop-blur-md text-cream-muted hover:border-gold hover:text-gold shadow-lg shadow-black/30'
            : 'border-white/10 bg-transparent text-white/40 hover:border-gold/40 hover:text-gold/70',
        ].join(' ')}
      >
        <User size={12} />
        Sign in
      </button>
    </div>
  )
}
