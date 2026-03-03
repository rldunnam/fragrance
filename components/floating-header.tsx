'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth, useClerk, UserButton } from '@clerk/nextjs'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Scent Selector', href: '/' },
  { label: 'The Guide',      href: '/guide' },
  { label: 'Collection',     href: '/collection' },
]

export function FloatingHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const { isSignedIn } = useAuth()
  const { openSignIn } = useClerk()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onSignInRequired = () => openSignIn()
    window.addEventListener('fragrance:signin-required', onSignInRequired)
    return () => window.removeEventListener('fragrance:signin-required', onSignInRequired)
  }, [openSignIn])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#0A0A0F]/90 backdrop-blur-md border-b border-gold/10 shadow-lg shadow-black/30'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Wordmark */}
          <Link
            href="/"
            className="font-serif text-sm tracking-wider text-gold/70 hover:text-gold transition-colors duration-200"
          >
            The Art & Science of Fragrance
          </Link>

          {/* Centre nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(({ label, href }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-[0.12em] transition-all duration-200',
                    active
                      ? 'bg-gold/15 text-gold border border-gold/30'
                      : 'text-cream-muted/60 hover:text-gold/80 hover:bg-gold/5 border border-transparent'
                  )}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Right: sign in / user */}
          <div className="flex items-center gap-3">
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
              <button
                onClick={() => openSignIn()}
                className={cn(
                  'flex items-center gap-2 rounded-full border px-3 py-1.5',
                  'text-xs font-medium tracking-wide transition-all duration-300',
                  scrolled
                    ? 'border-gold/30 bg-surface/80 text-cream-muted hover:border-gold hover:text-gold'
                    : 'border-white/10 text-white/40 hover:border-gold/40 hover:text-gold/70'
                )}
              >
                Sign in
              </button>
            )}

            {/* Mobile menu */}
            <MobileMenu pathname={pathname} />
          </div>
        </div>
      </div>
    </header>
  )
}

function MobileMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex flex-col gap-[5px] p-1.5 rounded border border-gold/20 hover:border-gold/40 transition-colors"
        aria-label="Toggle navigation"
      >
        <span className={cn('block h-px w-4 bg-gold/60 transition-all duration-200', open && 'rotate-45 translate-y-[6px]')} />
        <span className={cn('block h-px w-4 bg-gold/60 transition-all duration-200', open && 'opacity-0')} />
        <span className={cn('block h-px w-4 bg-gold/60 transition-all duration-200', open && '-rotate-45 -translate-y-[6px]')} />
      </button>

      <div className={cn(
        'absolute top-full right-0 mt-2 w-48 rounded-xl bg-[#0A0A0F]/95 backdrop-blur-md border border-gold/10',
        'overflow-hidden transition-all duration-300 ease-out',
        open ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
      )}>
        <nav className="p-2 flex flex-col gap-1">
          {NAV.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                'px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                pathname === href
                  ? 'bg-gold/10 text-gold'
                  : 'text-cream-muted hover:bg-surface-elevated hover:text-cream'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
