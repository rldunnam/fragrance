"use client"

import { useState, useCallback, useRef, useEffect, type MouseEvent } from "react"
import { cn } from "@/lib/utils"
import { X, Droplets, Flame, TreePine, Wind } from "lucide-react"

/* ─── Data ─── */

interface SubfamilyFragrance {
  name: string
  house: string
  notes: string
}

interface Subfamily {
  name: string
  description: string
  notes: string[]
  startAngle: number
  endAngle: number
  fragrances?: SubfamilyFragrance[]
}

interface FragranceFamily {
  name: string
  icon: typeof Droplets
  color: string
  colorLight: string
  colorDark: string
  description: string
  subfamilies: Subfamily[]
  fragrances: { name: string; house: string; notes: string }[]
  startAngle: number
  endAngle: number
}

const FAMILIES: FragranceFamily[] = [
  {
    name: "Floral",
    icon: Droplets,
    color: "#C9A0DC",
    colorLight: "#DFC1EA",
    colorDark: "#9B6FB0",
    description:
      "Rose, jasmine, lily. The most diverse family, ranging from powdery soft florals to exotic floral ambers.",
    startAngle: 0,
    endAngle: 90,
    subfamilies: [
      {
        name: "Soft Floral",
        description: "Powdery, aldehydic compositions with gentle elegance",
        notes: ["Rose", "Peony", "Powder", "Aldehyde"],
        startAngle: 0,
        endAngle: 30,
        fragrances: [
          { name: "Chanel No.5", house: "Chanel", notes: "Aldehyde, rose, jasmine, sandalwood" },
          { name: "Guerlain Mon Guerlain", house: "Guerlain", notes: "Lavender, peony, vanilla, sandalwood" },
          { name: "Dior Miss Dior", house: "Dior", notes: "Rose, peony, musk, patchouli" },
        ],
      },
      {
        name: "Floral",
        description: "Rich, full-bodied flower bouquets at their peak",
        notes: ["Jasmine", "Lily", "Tuberose", "Iris"],
        startAngle: 30,
        endAngle: 60,
        fragrances: [
          { name: "Dior Homme", house: "Dior", notes: "Iris, lavender, cocoa, vetiver" },
          { name: "Le Labo Rose 31", house: "Le Labo", notes: "Rose, cumin, cedar, musk" },
          { name: "Creed Fleurissimo", house: "Creed", notes: "Tuberose, violet, lily, musk" },
        ],
      },
      {
        name: "Floral Amber",
        description: "Warm florals with orange blossom and sweet spices",
        notes: ["Orange Blossom", "Ylang-Ylang", "Sweet Spice"],
        startAngle: 60,
        endAngle: 90,
        fragrances: [
          { name: "Frederic Malle Portrait of a Lady", house: "Frederic Malle", notes: "Rose, patchouli, frankincense, amber" },
          { name: "YSL Black Opium", house: "YSL", notes: "Coffee, vanilla, orange blossom" },
          { name: "Guerlain L'Homme Ideal", house: "Guerlain", notes: "Almond, orange blossom, tonka, leather" },
        ],
      },
    ],
    fragrances: [
      { name: "Dior Homme", house: "Dior", notes: "Iris, cocoa, vetiver" },
      { name: "Frederic Malle Portrait of a Lady", house: "Frederic Malle", notes: "Rose, patchouli, frankincense" },
      { name: "Le Labo Rose 31", house: "Le Labo", notes: "Rose, cumin, cedar" },
      { name: "Guerlain L'Homme Ideal", house: "Guerlain", notes: "Almond, leather, tonka" },
    ],
  },
  {
    name: "Amber",
    icon: Flame,
    color: "#D4915A",
    colorLight: "#E8B88A",
    colorDark: "#B06B30",
    description:
      "Warm, sensual compositions featuring vanilla, incense, and exotic resins. The most seductive family.",
    startAngle: 90,
    endAngle: 180,
    subfamilies: [
      {
        name: "Soft Amber",
        description: "Gentle warmth with powdery, incense-like qualities",
        notes: ["Incense", "Amber", "Vanilla", "Powder"],
        startAngle: 90,
        endAngle: 120,
        fragrances: [
          { name: "YSL La Nuit de L'Homme", house: "YSL", notes: "Cardamom, lavender, cedar, amber" },
          { name: "Maison Margiela Jazz Club", house: "Maison Margiela", notes: "Rum, tobacco, vanilla, amber" },
          { name: "Prada L'Homme", house: "Prada", notes: "Iris, amber, cedar, musk" },
        ],
      },
      {
        name: "Amber",
        description: "Rich, opulent oriental compositions",
        notes: ["Oud", "Myrrh", "Benzoin", "Labdanum"],
        startAngle: 120,
        endAngle: 150,
        fragrances: [
          { name: "Amouage Jubilation XXV", house: "Amouage", notes: "Spices, rose, oud, amber, myrrh" },
          { name: "Montale Black Aoud", house: "Montale", notes: "Oud, rose, musk, patchouli" },
          { name: "Tom Ford Oud Wood", house: "Tom Ford", notes: "Oud, rosewood, cardamom, amber" },
        ],
      },
      {
        name: "Woody Amber",
        description: "Where warmth meets structure, resin meets wood",
        notes: ["Sandalwood", "Amber", "Tonka", "Patchouli"],
        startAngle: 150,
        endAngle: 180,
        fragrances: [
          { name: "Tom Ford Tobacco Vanille", house: "Tom Ford", notes: "Tobacco, vanilla, sandalwood, cacao" },
          { name: "Parfums de Marly Herod", house: "PdM", notes: "Tobacco, vanilla, patchouli, cinnamon" },
          { name: "Xerjoff Naxos", house: "Xerjoff", notes: "Honey, tobacco, vanilla, tonka" },
        ],
      },
    ],
    fragrances: [
      { name: "Tom Ford Tobacco Vanille", house: "Tom Ford", notes: "Tobacco, vanilla, cacao" },
      { name: "YSL La Nuit de L'Homme", house: "YSL", notes: "Cardamom, lavender, cedar" },
      { name: "Amouage Jubilation XXV", house: "Amouage", notes: "Spices, rose, oud, amber" },
      { name: "Maison Margiela Jazz Club", house: "Maison Margiela", notes: "Rum, tobacco, vanilla" },
    ],
  },
  {
    name: "Woody",
    icon: TreePine,
    color: "#7A9E7E",
    colorLight: "#A4C4A8",
    colorDark: "#4E7252",
    description:
      "Sandalwood, cedar, vetiver. Ranges from earthy mossy woods to dry, smoky leather compositions.",
    startAngle: 180,
    endAngle: 270,
    subfamilies: [
      {
        name: "Woods",
        description: "Clean, aromatic woods with natural freshness",
        notes: ["Cedar", "Sandalwood", "Guaiac Wood"],
        startAngle: 180,
        endAngle: 210,
        fragrances: [
          { name: "Terre d'Hermes", house: "Hermes", notes: "Orange, flint, cedar, vetiver" },
          { name: "Bleu de Chanel", house: "Chanel", notes: "Grapefruit, cedar, sandalwood, musk" },
          { name: "Bois 1920 Sushi Imperiale", house: "Bois 1920", notes: "Yuzu, guaiac wood, cedar, musk" },
        ],
      },
      {
        name: "Mossy Woods",
        description: "Earthy, damp forest floor with oakmoss character",
        notes: ["Oakmoss", "Patchouli", "Earth", "Vetiver"],
        startAngle: 210,
        endAngle: 240,
        fragrances: [
          { name: "Creed Aventus", house: "Creed", notes: "Pineapple, birch, oakmoss, musk" },
          { name: "Chanel Pour Monsieur", house: "Chanel", notes: "Lemon, vetiver, oakmoss, cedar" },
          { name: "Guerlain Vetiver", house: "Guerlain", notes: "Vetiver, tobacco, earth, oakmoss" },
        ],
      },
      {
        name: "Dry Woods",
        description: "Leather, smoke, and arid landscapes",
        notes: ["Leather", "Smoke", "Tobacco", "Birch"],
        startAngle: 240,
        endAngle: 270,
        fragrances: [
          { name: "Knize Ten", house: "Knize", notes: "Leather, birch tar, sandalwood, tobacco" },
          { name: "Parfums de Marly Layton", house: "PdM", notes: "Apple, lavender, vanilla, birch" },
          { name: "Memo Marfa", house: "Memo", notes: "Leather, smoke, cedar, vetiver" },
        ],
      },
    ],
    fragrances: [
      { name: "Creed Aventus", house: "Creed", notes: "Pineapple, birch, oakmoss" },
      { name: "Terre d'Hermes", house: "Hermes", notes: "Orange, flint, cedar" },
      { name: "Bleu de Chanel", house: "Chanel", notes: "Grapefruit, cedar, sandalwood" },
      { name: "Parfums de Marly Layton", house: "PdM", notes: "Apple, lavender, vanilla" },
    ],
  },
  {
    name: "Fresh",
    icon: Wind,
    color: "#5A9BB5",
    colorLight: "#8AC4D8",
    colorDark: "#3A7A94",
    description:
      "Citrus, aquatic, green notes. Encompassing aromatic herbs, bright citruses, and cool marine accords.",
    startAngle: 270,
    endAngle: 360,
    subfamilies: [
      {
        name: "Aromatic",
        description: "Herbal freshness with lavender, sage, and rosemary",
        notes: ["Lavender", "Sage", "Rosemary", "Thyme"],
        startAngle: 270,
        endAngle: 300,
        fragrances: [
          { name: "Dior Sauvage", house: "Dior", notes: "Bergamot, ambroxan, pepper, lavender" },
          { name: "Versace Pour Homme", house: "Versace", notes: "Neroli, citron, sage, amber" },
          { name: "Penhaligon's Sartorial", house: "Penhaligon's", notes: "Lavender, beeswax, musk, sandalwood" },
        ],
      },
      {
        name: "Citrus",
        description: "Bright, zesty, and energizing citrus bursts",
        notes: ["Bergamot", "Lemon", "Grapefruit", "Neroli"],
        startAngle: 300,
        endAngle: 330,
        fragrances: [
          { name: "Acqua di Gio", house: "Armani", notes: "Bergamot, neroli, jasmine, musk" },
          { name: "Creed Millesime Imperial", house: "Creed", notes: "Lemon, bergamot, sea salt, musk" },
          { name: "Atelier Cologne Cedre Atlas", house: "Atelier Cologne", notes: "Grapefruit, cedar, musk, amber" },
        ],
      },
      {
        name: "Water",
        description: "Marine, aquatic, and ozonic accords",
        notes: ["Sea Salt", "Ambroxan", "Calone", "Seaweed"],
        startAngle: 330,
        endAngle: 360,
        fragrances: [
          { name: "Acqua di Gio Profumo", house: "Armani", notes: "Bergamot, aquatic, patchouli, incense" },
          { name: "Davidoff Cool Water", house: "Davidoff", notes: "Mint, sea water, sandalwood, musk" },
          { name: "Issey Miyake L'Eau d'Issey", house: "Issey Miyake", notes: "Calone, freesia, cedar, musk" },
        ],
      },
    ],
    fragrances: [
      { name: "Dior Sauvage", house: "Dior", notes: "Bergamot, ambroxan, pepper" },
      { name: "Acqua di Gio Profumo", house: "Armani", notes: "Bergamot, aquatic, patchouli" },
      { name: "Davidoff Cool Water", house: "Davidoff", notes: "Mint, sea water, sandalwood" },
      { name: "Versace Pour Homme", house: "Versace", notes: "Neroli, citron, amber" },
    ],
  },
]

/* ─── Helpers ─── */

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1"
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`
}

function describeArcSegment(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number
): string {
  const outerStart = polarToCartesian(cx, cy, outerR, startAngle)
  const outerEnd = polarToCartesian(cx, cy, outerR, endAngle)
  const innerEnd = polarToCartesian(cx, cy, innerR, endAngle)
  const innerStart = polarToCartesian(cx, cy, innerR, startAngle)
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1"

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ")
}

function getLabelPosition(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const midAngle = (startAngle + endAngle) / 2
  return polarToCartesian(cx, cy, r, midAngle)
}

/* ─── Bottle Silhouette Icon ─── */

function BottleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 36"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="9" y="0" width="6" height="4" rx="1" opacity="0.6" />
      <rect x="10" y="4" width="4" height="3" rx="0.5" opacity="0.4" />
      <path d="M7 10 C7 7, 10 7, 10 7 L14 7 C14 7, 17 7, 17 10 L18 28 C18 32, 15 34, 12 34 C9 34, 6 32, 6 28 Z" />
    </svg>
  )
}

/* ─── Main Component ─── */

export function FragranceWheel() {
  const [activeFamily, setActiveFamily] = useState<number | null>(null)
  const [activeSubfamily, setActiveSubfamily] = useState<string | null>(null)
  const [hoveredFamily, setHoveredFamily] = useState<number | null>(null)
  const [hoveredSubfamily, setHoveredSubfamily] = useState<{ family: number; sub: number } | null>(null)
  const [tooltip, setTooltip] = useState<{
    x: number
    y: number
    content: { title: string; description: string; notes: string[] }
  } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const CX = 250
  const CY = 250
  const OUTER_R = 195
  const INNER_R = 120
  const SUB_OUTER_R = 115
  const SUB_INNER_R = 70
  const LABEL_R = 160
  const SUB_LABEL_R = 93
  const GAP = 1.5 // degrees gap between segments

  const handleFamilyClick = useCallback((index: number) => {
    setActiveFamily((prev) => {
      if (prev === index) { setActiveSubfamily(null); return null }
      setActiveSubfamily(null)
      return index
    })
    setTooltip(null)
  }, [])

  const handleSubfamilyHover = useCallback(
    (familyIndex: number, subIndex: number, event: MouseEvent<SVGPathElement>) => {
      setHoveredSubfamily({ family: familyIndex, sub: subIndex })
      setHoveredFamily(familyIndex)
      const sub = FAMILIES[familyIndex].subfamilies[subIndex]
      if (svgRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const svgRect = svgRef.current.getBoundingClientRect()
        const relX = event.clientX - containerRect.left
        const relY = event.clientY - containerRect.top
        setTooltip({
          x: Math.min(relX, containerRect.width - 220),
          y: Math.max(relY - 120, 10),
          content: {
            title: sub.name,
            description: sub.description,
            notes: sub.notes,
          },
        })
      }
    },
    []
  )

  const handleFamilyHover = useCallback(
    (familyIndex: number, event: MouseEvent<SVGPathElement>) => {
      setHoveredFamily(familyIndex)
      const family = FAMILIES[familyIndex]
      if (svgRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const relX = event.clientX - containerRect.left
        const relY = event.clientY - containerRect.top
        setTooltip({
          x: Math.min(relX, containerRect.width - 220),
          y: Math.max(relY - 100, 10),
          content: {
            title: family.name,
            description: family.description,
            notes: family.subfamilies.flatMap((s) => s.notes).slice(0, 5),
          },
        })
      }
    },
    []
  )

  const handleMouseLeave = useCallback(() => {
    setHoveredFamily(null)
    setHoveredSubfamily(null)
    setTooltip(null)
  }, [])

  /* Close sidebar on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveFamily(null)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  /* Rotation for the selected family (center it at top) */
  const rotation = activeFamily !== null
    ? -(FAMILIES[activeFamily].startAngle + (FAMILIES[activeFamily].endAngle - FAMILIES[activeFamily].startAngle) / 2)
    : 0

  const scale = activeFamily !== null ? 1.08 : 1

  return (
    <div
      ref={containerRef}
      id="widget-fragrance-wheel"
      className="scroll-reveal relative my-8 overflow-hidden rounded-lg border border-border bg-surface/80"
    >
      <div className="flex flex-col lg:flex-row">
        {/* ─── SVG Wheel ─── */}
        <div
          className={cn(
            "relative flex items-center justify-center py-8 px-4 transition-all duration-700 ease-out",
            activeFamily !== null
              ? "lg:w-[55%] w-full"
              : "w-full"
          )}
        >
          {/* Subtle radial glow behind the wheel */}
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background: hoveredFamily !== null
                ? `radial-gradient(circle at 50% 50%, ${FAMILIES[hoveredFamily].color}15 0%, transparent 65%)`
                : "radial-gradient(circle at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 65%)",
            }}
          />

          <svg
            ref={svgRef}
            viewBox="0 0 500 500"
            className="w-full max-w-[500px] h-auto"
            onMouseLeave={handleMouseLeave}
            role="img"
            aria-label="Interactive fragrance wheel showing four scent families: Floral, Amber, Woody, and Fresh, with their subfamilies"
          >
            <defs>
              {FAMILIES.map((family, i) => (
                <filter key={`glow-${i}`} id={`glow-${i}`}>
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feFlood floodColor={family.color} floodOpacity="0.5" result="color" />
                  <feComposite in="color" in2="blur" operator="in" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}
              <filter id="gold-glow-filter">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feFlood floodColor="#D4AF37" floodOpacity="0.4" result="color" />
                <feComposite in="color" in2="blur" operator="in" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g
              style={{
                transform: `rotate(${rotation}deg) scale(${scale})`,
                transformOrigin: "250px 250px",
                transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* ─── Subfamily Inner Ring ─── */}
              {FAMILIES.map((family, fi) =>
                family.subfamilies.map((sub, si) => {
                  const isHovered =
                    hoveredSubfamily?.family === fi && hoveredSubfamily?.sub === si
                  const isFamilyActive = activeFamily === fi
                  const isFamilyHovered = hoveredFamily === fi

                  return (
                    <path
                      key={`sub-${fi}-${si}`}
                      d={describeArcSegment(
                        CX,
                        CY,
                        SUB_INNER_R,
                        SUB_OUTER_R,
                        sub.startAngle + GAP / 2,
                        sub.endAngle - GAP / 2
                      )}
                      fill={
                        isHovered || isFamilyActive
                          ? `${family.color}30`
                          : isFamilyHovered
                            ? `${family.color}18`
                            : `${family.color}0A`
                      }
                      stroke={
                        isHovered
                          ? family.colorLight
                          : isFamilyActive || isFamilyHovered
                            ? `${family.color}80`
                            : "#D4AF3725"
                      }
                      strokeWidth={isHovered ? 1.5 : 0.8}
                      className="cursor-pointer transition-all duration-300"
                      style={{
                        filter: isHovered ? `drop-shadow(0 0 6px ${family.color}60)` : "none",
                      }}
                      onMouseMove={(e) => handleSubfamilyHover(fi, si, e)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleFamilyClick(fi)}
                    />
                  )
                })
              )}

              {/* ─── Main Family Outer Ring ─── */}
              {FAMILIES.map((family, fi) => {
                const isHovered = hoveredFamily === fi
                const isActive = activeFamily === fi

                return (
                  <path
                    key={`family-${fi}`}
                    d={describeArcSegment(
                      CX,
                      CY,
                      INNER_R,
                      OUTER_R,
                      family.startAngle + GAP / 2,
                      family.endAngle - GAP / 2
                    )}
                    fill={
                      isActive
                        ? `${family.color}35`
                        : isHovered
                          ? `${family.color}25`
                          : `${family.color}12`
                    }
                    stroke={
                      isActive
                        ? family.colorLight
                        : isHovered
                          ? `${family.color}CC`
                          : "#D4AF3730"
                    }
                    strokeWidth={isActive ? 2 : isHovered ? 1.5 : 0.8}
                    className="cursor-pointer transition-all duration-300"
                    style={{
                      filter: isActive
                        ? `drop-shadow(0 0 12px ${family.color}50)`
                        : isHovered
                          ? `drop-shadow(0 0 8px ${family.color}40)`
                          : "none",
                    }}
                    onMouseMove={(e) => handleFamilyHover(fi, e)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleFamilyClick(fi)}
                  />
                )
              })}

              {/* ─── Divider Lines (Gold) ─── */}
              {FAMILIES.map((family, fi) => {
                const inner = polarToCartesian(CX, CY, SUB_INNER_R, family.startAngle)
                const outer = polarToCartesian(CX, CY, OUTER_R, family.startAngle)
                return (
                  <line
                    key={`divider-${fi}`}
                    x1={inner.x}
                    y1={inner.y}
                    x2={outer.x}
                    y2={outer.y}
                    stroke="#D4AF37"
                    strokeWidth="0.5"
                    opacity="0.4"
                    className="pointer-events-none"
                  />
                )
              })}

              {/* ─── Subfamily Divider Lines ─── */}
              {FAMILIES.map((family, fi) =>
                family.subfamilies.map((sub, si) => {
                  if (si === 0) return null
                  const inner = polarToCartesian(CX, CY, SUB_INNER_R, sub.startAngle)
                  const outer = polarToCartesian(CX, CY, SUB_OUTER_R, sub.startAngle)
                  return (
                    <line
                      key={`sub-divider-${fi}-${si}`}
                      x1={inner.x}
                      y1={inner.y}
                      x2={outer.x}
                      y2={outer.y}
                      stroke="#D4AF37"
                      strokeWidth="0.3"
                      opacity="0.25"
                      className="pointer-events-none"
                    />
                  )
                })
              )}

              {/* ─── Outer Gold Ring ─── */}
              <circle
                cx={CX}
                cy={CY}
                r={OUTER_R + 2}
                fill="none"
                stroke="#D4AF37"
                strokeWidth="0.5"
                opacity="0.3"
              />

              {/* ─── Inner Separator Ring ─── */}
              <circle
                cx={CX}
                cy={CY}
                r={INNER_R}
                fill="none"
                stroke="#D4AF37"
                strokeWidth="0.5"
                opacity="0.25"
              />

              {/* ─── Inner Decorative Ring ─── */}
              <circle
                cx={CX}
                cy={CY}
                r={SUB_INNER_R}
                fill="none"
                stroke="#D4AF37"
                strokeWidth="0.5"
                opacity="0.2"
              />

              {/* ─── Family Labels (Outer Ring) ─── */}
              {FAMILIES.map((family, fi) => {
                const pos = getLabelPosition(CX, CY, LABEL_R, family.startAngle, family.endAngle)
                const midAngle = (family.startAngle + family.endAngle) / 2
                const textRotation = midAngle > 90 && midAngle < 270 ? midAngle + 180 : midAngle

                return (
                  <g key={`label-${fi}`} className="pointer-events-none">
                    <text
                      x={pos.x}
                      y={pos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={
                        activeFamily === fi || hoveredFamily === fi
                          ? family.colorLight
                          : "#F5F5F0"
                      }
                      fontSize="13"
                      fontFamily="'Playfair Display', serif"
                      fontWeight="600"
                      letterSpacing="0.05em"
                      style={{
                        transform: `rotate(${textRotation - 90}deg)`,
                        transformOrigin: `${pos.x}px ${pos.y}px`,
                        transition: "fill 0.3s, opacity 0.3s",
                        filter:
                          activeFamily === fi || hoveredFamily === fi
                            ? `drop-shadow(0 0 4px ${family.color}60)`
                            : "none",
                      }}
                    >
                      {family.name.toUpperCase()}
                    </text>
                  </g>
                )
              })}

              {/* ─── Subfamily Labels (Inner Ring) ─── */}
              {FAMILIES.map((family, fi) =>
                family.subfamilies.map((sub, si) => {
                  const pos = getLabelPosition(CX, CY, SUB_LABEL_R, sub.startAngle, sub.endAngle)
                  const midAngle = (sub.startAngle + sub.endAngle) / 2
                  const textRotation = midAngle > 90 && midAngle < 270 ? midAngle + 180 : midAngle
                  const isHovered =
                    hoveredSubfamily?.family === fi && hoveredSubfamily?.sub === si

                  return (
                    <text
                      key={`sub-label-${fi}-${si}`}
                      x={pos.x}
                      y={pos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={
                        isHovered
                          ? family.colorLight
                          : activeFamily === fi || hoveredFamily === fi
                            ? `${family.color}CC`
                            : "#8A8A8A"
                      }
                      fontSize="8.5"
                      fontFamily="'Inter', sans-serif"
                      fontWeight="500"
                      letterSpacing="0.04em"
                      className="pointer-events-none transition-all duration-300"
                      style={{
                        transform: `rotate(${textRotation - 90}deg)`,
                        transformOrigin: `${pos.x}px ${pos.y}px`,
                        filter: isHovered ? `drop-shadow(0 0 3px ${family.color}50)` : "none",
                      }}
                    >
                      {sub.name}
                    </text>
                  )
                })
              )}

              {/* ─── Center Emblem ─── */}
              <circle
                cx={CX}
                cy={CY}
                r={SUB_INNER_R - 6}
                fill="#0A0A0F"
                stroke="#D4AF37"
                strokeWidth="0.8"
                opacity="0.8"
              />
              <circle
                cx={CX}
                cy={CY}
                r={SUB_INNER_R - 12}
                fill="none"
                stroke="#D4AF37"
                strokeWidth="0.3"
                opacity="0.3"
              />
              {/* Compass cross */}
              <line x1={CX} y1={CY - 30} x2={CX} y2={CY + 30} stroke="#D4AF37" strokeWidth="0.4" opacity="0.25" />
              <line x1={CX - 30} y1={CY} x2={CX + 30} y2={CY} stroke="#D4AF37" strokeWidth="0.4" opacity="0.25" />
              {/* Small diamond at center */}
              <polygon
                points={`${CX},${CY - 6} ${CX + 4},${CY} ${CX},${CY + 6} ${CX - 4},${CY}`}
                fill="#D4AF37"
                opacity="0.4"
              />
              <text
                x={CX}
                y={CY + 22}
                textAnchor="middle"
                fill="#D4AF37"
                fontSize="7"
                fontFamily="'Inter', sans-serif"
                fontWeight="500"
                letterSpacing="0.2em"
                opacity="0.6"
              >
                SCENT
              </text>
              <text
                x={CX}
                y={CY - 16}
                textAnchor="middle"
                fill="#D4AF37"
                fontSize="7"
                fontFamily="'Inter', sans-serif"
                fontWeight="500"
                letterSpacing="0.2em"
                opacity="0.6"
              >
                FAMILIES
              </text>

              {/* ─── Family Icon Indicators (small circles along outer edge) ─── */}
              {FAMILIES.map((family, fi) => {
                const midAngle = (family.startAngle + family.endAngle) / 2
                const pos = polarToCartesian(CX, CY, OUTER_R + 12, midAngle)
                const isActive = activeFamily === fi || hoveredFamily === fi
                return (
                  <circle
                    key={`indicator-${fi}`}
                    cx={pos.x}
                    cy={pos.y}
                    r={isActive ? 4 : 3}
                    fill={isActive ? family.color : "#D4AF3730"}
                    stroke={isActive ? family.colorLight : "#D4AF3720"}
                    strokeWidth="0.5"
                    className="pointer-events-none transition-all duration-300"
                    style={{
                      filter: isActive ? `drop-shadow(0 0 4px ${family.color}80)` : "none",
                    }}
                  />
                )
              })}
            </g>
          </svg>

          {/* ─── Tooltip ─── */}
          {tooltip && (
            <div
              className="pointer-events-none absolute z-20 w-52 rounded-md border border-border bg-surface-elevated/95 px-4 py-3 shadow-xl backdrop-blur-sm"
              style={{
                left: tooltip.x + 15,
                top: tooltip.y,
                transition: "opacity 0.15s ease-out",
              }}
            >
              <div className="font-serif text-sm font-semibold text-cream">
                {tooltip.content.title}
              </div>
              <div className="mt-1 text-xs text-cream-muted leading-relaxed">
                {tooltip.content.description}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tooltip.content.notes.map((note) => (
                  <span
                    key={note}
                    className="inline-block rounded-full border border-gold/20 bg-gold/10 px-2 py-0.5 text-[10px] text-gold-light"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Instruction text */}
          <div
            className={cn(
              "absolute bottom-3 left-0 right-0 text-center text-xs text-cream-muted/40 transition-opacity duration-500",
              activeFamily !== null ? "opacity-0" : "opacity-100"
            )}
          >
            Hover to explore &middot; Click a family to discover fragrances
          </div>
        </div>

        {/* ─── Sidebar Panel ─── */}
        <div
          className={cn(
            "overflow-hidden border-t lg:border-t-0 lg:border-l border-border transition-all duration-700 ease-out",
            activeFamily !== null
              ? "lg:w-[45%] w-full max-h-[600px] lg:max-h-none opacity-100"
              : "lg:w-0 w-full max-h-0 lg:max-h-none opacity-0"
          )}
        >
          {activeFamily !== null && (
            <SidebarContent
              family={FAMILIES[activeFamily]}
              onClose={() => { setActiveFamily(null); setActiveSubfamily(null) }}
              activeSubfamily={activeSubfamily}
              onSubfamilyClick={(name) => setActiveSubfamily(prev => prev === name ? null : name)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Sidebar Content ─── */

function SidebarContent({
  family,
  onClose,
  activeSubfamily,
  onSubfamilyClick,
}: {
  family: FragranceFamily
  onClose: () => void
  activeSubfamily: string | null
  onSubfamilyClick: (name: string) => void
}) {
  const Icon = family.icon

  return (
    <div className="flex h-full flex-col px-6 py-6 lg:py-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full border"
            style={{
              borderColor: `${family.color}40`,
              backgroundColor: `${family.color}15`,
            }}
          >
            <Icon
              className="h-5 w-5"
              style={{ color: family.color }}
            />
          </div>
          <div>
            <h4 className="font-serif text-xl font-semibold text-cream">
              {family.name}
            </h4>
            <p className="text-xs text-cream-muted/60 uppercase tracking-widest mt-0.5">
              Family
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-cream-muted/60 transition-colors hover:border-gold/30 hover:text-cream cursor-pointer"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Description */}
      <p className="mt-4 text-sm text-cream-muted leading-relaxed">
        {family.description}
      </p>

      {/* Subfamilies */}
      <div className="mt-5 flex flex-wrap gap-2">
        {family.subfamilies.map((sub) => {
          const isActive = activeSubfamily === sub.name
          return (
            <button
              key={sub.name}
              onClick={() => onSubfamilyClick(sub.name)}
              className="inline-block rounded-full border px-3 py-1 text-xs transition-all duration-200 cursor-pointer"
              style={{
                borderColor: isActive ? family.color : `${family.color}30`,
                color: isActive ? family.colorDark : family.colorLight,
                backgroundColor: isActive ? family.color : `${family.color}10`,
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {sub.name}
            </button>
          )
        })}
      </div>

      {/* Divider */}
      <div className="my-5 h-px w-full bg-border" />

      {/* Fragrances — swap between subfamily and family level */}
      {(() => {
        const activeSub = activeSubfamily
          ? family.subfamilies.find(s => s.name === activeSubfamily)
          : null
        const fragrances = activeSub?.fragrances ?? family.fragrances
        const label = activeSub ? activeSub.name : family.name

        return (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-gold/70">
                {label} Examples
              </p>
              {activeSub && (
                <span className="text-[10px] text-cream-muted/40 leading-relaxed">
                  — {activeSub.description}
                </span>
              )}
            </div>
            <div className="space-y-3">
              {fragrances?.map((frag) => (
                <div
                  key={frag.name}
                  className="group flex items-start gap-3 rounded-lg border border-border/60 bg-surface/60 px-4 py-3 transition-all duration-300 hover:border-gold/20 hover:bg-surface-elevated cursor-default"
                >
                  <div style={{ color: `${family.color}50` }} className="flex-shrink-0">
                    <BottleIcon
                      className="mt-0.5 h-7 w-auto transition-colors duration-300"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-serif text-sm font-semibold text-cream group-hover:text-gold-light transition-colors duration-300">
                      {frag.name}
                    </div>
                    <div className="text-[11px] text-cream-muted/50 uppercase tracking-wider mt-0.5">
                      {frag.house}
                    </div>
                    <div className="mt-1 text-xs text-cream-muted/70 leading-relaxed">
                      {frag.notes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
