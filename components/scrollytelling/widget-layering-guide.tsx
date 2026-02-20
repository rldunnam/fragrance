"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

/* ────────────────────────────────────────────────────────
   Data
   ──────────────────────────────────────────────────────── */

interface LayerStep {
  id: "shower" | "deodorant" | "cologne"
  label: string
  subtitle: string
  description: string
  tip: string
  bodyZone: string
  intensity: number          // default 0-100
  maxRecommended: number     // recommended max
  icon: "shower" | "deodorant" | "cologne"
}

const STEPS: LayerStep[] = [
  {
    id: "shower",
    label: "Shower Gel",
    subtitle: "Base Layer",
    description:
      "A scented shower gel provides the first invisible layer of fragrance, priming skin with complementary notes that enhance your cologne's longevity.",
    tip: "Use a scented body wash in the same olfactory family as your cologne. Woody cologne? Cedar body wash.",
    bodyZone: "Full body",
    intensity: 30,
    maxRecommended: 50,
    icon: "shower",
  },
  {
    id: "deodorant",
    label: "Deodorant",
    subtitle: "Mid Layer",
    description:
      "Your deodorant sits closest to your body heat. A subtle, complementary scent here bridges your base layer and your signature cologne.",
    tip: "Choose unscented or lightly scented formulas so they don't compete with your cologne.",
    bodyZone: "Underarms",
    intensity: 25,
    maxRecommended: 40,
    icon: "deodorant",
  },
  {
    id: "cologne",
    label: "Cologne",
    subtitle: "Signature Layer",
    description:
      "Your cologne is the dominant note in your olfactory signature. Apply to pulse points where body heat will project the scent throughout the day.",
    tip: "Two sprays are often enough. Pulse points: wrists, neck, and behind the ears.",
    bodyZone: "Pulse points",
    intensity: 75,
    maxRecommended: 100,
    icon: "cologne",
  },
]

/* ────────────────────────────────────────────────────────
   SVG Icons (minimalist, gold-lined)
   ──────────────────────────────────────────────────────── */

function ShowerIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn(
        "w-10 h-10 md:w-12 md:h-12 transition-all duration-500",
        active ? "opacity-100" : "opacity-40"
      )}
      aria-hidden="true"
    >
      {/* Shower head */}
      <rect
        x="18"
        y="6"
        width="12"
        height="4"
        rx="2"
        stroke={active ? "#D4AF37" : "#8A8A8A"}
        strokeWidth="1.5"
        fill="none"
      />
      {/* Handle */}
      <line
        x1="24"
        y1="10"
        x2="24"
        y2="18"
        stroke={active ? "#D4AF37" : "#8A8A8A"}
        strokeWidth="1.5"
      />
      {/* Drops */}
      {[16, 20, 24, 28, 32].map((x, i) => (
        <line
          key={x}
          x1={x}
          y1={22}
          x2={x}
          y2={28 + (i % 2 === 0 ? 2 : 0)}
          stroke={active ? "#D4AF37" : "#8A8A8A"}
          strokeWidth="1.5"
          strokeLinecap="round"
          className={active ? "animate-pulse" : ""}
          style={active ? { animationDelay: `${i * 150}ms` } : {}}
        />
      ))}
      {/* Body curve */}
      <path
        d="M20 32 C20 36, 24 42, 24 42 C24 42, 28 36, 28 32"
        stroke={active ? "#E8D5A3" : "#5A5A5A"}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

function DeodorantIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn(
        "w-10 h-10 md:w-12 md:h-12 transition-all duration-500",
        active ? "opacity-100" : "opacity-40"
      )}
      aria-hidden="true"
    >
      {/* Stick body */}
      <rect
        x="17"
        y="14"
        width="14"
        height="26"
        rx="3"
        stroke={active ? "#D4AF37" : "#8A8A8A"}
        strokeWidth="1.5"
        fill="none"
      />
      {/* Cap */}
      <rect
        x="19"
        y="6"
        width="10"
        height="8"
        rx="2"
        stroke={active ? "#D4AF37" : "#8A8A8A"}
        strokeWidth="1.5"
        fill={active ? "rgba(212,175,55,0.1)" : "none"}
      />
      {/* Scent waves */}
      {active && (
        <>
          <path
            d="M34 18 C36 20, 36 24, 34 26"
            stroke="#D4AF37"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M37 16 C40 20, 40 24, 37 28"
            stroke="#D4AF37"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            opacity="0.3"
          />
        </>
      )}
    </svg>
  )
}

function CologneIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn(
        "w-10 h-10 md:w-12 md:h-12 transition-all duration-500",
        active ? "opacity-100" : "opacity-40"
      )}
      aria-hidden="true"
    >
      {/* Bottle body */}
      <rect
        x="15"
        y="18"
        width="18"
        height="24"
        rx="2"
        stroke={active ? "#D4AF37" : "#8A8A8A"}
        strokeWidth="1.5"
        fill={active ? "rgba(212,175,55,0.05)" : "none"}
      />
      {/* Neck */}
      <rect
        x="20"
        y="12"
        width="8"
        height="6"
        stroke={active ? "#D4AF37" : "#8A8A8A"}
        strokeWidth="1.5"
        fill="none"
      />
      {/* Sprayer */}
      <rect
        x="22"
        y="6"
        width="4"
        height="6"
        rx="1"
        stroke={active ? "#D4AF37" : "#8A8A8A"}
        strokeWidth="1.5"
        fill={active ? "rgba(212,175,55,0.15)" : "none"}
      />
      {/* Spray mist */}
      {active && (
        <>
          <circle cx="24" cy="3" r="1" fill="#D4AF37" opacity="0.5" />
          <circle cx="20" cy="2" r="0.7" fill="#D4AF37" opacity="0.3" />
          <circle cx="28" cy="2" r="0.7" fill="#D4AF37" opacity="0.3" />
        </>
      )}
      {/* Label line */}
      <line
        x1="18"
        y1="28"
        x2="30"
        y2="28"
        stroke={active ? "#E8D5A3" : "#5A5A5A"}
        strokeWidth="0.8"
      />
    </svg>
  )
}

function StepIcon({ icon, active }: { icon: LayerStep["icon"]; active: boolean }) {
  switch (icon) {
    case "shower":
      return <ShowerIcon active={active} />
    case "deodorant":
      return <DeodorantIcon active={active} />
    case "cologne":
      return <CologneIcon active={active} />
  }
}

/* ────────────────────────────────────────────────────────
   Silhouette with animated pulse zones
   ──────────────────────────────────────────────────────── */

function SilhouetteFigure({
  activeStep,
  intensities,
}: {
  activeStep: number
  intensities: number[]
}) {
  const stepId = STEPS[activeStep].id
  const intensity = intensities[activeStep] / 100

  return (
    <svg
      viewBox="0 0 120 260"
      className="w-full h-full max-h-[320px] md:max-h-[380px]"
      aria-label="Human silhouette showing fragrance application zones"
      role="img"
    >
      <defs>
        <radialGradient id="pulse-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.6 * intensity} />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pulse-glow-subtle" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.3 * intensity} />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Body outline */}
      <g stroke="#2A2A35" strokeWidth="1.2" fill="none">
        {/* Head */}
        <ellipse cx="60" cy="32" rx="16" ry="20" />
        {/* Neck */}
        <line x1="52" y1="52" x2="52" y2="65" />
        <line x1="68" y1="52" x2="68" y2="65" />
        {/* Shoulders */}
        <path d="M52 65 C40 68, 25 75, 20 85" />
        <path d="M68 65 C80 68, 95 75, 100 85" />
        {/* Torso */}
        <line x1="20" y1="85" x2="25" y2="155" />
        <line x1="100" y1="85" x2="95" y2="155" />
        {/* Hips */}
        <path d="M25 155 C30 160, 55 165, 60 165" />
        <path d="M95 155 C90 160, 65 165, 60 165" />
        {/* Left arm */}
        <path d="M20 85 C15 100, 10 120, 8 140" />
        {/* Right arm */}
        <path d="M100 85 C105 100, 110 120, 112 140" />
        {/* Left leg */}
        <path d="M40 160 C38 190, 35 220, 33 248" />
        {/* Right leg */}
        <path d="M80 160 C82 190, 85 220, 87 248" />
      </g>

      {/* ---- Application zone glows ---- */}

      {/* Shower gel: full body wash */}
      <g
        className="transition-opacity duration-700"
        style={{ opacity: stepId === "shower" ? 1 : 0 }}
      >
        <ellipse cx="60" cy="120" rx="45" ry="65" fill="url(#pulse-glow-subtle)">
          <animate
            attributeName="rx"
            values="42;48;42"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="ry"
            values="62;68;62"
            dur="3s"
            repeatCount="indefinite"
          />
        </ellipse>
      </g>

      {/* Deodorant: underarms */}
      <g
        className="transition-opacity duration-700"
        style={{ opacity: stepId === "deodorant" ? 1 : 0 }}
      >
        <ellipse cx="25" cy="90" rx="14" ry="10" fill="url(#pulse-glow)">
          <animate
            attributeName="rx"
            values="12;16;12"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse cx="95" cy="90" rx="14" ry="10" fill="url(#pulse-glow)">
          <animate
            attributeName="rx"
            values="12;16;12"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </ellipse>
      </g>

      {/* Cologne: pulse points (neck, wrists, behind ears) */}
      <g
        className="transition-opacity duration-700"
        style={{ opacity: stepId === "cologne" ? 1 : 0 }}
      >
        {/* Neck */}
        <ellipse cx="60" cy="58" rx="10" ry="8" fill="url(#pulse-glow)">
          <animate
            attributeName="rx"
            values="8;12;8"
            dur="2s"
            repeatCount="indefinite"
          />
        </ellipse>
        {/* Left wrist */}
        <ellipse cx="8" cy="140" rx="8" ry="6" fill="url(#pulse-glow)">
          <animate
            attributeName="rx"
            values="6;10;6"
            dur="2.2s"
            repeatCount="indefinite"
          />
        </ellipse>
        {/* Right wrist */}
        <ellipse cx="112" cy="140" rx="8" ry="6" fill="url(#pulse-glow)">
          <animate
            attributeName="rx"
            values="6;10;6"
            dur="2.2s"
            repeatCount="indefinite"
          />
        </ellipse>
        {/* Behind left ear */}
        <ellipse cx="42" cy="28" rx="6" ry="5" fill="url(#pulse-glow-subtle)">
          <animate
            attributeName="rx"
            values="5;8;5"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </ellipse>
        {/* Behind right ear */}
        <ellipse cx="78" cy="28" rx="6" ry="5" fill="url(#pulse-glow-subtle)">
          <animate
            attributeName="rx"
            values="5;8;5"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </ellipse>
      </g>

      {/* Zone label */}
      <text
        x="60"
        y="252"
        textAnchor="middle"
        fill="#D4AF37"
        fontSize="9"
        fontFamily="sans-serif"
        letterSpacing="0.12em"
        className="uppercase"
      >
        {STEPS[activeStep].bodyZone}
      </text>
    </svg>
  )
}

/* ────────────────────────────────────────────────────────
   Intensity Slider
   ──────────────────────────────────────────────────────── */

function IntensitySlider({
  value,
  maxRecommended,
  onChange,
  label,
}: {
  value: number
  maxRecommended: number
  onChange: (v: number) => void
  label: string
}) {
  const isOverMax = value > maxRecommended
  const trackRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs tracking-wider uppercase text-cream-muted/70">
          {label} Intensity
        </span>
        <span
          className={cn(
            "text-xs font-medium tabular-nums transition-colors duration-300",
            isOverMax ? "text-red-400" : "text-gold"
          )}
        >
          {value}%
        </span>
      </div>

      {/* Custom track */}
      <div className="relative h-8 flex items-center" ref={trackRef}>
        {/* Background track */}
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-surface-elevated" />

        {/* Recommended zone */}
        <div
          className="absolute h-1.5 rounded-full bg-gold/10 left-0"
          style={{ width: `${maxRecommended}%` }}
        />

        {/* Active fill */}
        <div
          className={cn(
            "absolute h-1.5 rounded-full left-0 transition-all duration-200",
            isOverMax
              ? "bg-gradient-to-r from-gold to-red-400"
              : "bg-gold/60"
          )}
          style={{ width: `${value}%` }}
        />

        {/* Recommended limit marker */}
        <div
          className="absolute top-0 bottom-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ left: `${maxRecommended}%` }}
        >
          <div className="w-px h-full bg-gold/30" />
        </div>

        {/* Range input */}
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={`${label} intensity`}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        {/* Thumb visual */}
        <div
          className={cn(
            "absolute w-4 h-4 rounded-full border-2 transition-all duration-200 pointer-events-none -translate-x-1/2",
            isOverMax
              ? "border-red-400 bg-red-400/20 shadow-[0_0_8px_rgba(248,113,113,0.3)]"
              : "border-gold bg-background shadow-[0_0_8px_rgba(212,175,55,0.3)]"
          )}
          style={{ left: `${value}%` }}
        />
      </div>

      {/* Warning */}
      <div className="h-4">
        {isOverMax && (
          <p className="text-[11px] text-red-400/80 leading-tight">
            Exceeds recommended level &mdash; risk of scent clash
          </p>
        )}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────
   Total Intensity Meter (Two-Product Rule)
   ──────────────────────────────────────────────────────── */

function TotalIntensityMeter({ intensities }: { intensities: number[] }) {
  // Weighted total: cologne is the dominant, others are supporting
  const total = intensities[0] * 0.2 + intensities[1] * 0.2 + intensities[2] * 0.6
  const balanced = total <= 70
  const label = total <= 40 ? "Subtle" : total <= 70 ? "Balanced" : "Overpowering"

  return (
    <div className="rounded-lg border border-border bg-surface/60 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs tracking-wider uppercase text-cream-muted/70">
          Overall Balance
        </span>
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-wider transition-colors duration-300",
            balanced ? "text-gold" : "text-red-400"
          )}
        >
          {label}
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-surface-elevated overflow-hidden">
        <div
          className={cn(
            "absolute left-0 top-0 h-full rounded-full transition-all duration-500",
            total <= 40
              ? "bg-gold/40"
              : total <= 70
                ? "bg-gold"
                : "bg-gradient-to-r from-gold to-red-400"
          )}
          style={{ width: `${Math.min(total, 100)}%` }}
        />
      </div>
      <p className="mt-2 text-[11px] text-cream-muted/50 leading-relaxed">
        The Two-Product Rule: limit fragranced products to two maximum for harmony, not chaos.
      </p>
    </div>
  )
}

/* ────────────────────────────────────────────────────────
   Step Navigation Dots
   ──────────────────────────────────────────────────────── */

function StepNav({
  steps,
  activeStep,
  onSelect,
}: {
  steps: LayerStep[]
  activeStep: number
  onSelect: (i: number) => void
}) {
  return (
    <div className="flex items-center justify-center gap-2" role="tablist" aria-label="Layering steps">
      {steps.map((step, i) => {
        const isActive = i === activeStep
        const isPast = i < activeStep
        return (
          <button
            key={step.id}
            role="tab"
            aria-selected={isActive}
            aria-label={`Step ${i + 1}: ${step.label}`}
            onClick={() => onSelect(i)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 cursor-pointer",
              "text-xs md:text-sm tracking-wide",
              isActive
                ? "border-gold/50 bg-gold/10 text-gold"
                : isPast
                  ? "border-border bg-surface-elevated/50 text-cream-muted/60"
                  : "border-border/50 bg-transparent text-cream-muted/40 hover:border-border hover:text-cream-muted/60"
            )}
          >
            <span
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 transition-all duration-300",
                isActive
                  ? "bg-gold text-background"
                  : isPast
                    ? "bg-gold/20 text-gold/60"
                    : "bg-surface-elevated text-cream-muted/40"
              )}
            >
              {i + 1}
            </span>
            <span className="hidden sm:inline">{step.label}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ────────────────────────────────────────────────────────
   Connection Line between steps
   ──────────────────────────────────────────────────────── */

function StepConnector({ completed }: { completed: boolean }) {
  return (
    <div className="hidden sm:flex items-center">
      <div
        className={cn(
          "w-6 h-px transition-colors duration-500",
          completed ? "bg-gold/40" : "bg-border/30"
        )}
      />
      <svg width="6" height="10" viewBox="0 0 6 10" className={cn(
        "transition-colors duration-500",
        completed ? "text-gold/40" : "text-border/30"
      )}>
        <path d="M1 1 L5 5 L1 9" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    </div>
  )
}

/* ────────────────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────────────────── */

export function LayeringGuide() {
  const [activeStep, setActiveStep] = useState(0)
  const [intensities, setIntensities] = useState([
    STEPS[0].intensity,
    STEPS[1].intensity,
    STEPS[2].intensity,
  ])
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const step = STEPS[activeStep]

  const updateIntensity = useCallback(
    (idx: number, val: number) => {
      setIntensities((prev) => {
        const next = [...prev]
        next[idx] = val
        return next
      })
      setIsAutoPlaying(false)
    },
    []
  )

  // Auto-advance steps
  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const handleSelectStep = useCallback((i: number) => {
    setActiveStep(i)
    setIsAutoPlaying(false)
  }, [])

  return (
    <div
      id="widget-layering-guide"
      className="scroll-reveal my-8 rounded-lg border border-gold/15 bg-surface/40 overflow-hidden"
    >
      {/* Header */}
      <div className="border-b border-border/50 px-5 py-4 md:px-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold/50 mb-1">
              Interactive Guide
            </div>
            <h4 className="font-serif text-lg md:text-xl text-cream font-semibold">
              Fragrance Layering
            </h4>
          </div>
          <StepNav
            steps={STEPS}
            activeStep={activeStep}
            onSelect={handleSelectStep}
          />
        </div>
      </div>

      {/* Main content: silhouette + details */}
      <div className="flex flex-col md:flex-row">
        {/* Left: Silhouette */}
        <div className="md:w-[280px] lg:w-[320px] flex-shrink-0 flex items-center justify-center p-6 md:p-8 border-b md:border-b-0 md:border-r border-border/30 bg-background/30">
          <SilhouetteFigure
            activeStep={activeStep}
            intensities={intensities}
          />
        </div>

        {/* Right: Step details */}
        <div className="flex-1 p-5 md:p-6 lg:p-8 flex flex-col justify-between min-h-[340px]">
          {/* Step indicator + icon */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg border border-gold/20 bg-gold/5">
                <StepIcon icon={step.icon} active />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-gold/60 mb-0.5">
                  Step {activeStep + 1} of {STEPS.length}
                </div>
                <h5 className="font-serif text-base md:text-lg text-cream font-semibold leading-snug">
                  {step.label}
                  <span className="text-cream-muted/50 font-sans text-xs font-normal ml-2">
                    {step.subtitle}
                  </span>
                </h5>
              </div>
            </div>

            <p className="text-sm text-cream-muted/80 leading-relaxed mb-4">
              {step.description}
            </p>

            {/* Tip */}
            <div className="flex items-start gap-2 rounded-md bg-gold/5 border border-gold/10 px-3 py-2.5 mb-5">
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="w-4 h-4 mt-0.5 shrink-0 text-gold/70"
              >
                <path
                  d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 10.5a.75.75 0 110-1.5.75.75 0 010 1.5zM8.75 4.75v4a.75.75 0 01-1.5 0v-4a.75.75 0 011.5 0z"
                  fill="currentColor"
                />
              </svg>
              <p className="text-xs text-cream-muted/70 leading-relaxed">
                {step.tip}
              </p>
            </div>
          </div>

          {/* Intensity slider */}
          <div className="space-y-4">
            <IntensitySlider
              value={intensities[activeStep]}
              maxRecommended={step.maxRecommended}
              onChange={(v) => updateIntensity(activeStep, v)}
              label={step.label}
            />

            <TotalIntensityMeter intensities={intensities} />
          </div>
        </div>
      </div>

      {/* Bottom: step flow overview */}
      <div className="border-t border-border/30 px-5 py-3 md:px-6 bg-background/20">
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="contents">
              <button
                onClick={() => handleSelectStep(i)}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded transition-all duration-300 cursor-pointer",
                  i === activeStep
                    ? "text-gold"
                    : i < activeStep
                      ? "text-cream-muted/50"
                      : "text-cream-muted/30 hover:text-cream-muted/50"
                )}
                aria-label={`Go to ${s.label}`}
              >
                <StepIcon icon={s.icon} active={i === activeStep} />
                <span className="text-[10px] md:text-xs tracking-wider uppercase hidden sm:inline">
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && <StepConnector completed={i < activeStep} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
