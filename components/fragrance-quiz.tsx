'use client'

import { useState, useCallback, useMemo } from 'react'
import { useAuth } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import { runQuiz, quizResultToFilters, encodeFiltersToParams, type QuizAnswers, type QuizResult } from '@/lib/fragrances/quiz-engine'
import { quizBoostScore } from '@/lib/fragrances/taste-profile'
import { useCollection } from '@/lib/collection-context'
import { fragrances } from '@/lib/fragrances/data'
import type { Fragrance } from '@/lib/fragrances/types'
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

// ─── Top Matches ─────────────────────────────────────────────────────────────

function getTopMatches(result: QuizResult, count = 5): Fragrance[] {
  const profile = {
    primaryFamily:   result.primaryFamily,
    secondaryFamily: result.secondaryFamily,
    accentFamily:    result.accentFamily,
    projection:      result.axisScores.Projection,
    sweetness:       result.axisScores.Sweetness,
    thermal:         result.axisScores.Thermal,
  }
  return [...fragrances]
    .map(f => ({ fragrance: f, score: quizBoostScore(f, profile, 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ fragrance }) => fragrance)
}

// ─── Mini Fragrance Card ──────────────────────────────────────────────────────

function MiniFragranceCard({ fragrance, rank }: { fragrance: Fragrance; rank: number }) {
  const allNotes = [...fragrance.topNotes, ...fragrance.heartNotes, ...fragrance.baseNotes].slice(0, 4)
  return (
    <div className="flex items-start gap-4 rounded-xl border border-gold/15 bg-surface p-4 hover:border-gold/30 transition-all duration-200">
      {/* Rank */}
      <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full border border-gold/20 bg-surface-elevated">
        <span className="font-serif text-sm text-gold/60">{rank}</span>
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-cream leading-snug">{fragrance.name}</p>
            <p className="text-xs text-cream-muted/60 mt-0.5">{fragrance.house}</p>
          </div>
          <span className="flex-shrink-0 text-xs text-cream-muted/40 font-medium">${fragrance.price}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {allNotes.map(note => (
            <span key={note} className="rounded-full bg-surface-elevated border border-gold/10 px-2 py-0.5 text-[10px] text-cream-muted/60">
              {note}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Result Display ───────────────────────────────────────────────────────────

function QuizResultCard({ result, onRetake, topMatches, filterUrl }: { result: QuizResult; onRetake: () => void; topMatches: Fragrance[]; filterUrl: string }) {
  return (
    <div className="mx-auto max-w-2xl">

      {/* Archetype header */}
      <div className="text-center mb-10">
        <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-gold/70">Your Fragrance Identity</span>
        <h2 className="mt-4 font-serif text-4xl sm:text-5xl text-cream leading-tight">{result.archetype}</h2>
        <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        <p className="mt-6 text-base text-cream-muted leading-relaxed max-w-lg mx-auto">{result.description}</p>
      </div>

      {/* Scent Families */}
      <div className="mb-6 rounded-xl border border-gold/15 bg-surface p-6">
        <h3 className="mb-5 text-[11px] font-medium uppercase tracking-[0.2em] text-gold/70">Scent Families</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Primary', value: result.primaryFamily, weight: '60%' },
            { label: 'Secondary', value: result.secondaryFamily, weight: '30%' },
            { label: 'Accent', value: result.accentFamily, weight: '10%' },
          ].map(({ label, value, weight }) => (
            <div key={label} className="text-center">
              <div className="text-[10px] uppercase tracking-wider text-cream-muted/50 mb-2">{label}</div>
              <div className="text-sm font-medium text-cream leading-snug">{value}</div>
              <div className="text-[10px] text-gold/50 mt-1">{weight}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-gold/15 bg-surface p-5">
          <h3 className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-gold/70">Seek</h3>
          <ul className="space-y-2">
            {result.notesToSeek.map(note => (
              <li key={note} className="flex items-center gap-2 text-sm text-cream-muted">
                <span className="text-gold text-xs leading-none">+</span>{note}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-gold/10 bg-surface p-5">
          <h3 className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-cream-muted/30">Avoid</h3>
          <ul className="space-y-2">
            {result.notesToAvoid.map(note => (
              <li key={note} className="flex items-center gap-2 text-sm text-cream-muted/50">
                <span className="text-cream-muted/30 text-xs leading-none">–</span>{note}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Collection Insights */}
      {result.diversification.length > 0 && (
        <div className="mb-6 rounded-xl border border-gold/15 bg-surface p-5">
          <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-gold/70">Collection Insights</h3>
          <ul className="space-y-2">
            {result.diversification.map((tip, i) => (
              <li key={i} className="text-sm text-cream-muted leading-relaxed">{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Top Matches */}
      {topMatches.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-gold/70">
            Your Top {topMatches.length} Matches
          </h3>
          <div className="space-y-3">
            {topMatches.map((f, i) => (
              <MiniFragranceCard key={f.id} fragrance={f} rank={i + 1} />
            ))}
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href={`/?${filterUrl}`}
          className="flex-1 text-center rounded-full bg-gold/15 border border-gold/30 px-6 py-3 text-sm font-medium text-gold hover:bg-gold/25 transition-all duration-200"
        >
          Explore Recommendations →
        </Link>
        <button
          onClick={onRetake}
          className="flex-1 text-center rounded-full border border-gold/10 px-6 py-3 text-sm font-medium text-cream-muted/50 hover:border-gold/20 hover:text-cream-muted transition-all duration-200"
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
  const [finalAnswers, setFinalAnswers] = useState<QuizAnswers | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const current = QUESTIONS[currentIndex]
  const progress = (currentIndex / QUESTIONS.length) * 100

  const topMatches = useMemo(() => result ? getTopMatches(result, 5) : [], [result])
  const filterUrl  = useMemo(() => {
    if (!result || !finalAnswers) return ''
    return encodeFiltersToParams(quizResultToFilters(result, finalAnswers))
  }, [result, finalAnswers])

  const handleAnswer = useCallback(async (value: string) => {
    const newAnswers = { ...answers, [current.id]: value }
    setAnswers(newAnswers)

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(i => i + 1)
    } else {
      const finalAnswers = {
        ...newAnswers,
        Q1: (newAnswers.Q1 ?? 'reinvent') as QuizAnswers['Q1'],
        Q2: (newAnswers.Q2 ?? 'moderate') as QuizAnswers['Q2'],
      } as QuizAnswers
      const quizResult = runQuiz(finalAnswers)
      setResult(quizResult)
      setFinalAnswers(finalAnswers)

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
    setFinalAnswers(null)
    setSaved(false)
  }

  // ── Result screen ──
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
        <QuizResultCard result={result} onRetake={handleRetake} topMatches={topMatches} filterUrl={filterUrl} />
      </div>
    )
  }

  // ── Quiz screen ──
  return (
    <div className="mx-auto max-w-xl">

      {/* Progress bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold/60">{current.phase}</span>
          <span className="text-xs text-cream-muted/40 tabular-nums">
            {currentIndex + 1} / {QUESTIONS.length}
          </span>
        </div>
        <div className="h-[2px] w-full bg-surface-elevated rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-dark to-gold transition-all duration-500 ease-out rounded-full"
            style={{ width: `${Math.max(progress, 2)}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-cream mb-10 leading-snug">
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
            className="w-full rounded-xl border border-gold/20 bg-surface px-5 py-4 text-base text-cream placeholder:text-cream-muted/30 focus:border-gold/40 focus:outline-none transition-colors"
          />
          <button
            onClick={handleTextSubmit}
            className="w-full rounded-xl border border-gold/30 bg-gold/10 px-6 py-4 text-sm font-medium text-gold hover:bg-gold/20 transition-all duration-200"
          >
            {textInput ? 'Continue →' : 'Skip →'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {current.options.map(option => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className={cn(
                'group w-full rounded-xl border border-gold/15 bg-surface px-6 py-5 text-left',
                'hover:border-gold/50 hover:bg-surface-elevated',
                'transition-all duration-200 active:scale-[0.99]'
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-base font-medium text-cream group-hover:text-gold transition-colors duration-200">
                    {option.label}
                  </div>
                  {option.sublabel && (
                    <div className="mt-1 text-sm text-cream-muted/50">{option.sublabel}</div>
                  )}
                </div>
                <span className="flex-shrink-0 text-xl text-gold/20 group-hover:text-gold/70 group-hover:translate-x-1 transition-all duration-200">
                  →
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Back */}
      {currentIndex > 0 && (
        <button
          onClick={() => setCurrentIndex(i => i - 1)}
          className="mt-8 text-sm text-cream-muted/40 hover:text-cream-muted transition-colors"
        >
          ← Back
        </button>
      )}
    </div>
  )
}
