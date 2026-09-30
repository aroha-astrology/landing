# Asset provenance and licences

Every image under `public/assets/` is recorded here. Nothing on this site
should be used unless it appears in this file with a licence that permits
commercial use.

| Path | Source | Licence | Attribution required | Modification |
| --- | --- | --- | --- | --- |
| `assets/blog/<category>/<slug>.webp` | Original Aroha artwork, generated in code by `scripts/blog-art/generate.mjs` from each article's `art` frontmatter | Owned by Aroha | No | Yes (regenerate from source) |

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
