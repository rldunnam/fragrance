import { FragranceQuiz } from "@/components/fragrance-quiz"
import { Footer } from "@/components/scrollytelling/footer"

export default function QuizPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8 pt-28 pb-20">

        <div className="mb-16 text-center">
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-gold/70">
            Fragrance Identity Quiz
          </span>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl text-cream leading-tight">
            Discover Your<br className="hidden sm:block" />{" "}
            <span className="text-gold">Scent Profile</span>
          </h1>
          <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          <p className="mx-auto mt-6 max-w-md text-base text-cream-muted leading-relaxed">
            18 questions. Answer honestly. We&apos;ll map your identity to an archetype
            and personalise every recommendation in the selector.
          </p>
        </div>

        <FragranceQuiz />
      </div>
      <Footer />
    </main>
  )
}
