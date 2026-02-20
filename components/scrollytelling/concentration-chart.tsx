"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts"
import { cn } from "@/lib/utils"
import { Droplets, Clock, DollarSign, Sparkles } from "lucide-react"

/* ─── Data ─── */

interface ConcentrationData {
  name: string
  fullName: string
  oilMin: number
  oilMax: number
  longevityMin: number
  longevityMax: number
  useCase: string
  price: string
  priceLevel: number // 1-4
  description: string
}

const CONCENTRATIONS: ConcentrationData[] = [
  {
    name: "EDC",
    fullName: "Eau de Cologne",
    oilMin: 2,
    oilMax: 4,
    longevityMin: 1,
    longevityMax: 2,
    useCase: "Post-shower refresh, hot weather, casual daytime",
    price: "Budget-friendly",
    priceLevel: 1,
    description:
      "The lightest concentration. A burst of freshness that fades quickly — ideal for a quick pick-me-up or layering base.",
  },
  {
    name: "EDT",
    fullName: "Eau de Toilette",
    oilMin: 5,
    oilMax: 15,
    longevityMin: 3,
    longevityMax: 5,
    useCase: "Daily wear, office, casual outings",
    price: "Moderate",
    priceLevel: 2,
    description:
      "The workhorse of most collections. Balanced projection and longevity make it the go-to for everyday wear.",
  },
  {
    name: "EDP",
    fullName: "Eau de Parfum",
    oilMin: 15,
    oilMax: 20,
    longevityMin: 6,
    longevityMax: 8,
    useCase: "Evening events, date nights, cooler seasons",
    price: "Premium",
    priceLevel: 3,
    description:
      "Richer depth and longer wear. The heart and base notes truly shine, revealing complexity over hours.",
  },
  {
    name: "Parfum",
    fullName: "Parfum (Extrait)",
    oilMin: 20,
    oilMax: 40,
    longevityMin: 8,
    longevityMax: 24,
    useCase: "Special occasions, formal events, signature scent",
    price: "Luxury",
    priceLevel: 4,
    description:
      "The pinnacle of concentration. Intimate sillage with extraordinary longevity — a single application lasts all day.",
  },
]

const OIL_BAR_COLOR = "#D4AF37"
const OIL_BAR_DIM = "#3A3520"
const LONGEVITY_BAR_COLOR = "#E8D5A3"
const LONGEVITY_BAR_DIM = "#2A2822"
const GRID_COLOR = "#1E1E28"
const AXIS_COLOR = "#5A5A60"
const TOOLTIP_BG = "#18181F"
const TOOLTIP_BORDER = "#D4AF3740"

/* ─── Chart data shapes ─── */

interface OilChartRow {
  name: string
  oilMax: number
  oilMin: number
}

interface LongevityChartRow {
  name: string
  longevityMax: number
  longevityMin: number
}

/* ─── Custom Tooltip ─── */

function ConcentrationTooltip({
  active,
  payload,
  chartType,
}: {
  active?: boolean
  payload?: Array<{ payload: OilChartRow | LongevityChartRow }>
  chartType: "oil" | "longevity"
}) {
  if (!active || !payload || !payload.length) return null
  const row = payload[0].payload
  const data = CONCENTRATIONS.find((c) => c.name === row.name)
  if (!data) return null

  return (
    <div
      className="rounded-lg border px-4 py-3 shadow-xl max-w-[260px]"
      style={{
        backgroundColor: TOOLTIP_BG,
        borderColor: TOOLTIP_BORDER,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="font-serif text-sm font-semibold"
          style={{ color: "#D4AF37" }}
        >
          {data.fullName}
        </span>
      </div>
      {chartType === "oil" ? (
        <div className="flex items-center gap-1.5 mb-1.5">
          <Droplets size={13} style={{ color: "#D4AF37" }} />
          <span className="text-xs" style={{ color: "#E5E5E0" }}>
            {data.oilMin}% &ndash; {data.oilMax}% fragrance oil
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 mb-1.5">
          <Clock size={13} style={{ color: "#E8D5A3" }} />
          <span className="text-xs" style={{ color: "#E5E5E0" }}>
            {data.longevityMin} &ndash; {data.longevityMax} hours
          </span>
        </div>
      )}
      <p className="text-[11px] leading-relaxed mt-1" style={{ color: "#9A9A9A" }}>
        {data.useCase}
      </p>
    </div>
  )
}

/* ─── Price indicator dots ─── */

function PriceDots({ level, max = 4 }: { level: number; max?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <DollarSign
          key={i}
          size={11}
          style={{
            color: i < level ? "#D4AF37" : "#2A2A35",
          }}
        />
      ))}
    </span>
  )
}

/* ─── Main Component ─── */

export function ConcentrationChart() {
  const [activeConcentration, setActiveConcentration] = useState<string | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  /* Scroll reveal */
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  /* Chart data */
  const oilData: OilChartRow[] = CONCENTRATIONS.map((c) => ({
    name: c.name,
    oilMax: c.oilMax,
    oilMin: c.oilMin,
  }))

  const longevityData: LongevityChartRow[] = CONCENTRATIONS.map((c) => ({
    name: c.name,
    longevityMax: c.longevityMax,
    longevityMin: c.longevityMin,
  }))

  const handleMouseEnter = useCallback((name: string) => {
    setActiveConcentration(name)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setActiveConcentration(null)
  }, [])

  const getOilBarColor = (name: string) => {
    if (!activeConcentration) return OIL_BAR_COLOR
    return name === activeConcentration ? OIL_BAR_COLOR : OIL_BAR_DIM
  }

  const getLongevityBarColor = (name: string) => {
    if (!activeConcentration) return LONGEVITY_BAR_COLOR
    return name === activeConcentration ? LONGEVITY_BAR_COLOR : LONGEVITY_BAR_DIM
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "my-8 rounded-lg border border-border bg-surface/80 overflow-hidden",
        "transition-all duration-700",
        isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3 md:px-7 md:pt-6 md:pb-4 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={14} style={{ color: "#D4AF37" }} />
          <span className="text-[10px] font-medium uppercase tracking-[0.18em]" style={{ color: "#D4AF37" }}>
            Concentration Comparison
          </span>
        </div>
        <h4 className="font-serif text-lg md:text-xl font-semibold" style={{ color: "#F5F5F0" }}>
          From Light to Luxurious
        </h4>
        <p className="text-xs mt-1 leading-relaxed" style={{ color: "#8A8A8A" }}>
          Hover over any concentration to explore its characteristics. Compare oil percentage and wear time side by side.
        </p>
      </div>

      {/* Charts container */}
      <div className="px-3 py-4 md:px-5 md:py-6">
        {/* Dual-chart layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Oil % Chart */}
          <div>
            <div className="flex items-center gap-2 mb-3 px-2">
              <Droplets size={14} style={{ color: "#D4AF37" }} />
              <span className="text-xs font-medium tracking-wide" style={{ color: "#D4AF37" }}>
                Fragrance Oil %
              </span>
            </div>
            <div
              className={cn(
                "transition-all duration-1000 ease-out",
                isRevealed ? "opacity-100" : "opacity-0"
              )}
              style={{ height: 200 }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={oilData}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                  barCategoryGap="28%"
                >
                  <CartesianGrid
                    horizontal={false}
                    stroke={GRID_COLOR}
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    type="number"
                    domain={[0, 45]}
                    tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: GRID_COLOR }}
                    tickFormatter={(v: number) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: "#F5F5F0", fontSize: 12, fontFamily: "Playfair Display, serif" }}
                    tickLine={false}
                    axisLine={false}
                    width={56}
                  />
                  <Tooltip
                    content={<ConcentrationTooltip chartType="oil" />}
                    cursor={{ fill: "#D4AF3708" }}
                  />
                  <ReferenceLine
                    x={20}
                    stroke="#D4AF3720"
                    strokeDasharray="4 4"
                    label={{
                      value: "EDP threshold",
                      position: "top",
                      fill: "#5A5A60",
                      fontSize: 9,
                    }}
                  />
                  <Bar
                    dataKey="oilMax"
                    radius={[0, 4, 4, 0]}
                    isAnimationActive={isRevealed}
                    animationDuration={1200}
                    animationEasing="ease-out"
                    onMouseLeave={handleMouseLeave}
                  >
                    {oilData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={getOilBarColor(entry.name)}
                        style={{ cursor: "pointer", transition: "fill 0.35s ease" }}
                        onMouseEnter={() => handleMouseEnter(entry.name)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Longevity Chart */}
          <div>
            <div className="flex items-center gap-2 mb-3 px-2">
              <Clock size={14} style={{ color: "#E8D5A3" }} />
              <span className="text-xs font-medium tracking-wide" style={{ color: "#E8D5A3" }}>
                Longevity (hours)
              </span>
            </div>
            <div
              className={cn(
                "transition-all duration-1000 delay-200 ease-out",
                isRevealed ? "opacity-100" : "opacity-0"
              )}
              style={{ height: 200 }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={longevityData}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                  barCategoryGap="28%"
                >
                  <CartesianGrid
                    horizontal={false}
                    stroke={GRID_COLOR}
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    type="number"
                    domain={[0, 26]}
                    tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: GRID_COLOR }}
                    tickFormatter={(v: number) => `${v}h`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: "#F5F5F0", fontSize: 12, fontFamily: "Playfair Display, serif" }}
                    tickLine={false}
                    axisLine={false}
                    width={56}
                  />
                  <Tooltip
                    content={<ConcentrationTooltip chartType="longevity" />}
                    cursor={{ fill: "#E8D5A308" }}
                  />
                  <ReferenceLine
                    x={8}
                    stroke="#E8D5A320"
                    strokeDasharray="4 4"
                    label={{
                      value: "Full workday",
                      position: "top",
                      fill: "#5A5A60",
                      fontSize: 9,
                    }}
                  />
                  <Bar
                    dataKey="longevityMax"
                    radius={[0, 4, 4, 0]}
                    isAnimationActive={isRevealed}
                    animationDuration={1200}
                    animationBegin={200}
                    animationEasing="ease-out"
                    onMouseLeave={handleMouseLeave}
                  >
                    {longevityData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={getLongevityBarColor(entry.name)}
                        style={{ cursor: "pointer", transition: "fill 0.35s ease" }}
                        onMouseEnter={() => handleMouseEnter(entry.name)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detail cards row */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 px-1">
          {CONCENTRATIONS.map((c) => {
            const isActive = activeConcentration === c.name
            const isDimmed = activeConcentration !== null && !isActive
            return (
              <button
                key={c.name}
                type="button"
                className={cn(
                  "rounded-lg border p-3 md:p-4 text-left transition-all duration-350 cursor-pointer",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                  isActive
                    ? "border-gold/40 bg-surface-elevated shadow-lg"
                    : isDimmed
                      ? "border-border/30 bg-surface/30 opacity-40"
                      : "border-border bg-surface-elevated/60 hover:border-gold/20 hover:bg-surface-elevated"
                )}
                style={{
                  boxShadow: isActive ? "0 0 24px rgba(212, 175, 55, 0.08)" : "none",
                }}
                onMouseEnter={() => handleMouseEnter(c.name)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="font-serif text-sm font-semibold"
                    style={{ color: isActive || !isDimmed ? "#F5F5F0" : "#5A5A5A" }}
                  >
                    {c.name}
                  </span>
                  <PriceDots level={c.priceLevel} />
                </div>
                <div
                  className="text-[10px] uppercase tracking-[0.12em] mb-2"
                  style={{ color: isActive ? "#D4AF37" : "#6A6A6A" }}
                >
                  {c.fullName}
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex items-center gap-1">
                    <Droplets size={10} style={{ color: "#D4AF37" }} />
                    <span className="text-[11px]" style={{ color: "#C8C8C0" }}>
                      {c.oilMin}-{c.oilMax}%
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} style={{ color: "#E8D5A3" }} />
                    <span className="text-[11px]" style={{ color: "#C8C8C0" }}>
                      {c.longevityMin}-{c.longevityMax}h
                    </span>
                  </span>
                </div>
                <p
                  className="text-[11px] leading-relaxed hidden md:block"
                  style={{ color: isActive ? "#9A9A9A" : "#5A5A5A" }}
                >
                  {c.description}
                </p>
                <div
                  className="text-[10px] mt-2 leading-relaxed"
                  style={{ color: isActive ? "#B8860B" : "#4A4A4A" }}
                >
                  {c.useCase}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
