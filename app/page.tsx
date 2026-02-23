import { HeroSection } from "@/components/scrollytelling/hero-section"
import { SectionWrapper } from "@/components/scrollytelling/section-wrapper"
import { SectionHeading } from "@/components/scrollytelling/section-heading"
import { ContentWithSidebar } from "@/components/scrollytelling/content-with-sidebar"
import { Prose } from "@/components/scrollytelling/prose"
import { InsightBox } from "@/components/scrollytelling/insight-box"
import { BlockQuote } from "@/components/scrollytelling/block-quote"
import { MetricCard } from "@/components/scrollytelling/metric-card"
import { GoldDivider } from "@/components/scrollytelling/gold-divider"
import { NotePyramid } from "@/components/scrollytelling/note-pyramid"
import { ConcentrationChart } from "@/components/scrollytelling/concentration-chart"
import { FragranceWheel } from "@/components/scrollytelling/fragrance-wheel"
import { TrendingFragranceCards } from "@/components/scrollytelling/trending-fragrance-cards"
import { ClassicFlipCards } from "@/components/scrollytelling/classic-flip-cards"
import { NicheShowcase } from "@/components/scrollytelling/niche-showcase"
import { PlatformComparison } from "@/components/scrollytelling/platform-comparison"
import { LayeringGuide } from "@/components/scrollytelling/widget-layering-guide"
import { Footer } from "@/components/scrollytelling/footer"
import { DesignerVsNiche } from "@/components/widgets/designer-vs-niche"
import { ScentRecommendationEngine } from "@/components/scent-recommendation-engine"

export default function Home() {
  return (
    <main>
      {/* ─── Hero ─── */}
      <HeroSection />

      {/* ═══════════════════════════════════════════════════
          SECTION 1: Essential Vocabulary & Terminology
          ═══════════════════════════════════════════════════ */}
      <GoldDivider />
      <SectionWrapper id="vocabulary">
        <SectionHeading
          label="Section I"
          title="Essential Vocabulary & Terminology"
          subtitle="The language of fragrance: from note pyramids to performance metrics, master the terminology that defines olfactory appreciation."
        />

        {/* Note Pyramid */}
        <ContentWithSidebar
          sidebar={
            <>
              <MetricCard metric="15-30 min" description="Top notes evaporation time" />
              <MetricCard metric="2-4 hrs" description="Heart notes duration" />
              <MetricCard metric="6-24 hrs" description="Base notes longevity" />
            </>
          }
        >
          <Prose>
            <h3>The Note Pyramid: Understanding Fragrance Evolution</h3>
            <p>
              Fragrances unfold in three distinct layers. <strong>Top notes</strong>&mdash;bright
              citrus like bergamot or fresh herbs&mdash;create the first impression, lasting 15-30
              minutes. <strong>Heart notes</strong> emerge next, featuring florals, spices, or
              fruits that form the fragrance&apos;s core character for 2-4 hours.{" "}
              <strong>Base notes</strong> provide the foundation: woods like sandalwood, resins
              such as amber, and musks that linger 6-24 hours on skin and clothing.
            </p>
          </Prose>

          {/* HEAVY WIDGET 1: Note Pyramid Visualization */}
          <NotePyramid />
        </ContentWithSidebar>

        {/* Concentration Types */}
        <div className="mt-16">
          <Prose>
            <h3>Concentration Types: From Light to Luxurious</h3>
            <p>
              <strong>Eau de Cologne (EDC)</strong> contains 2-4% fragrance oil, offering
              refreshing simplicity for 1-2 hours. <strong>Eau de Toilette (EDT)</strong> at
              5-15% provides everyday wearability lasting 3-5 hours.{" "}
              <strong>Eau de Parfum (EDP)</strong> with 15-20% concentration delivers richer
              depth for 6-8 hours. <strong>Parfum (Extrait)</strong> reaches 20-40%, the most
              concentrated and enduring form.
            </p>
          </Prose>

          {/* Concentration Comparison Chart */}
          <ConcentrationChart />
        </div>

        {/* Performance Metrics */}
        <div className="mt-16">
          <Prose>
            <h3>Performance Metrics</h3>
            <p>
              <strong>Sillage</strong> describes the scent trail you leave&mdash;your olfactory
              wake. <strong>Projection</strong> measures how far the fragrance radiates from your
              body. <strong>Longevity</strong> indicates total wear time.{" "}
              <strong>Dry-down</strong> refers to the final stage when base notes dominate.
            </p>
          </Prose>
        </div>
      </SectionWrapper>

      {/* ═══════════════════════════════════════════════════
          SECTION 2: Scent Profiling & Classification
          ═══════════════════════════════════════════════════ */}
      <GoldDivider />
      <SectionWrapper id="scent-profiling">
        <SectionHeading
          label="Section II"
          title="Scent Profiling & Classification"
          subtitle="Understanding fragrance architecture requires mastering two interconnected frameworks: the fragrance wheel and the note pyramid."
        />

        <ContentWithSidebar
          sidebar={
            <>
              <MetricCard metric="4" description="Primary fragrance families" />
              <MetricCard metric="12+" description="Subfamilies within the wheel" />
            </>
          }
        >
          <Prose>
            <h3>The Fragrance Wheel</h3>
            <p>
              Developed by perfume taxonomist Michael Edwards, the fragrance wheel organizes
              scents into four primary families positioned around a circular spectrum. Adjacent
              families share characteristics, while opposite families offer contrast.
            </p>
          </Prose>

          {/* HEAVY WIDGET 3: Fragrance Wheel */}
          <FragranceWheel />

          <Prose>
            <p>
              <strong>Floral Family:</strong> Rose, jasmine, lily. Subfamilies include Soft
              Florals (powdery, aldehydic) and Floral Amber (orange blossom, sweet spices).
            </p>
            <p>
              <strong>Amber Family:</strong> Warm, sensual compositions featuring vanilla,
              incense, and exotic resins. Includes Soft Amber and Woody Amber variants.
            </p>
            <p>
              <strong>Woody Family:</strong> Sandalwood, cedar, vetiver. Ranges from Mossy Woods
              (oakmoss, earthy) to Dry Woods (leather, smoky notes).
            </p>
            <p>
              <strong>Fresh Family:</strong> Citrus, aquatic, green notes. Encompasses Aromatic
              (lavender, herbs), Citrus (bergamot, lemon), and Water (marine accords) subfamilies.
            </p>
          </Prose>
        </ContentWithSidebar>

        {/* The Note Pyramid (detailed) */}
        <div className="mt-16">
          <Prose>
            <h3>The Note Pyramid</h3>
            <p>
              <strong>Top Notes (5-15 minutes):</strong> First impression. Light, volatile
              molecules like citrus, herbs, and aldehydes. Evaporate quickly, determining
              initial perception.
            </p>
            <p>
              <strong>Heart Notes (2-4 hours):</strong> The fragrance&apos;s true character
              emerges. Florals, spices, and fruity elements form the composition&apos;s core,
              bridging top and base.
            </p>
            <p>
              <strong>Base Notes (6+ hours):</strong> Foundation providing depth and longevity.
              Woods, resins, vanilla, musk, and amber anchor the scent&apos;s dry-down.
            </p>
          </Prose>

          <InsightBox>
            <p>
              <strong>The wheel and pyramid work synergistically:</strong> the wheel categorizes
              overall character, while the pyramid reveals temporal evolution. A woody-fresh
              fragrance might open with citrus top notes, transition through aromatic lavender in
              the heart, then settle into cedar and vetiver base notes.
            </p>
          </InsightBox>
        </div>
      </SectionWrapper>

      {/* ═══════════════════════════════════════════════════
          SECTION 3: Popular Fragrances Landscape
          ═══════════════════════════════════════════════════ */}
      <GoldDivider />
      <SectionWrapper id="popular-fragrances">
        <SectionHeading
          label="Section III"
          title="Popular Fragrances Landscape"
          subtitle="The modern fragrance landscape spans three distinct territories: current bestsellers, timeless classics, and niche cult favorites."
        />

        {/* Trending */}
        <ContentWithSidebar
          sidebar={
            <MetricCard metric="2025" description="Year of peak designer innovation" />
          }
        >
          <Prose>
            <h3>Current Trending 2025-2026</h3>
          </Prose>

          {/* Trending Fragrance 3D Card Grid */}
          <TrendingFragranceCards />
        </ContentWithSidebar>

        {/* Classics */}
        <div className="mt-16">
          <Prose>
            <h3>Timeless Classics</h3>
          </Prose>

          <ClassicFlipCards />

          <BlockQuote quote="Eau Sauvage still hinges on the subtle balance between San Carlo bergamot, hedione and the lavender of Vaucluse — over half a century later." />
        </div>

        {/* Niche Cult Favorites */}
        <div className="mt-16">
          <Prose>
            <h3>Niche Cult Favorites</h3>
          </Prose>

          {/* Niche Cult Favorites Interactive Showcase */}
          <NicheShowcase />

          <InsightBox>
            <p>
              <strong>The niche-to-mainstream pipeline accelerates:</strong> fragrances once
              exclusive to specialty boutiques now drive designer innovation. Aventus&apos;s
              success spawned both designer interpretations and a thriving clone market.
            </p>
          </InsightBox>
        </div>
      </SectionWrapper>

      {/* ═══════════════════════════════════════════════════
          SECTION 4: Community Culture & Platforms
          ═══════════════════════════════════════════════════ */}
      <GoldDivider />
      <SectionWrapper id="community">
        <SectionHeading
          label="Section IV"
          title="Community Culture & Platforms"
          subtitle="Where enthusiasts gather: from Basenotes&apos; deep archives to Reddit&apos;s accessible discussions, the fragrance community thrives across distinct digital ecosystems."
        />

        <ContentWithSidebar
          sidebar={
            <MetricCard metric="11M+" description="Views on viral TikTok fragrance review showcasing community reach" />
          }
        >
          <Prose>
            <h3>Where Enthusiasts Gather</h3>
            <p>
              The men&apos;s fragrance community thrives across distinct digital ecosystems, each
              with its own character and audience. <strong>Basenotes</strong> attracts experienced
              enthusiasts and serves as the go-to hub for vintage fragrance discussion, offering
              deep technical knowledge and historical perspective.{" "}
              <strong>Fragrantica</strong> functions as the industry&apos;s comprehensive database,
              housing over 95,000 fragrance profiles with user reviews and note
              pyramids&mdash;essential for research.{" "}
              <strong>Reddit&apos;s r/fragrance</strong> welcomes newer enthusiasts with a younger
              demographic, emphasizing accessibility and trending releases over vintage
              exploration.
            </p>
          </Prose>

          {/* HEAVY WIDGET 7: Platform Comparison */}
          <PlatformComparison />
        </ContentWithSidebar>

        <div className="mt-10">
          <BlockQuote quote="Reddit fragcom collections seemed nearly identical? All drawn from the same pool...pretty mainstream designer, dupe, or Arabic. Even the few niche-esque outliers tended to be the same few predictable outliers." />
        </div>

        {/* Cultural Insights */}
        <div className="mt-12">
          <Prose>
            <h3>Cultural Insights</h3>
          </Prose>

          <InsightBox>
            <p>
              <strong>Context is King:</strong> Enthusiasts understand that fragrance selection
              hinges on seasonal logic (fresh citrus for summer heat, rich orientals for winter
              cold) and occasion appropriateness (subtle office scents vs bold evening
              statements). This contextual thinking distinguishes collectors from casual wearers.
            </p>
          </InsightBox>

          <Prose>
            <p>
              The community is experiencing significant shifts.{" "}
              <strong>Personalization and wellbeing</strong> dominate 2025-2026 trends, with
              fragrances increasingly viewed as mood-regulation tools and extensions of personal
              identity rather than mere cosmetics. The <strong>dupe market</strong> has emerged as
              an economic force, particularly on TikTok and Reddit, where affordable alternatives
              to luxury scents democratize access while sparking debates about authenticity and
              craftsmanship.
            </p>
            <p>
              Perhaps most notably, <strong>gender fluidity in fragrance</strong> has moved from
              niche concept to mainstream reality. Transparent musks, airy woods, and unisex
              gourmands appeal across identities, with brands increasingly abandoning gendered
              marketing in favor of emotion-based categorization.
            </p>
          </Prose>
        </div>
      </SectionWrapper>

      {/* ═══════════════════════════════════════════════════
          SECTION 5: Designer vs Niche
          ═══════════════════════════════════════════════════ */}
      <GoldDivider />
      <SectionWrapper id="designer-vs-niche">
        <SectionHeading
          label="Section V"
          title="Designer vs Niche: Understanding the Divide"
          subtitle="The distinction between designer and niche fragrances shapes both purchasing decisions and community identity."
        />

        <ContentWithSidebar
          sidebar={
            <>
              <MetricCard
                metric="100K+"
                description="Designer production run (bottles)"
              />
              <MetricCard
                metric="1K-5K"
                description="Niche batch production size"
              />
              <MetricCard
                metric="$55-$160"
                description="Designer price range"
              />
              <MetricCard
                metric="$110-$550+"
                description="Niche price range"
              />
            </>
          }
        >
          <Prose>
            <p>
              <strong>Designer fragrances</strong> from houses like Dior and Chanel are
              mass-produced (100,000+ bottles), widely distributed through department stores, and
              priced $55-$160. They prioritize broad appeal with familiar scent profiles
              designed for universal recognition.
            </p>
            <p>
              <strong>Niche fragrances</strong> from boutique houses take the opposite approach:
              small-batch production (1,000-5,000 bottles), selective distribution through
              specialized retailers, and premium pricing ($110-$550+). They emphasize
              artistic experimentation, rare ingredients, and creative freedom over market
              demands.
            </p>
          </Prose>

          {/* Designer vs Niche Interactive Comparison */}
          <DesignerVsNiche />
        </ContentWithSidebar>
      </SectionWrapper>

      {/* ═══════════════════════════════════════════════════
          SECTION 6: Practical Guide
          ═══════════════════════════════════════════════════ */}
      <GoldDivider />
      <SectionWrapper id="practical-guide">
        <SectionHeading
          label="Section VI"
          title="Practical Guide: Choosing Your Scent"
          subtitle="Context transforms fragrance from mere scent to strategic expression. The interplay of notes, projection, and occasion determines whether a fragrance elevates or overwhelms."
        />

        {/* Occasion & Season Selector */}
        <ContentWithSidebar
          sidebar={
            <MetricCard metric="1-2 feet" description="Typical office-appropriate sillage radius" />
          }
        >
          <Prose>
            <h3>Choosing by Occasion</h3>
            <p>
              <strong>Everyday Wear:</strong> Versatile scents with moderate projection suit
              daily routines. Fresh citrus or subtle woody notes provide approachability without
              fatigue. Think bergamot, lavender, or light sandalwood&mdash;scents that whisper
              rather than shout.
            </p>
            <p>
              <strong>Office Environments:</strong> Professional settings demand restraint. Clean,
              sophisticated compositions with woody or amber bases project confidence without
              overwhelming colleagues. Avoid heavy spices or gourmands. Longevity matters more
              than projection.
            </p>
            <p>
              <strong>Date Night:</strong> Intimate settings call for depth and intrigue. Spicy
              amber, leather, or oud-forward compositions create memorable impressions. These
              fragrances reveal themselves gradually, rewarding close proximity.
            </p>
          </Prose>

          <BlockQuote quote="Your black tie scent should be a real top-shelf juice. Less sensual than a date-night pick, but as sexy as any cleaned-up gentleman can be." />
        </ContentWithSidebar>

        {/* INTERACTIVE: Occasion & Season Selector */}
        <ScentRecommendationEngine />

        {/* Seasonal Intelligence */}
        <div className="mt-16">
          <Prose>
            <h3>Seasonal Intelligence</h3>
            <p>
              Temperature amplifies or mutes fragrance projection. Warm weather volatilizes
              molecules faster, making lighter compositions essential.
            </p>
            <p>
              <strong>Spring & Summer:</strong> Fresh citrus, aquatic notes, and green aromatics
              thrive in heat. These scents evaporate quickly but remain refreshing. Neroli, yuzu,
              and bergamot exemplify summer intelligence&mdash;bright without cloying.
            </p>
            <p>
              <strong>Fall & Winter:</strong> Cold air demands richer, spicier compositions.
              Amber, oud, tobacco, and warming spices like cinnamon project beautifully in cooler
              temperatures. Base notes dominate, creating enveloping warmth.
            </p>
          </Prose>
        </div>

        {/* Layering Techniques */}
        <div className="mt-16">
          <Prose>
            <h3>Advanced Layering Techniques</h3>
            <p>
              Layering multiple scented products requires precision. Your body wash, deodorant,
              and cologne all contribute to your olfactory signature.
            </p>
          </Prose>

          <InsightBox>
            <p>
              <strong>The Two-Product Rule:</strong> Limit fragranced products to two maximum. One
              dominant scent (your cologne) and one complementary base layer (scented deodorant or
              aftershave). More creates chaos rather than complexity.
            </p>
          </InsightBox>

          <Prose>
            <p>
              Choose products with similar olfactory families. Woody cologne pairs with
              cedar-based aftershave. Citrus cologne complements fresh deodorant. Avoid mixing
              gourmand and aquatic&mdash;they compete rather than harmonize.
            </p>
          </Prose>

          {/* Interactive Layering Guide */}
          <LayeringGuide />
        </div>
      </SectionWrapper>

      <GoldDivider variant="ornament" />

      {/* ─── Footer ─── */}
      <Footer />
    </main>
  )
}
