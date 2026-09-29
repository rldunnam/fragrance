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
    "Ambrette (Musk Mallow)" → "Ambrette").
  - Trademark symbols are dropped ("Ambermax™" → "Ambermax").

  Flag any other rename. To add a new alias, change `NOTE_ALIASES` in the same
  patch rather than renaming a note in one entry.
- Confirm the page is the right edition. Fragrantica keeps separate pages for
  reformulations and re-releases (e.g. La Belle Le Parfum 2021 and 2024).
- If the entry has `notesFlat: true`, confirm the source genuinely gives no tiers,
  that all notes are in `heartNotes`, and that `topNotes` and `baseNotes` are empty.

**Ingredient label** (`ingredients`, `ingredientsSource`, `formulaCode`)

- Open `ingredientsSource`. Preferred order: the house's own US site, then Sephora,
  Ulta, Nordstrom, or another major retailer. Flag decant shops and marketplaces.
- Compare the list item by item, in order. Flag missing, extra, or reordered items,
  and flag if the source's list is visibly truncated while the entry claims a full list.
- Ulta's product page truncates long lists in its display. For any Ulta-sourced
  label, confirm the last item against Sephora or the house site.
- Use the fragrance's own product page. Gift sets and samplers list several
  labels on one page; don't take a label from one.
- Retailer pages can disagree (e.g. an old list on one page, a reformulated one
  on another). Flag the conflict rather than picking one.
- If `formulaCode` is present, confirm it appears on the source.

**Manual screen flags** (`screenFlags`)

- For each flag, confirm the stated reason is supported by a source you can find
  (reviews, a published label). Flag any reason you cannot support.

**Identity and inclusion**

- No existing `id` may change. Flag any id that was renamed rather than kept with a
  corrected `name`.
- For each newly added entry: confirm the fragrance exists, that it is currently sold
  in the US (house US site or a major US retailer), and that its `line` matches an
  existing line in the catalog. Flag entries that look regional-only, discontinued,
  or limited without a `status` and `includeReason`.
- For any id added to `retired` in `lib/fragrances/published-ids.json`, confirm the
  reason is plausible (e.g. the fragrance genuinely does not exist).

**Price** (every price a patch adds or changes)

- Confirm against the house's US site, falling back to Sephora or Ulta.
- If none of those sells it in the US (regional releases), use US grey-market
  pricing, in this order: FragFlex, then Triple Traders, then the next US
  grey-market listing (e.g. Jomashop). Say which source was used in the
  finding. This applies to prices only; label sources still exclude these
  sites.
- Take the price at the size the source's product page presents by default:
  its preselected or suggested purchase size. Listing and range pages often
  show a "from" price for the smallest size, so open the product page.
- `lib/fragrances/price-basis.json` records each house's usual size. If the
  size you priced differs from it, the entry must set `priceSizeMl` to the
  priced size. Flag an entry whose price or `priceSizeMl` doesn't match the
  source's default size.
- Flag prices you cannot confirm, and flag a house with no size yet rather
  than guessing one.

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
