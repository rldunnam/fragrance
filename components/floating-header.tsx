'use client'

import { useEffect, useState } from 'react'
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import { User } from 'lucide-react'

export function FloatingHeader() {
  const [scrolled, setScrolled] = useState(false)
  const { user } = useUser()

  // Subtle background once user scrolls — stays invisible at top
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-0 right-0 z-40 flex items-center justify-end p-4 pointer-events-none">
      <div
        className={[
          'flex items-center gap-3 rounded-full px-4 py-2 pointer-events-auto',
          'border transition-all duration-500',
          scrolled
            ? 'border-gold/20 bg-surface/80 backdrop-blur-md shadow-lg shadow-black/30'
            : 'border-transparent bg-transparent',
        ].join(' ')}
      >
        {hasClerk && (
          <>
            {/* Signed out — show a minimal sign-in button */}
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  className={[
                    'flex items-center gap-2 rounded-full border px-3 py-1.5',
                    'text-xs font-medium tracking-wide transition-all duration-200',
                    'border-gold/30 text-cream-muted hover:border-gold hover:text-gold',
                    scrolled ? '' : 'border-white/10 text-white/40 hover:border-gold/40 hover:text-gold/70',
                  ].join(' ')}
                >
                  <User size={12} />
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>

            {/* Signed in — show Clerk's UserButton (avatar + dropdown) */}
            <SignedIn>
              <div className="flex items-center gap-2.5">
                {user?.firstName && (
                  <span className="text-xs text-cream-muted/70 hidden sm:block">
                    {user.firstName}
                  </span>
                )}
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
              </div>
            </SignedIn>
          </>
        )}
      </div>
    </div>
  )
}
