export const dynamic = 'force-dynamic'

import { GoldDivider } from "@/components/scrollytelling/gold-divider"
import { TrendingFragranceCards } from "@/components/scrollytelling/trending-fragrance-cards"
import { Footer } from "@/components/scrollytelling/footer"
import { ScentRecommendationEngine } from "@/components/scent-recommendation-engine"
import { SelectorHero } from "@/components/selector-hero"

export default function Home() {
  return (
    <main>
      <SelectorHero />

      {/* Trending — gives first-time visitors immediate orientation */}
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8 pt-12">
        <TrendingFragranceCards />
      </div>

      <GoldDivider />

      {/* Scent Selector */}
      <div id="selector" className="mx-auto max-w-[1200px] px-6 lg:px-8 py-12">
        <div className="mb-8">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold/70">
            Scent Selector
          </span>
          <h2 className="mt-2 font-serif text-2xl text-cream font-semibold">
            Find Your Fragrance
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-cream-muted leading-relaxed">
            Context transforms fragrance from mere scent to strategic expression. Filter by
            occasion, season, family, and budget — or let your taste profile guide the
            ranking. Build a shortlist and compare side by side.
          </p>
        </div>
        <ScentRecommendationEngine />
      </div>

      <Footer />
    </main>
  )
}
