# Knowledge Hub hero art

Original, code-drawn illustrations for every article, one art direction per
product:

- **Astrology**: midnight sky, gold linework (zodiac and Nakshatra rings, the
  North Indian chart, Dasha proportions, planets).
- **Vastu**: sandstone drafting paper, laterite ink, clay highlights (plans,
  compass roses, the Vastu Purusha grid, isometric rooms).
- **Puja**: ivory and firelight (diyas, kalash, thali, marigolds, doorways).

## Usage

```bash
npm run blog:art                 # regenerate all
npm run blog:art -- kitchen-vastu  # one or more slugs
ART_DEBUG_SVG=1 npm run blog:art -- kitchen-vastu  # also write the .svg
```

Output: `public/assets/blog/<category>/<slug>.webp` (1600 × 900, ~20–45 KB).
`next/image` serves responsive AVIF/WebP sizes from it, and the per-article
Open Graph image (`src/app/blog/[slug]/opengraph-image.tsx`) reuses it.

## Frontmatter

```yaml
category: "vastu"
heroAlt: "Describe what the image actually shows, in plain language"
art:
  motif: "plan-rooms"   # see the MOTIFS object in astrology.mjs / vastu.mjs / puja.mjs
  focus: ["kitchen"]    # optional, motif-specific (houses, sign index, room, planet…)
  variant: "read"       # optional, motif-specific
```

Each article should get a motif (or motif + focus) that no other article
uses, and one that depicts its actual subject. Images contain no text;
titles stay in HTML.
