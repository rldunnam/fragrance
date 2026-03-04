import { FragranceQuiz } from "@/components/fragrance-quiz"
import { Footer } from "@/components/scrollytelling/footer"

export default function QuizPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8 pt-24 pb-16">
        <div className="mb-12 text-center">
          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold/70">
            Fragrance Identity Quiz
          </span>
          <h1 className="mt-3 font-serif text-3xl sm:text-4xl text-cream">
            Discover Your Scent Profile
          </h1>
          <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          <p className="mx-auto mt-5 max-w-md text-sm text-cream-muted leading-relaxed">
            18 questions. Answer honestly. We&apos;ll map your identity to an archetype
            and use it to sharpen every recommendation in the selector.
          </p>
        </div>

        <FragranceQuiz />
      </div>
      <Footer />
    </main>
  )
}
