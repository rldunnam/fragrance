'use client'

import { useState, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import { runQuiz, type QuizAnswers, type QuizResult } from '@/lib/fragrances/quiz-engine'
import { useCollection } from '@/lib/collection-context'
import Link from 'next/link'

// ─── Question Definitions ─────────────────────────────────────────────────────

interface Option { label: string; value: string; sublabel?: string }
interface Question {
  id: keyof QuizAnswers
  phase: string
  question: string
  options: Option[]
  type?: 'text'
}

const QUESTIONS: Question[] = [
  {
    id: 'Q1', phase: 'Phase 1 — Intent',
    question: 'What are you hoping to accomplish with this quiz?',
    options: [
      { label: 'Refine', value: 'refine', sublabel: 'Improve what already works for me' },
      { label: 'Evolve', value: 'reinvent', sublabel: 'Develop something more distinctive' },
      { label: 'Reinvent', value: 'reinvent_contrast', sublabel: 'Completely change my scent identity' },
    ],
  },
  {
    id: 'Q2', phase: 'Phase 1 — Intent',
    question: 'Do you want something similar to what you currently wear?',
    options: [
      { label: 'Yes — improve it', value: 'low' },
      { label: 'Somewhat — with more depth', value: 'moderate' },
      { label: 'No — I want contrast', value: 'high' },
    ],
  },
  {
    id: 'Q3', phase: 'Phase 2 — Expression',
    question: 'When entering a room, what feels most natural?',
    options: [
      { label: 'I observe before engaging', value: 'Observe' },
      { label: 'I engage quickly and set the tone', value: 'Engage' },
    ],
  },
  {
    id: 'Q4', phase: 'Phase 2 — Expression',
    question: 'When someone compliments your scent, you prefer:',
    options: [
      { label: '"You smell clean."', value: 'Clean', sublabel: 'Subtle, understated' },
      { label: '"You smell incredible."', value: 'Incredible', sublabel: 'Attention-grabbing, memorable' },
    ],
  },
  {
    id: 'Q5', phase: 'Phase 2 — Expression',
    question: 'When leading a project, you tend to:',
    options: [
      { label: 'Guide quietly and strategically', value: 'Quiet' },
      { label: 'Take visible charge and energize others', value: 'Visible' },
    ],
  },
  {
    id: 'Q6', phase: 'Phase 2 — Tradition',
    question: 'Which aesthetic resonates more with you?',
    options: [
      { label: 'Tailored jacket, leather shoes, mechanical watch', value: 'Classic' },
      { label: 'Minimal sneakers, clean lines, modern tech', value: 'Modern' },
    ],
  },
  {
    id: 'Q7', phase: 'Phase 2 — Tradition',
    question: 'Which description feels closer to your ideal self?',
    options: [
      { label: 'Timeless and composed', value: 'Timeless' },
      { label: 'Innovative and dynamic', value: 'Innovative' },
    ],
  },
  {
    id: 'Q8', phase: 'Phase 2 — Tradition',
    question: "You'd rather be described as:",
    options: [
      { label: 'Dependable', value: 'Dependable' },
      { label: 'Captivating', value: 'Captivating' },
    ],
  },
  {
    id: 'Q9', phase: 'Phase 2 — Thermal',
    question: "Choose a setting you'd feel most confident in:",
    options: [
      { label: 'Bright daytime rooftop', value: 'Rooftop', sublabel: 'Open air, crisp, elevated' },
      { label: 'Candlelit evening lounge', value: 'Lounge', sublabel: 'Warm, intimate, atmospheric' },
    ],
  },
  {
    id: 'Q10', phase: 'Phase 2 — Thermal',
    question: 'Which environment feels most powerful to you?',
    options: [
      { label: 'Clean air after rain', value: 'Rain' },
      { label: 'Spices and wood in a winter cabin', value: 'Wood/Spice' },
    ],
  },
  {
    id: 'Q11', phase: 'Phase 2 — Sweetness',
    question: 'Your drink preference is closer to:',
    options: [
      { label: 'Black coffee or straight bourbon', value: 'Black Coffee', sublabel: 'Dry, direct, no sweetener' },
      { label: 'Latte or Old Fashioned', value: 'Latte/Old Fashioned', sublabel: 'Smooth, layered, a touch sweet' },
    ],
  },
  {
    id: 'Q12', phase: 'Phase 2 — Sweetness',
    question: 'When shopping, you gravitate toward:',
    options: [
      { label: 'Earth tones, navy, charcoal', value: 'Earth tones' },
      { label: 'Rich colors, texture, depth', value: 'Rich textures' },
    ],
  },
  {
    id: 'Q13', phase: 'Phase 2 — Projection',
    question: 'In close spaces, you prefer your scent to:',
    options: [
      { label: 'Stay intimate — close to the skin', value: 'Intimate' },
      { label: 'Announce your presence', value: 'Noticeable' },
    ],
  },
  {
    id: 'Q14', phase: 'Phase 3 — Environment',
    question: 'Strong fragrances sometimes give you headaches:',
    options: [
      { label: 'Yes, I prefer lighter options', value: 'Sensitive' },
      { label: 'No, I can handle bold scents', value: 'Tolerant' },
    ],
  },
  {
    id: 'Q15', phase: 'Phase 3 — Environment',
    question: 'Your climate is mostly:',
    options: [
      { label: 'Hot / humid', value: 'Hot/Humid' },
      { label: 'Mild', value: 'Mild' },
      { label: 'Cold / dry', value: 'Cold/Dry' },
    ],
  },
  {
    id: 'Q16', phase: 'Phase 3 — Environment',
    question: 'Your daily environment is:',
    options: [
      { label: 'Corporate / conservative', value: 'Corporate' },
      { label: 'Business casual', value: 'Business Casual' },
      { label: 'Creative / flexible', value: 'Creative' },
    ],
  },
  {
    id: 'Q17', phase: 'Phase 3 — Collection',
    question: 'How many fragrances do you currently own?',
    options: [
      { label: '0–2', value: '0-2', sublabel: 'Just getting started' },
      { label: '3–7', value: '3-7', sublabel: 'Building a rotation' },
      { label: '8+', value: '8+', sublabel: 'Collector' },
    ],
  },
  {
    id: 'Q18', phase: 'Phase 3 — Collection',
    question: 'List up to 3 fragrances you wear most often.',
    options: [],
    type: 'text',
  },
]

// ─── Result Display ───────────────────────────────────────────────────────────

function QuizResultCard({ result, onRetake }: { result: QuizResult; onRetake: () => void }) {
  return (
    <div className="mx-auto max-w-2xl">
      {/* Archetype */}
      <div className="text-center mb-10">
        <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold/70">Your Fragrance Identity</span>
        <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-cream">{result.archetype}</h2>
        <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        <p className="mt-5 text-sm text-cream-muted leading-relaxed max-w-lg mx-auto">{result.description}</p>
      </div>

      {/* Scent Families */}
      <div className="mb-8 rounded-xl border border-gold/15 bg-surface p-6">
        <h3 className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-gold/70">Scent Families</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Primary', value: result.primaryFamily, weight: '60%' },
            { label: 'Secondary', value: result.secondaryFamily, weight: '30%' },
            { label: 'Accent', value: result.accentFamily, weight: '10%' },
          ].map(({ label, value, weight }) => (
            <div key={label} className="text-center">
              <div className="text-[10px] uppercase tracking-wider text-cream-muted/50 mb-1">{label}</div>
              <div className="text-sm font-medium text-cream">{value}</div>
              <div className="text-[10px] text-gold/50 mt-0.5">{weight}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mb-8 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-gold/15 bg-surface p-5">
          <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-gold/70">Notes to Seek</h3>
          <ul className="space-y-1.5">
            {result.notesToSeek.map(note => (
              <li key={note} className="flex items-center gap-2 text-sm text-cream-muted">
                <span className="text-gold text-xs">+</span>{note}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-gold/15 bg-surface p-5">
          <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-cream-muted/40">Notes to Avoid</h3>
          <ul className="space-y-1.5">
            {result.notesToAvoid.map(note => (
              <li key={note} className="flex items-center gap-2 text-sm text-cream-muted/60">
                <span className="text-cream-muted/30 text-xs">–</span>{note}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Diversification */}
      {result.diversification.length > 0 && (
        <div className="mb-8 rounded-xl border border-gold/15 bg-surface p-5">
          <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-gold/70">Collection Insights</h3>
          <ul className="space-y-2">
            {result.diversification.map((tip, i) => (
              <li key={i} className="text-sm text-cream-muted leading-relaxed">{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <Link
          href="/"
          className="flex-1 text-center rounded-full bg-gold/15 border border-gold/30 px-6 py-2.5 text-sm font-medium text-gold hover:bg-gold/25 transition-all duration-200"
        >
          Explore Recommendations →
        </Link>
        <button
          onClick={onRetake}
          className="flex-1 text-center rounded-full border border-gold/10 px-6 py-2.5 text-sm font-medium text-cream-muted/50 hover:border-gold/20 hover:text-cream-muted transition-all duration-200"
        >
          Retake Quiz
        </button>
      </div>
    </div>
  )
}

// ─── Main Quiz Component ──────────────────────────────────────────────────────

export function FragranceQuiz() {
  const { isSignedIn } = useAuth()
  const collection = useCollection()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({})
  const [textInput, setTextInput] = useState('')
  const [result, setResult] = useState<QuizResult | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const current = QUESTIONS[currentIndex]
  const progress = ((currentIndex) / QUESTIONS.length) * 100

  const handleAnswer = useCallback(async (value: string) => {
    const newAnswers = { ...answers, [current.id]: value }
    setAnswers(newAnswers)

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(i => i + 1)
    } else {
      // Final question answered — run engine
      const finalAnswers = { ...newAnswers, Q1: newAnswers.Q1 ?? 'reinvent', Q2: newAnswers.Q2 ?? 'moderate' } as QuizAnswers
      const quizResult = runQuiz(finalAnswers)
      setResult(quizResult)

      // Save for signed-in users
      if (isSignedIn) {
        setSaving(true)
        await collection.saveQuizProfile({
          archetype:       quizResult.archetype,
          expression:      quizResult.axisScores.Expression,
          tradition:       quizResult.axisScores.Tradition,
          thermal:         quizResult.axisScores.Thermal,
          sweetness:       quizResult.axisScores.Sweetness,
          projection:      quizResult.axisScores.Projection,
          primaryFamily:   quizResult.primaryFamily,
          secondaryFamily: quizResult.secondaryFamily,
          accentFamily:    quizResult.accentFamily,
        })
        setSaving(false)
        setSaved(true)
      }
    }
  }, [answers, current, currentIndex, isSignedIn, collection])

  const handleTextSubmit = useCallback(() => {
    handleAnswer(textInput || '')
  }, [handleAnswer, textInput])

  const handleRetake = () => {
    setCurrentIndex(0)
    setAnswers({})
    setTextInput('')
    setResult(null)
    setSaved(false)
  }

  // Result screen
  if (result) {
    return (
      <div>
        {!isSignedIn && (
          <div className="mb-8 rounded-xl border border-gold/20 bg-gold/5 px-5 py-4 text-center">
            <p className="text-sm text-cream-muted">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('fragrance:signin-required'))}
                className="text-gold hover:text-gold-light underline underline-offset-2 transition-colors"
              >
                Sign in
              </button>
              {' '}to save your scent profile and personalise the selector.
            </p>
          </div>
        )}
        {saving && (
          <p className="mb-6 text-center text-xs text-cream-muted/50 uppercase tracking-wider">Saving your profile…</p>
        )}
        {saved && (
          <p className="mb-6 text-center text-xs text-gold/60 uppercase tracking-wider">Profile saved — your selector is now personalised.</p>
        )}
        <QuizResultCard result={result} onRetake={handleRetake} />
      </div>
    )
  }

  // Quiz screen
  return (
    <div className="mx-auto max-w-xl">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60">{current.phase}</span>
          <span className="text-[10px] uppercase tracking-[0.15em] text-cream-muted/40">
            {currentIndex + 1} / {QUESTIONS.length}
          </span>
        </div>
        <div className="h-px w-full bg-surface-elevated">
          <div
            className="h-full bg-gradient-to-r from-gold-dark to-gold transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="font-serif text-xl sm:text-2xl text-cream mb-8 leading-snug">
        {current.question}
      </h2>

      {/* Options */}
      {current.type === 'text' ? (
        <div className="space-y-4">
          <input
            type="text"
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleTextSubmit()}
            placeholder="e.g. Bleu de Chanel, Dior Sauvage…"
            className="w-full rounded-xl border border-gold/20 bg-surface px-4 py-3 text-sm text-cream placeholder:text-cream-muted/30 focus:border-gold/40 focus:outline-none transition-colors"
          />
          <button
            onClick={handleTextSubmit}
            className="w-full rounded-xl border border-gold/30 bg-gold/10 px-6 py-3 text-sm font-medium text-gold hover:bg-gold/20 transition-all duration-200"
          >
            {textInput ? 'Continue' : 'Skip'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {current.options.map(option => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className={cn(
                'w-full rounded-xl border px-5 py-4 text-left transition-all duration-200',
                'border-gold/15 bg-surface hover:border-gold/40 hover:bg-surface-elevated',
                'group'
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-cream group-hover:text-gold transition-colors duration-200">
                    {option.label}
                  </div>
                  {option.sublabel && (
                    <div className="mt-0.5 text-xs text-cream-muted/50">{option.sublabel}</div>
                  )}
                </div>
                <span className="text-gold/30 group-hover:text-gold/60 transition-colors duration-200 text-lg">→</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Back button */}
      {currentIndex > 0 && (
        <button
          onClick={() => setCurrentIndex(i => i - 1)}
          className="mt-6 text-xs text-cream-muted/40 hover:text-cream-muted transition-colors"
        >
          ← Back
        </button>
      )}
    </div>
  )
}
