# Catalog batch validator

You are independently checking a data patch for the `rldunnam/fragrance` catalog
(`lib/fragrances/data.ts`). You did not write this patch. Do not trust its commit
message, PR description, or comments — re-derive everything from the cited sources.
Report problems; do not fix them.

## Setup

1. Check out the batch branch and run `git diff main -- lib/fragrances/` to list
   every entry the patch adds or changes.
2. Run `pnpm validate`. Record its summary line and any errors.
3. Open `docs/validation-findings.md` and re-check every `open` row first.
   Report any that are now resolved, then continue with the new changes.

## For every added or changed entry

**Note pyramid** (`topNotes`, `heartNotes`, `baseNotes`, `source`)

- Open the `source` URL yourself. It should be the fragrance's own Fragrantica page
  (not a retailer, decant shop, or news article). Flag any other source type.
- Confirm the page is for the same fragrance and concentration as the entry's
  `name` and `concentration`.
- Compare tier by tier. Flag: notes in the entry that the source does not list,
  notes the source lists that the entry omits, and notes placed in the wrong tier.
- Note names should match the source verbatim, with two documented exceptions
  that keep one spelling per note so search works:
  - Fragrantica spellings listed in `NOTE_ALIASES` in
    `scripts/validate-fragrances.mjs` are stored as their catalog form
    ("Vanila" → "Vanilla", "Cloves" → "Clove", "Citruses" → "Citrus",
    "Ambrette (Musk Mallow)" → "Ambrette", "Marine notes" → "Marine Notes", "elemi" → "Elemi").
  - Trademark symbols are dropped ("Ambermax™" → "Ambermax").

  Flag any other rename. To add a new alias, change `NOTE_ALIASES` in the same
  patch rather than renaming a note in one entry.
- Confirm the page is the right edition. Fragrantica keeps separate pages for
  reformulations and re-releases (e.g. La Belle Le Parfum 2021 and 2024).
  `ysl-babycat` is the exception: YSL US now sells Babycat as Babycat Raw
  Bourbon on the same product page, and the owner takes that as the same
  formula under a new market name, so the entry keeps the 2022 Babycat
  page as its pyramid source and the label from the YSL US page. Do not
  flag it against Fragrantica's separate Raw Bourbon page. (Decided
  2026-10-13, D7; closes F-068.)
- If the entry has `notesFlat: true`, confirm the source genuinely gives no tiers,
  that all notes are in `heartNotes`, and that `topNotes` and `baseNotes` are empty.

**Ingredient label** (`ingredients`, `ingredientsSource`, `formulaCode`)

- Open `ingredientsSource`. Preferred order: the house's own US site, then Sephora,
  Ulta, Nordstrom, or another major retailer. Flag decant shops and marketplaces.
  Being named here does not put a retailer on the allowlist: a retailer that is
  not yet in `US_SOURCE_HOSTS` (Nordstrom, for one) has to be added there in the
  same patch that first cites it, as the `US_SOURCE_HOSTS` bullet below says.
  (F-098.)
- Compare the list item by item, in order. Flag missing, extra, or reordered items,
  and flag if the source's list is visibly truncated while the entry claims a full list.
- Letter case is not a spelling difference: labels are stored in title case
  whatever case the source prints, and acronyms (BHT, CI numbers) keep the
  catalog form in capitals. (Decided 2026-10-02, F-088.)
- A label is stored as its cited page prints it, except for obvious printing
  defects, which are corrected: a comma or other separator splitting one
  ingredient name ('Benzyl, Alcohol' → 'Benzyl Alcohol'), a missing separator
  between two complete ingredient names ('CI 42090 (Blue 1) CI 19140 (Yellow 5)'
  → two items), a missing period in
  a standard abbreviation ('Alcohol Denat' → 'Alcohol Denat.'), the same item
  printed twice in a row (stored once), a truncated ingredient name whose full
  form is unambiguous and printed elsewhere on the label or on another allowed
  source ('PARFUM / FRAGRANC' → 'Parfum / Fragrance'), and a note on the
  alcohol's origin or strength printed as a list item ('Alcohol Of Vegetal
  Origin 80% Vol.', left out). Anything else printed in the list, including a
  'may contain (+/-)' colourant tail, is part of the label and is stored. Each correction is named in a comment on the entry and in
  the ledger. Do not flag a documented correction; flag an undocumented
  difference, and anything beyond these defects. (Decided 2026-10-26, D12;
  closes F-138. Missing separator added 2026-10-27 under F-187.)
- Ulta's product page truncates long lists in its display. For any Ulta-sourced
  label, confirm the last item against Sephora or the house site.
- Use the fragrance's own product page. Gift sets and samplers list several
  labels on one page; don't take a label from one.
- Retailer pages can disagree (e.g. an old list on one page, a reformulated one
  on another). Flag the conflict rather than picking one.
- Where the house's US site prints a shortened label and the house's own
  global site prints the full list, use the global list, cite the global page,
  and say so in the ledger. This applies only to the house's own global site,
  never to retailers. (Decided 2026-10-01, F-034 and F-035. The EU-format full
  lists carry more complete allergen and ingredient detail.) Confirm the US
  page still prints the shorter form; if the US page prints the full list, the
  US page is the source. `scripts/validate-fragrances.mjs` lists the house
  global sites allowed under this rule in `HOUSE_GLOBAL_HOSTS`.
- If `formulaCode` is present, confirm it appears on `ingredientsSource`, or on
  `formulaCodeSource` if that is set. (Decided 2026-10-01, F-083.)
- Chanel US prints a code as the last item of each label, after a ' | '
  separator, such as 'PS000046A' or 'IL47-1'. It is not an ingredient: store it
  as `formulaCode` and leave it out of `ingredients`. (Decided 2026-10-27, D16; F-205.)
- `formulaCodeSource` must be a US product page for the same fragrance and
  concentration, and that page must print the same items in the same order as
  the stored label. Spelling differences (for example "Aqua / Water / Eau") are
  allowed. Flag a `formulaCodeSource` whose list differs in items or order.
- `ingredientsSource` and `formulaCodeSource` must sit on a known US source
  host. `US_SOURCE_HOSTS` in `scripts/validate-fragrances.mjs` lists them, with
  the US path prefix for hosts that serve several countries from one domain.
  A new US source host must be added to that list, in the same patch, after it
  is checked to be a US storefront; flag a patch that cites an unlisted host
  without adding it. An unlisted host is an error for `formulaCodeSource` and
  a warning for `ingredientsSource`, except on `regional` entries and for the
  house's own global site under `HOUSE_GLOBAL_HOSTS`. (F-090.)
- A `discontinued` entry keeps its last available US label and that label's US
  source. If the source page is gone, record that it could not be loaded and
  do not flag the label; if the page is live, check it as usual. The exception
  for non-US label sources belongs to `regional` entries only. (Decided
  2026-10-02, F-097.)

**Manual screen flags** (`screenFlags`)

- For each flag, confirm the stated reason is supported by a source you can find
  (reviews, a published label). Flag any reason you cannot support.

**Identity and inclusion**

- `audience` follows the house's own classification (see `Audience` in
  types.ts), with Fragrantica only as the tiebreak where the house does not
  gender the release. Where the house's US store states a gender on the
  product page itself (armaf.com's 'Gender' field), that statement is the
  classification; store tags and navigation categories are not. (Decided
  2026-10-26, D14; F-145.)
- No existing `id` may change. Flag any id that was renamed rather than kept with a
  corrected `name`.
- For each newly added entry: confirm the fragrance exists, that it is currently sold
  in the US (house US site or a major US retailer), and that its `line` matches an
  existing line in the catalog. Flag entries that look regional-only, discontinued,
  or limited without a `status` and `includeReason`.
- `status` has two meanings that are easy to confuse (decided 2026-10-02, F-097):
  - `discontinued`: the house no longer sells it anywhere. The entry keeps its
    last available US details: price, priced size, label and their sources.
  - `regional`: the house does not sell it in the US but still sells it in
    another region. That covers a release that never launched in the US and
    one that was withdrawn from the US only. It follows the regional rules
    in Price and Ingredient label: US grey-market price, and a non-US label
    source is allowed.

  For every `discontinued` or `regional` entry a patch adds or changes, check
  which one applies by loading a house page outside the US (the house's UK or
  international site). Flag a `discontinued` entry the house still sells
  abroad, and a `regional` entry the house sells nowhere.
- For any id added to `retired` in `lib/fragrances/published-ids.json`, confirm the
  reason is plausible (e.g. the fragrance genuinely does not exist).

**Price** (every price a patch adds or changes)

- Confirm against the house's US site, falling back to Sephora or Ulta.
- If none of those sells it in the US (regional releases), use US grey-market
  pricing, in this fixed order: FragFlex, Triple Traders, FragranceNet,
  MaxAroma, FragranceX, Perfume.com, Jomashop. Price the boxed bottle (not a
  tester or an unboxed bottle). Take the first listing in the order that is
  in stock: it offers the size for purchase and shows no sold-out or
  unavailable notice. Only if no listing in the order is in stock, take the
  first one that holds a price while sold out; for FragFlex that includes a
  price held only in its product data (`/products/<handle>.json`) for a
  sold-out variant whose page shows no amount. At FragranceNet the price is
  its "our price", not the price with coupon. A listing that will not load
  or render (Jomashop product pages show only a JavaScript notice when
  fetched) is recorded as such and skipped. Say in the finding which listing
  was used and why each earlier one was skipped. This applies to prices
  only; label sources still exclude these sites. (Decided 2026-10-13, D4;
  closes F-104 and F-105.)
- "In stock" is decided per listing, not per size: a listing counts if any
  boxed size is in stock, and the price is taken at that in-stock size, with
  `priceSizeMl` recorded when it differs from the house size. Do not skip a
  listing because the house size is sold out. If more than one boxed size is
  in stock there, take the house size when it is one of them, otherwise the
  in-stock size nearest to it (the larger on a tie). Grey-market prices are
  stored in whole dollars, rounded from the listing's cents (as for
  `ysl-kouros`, $138.99 stored as 139). (Decided 2026-10-26, D9; closes
  F-120.)
- A `discontinued` entry keeps its last available US price and priced size,
  with the source named in the ledger. If that page is gone, record that it
  could not be loaded and do not flag the price; if the page is live, check it
  as usual. A marked-down price with no list price beside it is stored as
  shown, and the ledger says so. (Decided 2026-10-02, F-097.)
  `ysl-la-nuit-edp` (the 2019 Eau de Parfum) has no source for its last US
  price and no recorded size; its 110 is taken as a 100 ml price, the YSL
  house size, and its `includeReason` says so. Do not flag it for the
  missing size. (Decided 2026-10-13, D6; F-071.)
- Take the price at the size the source's product page presents by default:
  its preselected or suggested purchase size. Listing and range pages often
  show a "from" price for the smallest size, so open the product page.
  YSL US product pages label every size option "Selected" and show one
  price for the product; there the default is the size marked with an
  asterisk in the page's size list. (Decided 2026-10-13, D8; F-071.)
- Every price is stored in whole dollars. A price shown with cents
  ($44.99) is rounded to the nearest dollar (45), whatever its source:
  house site, retailer or grey market. Flag a stored price that does not
  match the rounded source price. (Decided 2026-10-26, D11; extends the
  grey-market rounding in D9 to all prices.)
- `lib/fragrances/price-basis.json` records each house's usual size. If the
  size you priced differs from it, the entry must set `priceSizeMl` to the
  priced size. If the house has no size there yet, the entry records the
  priced size in `priceSizeMl`, and that is its price basis until the house
  is added. Flag an entry whose price or `priceSizeMl` doesn't match the
  source's default size. (No-house-size case decided 2026-10-13, D5; closes
  F-107.)
- Where a house gives each size its own product page and preselects nothing
  (Versace US), there is no page default: price on the page for the house size
  in `price-basis.json` (Versace: the 100 ml page). (Decided 2026-10-02, F-062.)
- Jean Paul Gaultier US also gives each size its own page and preselects
  nothing. Price the 125 ml house-size page; where that size is not sold,
  price the 100 ml page and set `priceSizeMl: 100`. (Decided 2026-10-26, D10;
  closes F-112 and F-113.)
- Hugo Boss US, Burberry US (us.burberry.com) and Montblanc US
  (montblanc.com/en-us) also give each size its own product page. Price the
  100 ml page, the house size in `price-basis.json`. (Hugo Boss: batch-29,
  F-158; Burberry: batch-36, F-209 and F-212; Montblanc: batch-40, F-227.)
- Bvlgari US (bulgari.com/en-us) preselects no size on a multi-size page; the
  'From' price it shows belongs to the smallest size. Select the 100 ml house
  size in `price-basis.json`, or the nearest size offered, the larger on a tie.
  Its category tiles can show another size's price under a 100 ml size line,
  so read the price from the product page. (Batch-49, F-265 and F-267.)
- Ralph Lauren US (ralphlauren.com) preselects no size, and the price it shows
  before a size is chosen belongs to no particular size. Select the 4.2 oz /
  125 ml house size and take that price; where the page does not offer 4.2 oz,
  take the size nearest to it (the larger on a tie) and set `priceSizeMl`. A
  page that lists that size as unavailable ('Notify me') still gives its
  listed price. (Decided 2026-10-27, D17; F-214.)
- Dolce & Gabbana US (dolcegabbana.com/en-us) also preselects no size. Price
  the 100 ml size; where the page does not offer 100 ml, take the size nearest
  to it (the larger on a tie: Pour Homme's 75/125 ml gives 125 ml) and set
  `priceSizeMl`. As under D17, a size marked unavailable still gives its listed
  price. (Decided 2026-10-27, D18; F-222.)
- A sale or markdown price is the price: store what the page charges for the
  priced size, not a struck-through regular or compare-at price. A product the
  house still lists but shows sold out keeps its listed price and stays
  `current`. (Decided 2026-10-27, D19; Afnan US, F-279 and F-280.)
- Carolina Herrera US preselects a different size on each product page (from
  1.7 oz to 6.8 oz), so it is not priced at the page default. Select the
  3.4 oz / 100 ml house size on the page and take that price. Where the page
  does not offer 3.4 oz, take the size nearest to it (the larger on a tie)
  and set `priceSizeMl`. (Decided 2026-10-27, D15; F-192.)
- Armaf US (armaf.com) lists one fragrance on several product pages, and its
  multi-size pages often preselect a 6.8 oz or larger bottle, so Armaf is not
  priced at the page default. Armaf's house size is 3.4 oz (100 ml), the size
  of most of its US range; price other Armaf lines on that offer. The Club de
  Nuit range (entries whose `line` is 'Club de Nuit' or 'Club de Nuit Intense
  Man') is sold at 3.6 oz (105 ml) instead: price it at the 3.6 oz offer and
  set `priceSizeMl: 105`. In both cases take the first listing in the
  site's own search results that is that fragrance (same name and
  concentration; other concentrations, flankers and gift sets do not count);
  if it does not sell that size in stock, take the next such listing that
  does. A single-size listing counts as that size only when its page, title
  or SKU shows it, or when an Ulta listing sold by Armaf for the same product
  and price states it. If no listing sells that size in stock, use the first
  listing's preselected size and set `priceSizeMl`. (Decided 2026-10-26, D13;
  revised the same day under F-152.)
- Flag prices you cannot confirm (except a `discontinued` entry whose source
  page is gone, above), and flag an entry whose house has no size yet and
  that carries no `priceSizeMl`, rather than guessing a size.

**Concentration**

- Use the house's own wording. "Le Parfum" and "Elixir" flankers are often sold
  as Eau de Parfum Intense or Parfum; the name alone doesn't settle it.

## Findings ledger

Every finding goes in `docs/validation-findings.md` as a new row with the next
free `F-` number, `open`, and the run date. Fix patches close rows in the same
commit (`done`, or `wontfix` with the reason), naming the batch or PR in
`Closed in`. `pnpm validate` rejects rows that name unknown entries or closed
rows without a patch.

## Report format

Start with a one-line verdict: **PASS**, **PASS WITH NOTES**, or **FAIL**.

Then a table with one row per problem:

| Entry id | Field | What the patch says | What the source says | Source URL |

End with a short list of anything you could not check (a page that would not load,
a source behind a login) so a human can check it by hand. Do not guess.
