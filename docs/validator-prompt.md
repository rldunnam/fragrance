# Catalog batch validator

You are independently checking a data patch for the `rldunnam/fragrance` catalog
(`lib/fragrances/data.ts`). You did not write this patch. Do not trust its commit
message, PR description, or comments — re-derive everything from the cited sources.
Report problems; do not fix them.

## Setup

1. Check out the batch branch and run `git diff main -- lib/fragrances/` to list
   every entry the patch adds or changes.
2. Run `pnpm validate`. Record its summary line and any errors.

## For every added or changed entry

**Note pyramid** (`topNotes`, `heartNotes`, `baseNotes`, `source`)

- Open the `source` URL yourself. It should be the fragrance's own Fragrantica page
  (not a retailer, decant shop, or news article). Flag any other source type.
- Confirm the page is for the same fragrance and concentration as the entry's
  `name` and `concentration`.
- Compare tier by tier. Flag: notes in the entry that the source does not list,
  notes the source lists that the entry omits, and notes placed in the wrong tier.
- Note names should match the source verbatim. The one allowed exception is a
  documented spelling fix that keeps search working (e.g. Fragrantica's "Vanila"
  stored as "Vanilla"). Flag any other rename.
- If the entry has `notesFlat: true`, confirm the source genuinely gives no tiers,
  that all notes are in `heartNotes`, and that `topNotes` and `baseNotes` are empty.

**Ingredient label** (`ingredients`, `ingredientsSource`, `formulaCode`)

- Open `ingredientsSource`. Preferred order: the house's own US site, then Sephora,
  Ulta, Nordstrom, or another major retailer. Flag decant shops and marketplaces.
- Compare the list item by item, in order. Flag missing, extra, or reordered items,
  and flag if the source's list is visibly truncated while the entry claims a full list.
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

**Price** (new entries only)

- Confirm `price` against the house's US site for 100 ml (or the nearest size the
  house sells, which should be stated), falling back to Sephora or Ulta. Flag
  prices you cannot confirm.

## Report format

Start with a one-line verdict: **PASS**, **PASS WITH NOTES**, or **FAIL**.

Then a table with one row per problem:

| Entry id | Field | What the patch says | What the source says | Source URL |

End with a short list of anything you could not check (a page that would not load,
a source behind a login) so a human can check it by hand. Do not guess.
