import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <SignIn
        appearance={{
          elements: {
            rootBox: 'shadow-2xl shadow-black/50',
            card: 'bg-surface border border-gold/20',
            headerTitle: 'text-cream font-serif',
            headerSubtitle: 'text-cream-muted',
            socialButtonsBlockButton: 'border-gold/20 text-cream hover:bg-surface-hover',
            socialButtonsBlockButtonText: 'text-cream',
            dividerLine: 'bg-gold/10',
            dividerText: 'text-cream-muted/50',
            formFieldLabel: 'text-cream-muted',
            formFieldInput: 'bg-surface-elevated border-gold/20 text-cream focus:border-gold/50',
            formButtonPrimary: 'bg-gold hover:bg-gold-dark text-surface font-medium',
            footerActionLink: 'text-gold hover:text-gold-light',
            identityPreviewText: 'text-cream-muted',
            identityPreviewEditButton: 'text-gold hover:text-gold-light',
          },
        }}
      />
    </div>
  )
}
