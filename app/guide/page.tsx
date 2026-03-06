export const dynamic = 'force-dynamic'

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

export default function GuidePage() {
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
            <p>
              Concentration affects more than just longevity — it shapes the fragrance&apos;s
              character. An EDT and EDP of the same fragrance often smell meaningfully different,
              with the EDP emphasising base notes and the EDT leading with brighter top notes.
            </p>
          </Prose>
          <ConcentrationChart />
        </div>

        {/* Performance Metrics */}
        <div className="mt-16">
          <Prose>
            <h3>Performance Metrics</h3>
            <p>
              <strong>Sillage</strong> describes the scent trail you leave&mdash;your olfactory
              wake. A high-sillage fragrance announces your presence and lingers after you&apos;ve
              left the room. <strong>Projection</strong> measures how far the fragrance radiates
              from your body in the moment you&apos;re wearing it.{" "}
              <strong>Longevity</strong> indicates total wear time from first spray to fadeout.{" "}
              <strong>Dry-down</strong> refers to the final stage when base notes fully dominate
              and the fragrance settles into its true character — often the most important phase
              for judging long-term wearability.
            </p>
          </Prose>
          <InsightBox>
            <p>
              <strong>Always test before buying:</strong> top notes dominate the first spray and
              can be misleading. A fragrance you love in the bottle may smell very different two
              hours later. Give it time — the dry-down is where a fragrance reveals itself.
            </p>
          </InsightBox>
        </div>
      </SectionWrapper>

      {/* ═══════════════════════════════════════════════════
          SECTION 2: Scent Profiling & Classification
          ═══════════════════════════════════════════════════ */}
      <GoldDivider />
      <SectionWrapper id="scent-profiling">
        <SectionHeading
          label="Section II"
          title="Scent Families & Classification"
          subtitle="Every fragrance belongs to a family — a shared DNA of ingredients and character. Knowing the families is the fastest shortcut to finding what you'll love."
        />

        <ContentWithSidebar
          sidebar={
            <>
              <MetricCard metric="5" description="Primary fragrance families covered here" />
              <MetricCard metric="12+" description="Subfamilies within the wheel" />
            </>
          }
        >
          <Prose>
            <h3>The Fragrance Wheel</h3>
            <p>
              Developed by perfume taxonomist Michael Edwards, the fragrance wheel organizes
              scents into four primary families positioned around a circular spectrum. Adjacent
              families share characteristics and blend naturally; opposite families offer contrast
              and tension. Most fragrances sit at the boundary between two families rather than
              squarely in one.
            </p>
          </Prose>

          <FragranceWheel />

          <Prose>
            <p>
              <strong>Floral Family:</strong> Iris, rose, orange blossom. In masculine perfumery,
              florals appear cool, powdery, and structured — far from conventional flowers. Think
              iris-forward compositions or lavender used as an architectural note rather than a
              garden scent.
            </p>
            <p>
              <strong>Amber Family:</strong> Warm, sensual compositions built on vanilla,
              labdanum, incense, and exotic resins. The amber family splits into Soft Amber
              (powdery, approachable) and Woody Amber (denser, more masculine). Oriental
              fragrances fall here.
            </p>
            <p>
              <strong>Woody Family:</strong> Sandalwood, cedar, vetiver, patchouli. The most
              versatile masculine family, ranging from Mossy Woods (oakmoss, earthy, vintage in
              character) to Dry Woods (leather, smoke, arid). Nearly every masculine fragrance
              touches this family somewhere.
            </p>
            <p>
              <strong>Fresh Family:</strong> Citrus, aquatic, and green notes. Encompasses
              Aromatic (lavender, sage, herbs), Citrus (bergamot, yuzu, lemon), and Water
              (marine accords, calone) subfamilies. The dominant family in everyday and office
              fragrances.
            </p>
          </Prose>
        </ContentWithSidebar>

        {/* Fougère */}
        <div className="mt-16">
          <Prose>
            <h3>Fougère: The Family the Wheel Doesn&apos;t Fully Capture</h3>
            <p>
              Fougère (French for &ldquo;fern&rdquo;) is one of the oldest and most important
              masculine fragrance categories, yet it sits awkwardly on the wheel — bridging
              Fresh, Woody, and Aromatic without belonging entirely to any of them. Its
              foundation is a specific accord: <strong>lavender</strong> on top,{" "}
              <strong>oakmoss and geranium</strong> in the heart, and{" "}
              <strong>coumarin</strong> (a warm, hay-like synthetic) in the base. This
              combination produces the archetypal &ldquo;barbershop&rdquo; or classic masculine
              scent that dominated perfumery from the 1880s through the 1990s.
            </p>
            <p>
              Houbigant&apos;s Fougère Royale (1882) invented the category. Azzaro Pour Homme,
              Paco Rabanne Pour Homme, and Drakkar Noir defined its golden era. Modern
              interpretations like Montblanc Legend and Tom Ford Beau de Jour reframe the
              structure with contemporary clarity — less mossy, more precise. If you&apos;ve
              ever smelled a fragrance that felt simultaneously clean, herbal, and vaguely
              nostalgic, you were almost certainly wearing a fougère.
            </p>
          </Prose>
          <InsightBox>
            <p>
              <strong>Why fougère matters as a reference point:</strong> the accord is so
              foundational that perfumers use it as shorthand. When a fragrance is described as
              &ldquo;aromatic fougère,&rdquo; it signals a specific set of expectations —
              lavender-forward, moderate projection, broadly wearable, with a classic masculine
              backbone. It&apos;s the DNA of half the men&apos;s fragrances ever made.
            </p>
          </InsightBox>
        </div>

        {/* Wheel + pyramid synthesis */}
        <div className="mt-16">
          <Prose>
            <h3>Families and Notes Working Together</h3>
            <p>
              Scent families describe the overall character; the note pyramid describes how that
              character evolves over time. A woody-fresh fragrance might open with citrus top
              notes, transition through aromatic lavender in the heart, then settle into cedar
              and vetiver in the base. The family stays consistent — the journey changes.
            </p>
            <p>
              Understanding both frameworks together is what separates intentional fragrance
              selection from guesswork. When you know a fragrance is a fresh aromatic fougère
              with a vetiver base, you can predict how it will wear before you ever smell it.
            </p>
          </Prose>
        </div>
      </SectionWrapper>

      {/* ═══════════════════════════════════════════════════
          SECTION 3: Popular Fragrances Landscape
          ═══════════════════════════════════════════════════ */}
      <GoldDivider />
      <SectionWrapper id="popular-fragrances">
        <SectionHeading
          label="Section III"
          title="The Fragrance Landscape"
          subtitle="Three distinct territories define what's worth knowing: current releases shaping the conversation, timeless classics that set the standard, and niche cult favorites that push the form."
        />

        {/* Trending */}
        <ContentWithSidebar
          sidebar={
            <MetricCard metric="2025–26" description="Current releases redefining masculine fragrance" />
          }
        >
          <Prose>
            <h3>Current Releases</h3>
          </Prose>
          <TrendingFragranceCards />
        </ContentWithSidebar>

        {/* Classics */}
        <div className="mt-16">
          <Prose>
            <h3>Timeless Classics</h3>
            <p>
              These are the reference points — fragrances studied by perfumers, collected by
              enthusiasts, and worn continuously for decades. Understanding them isn&apos;t
              nostalgia; it&apos;s building a vocabulary for everything that came after.
            </p>
          </Prose>
          <ClassicFlipCards />
          <BlockQuote quote="The classics aren't outdated — they're the grammar that modern fragrances are written in." />
        </div>

        {/* Niche */}
        <div className="mt-16">
          <Prose>
            <h3>Niche Cult Favorites</h3>
            <p>
              Niche fragrances operate outside the commercial mainstream — smaller batches,
              unusual ingredients, and no obligation to appeal to everyone. The tradeoff is
              price and accessibility; the reward is originality and craftsmanship that
              designer houses rarely risk.
            </p>
          </Prose>
          <NicheShowcase />
          <InsightBox>
            <p>
              <strong>The niche-to-mainstream pipeline:</strong> what starts in specialty
              boutiques eventually shapes designer releases. Aventus&apos;s smoky pineapple
              DNA now appears in countless designer flankers. Le Labo&apos;s minimalist
              aesthetic influenced an entire generation of &ldquo;clean&rdquo; designer launches.
              Niche is where the industry&apos;s next decade is written.
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
          subtitle="Where enthusiasts gather: from Basenotes' deep archives to Reddit's accessible discussions, the fragrance community thrives across distinct digital ecosystems."
        />

        <ContentWithSidebar
          sidebar={
            <MetricCard metric="95,000+" description="Fragrance profiles indexed on Fragrantica — the community's essential reference database" />
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
              pyramids&mdash;essential for research before buying.{" "}
              <strong>Reddit&apos;s r/fragrance</strong> welcomes newer enthusiasts with a younger
              demographic, emphasising accessibility and trending releases.
            </p>
          </Prose>
          <PlatformComparison />
        </ContentWithSidebar>

        <div className="mt-12">
          <Prose>
            <h3>Cultural Currents</h3>
          </Prose>
          <InsightBox>
            <p>
              <strong>Context is everything:</strong> enthusiasts understand that fragrance
              selection hinges on seasonal logic (fresh citrus for summer heat, rich orientals
              for winter cold) and occasion appropriateness (subtle office scents vs bold
              evening statements). This contextual thinking distinguishes collectors from
              casual wearers — and it&apos;s learnable.
            </p>
          </InsightBox>
          <Prose>
            <p>
              The community is experiencing significant shifts.{" "}
              <strong>Personalization and wellbeing</strong> dominate 2025-2026 trends, with
              fragrances increasingly viewed as mood-regulation tools and extensions of personal
              identity rather than mere cosmetics. The <strong>dupe market</strong> has emerged
              as a genuine economic force — particularly on TikTok and Reddit — democratizing
              access to luxury-adjacent scents while sparking ongoing debates about
              authenticity and the value of craftsmanship.
            </p>
            <p>
              Perhaps most notably, <strong>gender fluidity in fragrance</strong> has moved from
              niche positioning to mainstream reality. Transparent musks, airy woods, and unisex
              gourmands appeal across identities, with brands increasingly abandoning gendered
              marketing in favour of emotion-based categorization.
            </p>
          </Prose>
          <BlockQuote quote="The best fragrance you own is the one that makes you reach for it without thinking. Everything else is just collection." />
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
          subtitle="The distinction shapes purchasing decisions, community identity, and how you build a collection that actually makes sense."
        />

        <ContentWithSidebar
          sidebar={
            <>
              <MetricCard metric="100K+" description="Designer production run (bottles)" />
              <MetricCard metric="1K-5K"  description="Niche batch production size" />
              <MetricCard metric="$55–$160"    description="Designer price range" />
              <MetricCard metric="$110–$550+"  description="Niche price range" />
            </>
          }
        >
          <Prose>
            <p>
              <strong>Designer fragrances</strong> from houses like Dior, Chanel, and Giorgio
              Armani are mass-produced (100,000+ bottles), widely distributed through department
              stores and duty-free, and priced $55-$160. They prioritise broad appeal — scent
              profiles tested for maximum acceptance, not maximum originality. The upside is
              consistency, availability, and the social legibility of wearing something
              recognisable.
            </p>
            <p>
              <strong>Niche fragrances</strong> from boutique houses take the opposite position:
              small-batch production (1,000-5,000 bottles), selective distribution through
              specialist retailers, and premium pricing ($110-$550+). They emphasise artistic
              experimentation, rare or unusual ingredients, and creative freedom unconstrained
              by mass-market demands. Many are genuinely strange. That&apos;s the point.
            </p>
            <p>
              The divide isn&apos;t really about quality — it&apos;s about intent. A
              well-chosen designer fragrance will outperform a mediocre niche one in almost
              every practical situation. The question is whether you&apos;re optimising for
              wearability and social ease, or for personal expression and olfactory
              distinctiveness. Most serious collectors eventually do both.
            </p>
          </Prose>
          <DesignerVsNiche />
        </ContentWithSidebar>

        <div className="mt-12">
          <InsightBox>
            <p>
              <strong>The middle ground worth knowing:</strong> luxury designer (Tom Ford
              Private Blend, Dior La Collection) and indie houses (Imaginary Authors, Zoologist)
              occupy the space between. They offer niche-level creativity at slightly more
              accessible price points, and are often where the most interesting designer
              talent ends up.
            </p>
          </InsightBox>
        </div>
      </SectionWrapper>

      {/* ═══════════════════════════════════════════════════
          SECTION 6: Application & Layering
          ═══════════════════════════════════════════════════ */}
      <GoldDivider />
      <SectionWrapper id="practical-guide">
        <SectionHeading
          label="Section VI"
          title="Application & Layering"
          subtitle="How and where you apply fragrance matters as much as what you choose. The same scent can whisper or shout depending on skin, temperature, and technique."
        />

        <ContentWithSidebar
          sidebar={
            <MetricCard metric="1-2 ft" description="Typical office-appropriate sillage radius — beyond this, you're imposing" />
          }
        >
          <Prose>
            <h3>Choosing by Occasion</h3>
            <p>
              <strong>Everyday Wear:</strong> Versatile scents with moderate projection suit
              daily routines. Fresh citrus or subtle woody notes provide approachability without
              fatigue. Think bergamot, lavender, or light sandalwood — scents that communicate
              care without demanding attention.
            </p>
            <p>
              <strong>Office Environments:</strong> Professional settings demand restraint.
              Clean, sophisticated compositions with woody or amber bases project confidence
              without overwhelming colleagues. Fougères are ideal here — structured, familiar,
              and never intrusive. Avoid heavy spices or gourmands. Longevity matters more
              than projection.
            </p>
            <p>
              <strong>Date Night:</strong> Intimate settings reward depth and intrigue. Spicy
              amber, leather, or oud-forward compositions create memorable impressions.
              These fragrances reveal themselves gradually, rewarding close proximity.
            </p>
          </Prose>
          <BlockQuote quote="Your black tie scent should be a real top-shelf juice. Less sensual than a date-night pick, but as sexy as any cleaned-up gentleman can be." />
        </ContentWithSidebar>

        <div className="mt-16">
          <Prose>
            <h3>Seasonal Intelligence</h3>
            <p>
              Temperature directly affects how a fragrance performs. Heat volatilises aromatic
              molecules faster — a fragrance that projects beautifully in autumn can become
              overwhelming in summer. Cold air suppresses projection, which is why winter
              calls for heavier, denser compositions that would suffocate in July.
            </p>
            <p>
              <strong>Spring & Summer:</strong> Fresh citrus, aquatic notes, and green aromatics
              thrive in heat. EDTs over EDPs. Neroli, yuzu, and bergamot carry the season
              without cloying. Light fougères and marine compositions are your most reliable
              tools.
            </p>
            <p>
              <strong>Fall & Winter:</strong> Cold air calls for richness. Amber, oud, tobacco,
              and warming spices like cinnamon and cardamom project beautifully in cooler
              temperatures. Base notes dominate; give them something to work with.
            </p>
          </Prose>
        </div>

        <div className="mt-16">
          <Prose>
            <h3>Application Technique & Layering</h3>
            <p>
              Apply to pulse points — wrists, neck, behind the ears, inner elbows — where body
              heat actively diffuses the fragrance. Avoid rubbing wrists together after
              spraying; this crushes top notes and distorts the opening. For longevity,
              apply to moisturised skin — fragrance clings to hydration.
            </p>
          </Prose>
          <InsightBox>
            <p>
              <strong>The Two-Product Rule:</strong> limit fragranced products to two maximum.
              One dominant scent (your cologne) and one complementary base layer (scented
              moisturiser or aftershave). More creates noise rather than complexity.
              Choose products from compatible olfactory families — woody cologne with a
              cedar-based aftershave, citrus cologne with a fresh-scented moisturiser.
            </p>
          </InsightBox>
          <LayeringGuide />
        </div>
      </SectionWrapper>

      <GoldDivider variant="ornament" />
      <Footer />
    </main>
  )
}
