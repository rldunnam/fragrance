# Validation findings ledger

Every finding from a catalog validation run is recorded here and stays here.
Nothing is deleted: a finding is closed by the patch that fixes it.

## How to maintain

- **Validators** start each run by re-checking every `open` row, then add new
  findings as new rows with the next free `F-` number. Use one entry id per
  row, or `—` for a catalog-wide item.
- **Fix patches** change the rows they close in the same commit: set
  `Status` to `done` (fixed) or `wontfix` (decided not a problem, with the
  reason in the finding), and fill `Closed in` with the batch or PR.
- `pnpm validate` checks this file. Every row must name an entry that is in
  `data.ts` or `retired`, open rows must have `—` in `Closed in`, and closed
  rows must name the patch. Keep `|` out of cell text.

Statuses: `open`, `done`, `wontfix`. Found dates are validation run dates.

## Findings

| ID | Status | Entry | Field | Finding | Source | Found | Closed in |
|---|---|---|---|---|---|---|---|
| F-001 | done | `stronger-with-you-powerfully` | ingredients, formulaCode | Label ended at 'Methyl Anthranilate', exactly where Ulta's page display truncates. Restored the 11 missing items and F.I.L. N70081199/1 from Sephora US, and moved the source there. | sephora.com/product/stronger-with-you-powerfully-eau-de-parfum-P520339 | 2026-09-24 | batch-1 |
| F-002 | done | `stronger-with-you-powerfully` | price | 150; Sephora and Armani US list 100 ml at $130. Set to 130. | same | 2026-09-27 | batch-1 |
| F-003 | done | `stronger-with-you-amber` | price | 130; Armani US sells one size, 100 ml, at $135. Set to 135. | giorgioarmanibeauty-usa.com/fragrances/mens-cologne/stronger-with-you/ | 2026-09-24 | batch-1 |
| F-004 | done | `jpg-le-male-elixir-absolu` | ingredients, ingredientsSource | Label came from a decant shop (microperfumes.com) and lacked 'CI 42090 (Blue 1)' and 'Benzyl Alcohol'. Replaced with the Sephora US list. | sephora.com/product/le-male-elixer-absolu-P515712 | 2026-09-24 | batch-1 |
| F-005 | done | `tom-ford-lost-cherry` | baseNotes | 'Clove' vs Fragrantica 'Cloves'. This is the allowed spelling fix ('Clove' is the catalog spelling in 4 entries), now documented in NOTE_ALIASES. No data change. | fragrantica.com/perfume/Tom-Ford/Lost-Cherry-51411.html | 2026-09-24 | batch-1 |
| F-006 | done | `tom-ford-noir-extreme-parfum` | topNotes | 'Citrus' vs Fragrantica 'Citruses'. Allowed spelling fix ('Citrus' is used in 15 entries), now documented in NOTE_ALIASES. No data change. | fragrantica.com/perfume/Tom-Ford/Noir-Extreme-Parfum-75489.html | 2026-09-24 | batch-1 |
| F-007 | done | `tom-ford-eau-ombre-leather` | baseNotes | 'Ambrofix' vs Fragrantica 'Ambrofix™'. Trademark symbols are now dropped by documented rule. No data change. | fragrantica.com/perfume/Tom-Ford/Eau-d-Ombre-Leather-95389.html | 2026-09-24 | batch-1 |
| F-008 | done | `layton` | baseNotes | 'Ambermax™' was the only note carrying a trademark symbol. Stored as 'Ambermax' under the rule in F-007. | fragrantica.com/perfume/Parfums-de-Marly/Layton-39314.html | 2026-09-27 | batch-1 |
| F-009 | wontfix | `boss-stronger-with-you-absolutely` | topNotes | 'Elemi' vs 'elemi'. Fragrantica lowercases it only in its summary sentence; the catalog uses 'Elemi' in 10 places. | fragrantica.com/perfume/Giorgio-Armani/Emporio-Armani-Stronger-With-You-Absolutely-64501.html | 2026-09-24 | batch-1 |
| F-010 | wontfix | `boss-stronger-with-you-leather` | topNotes | Same as F-009. | fragrantica.com/perfume/Giorgio-Armani/Emporio-Armani-Stronger-With-You-Leather-63355.html | 2026-09-24 | batch-1 |
| F-011 | open | `emporio-armani-power-of-you` | ingredientsSource | Sephora UK. The content matches the US lists; switch to Armani US or Nordstrom. | nordstrom.com/s/armani-power-of-you-eau-de-parfum/8834302 | 2026-09-24 | — |
| F-012 | open | `boss-stronger-with-you-absolutely` | concentration | EDP; Armani US sells it as "Stronger With You Absolutely Parfum". | giorgioarmanibeauty-usa.com/fragrances/mens-cologne/stronger-with-you/ | 2026-09-24 | — |
| F-013 | done | `stronger-with-you-sandalwood` | price | $145 cannot be confirmed: regional, with no US listing. Needs a basis decision for regional entries. Decided 2026-09-28: regional entries are priced from US grey market, FragFlex or Triple Traders first. FragFlex lists the 100 ml but it is sold out with no price; Triple Traders has no listing. Next US listing: Jomashop, 3.4 oz at $169.99, in line with Armani Saudi Arabia's SAR 638. Set 170. | — | 2026-09-24 | batch-7 |
| F-014 | open | `stronger-with-you` | formulaCode | F.I.L. B267449/1 not visible on any source seen; every snippet cut off at "(F.I.L.". Check the Ulta page by hand. | ulta.com Intensely page | 2026-09-27 | — |
| F-015 | open | `boss-stronger-with-you-absolutely` | formulaCode, ingredients | F.I.L. N70035952/1 and the final item 'CI 60730 / Ext. Violet 2' not visible on sources seen. | giorgioarmanibeauty-usa.com Absolutely page | 2026-09-24 | — |
| F-016 | open | `stronger-with-you-parfum` | formulaCode | F.I.L. N70048180/3 not visible on sources seen. | giorgioarmanibeauty-usa.com Parfum page | 2026-09-27 | — |
| F-017 | done | `jpg-le-male-elixir-absolu` | topNotes, heartNotes, baseNotes | Confirmed on Fragrantica: top Plum, Cinnamon, Cardamom, Bergamot; middle Lavender, Davana, Artemisia; base Tonka Bean, Benzoin, Ambrette (Musk Mallow), Patchouli, Labdanum. The entry has Lavender / Plum / Tonka Bean: 9 notes missing, Lavender and Plum in the wrong tiers, and no Cinnamon, so the cinnamon screen misses it. Fix now. Fixed: all 12 notes set tier for tier. Ambrette (Musk Mallow) is stored as Ambrette, the catalog spelling in 5 entries, via a new NOTE_ALIASES entry. | fragrantica.com/perfume/Jean-Paul-Gaultier/Le-Male-Elixir-Absolu-101529.html | 2026-09-24 | batch-4 |
| F-018 | done | `jpg-le-male-elixir-absolu` | price | $170, no size stated. JPG US sells 75, 125 and 200 ml, from $150. Price at the size the JPG US product page preselects and set priceSizeMl if it differs from the house size. Fixed: JPG US gives each size its own product page, and the product master ("LM RE25 PARF INTENSE 125ML") is the 4.2 oz page at $189. Set price 189, priceSizeMl 125 (JPG has no house size yet, see F-045). | jeanpaulgaultier.com/us/en_US/c/all-products-for-men--all-men | 2026-09-24 | batch-6 |
| F-019 | done | `jpg-la-belle` | price, status | $115; JPG US lists 100 ml at $150, tagged "Exclusive". Check whether it is house-site-only, which would need status and includeReason. Fixed: JPG US sells one size, 3.4 oz / 100 ml, at $150. Set price 150, priceSizeMl 100. Ulta also sells La Belle EDP 3.4 oz, so it is not house-site-only; status stays current. | jeanpaulgaultier.com/us/en_US/p/range-la-belle/ | 2026-09-24 | batch-6 |
| F-020 | done | `jpg-le-beau-paradise-garden` | price | $125, no size stated. Sold in 75 and 125 ml, from $126. Price at the size the JPG US product page preselects and set priceSizeMl if it differs from the house size. Fixed: JPG US product master ("LE BEAU RE 2024 EDP 125ML") is the 4.2 oz page at $159. Set price 159, priceSizeMl 125. | jeanpaulgaultier.com/us/en_US/c/all-products-for-men--all-men | 2026-09-24 | batch-6 |
| F-021 | open | `jpg-le-male` | ingredientsSource | A four-fragrance mini gift set page, not Le Male's own product page. The label was not compared. It contains Cinnamomum and Cinnamal. | sephora.com/product/mini-cologne-replica-sampler-set-P522528 | 2026-09-27 | — |
| F-022 | open | `jpg-ultra-male` | ingredientsSource | Sephora FR, not a US source; content not compared against a US list. | sephora.fr | 2026-09-24 | — |
| F-023 | open | `jpg-le-male-elixir` | ingredients | Matches the cited Sephora page (13 items), but Sephora's gift-set page and Sephora India list a much longer Elixir label. Possible reformulation; check a current box. | sephora.com/product/jean-paul-gaultier-le-male-elixir-P510806 | 2026-09-27 | — |
| F-024 | open | `jpg-le-male-le-parfum` | concentration | Parfum; JPG sells it as Eau de Parfum Intense. | jeanpaulgaultier.com/us/en_US/p/range-le-male/ | 2026-09-27 | — |
| F-025 | open | `jpg-la-belle-le-parfum` | concentration | Parfum; JPG sells it as Eau de Parfum Intense. | jeanpaulgaultier.com/ww/en/p/range-la-belle/ | 2026-09-27 | — |
| F-026 | open | `jpg-scandal-pour-homme` | line | 'Scandal Pour Homme' is a new line used by this entry only. | — | 2026-09-27 | — |
| F-027 | open | `jpg-le-beau-edp` | retired reason | The retirement stands, but the reason's list of the Le Beau line omits Le Beau Flower Edition (2025). | jeanpaulgaultier.com/us/en_US/c/all-products-for-men--all-men | 2026-09-24 | — |
| F-028 | wontfix | `jpg-le-male` | topNotes, heartNotes, baseNotes | Re-checked on Fragrantica directly: matches tier for tier. | fragrantica.com/perfume/Jean-Paul-Gaultier/Le-Male-430.html | 2026-09-27 | batch-2 |
| F-029 | wontfix | `jpg-le-male-elixir` | topNotes, heartNotes, baseNotes | Re-checked on Fragrantica directly: matches tier for tier. | fragrantica.com/perfume/Jean-Paul-Gaultier/Le-Male-Elixir-81642.html | 2026-09-27 | batch-2 |
| F-030 | wontfix | `jpg-ultra-male` | topNotes, heartNotes, baseNotes | Re-checked on Fragrantica directly: matches tier for tier. | fragrantica.com/perfume/Jean-Paul-Gaultier/Ultra-Male-30947.html | 2026-09-27 | batch-2 |
| F-031 | wontfix | `jpg-la-belle-paradise-garden` | topNotes, heartNotes, baseNotes | Re-checked on Fragrantica: Blue Lotus / Iris / Vanilla matches. The 2026-09-24 flag was a false alarm. | fragrantica.com/perfume/Jean-Paul-Gaultier/La-Belle-Paradise-Garden-88873.html | 2026-09-24 | batch-2 |
| F-032 | done | `dior-sauvage-extrait` | price | $205 matches Dior US and Macy's, but the size is not stated. Confirm the size Dior US preselects, add Dior to price-basis.json, and set priceSizeMl if they differ. Fixed: Dior US sells one size, 1.7 oz / 50 ml, at $205. Price kept, priceSizeMl 50 set. Dior still has no house size in price-basis.json; that stays with F-045. | dior.com/en_us/beauty/products/sauvage-extrait-Y0000281.html | 2026-09-24 | batch-6 |
| F-033 | done | `pdm-carlisle` | screenFlags | The label half of the reason checks out (Cinnamal on PDM US and Nordstrom). "Reviewers consistently describe a cinnamon-apple accord" was not supported by the reviews seen. Fixed: reason reworded to what sources support (PDM US label lists Cinnamal; one Fragrantica review describes a green apple cinnamon pie scent). Flag kept. | us.parfums-de-marly.com/products/carlisle | 2026-09-24 | batch-5 |
| F-034 | open | `pdm-oajan` | ingredients | 13 items; PDM's global site lists 29. The US page could not be loaded, so this may be a US short-form label. | us.parfums-de-marly.com/products/oajan | 2026-09-24 | — |
| F-035 | open | `layton` | ingredientsSource | parfums-de-marly.com is PDM's global storefront; use us.parfums-de-marly.com. | parfums-de-marly.com/products/layton | 2026-09-27 | — |
| F-036 | open | `boss-stronger-with-you-edt` | rationale | Mentions pink pepper and cardamom, which are not in the verified pyramid. | — | 2026-09-24 | — |
| F-037 | open | `boss-stronger-with-you-absolutely` | rationale | Mentions suede and oakwood, which are not in the verified pyramid. | — | 2026-09-24 | — |
| F-038 | open | `emporio-armani-power-of-you` | rationale | Mentions pear and praline, which are not in the verified pyramid. | — | 2026-09-24 | — |
| F-039 | open | `jpg-scandal-pour-homme` | rationale | Mentions blood orange and aldehydes, which are not in the verified pyramid. | — | 2026-09-24 | — |
| F-040 | open | `jpg-la-belle-paradise-garden` | rationale | Mentions pineapple and coconut, which are not in the pyramid. | — | 2026-09-24 | — |
| F-041 | open | `pdm-oajan` | rationale | Mentions rum, saffron, rose and oud, which are not in the verified pyramid. | — | 2026-09-24 | — |
| F-042 | open | `pdm-carlisle` | rationale | Mentions cinnamon, which is not in the verified pyramid. | — | 2026-09-24 | — |
| F-043 | open | `tom-ford-noir-de-noir` | rationale | Mentions sandalwood, which is not in the verified pyramid. | — | 2026-09-24 | — |
| F-044 | open | `tom-ford-bois-pacifique` | rationale | Mentions saffron, which is not in the verified pyramid. | — | 2026-09-24 | — |
| F-045 | done | — | price | Only Emporio Armani has a size in price-basis.json. Sizes stay per house (decided 2026-09-27); prices follow each source page's default size, with priceSizeMl where it differs. Add sizes for Jean Paul Gaultier, Dior and Tom Ford next. JPG added at 125 ml (decided 2026-09-28: the product-master SKU for the men's line). The other JPG prices are now read as 125 ml prices; F-059 tracks re-pricing them. Dior and Tom Ford still need a house size, tracked in F-062. | lib/fragrances/price-basis.json | 2026-09-27 | batch-7 |
| F-046 | open | `dior-tobacolor` | ingredientsSource | Label taken from Dior Indonesia (dior.com/en_id/). Dior US sells it; re-take the list and formula code #20566 from the US page. | dior.com/en_us/beauty/products/tobacolor-Y0996186.html | 2026-09-27 | — |
| F-047 | done | — | validator | Non-US check missed country locales in the path (dior.com/en_id/). Added NON_US_LOCALE_PATH_RE. | scripts/validate-fragrances.mjs | 2026-09-27 | batch-2 |
| F-048 | open | `tom-ford-bois-pacifique` | ingredients | Not yet compared against Tom Ford US (#87 was hand-edited). Tuscan Leather and Tobacco Vanille from the same commit matched exactly. | tomfordbeauty.com/products/bois-pacifique-eau-de-parfum | 2026-09-27 | — |
| F-049 | open | `tom-ford-fucking-fabulous` | ingredients | Same as F-048. | tomfordbeauty.com/products/fucking-fabulous-eau-de-parfum | 2026-09-27 | — |
| F-050 | wontfix | `tom-ford-lost-cherry` | ingredients | Compared with Tom Ford US: matches item for item (20 items). Tom Ford's own gift-set page and Bluemercury still show an older 29-item list with Cinnamal; the pyramid's Cinnamon note keeps the screen covered either way. | tomfordbeauty.com/products/lost-cherry-eau-de-parfum | 2026-09-27 | batch-3 |
| F-051 | open | `tom-ford-noir-extreme` | ingredients | Same as F-048. | tomfordbeauty.com/products/noir-extreme-eau-de-parfum | 2026-09-27 | — |
| F-052 | wontfix | `tom-ford-noir-extreme-parfum` | ingredients | Compared with Tom Ford US: matches item for item (44 items). | tomfordbeauty.com/products/noir-extreme-parfum | 2026-09-27 | batch-3 |
| F-053 | done | `versace-eros-edp` | ingredients, ingredientsSource | 'Alpha-Isometyl Ionone' is Ulta's misprint copied verbatim, so an exact search for Alpha-Isomethyl Ionone misses this entry. Versace US lists the same 12 items spelled correctly; re-source to it. Fix now (Cinnamal label). Fixed: re-sourced to Versace US (same 12 items, same order), with Alpha-Isomethyl Ionone spelled correctly. | versace.com/us/en/men/accessories/fragrances-body-care/eros/eros-edp-100-ml-blue/R740110-R100MLS_RNUL.html | 2026-09-28 | batch-4 |
| F-054 | done | `versace-eros-parfum` | ingredients, ingredientsSource | First item stored as 'Alcohol Denat. (Sd Alcohol 39-C .)' with a stray " ."; otherwise matches. Versace US lists it cleanly; re-source to it. Fixed: re-sourced to Versace US; same 12 items in the same order, stray " ." removed. | versace.com/us/en/men/accessories/fragrances-body-care/eros/eros-parfum-100-ml-black/R740210-R100MLS_RNUL.html | 2026-09-28 | batch-5 |
| F-055 | open | `versace-eros-flame` | ingredients, ingredientsSource | Matches the retailer list (Ulta, Kohl's), but Versace US prints a different order (Ethylhexyl Methoxycinnamate before Coumarin; Butyl Methoxydibenzoylmethane before Ethylhexyl Salicylate) and 'Parfum (Fragrance)', 'Aqua (Water)'. The house list wins; re-source to it. | versace.com/us/en/men/accessories/fragrances-body-care/eros-flame/eros-flame-edp-100-ml-red/R741010-R100MLS_RNUL.html | 2026-09-28 | — |
| F-056 | done | `pdm-carlisle` | ingredientsSource | Label taken from Bluemercury although PDM US carries it (per F-033). Re-source to PDM US and compare. Fixed: re-sourced to PDM US. Its 12-item label matches the stored list item for item, Cinnamal included. | us.parfums-de-marly.com/products/carlisle | 2026-09-28 | batch-5 |
| F-057 | done | — | validator | Added a near-duplicate ingredient spelling check (ignores separators); it flags F-053 and F-054 and nothing else. | scripts/validate-fragrances.mjs | 2026-09-28 | batch-3 |
| F-058 | open | `jpg-le-male` | ingredients, ingredientsSource | Three current US labels disagree. JPG US lists 16 items (Anise Alcohol, Cinnamal, no Cinnamomum); Ulta lists 17 with Butylphenyl Methylpropional, an older formula; Sephora's set pages list the stored 32 items, Cinnamomum Zeylanicum Bark Oil included, in the expanded allergen format. The house list may be the stale one, so F-021 stays open; check a current US box. The Cinnamon note keeps the screen covered either way. | jeanpaulgaultier.com/us/en_US/p/range-le-male/le-male-eau-de-toilette-000000000065120122 | 2026-09-28 | — |
| F-059 | open | — | price | JPG now has a 125 ml house size, so these prices read as 125 ml prices but none has been checked at that size: `jpg-ultra-male`, `jpg-le-male`, `jpg-le-male-le-parfum`, `jpg-le-male-elixir`, `jpg-le-beau`, `jpg-scandal-pour-homme`, `jpg-la-belle-le-parfum`, `jpg-la-belle-paradise-garden`, `jpg-le-beau-narcisse`, `jpg-le-beau-le-parfum`. Le Male's $75, for one, is the 1.4 oz price. Re-price each at the JPG US 125 ml page, or set priceSizeMl. | jeanpaulgaultier.com/us/en_US | 2026-09-28 | — |
| F-060 | done | `versace-eros-edp` | price | $95; Versace US lists Eros EDP 100 ml at $149. Set 149, priceSizeMl 100 (Versace has no house size yet). | versace.com/us/en/men/accessories/fragrances-body-care/eros/eros-edp-100-ml-blue/R740110-R100MLS_RNUL.html | 2026-09-28 | batch-7 |
| F-061 | done | `versace-eros-parfum` | price | $120; Versace US lists Eros Parfum 100 ml at $179. Set 179, priceSizeMl 100. | versace.com/us/en/men/accessories/fragrances-body-care/eros/eros-parfum-100-ml-black/R740210-R100MLS_RNUL.html | 2026-09-28 | batch-7 |
| F-062 | open | — | price | Dior, Tom Ford and Versace have no house size in price-basis.json. Sauvage Extrait, Eros EDP and Eros Parfum carry priceSizeMl meanwhile. | lib/fragrances/price-basis.json | 2026-09-28 | — |

## Validation coverage

Commits in `4ad2997..main` that touch `lib/fragrances/`, and where each stands.

| PR | Commit | Validated | Notes |
|---|---|---|---|
| #82 | d7a7400 | 2026-09-24, 2026-09-27 | F-001–F-003, F-009–F-016, F-036–F-038 |
| #83 | 0381163 | 2026-09-24, 2026-09-27 | F-004, F-017–F-031, F-039, F-040. Pyramids F-028–F-031 still unverified. |
| #84 | eb44973 | 2026-09-24 | Pyramids matched on 2026-09-24; not re-derived. F-034, F-041, F-042. |
| #85 | ac6401a | 2026-09-27 | All six pyramids match, including Tobacolor's flat list. F-046. |
| #86 | 7d360e0 | 2026-09-24 | F-005–F-007, F-032, F-033, F-043, F-044 |
| #87 | 8f4ab8d | 2026-09-28 (partial) | Tuscan Leather, Tobacco Vanille, Lost Cherry and Noir Extreme Parfum labels match Tom Ford US; F-048, F-049, F-051 carried. Also changed card wording in fragrance-card.tsx (not data). |
| #89 | 4e6b554 | 2026-09-28 (partial) | Althaïr label matches PDM US. Carlisle F-056; Haltane and Pegasus labels not yet compared. |
| #90 | 5d675ab | 2026-09-28 (partial) | Eros labels F-053–F-055. Pyramids (Eros EDP, Flame, Najim, Parfum, Flowerbomb) not yet checked. |
| #91 | 27bd9ce | 2026-09-28 (partial) | Retirement of versace-dylan-blue-edp confirmed: Versace US sells Dylan Blue pour Homme as EDT only. Pyramids (Ombré Leather, Oud Wood, Dylan Blue) not yet checked. |
| #92 | 9224980 | n/a | screens.ts only; no data entries. |
| #93 | 5dca68e | 2026-09-28 (partial) | Label matches PDM US; concentration Parfum matches PDM's product name. Pyramid not yet checked. |
| #94 | 1ef42ab | not yet | |
| #95 | eb0e7a1 | not yet | |
| #96 | ca3f739 | not yet | |
| #98 | 8000f5b | not yet | |
| batch-1 | 0001 patch | — | Closes F-001–F-010. |
| batch-1b | 0002 patch | — | Price rule: per-house size, priced at the source's default size. No findings closed. |
| batch-2 | 0003 patch | — | Ledger update for #84–#87; locale-path check. Closes F-028–F-031, F-047. |
| batch-3 | batch-3 patch | — | Ledger update for #87–#93; near-duplicate ingredient check. Closes F-050, F-052, F-057. |
| batch-4 | batch-4 patch | — | Fix-now rows: Le Male Elixir Absolu pyramid, Eros EDP label. Closes F-017, F-053. |
| batch-5 | batch-5 patch | — | Cinnamal labels: Eros Parfum and Carlisle re-sourced to house US sites; Carlisle flag reason. Closes F-033, F-054, F-056. Opens F-058. |
| batch-6 | batch-6 patch | — | Prices at each source page's size, recorded in priceSizeMl. Closes F-018, F-019, F-020, F-032. |
| batch-7 | batch-7 patch | — | JPG house size 125 ml; regional price basis; Versace US prices. Closes F-013, F-045, F-060, F-061. Opens F-059, F-062. |
