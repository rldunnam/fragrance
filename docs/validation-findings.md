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
| F-013 | open | `stronger-with-you-sandalwood` | price | $145 cannot be confirmed: regional, with no US listing. Needs a basis decision for regional entries. | — | 2026-09-24 | — |
| F-014 | open | `stronger-with-you` | formulaCode | F.I.L. B267449/1 not visible on any source seen; every snippet cut off at "(F.I.L.". Check the Ulta page by hand. | ulta.com Intensely page | 2026-09-27 | — |
| F-015 | open | `boss-stronger-with-you-absolutely` | formulaCode, ingredients | F.I.L. N70035952/1 and the final item 'CI 60730 / Ext. Violet 2' not visible on sources seen. | giorgioarmanibeauty-usa.com Absolutely page | 2026-09-24 | — |
| F-016 | open | `stronger-with-you-parfum` | formulaCode | F.I.L. N70048180/3 not visible on sources seen. | giorgioarmanibeauty-usa.com Parfum page | 2026-09-27 | — |
| F-017 | open | `jpg-le-male-elixir-absolu` | topNotes, heartNotes, baseNotes | Runs disagree. The 2026-09-24 run found about 10 notes missing with tiers misplaced; the 2026-09-27 run only saw a decant-site copy matching the entry (Lavender / Plum / Tonka Bean). Verify on Fragrantica directly. | fragrantica.com/perfume/Jean-Paul-Gaultier/Le-Male-Elixir-Absolu-101529.html | 2026-09-24 | — |
| F-018 | open | `jpg-le-male-elixir-absolu` | price | $170, no size stated. JPG US sells 75, 125 and 200 ml, from $150. Needs the JPG price basis. | jeanpaulgaultier.com/us/en_US/c/all-products-for-men--all-men | 2026-09-24 | — |
| F-019 | open | `jpg-la-belle` | price, status | $115; JPG US lists 100 ml at $150, tagged "Exclusive". Check whether it is house-site-only, which would need status and includeReason. | jeanpaulgaultier.com/us/en_US/p/range-la-belle/ | 2026-09-24 | — |
| F-020 | open | `jpg-le-beau-paradise-garden` | price | $125, no size stated. Sold in 75 and 125 ml, from $126. Needs the JPG price basis. | jeanpaulgaultier.com/us/en_US/c/all-products-for-men--all-men | 2026-09-24 | — |
| F-021 | open | `jpg-le-male` | ingredientsSource | A four-fragrance mini gift set page, not Le Male's own product page. The label was not compared. It contains Cinnamomum and Cinnamal. | sephora.com/product/mini-cologne-replica-sampler-set-P522528 | 2026-09-27 | — |
| F-022 | open | `jpg-ultra-male` | ingredientsSource | Sephora FR, not a US source; content not compared against a US list. | sephora.fr | 2026-09-24 | — |
| F-023 | open | `jpg-le-male-elixir` | ingredients | Matches the cited Sephora page (13 items), but Sephora's gift-set page and Sephora India list a much longer Elixir label. Possible reformulation; check a current box. | sephora.com/product/jean-paul-gaultier-le-male-elixir-P510806 | 2026-09-27 | — |
| F-024 | open | `jpg-le-male-le-parfum` | concentration | Parfum; JPG sells it as Eau de Parfum Intense. | jeanpaulgaultier.com/us/en_US/p/range-le-male/ | 2026-09-27 | — |
| F-025 | open | `jpg-la-belle-le-parfum` | concentration | Parfum; JPG sells it as Eau de Parfum Intense. | jeanpaulgaultier.com/ww/en/p/range-la-belle/ | 2026-09-27 | — |
| F-026 | open | `jpg-scandal-pour-homme` | line | 'Scandal Pour Homme' is a new line used by this entry only. | — | 2026-09-27 | — |
| F-027 | open | `jpg-le-beau-edp` | retired reason | The retirement stands, but the reason's list of the Le Beau line omits Le Beau Flower Edition (2025). | jeanpaulgaultier.com/us/en_US/c/all-products-for-men--all-men | 2026-09-24 | — |
| F-028 | open | `jpg-le-male` | topNotes, heartNotes, baseNotes | Pyramid only seen on a decant site's copy of Fragrantica. Verify on Fragrantica directly. | fragrantica.com/perfume/Jean-Paul-Gaultier/Le-Male-430.html | 2026-09-27 | — |
| F-029 | open | `jpg-le-male-elixir` | topNotes, heartNotes, baseNotes | Same as F-028. | fragrantica.com/perfume/Jean-Paul-Gaultier/Le-Male-Elixir-81642.html | 2026-09-27 | — |
| F-030 | open | `jpg-ultra-male` | topNotes, heartNotes, baseNotes | Same as F-028. | fragrantica.com/perfume/Jean-Paul-Gaultier/Ultra-Male-30947.html | 2026-09-27 | — |
| F-031 | open | `jpg-la-belle-paradise-garden` | topNotes, heartNotes, baseNotes | Flagged by the 2026-09-24 run against Fragrantica; not re-checked yet. The entry has Blue Lotus / Iris / Vanilla. | fragrantica.com/perfume/Jean-Paul-Gaultier/La-Belle-Paradise-Garden-88873.html | 2026-09-24 | — |
| F-032 | open | `dior-sauvage-extrait` | price | $205 matches Dior US and Macy's, but the size is not stated. Needs the Dior price basis or priceSizeMl. | dior.com/en_us/beauty/products/sauvage-extrait-Y0000281.html | 2026-09-24 | — |
| F-033 | open | `pdm-carlisle` | screenFlags | The label half of the reason checks out (Cinnamal on PDM US and Nordstrom). "Reviewers consistently describe a cinnamon-apple accord" was not supported by the reviews seen. | us.parfums-de-marly.com/products/carlisle | 2026-09-24 | — |
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
| F-045 | open | — | price | Only Emporio Armani has a price basis in price-basis.json. Each house needs its most common size set, starting with Jean Paul Gaultier (men's range 75/125 ml, La Belle 100 ml), Dior and Tom Ford. | lib/fragrances/price-basis.json | 2026-09-27 | — |

## Validation coverage

Commits in `4ad2997..main` that touch `lib/fragrances/`, and where each stands.

| PR | Commit | Validated | Notes |
|---|---|---|---|
| #82 | d7a7400 | 2026-09-24, 2026-09-27 | F-001–F-003, F-009–F-016, F-036–F-038 |
| #83 | 0381163 | 2026-09-24, 2026-09-27 | F-004, F-017–F-031, F-039, F-040. Pyramids F-028–F-031 still unverified. |
| #84 | eb44973 | 2026-09-24 | F-034, F-041, F-042. Re-check pending. |
| #85 | ac6401a | not yet | |
| #86 | 7d360e0 | 2026-09-24 | F-005–F-007, F-032, F-033, F-043, F-044 |
| #87 | 8f4ab8d | not yet | Hand-edited, no batch description. |
| #89 | 4e6b554 | not yet | |
| #90 | 5d675ab | not yet | |
| #91 | 27bd9ce | not yet | |
| #92 | 9224980 | n/a | screens.ts only; no data entries. |
| #93 | 5dca68e | not yet | |
| #94 | 1ef42ab | not yet | |
| #95 | eb0e7a1 | not yet | |
| #96 | ca3f739 | not yet | |
| #98 | 8000f5b | not yet | |
| batch-1 | this patch | — | Closes F-001–F-010. |
