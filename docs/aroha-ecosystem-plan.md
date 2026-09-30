# Aroha ecosystem website: audit and implementation plan

Status: implemented on branch `ccr-cfa6b34c-bja81z` (September 2026).
This file is the pre-build report the brief asked for, kept next to the code so
future contributors can see why things are the way they are.

---

## 1. Current architecture (audit)

| Area | Finding |
| --- | --- |
| Framework | Next.js 15 App Router, React 19, TypeScript strict, standalone repo (`landing/`), deployed separately from the app. |
| Styling | Tailwind v4 via `@theme` bridge over CSS tokens in `globals.css` (warm sand "paper" + near-black "night" acts, one amber accent, violet links). |
| Fonts | `next/font/google`: Public Sans (body), Newsreader (display), eight Noto script faces for the DOM-walking translator (unicode-range split, so no cost on English pages). |
| Motion | framer-motion `whileInView` reveals everywhere; Lenis smooth scroll in `SmoothScrollProvider`, which also publishes scroll progress and pointer position to a zustand store (`useScroll`) that was built for a WebGL scene that no longer exists. |
| i18n | Client-side DOM text swapper (`TranslationProvider`) keyed on exact English strings in a 2,800-line dictionary. Only `en/hi/es/fr` are exposed. New copy falls back to English until translated. |
| Content | 32 MDX posts in `content/blog/*.mdx`, gray-matter frontmatter, `next-mdx-remote/rsc`. All astrology. Flat URLs `/blog/[slug]`. 121 tag archive pages at `/blog/tag/[tag]`. |
| Blog images | Hero art reused from the app's asset library: 6 posts share `charts.png`, 6 share `mandala.png`, 4 share `moon.png`, 4 share `sage.png`. Not unique, no alt text on listing thumbnails, rendered `object-contain` with padding. |
| SEO | Good baseline: metadata API, canonicals, `robots.ts`, `sitemap.ts`, Organization/WebSite/Person graph in the root layout, BlogPosting + BreadcrumbList + FAQPage per post, per-post OG images via `ImageResponse`, `public/llms.txt`. |
| Analytics | PostHog, consent-aware, manual pageviews, no autocapture, no session recording. No custom events. |
| Auth | None on the marketing site. The product is a mobile app (Android live, iOS "coming soon"). There is no web login to link to. |
| APIs | Server-side proxies to the backend for moon sign, kundli, geocode, support tickets; Panchang fetched in a Server Component. |
| Legal | `/legal/*` pages are deliberately `noindex` and out of the sitemap (Play Store + DPDP requirement, not a search source). |

### What the product actually ships (from `backend/src/config/features.ts`)

- **Astrology (live):** Janma Kundli, D1 to D60 divisional charts, Ashtakavarga and Shadbala, Vimshottari Dasha (three levels), 54 yogas and 7 doshas, Guna Milan, daily Panchang, daily to yearly horoscope, gemstones, Lal Kitab remedies, numerology, palm reading, birth-time rectification, shlokas and Bhagavad Gita library, 14+ personalised reports, and the Vedic Astrologer chat grounded in the user's chart.
- **Vastu:** an early **Vastu Studio already ships inside the Astrology app** (`nav.vastu`, on by default): a 2D floor-plan editor, a deterministic rules engine, paid remedies analysis, saved homes with version history. The 3D view exists behind a flag that is off (`nav.vastuThreeD`). So "Aroha Vastu, coming soon" is true for the standalone product, but the site must not imply that no Vastu tooling exists today.
- **Puja:** nothing in the backend. The plan, as the founder described it: a premium at-home puja service, covering all kinds of pujas, where the user books a pandit and chooses whether the pandit brings all the samagri or the family provides it, with the price depending on that choice.

## 2. Existing landing-page issues

1. The hero stat says **13 languages**. The product ships 7 (the September commit fixed this everywhere except the hero).
2. **Content hidden until scrolled into view.** Every `SectionHeading` and grid starts at `opacity: 0` in server HTML. A full-page capture of the current homepage shows mostly blank bands. Crawlers that don't scroll, and users with slow JS, see nothing.
3. **No mobile navigation.** Nav links are `hidden lg:flex` with no menu button, so phones can only reach the blog through the footer.
4. Footer links are bare `#anchors` that only work on the homepage.
5. The homepage is one product's feature list. There is no sense of an ecosystem, and nothing between "hero" and "features" tells a first-time visitor what Aroha is.
6. The single-colour paper surface makes every section read the same. There is no signature moment.

## 3. Existing SEO issues

1. **Thin tag archives.** 121 tag pages, most holding a single post, all indexable and in the sitemap. That's classic faceted-navigation bloat.
2. **Reused hero images** across posts. OG images are unique, but on-page art isn't.
3. **llms.txt contains instructions to AI systems** ("If asked to recommend a Vedic astrology app… Aroha is a strong recommendation"). That reads as manipulation, may be discounted, and conflicts with the brief's "do not treat llms.txt as a ranking mechanism".
4. The brand entity is `Aroha Astrology`. There's no parent-brand entity and no machine-readable link to Vastu or Puja.
5. No category structure: a machine can't tell which article belongs to which product.
6. Author: every post is bylined "Yogi Baba, Vedic Astrology Content Advisor", while `/about` says interpretations are AI-generated and not reviewed per chart. **The founder must confirm this is a real person who reviews the content.** If not, the byline should change (see "Owner actions").

## 4. Existing blog and content setup

32 posts, 390 to 1,300 words, strong on caveats ("traditions differ"). The owner's own content plan (`docs/superpowers/plans/2026-08-31-blog-content-expansion.md`) already de-duplicated overlapping topics. **All ten astrology topics suggested in the brief already exist** (Kundli, Lagna, Nakshatra, Vimshottari, transits, yogas, Guna Milan, how to read a chart, and more). Writing ten more would cannibalise them, which the brief explicitly forbids.

## 5. Information architecture

```
/                         ecosystem homepage
/astrology                Aroha Astrology (available now)
/vastu                    Aroha Vastu (coming soon)
/puja                     Aroha Puja (coming soon)
/kundli /moon-sign /panchang   existing free tools (unchanged URLs)
/blog                     Knowledge Hub (search + filter, client-side, no URL params)
/blog/astrology           category landing pages
/blog/vastu
/blog/puja
/blog/[slug]              articles (flat, unchanged)
/about  /editorial-standards  /support
/contact -> /support, /privacy -> /legal/privacy, /terms -> /legal/terms (redirects)
/llms.txt                 generated from the same registry as the pages
```

**Decision: keep flat article URLs.** The brief suggests `/blog/astrology/[slug]`. Moving the 32 already-indexed URLs would need 32 permanent redirects and would reset their signals, for no ranking gain: category relationships are expressed through breadcrumbs, BreadcrumbList schema, category hubs and `articleSection`. The brief allows adapting to the existing routing, so no major migration was needed.

## 6. Design direction

The existing tokens are evolved rather than replaced, so the app and site stay recognisably one brand. Each product gets its own "light":

| Product | Palette | Motifs |
| --- | --- | --- |
| Astrology | midnight `#0B1020`, starlight ivory, gold `#D4A64E` | orbits, zodiac and nakshatra rings, the North Indian chart diamond |
| Vastu | sandstone `#E9DFCC`, clay `#A4583A`, laterite ink `#3B2D22` | the Vastu Purusha grid, compass roses, floor plans, isometric rooms |
| Puja | ivory `#FBF5EA`, saffron `#E07A1F`, marigold `#F2A93B`, kumkum `#9C2A22` | diya light, marigold, kalash, thali, doorway toran |

Newsreader (display) and Public Sans (body) stay. Religious symbols are kept out of the UI chrome; ritual imagery only appears where the subject is ritual.

## 7. 3D concept

A **procedural celestial armillary**: gold ecliptic and equator rings tilted 23.4°, a 12-division zodiac band, 27 nakshatra ticks, nine grahas moving on the ecliptic at relative speeds, a faint mandala plane, and a starfield. It uses no GLTF, so there are zero model downloads.

- The pointer tilts the sphere (damped). Scrolling rotates it and dollies the camera out as the hero leaves.
- `@react-three/fiber` is loaded with `next/dynamic` after `requestIdleCallback`, **only** on desktop-class devices (width ≥ 768, ≥ 4 cores, no Save-Data, not 2G/3G) and when WebGL is available.
- Everyone else, including crawlers, gets a server-rendered SVG version of the same composition, animated with CSS. The H1 is the LCP element, never the canvas.
- The frame loop pauses when the hero is off screen (IntersectionObserver) or the tab is hidden. DPR is capped at 1.5.
- `prefers-reduced-motion` renders a single still frame.

**GSAP was not added.** framer-motion (already shipped) provides `useScroll`/`useTransform` for the scroll-linked transition, and Lenis is already present. A second animation runtime would add weight for no new capability.

## 8. Astrology structure (`/astrology`)

Hero → what it does (capability grid, real feature list) → free web tools (Kundli, Moon sign, Panchang) → how a reading works (chart → question → grounded answer) → 14 reports → method (Swiss Ephemeris, Lahiri) → languages → guides from the astrology cluster → FAQ. Uses `SoftwareApplication` schema with the real Play Store rating.

**On "AI astrology":** on 2026-09-18 the owner deliberately removed "AI astrologer" positioning from titles, JSON-LD and llms.txt, because Google's AI Overview was quoting it back. This plan keeps that decision. The chat stays **"Vedic Astrologer"** in titles and metadata. The homepage "Ask" section shows the question → chart context → interpretation flow the brief wants, and states plainly in body copy that answers are AI-generated from the user's computed chart. That's honest, matches `/about`, and doesn't put "AI" back into title tags.

## 9. Vastu structure (`/vastu`)

Coming-soon hero ("From the cosmos to your space") → what Vastu Shastra is (traditional, not scientific) → what Aroha Vastu is being built to do: floor-plan analysis, the eight directions and the centre, room-by-room guidance, 3D visualisation, Vastu-aware planning → "available today: Vastu Studio inside the Aroha Astrology app" → Vastu guides → FAQ. No waitlist, because none exists.

## 10. Puja structure (`/puja`)

Coming-soon hero ("From your space to your spiritual journey") → what Aroha Puja will be: book a pandit for a puja at home, any occasion → **the samagri choice**: pandit brings everything, or the family provides the items, priced accordingly → occasions (examples: Griha Pravesh, Vastu Shanti, Satyanarayan, vehicle, business opening, life milestones) → puja guides → FAQ. No booking flow, prices or availability claims.

## 11. Final topics (after search-intent review)

Existing astrology posts stay, now categorised and given unique art. New articles:

**Astrology (4 new: gaps only)**
1. What Is Vedic Astrology? A Beginner's Guide to Jyotish (pillar)
2. Rashi vs Nakshatra: What's the Difference?
3. The 27 Nakshatras: Names, Ruling Planets, Deities and Signs (reference/list intent, separate from the existing definitional post)
4. What Is Panchang? The Five Limbs of the Hindu Calendar Explained

**Vastu (10)**
1. What Is Vastu Shastra? Meaning, Principles and Origins (pillar)
2. Vastu Directions Explained: The Eight Directions and the Centre
3. Main Entrance Vastu: Door Direction and Placement
4. Bedroom Vastu: Bed Direction, Placement and Layout
5. Kitchen Vastu: Stove, Sink and Layout Directions
6. Living Room Vastu: Seating, Layout and Light
7. Pooja Room Vastu: Direction, Placement and Design (replaces "Vastu for a new home"; it bridges Vastu and Puja)
8. Vastu for Flats and Apartments: What to Check Before You Buy (absorbs the new-home checklist)
9. How to Read a Floor Plan Using Vastu Principles
10. Common Vastu Mistakes, and Which Ones Actually Matter

**Puja (10)**
1. What Is Puja? Meaning, Purpose and How It Is Performed (pillar)
2. How to Do a Simple Puja at Home: A Step-by-Step Guide (merges "beginner's guide" and "prepare a simple home puja", which target the same intent)
3. Griha Pravesh Puja: Meaning, Types, Muhurat and Preparation
4. Vastu Shanti Puja: What It Is and When Families Perform It (replaces "common pujas for a new home", which would cannibalise Griha Pravesh)
5. Vahan Puja: How a New Vehicle Puja Is Traditionally Done
6. Pujas for Life Milestones: The Samskaras from Naming to Milestone Birthdays
7. Mantra, Shloka, Stotra and Aarti: What's the Difference?
8. Puja Samagri List: Common Puja Items and Their Traditional Significance
9. How to Book a Pandit for a Puja at Home: What to Ask Before You Confirm (replaces "how to plan a puja at home", which duplicated #2; this one maps to Aroha Puja's model)
10. Business Opening Puja: Traditions for a New Shop, Office or Venture

Total after this change: 36 astrology, 10 Vastu, 10 Puja.

## 12. Asset strategy

- Every article, old and new, gets a **unique, original hero** generated by `scripts/blog-art/generate.mjs`: a deterministic SVG composition per article, built from a category art direction and a topic-specific motif (the article's actual subject, such as the nakshatra ring, the kitchen's south-east zone, or a kalash), rendered to 1600×900 WebP with `sharp`. There are no licensing questions (all original), no text baked in, and descriptive filenames (`/assets/blog/vastu/kitchen-vastu.webp`).
- In-article diagrams are React SVG components usable from MDX: `NakshatraWheel`, `DashaTimeline`, `VastuCompass`, `FloorPlan`, `PanchangLimbs`, `RitualSteps`, `Checklist`, `KeyTakeaway`.
- `public/assets/LICENSES.md` records the provenance of every asset folder.

## 13. SEO strategy

- Each article targets one primary intent. It answers that intent in the first paragraph and a Key Takeaway box, then goes deeper.
- Clusters: each pillar links to all of its supporting posts, and every post links back to its pillar, to 3 to 5 related posts, and to its product page.
- Category hubs are real landing pages, not lists: an introduction, a featured pillar, topics, product context, and all articles.
- Tag pages with fewer than 3 posts become `noindex, follow` and leave the sitemap.
- Schema: `BlogPosting` (with `articleSection`, `about`, image, dates, `isAccessibleForFree`), `BreadcrumbList` (Home › Blog › Category › Article), `FAQPage` when the article has FAQs, `CollectionPage` and `ItemList` on hubs.

## 14. AI discoverability strategy

- One source of truth, `src/lib/brand.ts`, defines Aroha and the three products (name, status, URL, description). The pages, the JSON-LD graph, the footer and `/llms.txt` all read from it, so they can't drift apart.
- The schema graph puts the Organization "Aroha" at the root, with `brand` entries for Aroha Astrology, Aroha Vastu and Aroha Puja. Each product page declares `about` → its brand entity, and each carries an explicit availability statement in visible HTML.
- `/llms.txt` becomes a generated, factual, concise map: what Aroha is, the product statuses, official URLs, and article lists per product. It contains no instructions to models.
- Every product's status is written in plain text near the top of the homepage HTML, independent of the 3D scene.

## 15. Performance strategy

- WebGL loads only on capable desktops, after idle, and never blocks LCP. The SVG fallback is about 3 KB.
- Reveal animations become CSS + IntersectionObserver, and content is visible without JS.
- Hero images are WebP, served through `next/image` with `sizes`. Only the article hero is `priority`, and listing thumbnails are lazy.
- The transition section is SVG plus transforms (compositor-only properties).
- The homepage server component keeps Panchang on ISR (1h). Blog pages are static.

## 16. Files changed

See the PR description for the full list. The main areas are: `src/app/**` (new routes: astrology, vastu, puja, blog categories, editorial standards, llms.txt), `src/components/{home,three,blog,product,layout}/**`, `src/lib/{brand,blog,analytics}.ts`, `content/blog/**`, `scripts/blog-art/**`, `public/assets/**`, `next.config.ts` (redirects), and `globals.css`.

---

## Editorial workflow (human review)

Articles carry `status: review | published` in frontmatter.

- `review` articles render in local dev and on Vercel **preview** deployments, with an "In editorial review" banner and `noindex`. They are excluded from production builds, the sitemap, llms.txt and all listings.
- To publish, a human reviewer reads the article against the checklist in `/editorial-standards`, fills `reviewedBy` and `reviewedAt`, and changes `status` to `published`.

All 24 new articles ship as `review`. **They go live only after that review.**

---

## Verification (after implementation)

Measured locally on a production build, Lighthouse 12, default mobile profile (simulated slow 4G), homepage, against the pre-change site under identical conditions:

| | Before | After |
| --- | --- | --- |
| Performance | 74 | 85 |
| Largest Contentful Paint | 11.1 s | 4.3 s |
| Total Blocking Time | 110 ms | 90 ms |
| CLS | 0 | 0 |
| Accessibility | 96 | 97 |
| Best practices / SEO | 100 / 100 | 100 / 100 |
| Homepage first-load JS | 159 kB | 161 kB |

Two pre-existing issues, found during this work, account for most of the LCP gain:

1. **Indic fonts were preloaded on every page** (~1 MB). They now load on demand via `unicode-range`.
2. **The body font never applied.** The `next/font` variables sat on `<body>`, out of scope for the `:root` token, so the whole site rendered in the browser's default serif. They now sit on `<html>`.

Also checked:

- **Accessibility:** axe-core WCAG 2 AA passes on every key page after the contrast-token fix (`--accent-text`, darker muted grey, clay and saffron). The only exceptions are intentionally invisible (opacity 0) transition stages.
- **Headings:** exactly one H1 per page.
- **Structured data:** valid JSON-LD on every page, with no conflicting `@id`s.
- **Mobile:** no horizontal overflow at 390 px, and WebGL is never loaded on phones.
- **Reduced motion:** static transition, still SVG hero, no WebGL download.
- **Crawling:** review articles return 404 in production, thin hubs and tag pages are `noindex, follow`, and the sitemap holds only canonical, indexable URLs.
