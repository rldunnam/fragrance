'use client'

import { useEffect, useState } from 'react'
import { useAuth, useClerk, UserButton } from '@clerk/nextjs'
import { User } from 'lucide-react'

export function FloatingHeader() {
  const [scrolled, setScrolled] = useState(false)
  const { isSignedIn } = useAuth()
  const { openSignIn } = useClerk()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Listen for lazy auth prompts from cabinet/wishlist/rating actions
  useEffect(() => {
    const onSignInRequired = () => openSignIn()
    window.addEventListener('fragrance:signin-required', onSignInRequired)
    return () => window.removeEventListener('fragrance:signin-required', onSignInRequired)
  }, [openSignIn])

  const buttonClass = [
    'flex items-center gap-2 rounded-full border px-3 py-1.5',
    'text-xs font-medium tracking-wide transition-all duration-300',
    scrolled
      ? 'border-gold/30 bg-surface/80 backdrop-blur-md text-cream-muted hover:border-gold hover:text-gold shadow-lg shadow-black/30'
      : 'border-white/10 bg-transparent text-white/40 hover:border-gold/40 hover:text-gold/70',
  ].join(' ')

  return (
    <div className="fixed top-0 right-0 z-60 p-4">
      {isSignedIn ? (
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'w-7 h-7 ring-1 ring-gold/30 hover:ring-gold/60 transition-all',
              userButtonPopoverCard: 'bg-surface border border-gold/20 shadow-xl shadow-black/50',
              userButtonPopoverActionButton: 'text-cream-muted hover:text-cream hover:bg-surface-hover',
              userButtonPopoverActionButtonText: 'text-cream-muted',
              userButtonPopoverFooter: 'hidden',
            },
          }}
        />
      ) : (
        <button onClick={() => openSignIn()} className={buttonClass}>
          <User size={12} />
          Sign in
        </button>
      )}
    </div>
  )
}
