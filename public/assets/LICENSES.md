# Asset provenance and licences

Every image under `public/assets/` is recorded here. Nothing on this site
should be used unless it appears in this file with a licence that permits
commercial use.

| Path | Source | Licence | Attribution required | Modification |
| --- | --- | --- | --- | --- |
| `assets/blog/<category>/<slug>.webp` | Original Aroha artwork, generated in code by `scripts/blog-art/generate.mjs` from each article's `art` frontmatter | Owned by Aroha | No | Yes (regenerate from source) |
| `assets/blog/photos/<slug>.webp`, `assets/blog/covers/<category>.webp` | AI-generated illustrations made for Aroha with Google Gemini (Sept 2026) from the prompts in `docs/blog-image-prompts.md`; cropped to 16:9 and converted to WebP. Frontmatter `hero` points an article at its photo; the code-generated art stays as the fallback | Generated for Aroha under the provider's terms | No | Yes |
| `assets/blog/illustrations/<slug>.webp`, `assets/blog/covers/vastu.webp` | AI-generated illustrations supplied by the Aroha team (Google Gemini, Sept–Oct 2026), 35 picked from 104 drafts after a check for misspellings and factual errors; cropped to 16:9 and converted to WebP, with the generator's corner mark removed at the team's request (the site states that illustrations are AI-generated on `/editorial-standards`). Two had a text error painted out (`marriage-timing-vedic-astrology`, `what-is-a-nakshatra`), eight portrait drafts are centred on a blurred copy of themselves to fill the frame, and the cover is cropped to its artwork. Frontmatter `hero` points an article at its illustration; the code-generated art stays as the fallback | Generated for Aroha under the provider's terms | No | Yes |
| `assets/planets/*` | Original planet surface maps and disc renders, generated in code by `scripts/planets/generate.mjs` (3D noise, no source imagery) | Owned by Aroha | No | Yes (regenerate from source) |
| `assets/video/aroha-daily-panchang.{mp4,jpg}`, `assets/video/aroha-vastu-planner.{mp4,jpg}` | Aroha promo films supplied by the Aroha team (Aroha-Promo, Sept 2026), re-encoded to 720p H.264 with poster frames | Owned by Aroha | No | Yes |
| `assets/vastu/aroha-vastu-interiors-*.webp` | Aroha Vastu Interiors promo stills supplied by the Aroha team (Aroha-Promo, Sept 2026), converted to WebP | Owned by Aroha | No | Yes; always captioned as the 3D version, coming soon |

## Assets outside `public/assets/` (pre-existing)

| Path | Source | Notes |
| --- | --- | --- |
| `brand/aroha-logo-*.png` | Aroha app (frontend repo) | Aroha's own mark |
| `planets/*.png`, `gemstones/*.png`, `blog/*.png`, `reports/*.png` | Aroha app's own asset library | Owned by Aroha; `blog/*.png` is no longer used as article heroes |
| `brand/google-play-badge.png`, `brand/app-store-badge.svg` | Google and Apple badge generators | Trademarks; use only unmodified, per each vendor's badge guidelines |
| `videos/*` | Aroha launch films | Owned by Aroha |

## Adding an external asset

1. Confirm the licence allows commercial use and modification.
2. Save the original licence text or URL.
3. Add a row above with source, licence, attribution and modification rights.
4. If attribution is required, add it where the asset is shown.

If a licence doesn't clearly permit commercial use, don't use the asset.
