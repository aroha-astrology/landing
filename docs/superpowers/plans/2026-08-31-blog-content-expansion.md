# Blog Content Expansion (11 posts) + FAQ Schema + llms.txt Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Deviation from the standard template:** most tasks below are content-authoring, not code — there is no test framework for MDX prose. Each content task's "verification step" is `npm run build` (MDX must compile) plus a `npm run dev` visual/accuracy read-through, in place of a unit test. The two infra tasks (Task 0, Task 12) are real code changes and follow the normal write-test-implement shape.

**Goal:** Ship 11 new Vedic-astrology blog posts to `landing/content/blog/`, in a dependency-aware order that avoids duplicating three sections that already exist in older posts, then add the FAQPage structured-data + `llms.txt` infra so both new and existing posts are citable by search and AI-assistant crawlers (GEO).

**Architecture:** Every post is a `content/blog/<slug>.mdx` file with gray-matter frontmatter (`title`, `description`, `date`, `tags`); `src/lib/blog.ts` and `sitemap.ts` already read the directory generically, so **no code changes are needed to publish a post** — only content changes. Two small, real code changes are needed for the GEO/SEO ask: (1) an optional `faqs` frontmatter array + a `FAQPage` JSON-LD block on `blog/[slug]/page.tsx`, mirroring the existing hand-written pattern in `src/app/moon-sign/page.tsx:16-73` rather than parsing markdown; (2) a static `public/llms.txt`.

**Tech Stack:** Next.js 15 (App Router), `next-mdx-remote/rsc`, `gray-matter`, Next Metadata API. No new dependencies.

---

## Why this order (read before executing)

The 11 topics aren't independent — three of them overlap existing published posts, and two of them depend on a not-yet-published post to link to sensibly. Publishing in spec order would create duplicate/competing content (bad for SEO) and dangling forward-references (bad for GEO citability). Sequence tasks 1–11 as listed; don't reorder without re-checking the "Overlap/dependency" line in that task.

| # | Post | Why here |
|---|---|---|
| 1 | How to Find Your Birth Time | No dependency. Highest business value (onboarding-drop-off recovery) — ship first. |
| 2 | Retrograde Planets | No dependency. Fills the biggest gap next to existing dignity/combustion content. |
| 3 | Career in Kundli | No dependency. Highest commercial search intent. |
| 4 | Planetary Aspects (Drishti) | No dependency, but every later post that mentions "aspects" should be able to link here — do it before 5–11. |
| 5 | Mahadasha / Antardasha / Pratyantar Dasha | **Overlaps** `vimshottari-dasha-guide.mdx`, which already has a full "Antardashas" section. Must be written as a companion deep-dive (adds Pratyantar + worked multi-level example), not a re-explainer — see Task 5. |
| 6 | Atmakaraka | No dependency, but Ishta Devata (7) needs it published first so the internal link isn't forward-dangling. |
| 7 | Ishta Devata | **Depends on** 6 (Atmakaraka, Karakamsha are prerequisite concepts). |
| 8 | Neecha Bhanga Raja Yoga | **Overlaps** `exalted-debilitated-planets.mdx`, which already has a "Neecha Bhanga Raja Yoga" H2. That section must be trimmed to a teaser + link once this post exists — see Task 8. |
| 9 | Marriage Timing | No hard dependency, but is richer with 5 (Dasha timing) and existing Manglik/Guna Milan/Navamsa posts to link to. |
| 10 | Doshas in Kundli (pillar) | Benefits from 8 existing (can link to Neecha Bhanga as the "debilitation isn't automatically a dosha" cross-reference) and existing Manglik post. |
| 11 | Vedic Astrology Remedies | Broadest/last — rounds up links to Gemstones (existing), and future Doshas/Manglik. |

Task 0 (FAQ schema infra) runs first since posts 1–11 all end in an FAQ section and should use the new frontmatter field from the start, not be retrofitted. Task 12 (llms.txt) and Task 13 (backlink/trim pass on old posts) run last, after all 11 exist.

---

## File Structure

- Modify: `src/lib/blog.ts` — widen `BlogFrontmatter` type with optional `faqs`.
- Modify: `src/app/blog/[slug]/page.tsx` — emit `FAQPage` graph node when `faqs` is present.
- Create: `public/llms.txt` — GEO manifest.
- Create: 11 files under `content/blog/*.mdx` (paths below, one per task).
- Modify: `content/blog/exalted-debilitated-planets.mdx` — trim Neecha Bhanga section (Task 8).
- Modify: `content/blog/vimshottari-dasha-guide.mdx` — add forward link to the new Dasha-hierarchy post (Task 5).
- Modify: `content/blog/raj-yoga-vedic-astrology.mdx` — add backlink to Neecha Bhanga post (Task 8).

---

## Shared accuracy guardrails (apply to every article task below)

Carried over from the user's own spec — do not relax these when drafting:

- Never present a single classical rule as the only method different traditions use (Jaimini deity/Atmakaraka rules, Rahu/Ketu aspect rules, Kaal Sarp interpretation, etc.) — name that traditions differ.
- Never promise a deterministic outcome ("your exact marriage date", "your dosha is cancelled") — describe how it's traditionally analyzed instead.
- Every "X is bad/weak" claim (retrograde, debilitated, dosha) must be immediately qualified by house/lordship/aspect/dasha context — this codebase already has that voice, see `content/blog/exalted-debilitated-planets.mdx:30-37`.
- End every post with the same CTA shape already used across the blog: a one-line pointer to the relevant in-app feature (`/kundli`, or the Play Store link used in `vimshottari-dasha-guide.mdx:48`), not a hard sales pitch.

---

### Task 0: FAQPage schema infra

**Files:**
- Modify: `src/lib/blog.ts`
- Modify: `src/app/blog/[slug]/page.tsx`

- [ ] **Step 1: Widen the frontmatter type**

In `src/lib/blog.ts`, change:

```ts
export type BlogFrontmatter = {
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  tags: string[];
};
```

to:

```ts
export type BlogFrontmatter = {
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  tags: string[];
  faqs?: { question: string; answer: string }[];
};
```

- [ ] **Step 2: Add the FAQPage graph node**

In `src/app/blog/[slug]/page.tsx`, destructure `faqs` alongside the existing fields:

```ts
const { title, description, date, tags, faqs } = post.frontmatter;
```

Then extend the existing `jsonLd['@graph']` array (currently `BlogPosting` + `BreadcrumbList`) with a conditional third node, matching the exact shape already used in `src/app/moon-sign/page.tsx:64-71`:

```ts
...(faqs?.length
  ? [
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      },
    ]
  : []),
```

- [ ] **Step 3: Verify it compiles and emits nothing for existing posts**

Run: `npm run build`
Expected: build succeeds; no existing `.mdx` file sets `faqs`, so their rendered JSON-LD `@graph` is unchanged (still just `BlogPosting` + `BreadcrumbList`).

- [ ] **Step 4: Commit**

```bash
git add src/lib/blog.ts "src/app/blog/[slug]/page.tsx"
git commit -m "feat(blog): add optional FAQPage schema to blog posts"
```

---

### Task 1: How to Find Your Birth Time

**Create:** `content/blog/how-to-find-unknown-birth-time.mdx`

**Overlap/dependency:** None.

**Frontmatter:**

```yaml
---
title: "Don't Know Your Birth Time? How to Find or Estimate It for a Kundli"
description: "Your birth time decides your Lagna and house divisions — here's how to track it down from records, and what rectification can and can't do if it's truly unknown."
date: "2026-09-01"
tags: ["birth time unknown", "kundli without birth time", "birth time rectification", "find birth time astrology"]
---
```

**Outline** (H2 unless marked):
1. Why Birth Time Matters in Vedic Astrology
2. What Changes When Your Birth Time Is Unknown?
3. Can You Still Make a Kundli Without Birth Time?
4. Can You Find Your Birth Time From Official Records? (birth certificate / hospital records / family records as H3s)
5. Astrological Birth Time Rectification — how it works, what life events it uses, why it isn't exact
6. Can You Know Your Moon Sign Without Birth Time?
7. Can You Know Your Sun Sign Without Birth Time?
8. What You Can Still Explore Without an Exact Birth Time
9. Frequently Asked Questions

**Internal links:** [/blog/what-is-lagna-ascendant](/blog/what-is-lagna-ascendant), [/blog/what-is-a-moon-sign](/blog/what-is-a-moon-sign), [/blog/12-houses-vedic-astrology](/blog/12-houses-vedic-astrology).

**CTA:** point at the app's onboarding flow — this post exists specifically to keep a user without a known birth time from bouncing.

- [ ] **Step 1:** Draft the post per the outline and accuracy guardrails above.
- [ ] **Step 2:** Run `npm run build` — confirm the new route compiles and appears in `next build`'s route list.
- [ ] **Step 3:** Run `npm run dev`, open `/blog/how-to-find-unknown-birth-time`, confirm heading hierarchy renders correctly and internal links resolve (no 404s).
- [ ] **Step 4: Commit**

```bash
git add content/blog/how-to-find-unknown-birth-time.mdx
git commit -m "content(blog): add birth time rectification guide"
```

---

### Task 2: Retrograde Planets in Vedic Astrology

**Create:** `content/blog/retrograde-planets-vedic-astrology.mdx`

**Overlap/dependency:** None. Companion to the existing combustion/dignity posts — cross-link both ways.

**Frontmatter:**

```yaml
---
title: "Retrograde Planets in Vedic Astrology: Meaning, Effects and Common Myths"
description: "A retrograde (vakri) planet doesn't simply mean 'stronger' or 'weaker' — its reading depends on sign, house, dignity and dasha. Here's how each retrograde planet is traditionally interpreted."
date: "2026-09-02"
tags: ["retrograde planets astrology", "vakri planet meaning", "retrograde saturn", "retrograde jupiter effects"]
---
```

**Outline:**
1. What Does Retrograde Mean?
2. Why Planets Appear Retrograde
3. Which Planets Can Be Retrograde?
4. What Is Vakri in Vedic Astrology?
5. Does Retrograde Always Mean Weak? (explicitly reject "retrograde = stronger" and "retrograde = weaker" as oversimplified — this is the accuracy point the user flagged)
6. How Retrogression Changes Planetary Expression — Mercury, Venus, Mars, Jupiter, Saturn as H3s
7. What About Rahu and Ketu?
8. Retrograde in Natal Charts vs. Transits
9. Common Myths About Retrograde Planets
10. Frequently Asked Questions

**Internal links:** [/blog/exalted-debilitated-planets](/blog/exalted-debilitated-planets), [/blog/combust-planets-vedic-astrology](/blog/combust-planets-vedic-astrology), [/blog/planetary-transits-gochar-vedic-astrology](/blog/planetary-transits-gochar-vedic-astrology).

- [ ] **Step 1:** Draft per outline and guardrails.
- [ ] **Step 2:** `npm run build`.
- [ ] **Step 3:** `npm run dev`, visual + link check.
- [ ] **Step 4: Commit**

```bash
git add content/blog/retrograde-planets-vedic-astrology.mdx
git commit -m "content(blog): add retrograde planets guide"
```

---

### Task 3: Career in Vedic Astrology

**Create:** `content/blog/career-in-vedic-astrology-kundli.mdx`

**Overlap/dependency:** None.

**Frontmatter:**

```yaml
---
title: "Career in Vedic Astrology: How to Read Profession and Career From Your Kundli"
description: "No single house decides your career — the 10th, 6th, 2nd, 11th and 9th houses, the Lagna lord, and the Dasamsa (D10) chart all factor in. Here's how astrologers piece it together."
date: "2026-09-03"
tags: ["career in kundli", "10th house astrology", "career astrology vedic", "dasamsa d10 chart"]
---
```

**Outline:**
1. Can a Kundli Show Career Direction?
2. The 10th House and Profession
3. The 10th Lord
4. The 6th House and Employment
5. The 2nd House and Income
6. The 11th House and Gains
7. The 5th House and Creativity
8. The 9th House and Career Fortune
9. The Role of the Lagna and Lagna Lord
10. Planets in the 10th House
11. Career Through the Dasamsa (D10)
12. Career Timing Through Dashas
13. Why No Single Placement Decides Your Career
14. Frequently Asked Questions

**Internal links:** [/blog/12-houses-vedic-astrology](/blog/12-houses-vedic-astrology), [/blog/divisional-charts-navamsa-guide](/blog/divisional-charts-navamsa-guide) (generalize D9→Vargas framing to introduce D10), [/blog/vimshottari-dasha-guide](/blog/vimshottari-dasha-guide).

**CTA:** this is the highest-commercial-intent post — point at a career-reading purchase flow if one exists in-app, otherwise `/kundli`.

- [ ] **Step 1:** Draft per outline and guardrails.
- [ ] **Step 2:** `npm run build`.
- [ ] **Step 3:** `npm run dev`, visual + link check.
- [ ] **Step 4: Commit**

```bash
git add content/blog/career-in-vedic-astrology-kundli.mdx
git commit -m "content(blog): add career reading guide"
```

---

### Task 4: Planetary Aspects (Drishti)

**Create:** `content/blog/planetary-aspects-drishti-vedic-astrology.mdx`

**Overlap/dependency:** None, but publish before 5–11 so later posts can link to it instead of re-explaining aspects.

**Frontmatter:**

```yaml
---
title: "Planetary Aspects (Drishti) in Vedic Astrology Explained"
description: "Beyond conjunction, planets 'see' other houses through aspects (drishti) — the universal 7th aspect, plus special aspects from Mars, Jupiter and Saturn. Here's how the Parashari system works."
date: "2026-09-04"
tags: ["drishti vedic astrology", "planetary aspects kundli", "jupiter aspect astrology", "mars aspect astrology"]
---
```

**Outline:**
1. What Is a Drishti?
2. How Planetary Aspects Work
3. The Universal 7th Aspect
4. Jupiter's Special Aspects
5. Mars's Special Aspects
6. Saturn's Special Aspects
7. Rahu and Ketu Aspects: Why Traditions Differ
8. Aspects vs. Conjunctions
9. How to Read Multiple Aspects on One House
10. Planetary Strength and Aspect Strength
11. Frequently Asked Questions

**Accuracy note (explicit, from spec):** clearly scope this to the Parashari aspect system and say other schools (Jaimini, KP) use different rules — don't present Parashari drishti as the only system.

**Internal links:** [/blog/navagraha-nine-planets-vedic-astrology](/blog/navagraha-nine-planets-vedic-astrology), [/blog/12-houses-vedic-astrology](/blog/12-houses-vedic-astrology).

- [ ] **Step 1:** Draft per outline and guardrails.
- [ ] **Step 2:** `npm run build`.
- [ ] **Step 3:** `npm run dev`, visual + link check.
- [ ] **Step 4: Commit**

```bash
git add content/blog/planetary-aspects-drishti-vedic-astrology.mdx
git commit -m "content(blog): add planetary aspects (drishti) guide"
```

---

### Task 5: Mahadasha, Antardasha and Pratyantar Dasha Explained

**Create:** `content/blog/mahadasha-antardasha-pratyantar-dasha-explained.mdx`

**Overlap/dependency:** `content/blog/vimshottari-dasha-guide.mdx:34-42` already has a full "Antardashas: sub-periods within each Mahadasha" section with a worked Saturn-Mercury/Saturn-Ketu example. **Do not re-explain what an Antardasha is from scratch.** This post's job is the piece that doesn't exist yet:
- the third level (Pratyantar Dasha) in full,
- how all three levels compose into one timeline,
- a worked three-level example (e.g. Saturn Mahadasha → Venus Antardasha → Mercury Pratyantar),
- the "what determines a good vs. bad Dasha result" analysis (strength/lordship/placement/aspects/vargas/transits), which the existing guide doesn't cover.

Open the post with one sentence acknowledging the reader may already know Mahadasha/Antardasha basics and linking to the existing guide for that primer, then go straight to Pratyantar.

**Frontmatter:**

```yaml
---
title: "Mahadasha, Antardasha and Pratyantar Dasha Explained"
description: "Your Mahadasha sets the theme, your Antardasha modifies it, and your Pratyantar Dasha narrows it further — here's how the three-level Dasha hierarchy actually combines, with a worked example."
date: "2026-09-05"
tags: ["antardasha meaning", "pratyantar dasha", "mahadasha antardasha", "dasha hierarchy vedic astrology"]
---
```

**Outline:**
1. Quick Recap: Mahadasha and Antardasha (short, links out rather than re-teaching)
2. What Is a Pratyantar Dasha?
3. How the Three-Level Hierarchy Works
4. A Worked Example (Mahadasha → Antardasha → Pratyantar)
5. How Long Are the Different Periods?
6. What Determines Whether a Dasha Gives Good Results? — Planetary Strength, House Ownership, House Placement, Aspects and Conjunctions, Divisional Charts, Transits (H3s)
7. Common Mistakes When Reading Dashas
8. Frequently Asked Questions

- [ ] **Step 1:** Draft per outline and guardrails.
- [ ] **Step 2:** Add a forward link from the existing guide — in `content/blog/vimshottari-dasha-guide.mdx`, after the Antardasha section (around line 42), add one sentence: "For the next level down — Pratyantar Dashas, and a worked multi-level example — see [Mahadasha, Antardasha and Pratyantar Dasha Explained](/blog/mahadasha-antardasha-pratyantar-dasha-explained)."
- [ ] **Step 3:** `npm run build`.
- [ ] **Step 4:** `npm run dev`, visual + link check both posts.
- [ ] **Step 5: Commit**

```bash
git add content/blog/mahadasha-antardasha-pratyantar-dasha-explained.mdx content/blog/vimshottari-dasha-guide.mdx
git commit -m "content(blog): add dasha hierarchy deep-dive, link from vimshottari guide"
```

---

### Task 6: What Is Atmakaraka?

**Create:** `content/blog/atmakaraka-vedic-astrology-explained.mdx`

**Overlap/dependency:** Must ship before Task 7 (Ishta Devata) — that post assumes Atmakaraka/Karakamsha are already explained and links back here.

**Frontmatter:**

```yaml
---
title: "What Is Atmakaraka in Vedic Astrology? Meaning and How to Find It"
description: "The Atmakaraka is the planet at the highest degree in your birth chart — the significator of the soul in Jaimini astrology. Here's how to find it and what each planet means in that role."
date: "2026-09-06"
tags: ["atmakaraka meaning", "how to find atmakaraka", "jaimini astrology", "karakamsha chart"]
---
```

**Outline:**
1. What Is Atmakaraka?
2. The Meaning of Atmakaraka in Jaimini Astrology
3. How to Find Your Atmakaraka (highest-degree rule)
4. Does Rahu Count? Why Different Methods Give Different Results
5. Meaning of Each Planet as Atmakaraka (Sun through Rahu as H3s)
6. Atmakaraka and Karakamsha
7. Atmakaraka and Ishta Devata (short teaser paragraph, links to Task 7 once it ships — see Step 2 below)
8. Frequently Asked Questions

- [ ] **Step 1:** Draft per outline and guardrails.
- [ ] **Step 2:** Leave the "Atmakaraka and Ishta Devata" section as a short teaser (2-3 sentences) with the link `/blog/how-to-find-ishta-devata-vedic-astrology` written in already — Task 7 creates that file next, so this link resolves as soon as Task 7 lands (build will 404 only if Task 7 is skipped; do not skip it).
- [ ] **Step 3:** `npm run build`.
- [ ] **Step 4:** `npm run dev`, visual + link check.
- [ ] **Step 5: Commit**

```bash
git add content/blog/atmakaraka-vedic-astrology-explained.mdx
git commit -m "content(blog): add atmakaraka guide"
```

---

### Task 7: How to Find Your Ishta Devata

**Create:** `content/blog/how-to-find-ishta-devata-vedic-astrology.mdx`

**Overlap/dependency:** Depends on Task 6 (Atmakaraka) shipping first — this post uses Atmakaraka/Karakamsha as prerequisite steps and links back.

**Frontmatter:**

```yaml
---
title: "How to Find Your Ishta Devata in Vedic Astrology: A Complete Guide"
description: "Your Ishta Devata — a personal deity indicated by your chart — is traditionally found through the Atmakaraka and Karakamsha in Jaimini astrology. Here's the method, and why different traditions apply it differently."
date: "2026-09-07"
tags: ["ishta devata meaning", "ishta devata calculator", "atmakaraka ishta devata", "karakamsha chart"]
---
```

**Outline:**
1. What Is an Ishta Devata?
2. Ishta Devata vs. Kuladevata vs. Family Deity
3. Can Your Kundli Indicate an Ishta Devata?
4. The Traditional Jaimini Method — Step 1: Find the Atmakaraka; Step 2: Find the Karakamsha; Step 3: Locate the 12th House From Karakamsha; Step 4: Interpret the Planet in That Position (H3s, link Step 1 to [/blog/atmakaraka-vedic-astrology-explained](/blog/atmakaraka-vedic-astrology-explained) instead of re-deriving it)
5. Planetary Associations and Traditional Deity Correspondences
6. Important Limitations and Different Traditions (explicit: no single universally agreed method — the accuracy point the user flagged)
7. Can You Worship More Than One Deity?
8. Frequently Asked Questions

- [ ] **Step 1:** Draft per outline and guardrails — step 4's sub-steps should link to Task 6 for the Atmakaraka/Karakamsha derivation rather than repeating it in full.
- [ ] **Step 2:** `npm run build`.
- [ ] **Step 3:** `npm run dev`, visual + link check both directions (Task 6 ↔ Task 7).
- [ ] **Step 4: Commit**

```bash
git add content/blog/how-to-find-ishta-devata-vedic-astrology.mdx
git commit -m "content(blog): add ishta devata guide"
```

---

### Task 8: Neecha Bhanga Raja Yoga

**Create:** `content/blog/neecha-bhanga-raja-yoga-explained.mdx`

**Overlap/dependency:** `content/blog/exalted-debilitated-planets.mdx:38-40` already has an H2 "Neecha Bhanga Raja Yoga" section (3 sentences) that must be trimmed once this post exists, or the two posts compete for the same query. Same for the one-directional link from `raj-yoga-vedic-astrology.mdx` — it's referenced by the exalted/debilitated post but doesn't link back; add that backlink too.

**Frontmatter:**

```yaml
---
title: "Neecha Bhanga Raja Yoga: How Debilitation Cancellation Works in Vedic Astrology"
description: "A debilitated planet isn't automatically weak — specific classical conditions can cancel that debilitation, sometimes converting it into a Raja Yoga. Here's how Neecha Bhanga is identified, and why it isn't a simple checklist."
date: "2026-09-08"
tags: ["neecha bhanga raja yoga", "debilitation cancellation", "neecha bhanga conditions", "raja yoga vedic astrology"]
---
```

**Outline:**
1. What Is Neecha Bhanga?
2. What Is Neecha Bhanga Raja Yoga?
3. Why Debilitation Doesn't Always Mean Weak Results
4. Classical Conditions for Debilitation Cancellation (as H3s, one per condition)
5. Why Not Every Neecha Bhanga Becomes a Raja Yoga
6. The Importance of House Placement
7. The Importance of Planetary Strength
8. Dasha Activation
9. Common Misunderstandings
10. Frequently Asked Questions

**Accuracy note (explicit, from spec):** don't let this read as a checklist ending in "I have Raja Yoga" — interpretation depends on the whole chart, same voice as the existing dignity post.

- [ ] **Step 1:** Draft per outline and guardrails.
- [ ] **Step 2:** In `content/blog/exalted-debilitated-planets.mdx`, replace the existing "## Neecha Bhanga Raja Yoga" paragraph (lines 38-40) with a one-sentence teaser plus link, e.g.: `## Neecha Bhanga Raja Yoga\n\nA debilitated planet isn't the end of the story — specific classical combinations can cancel that debilitation entirely. See [Neecha Bhanga Raja Yoga explained](/blog/neecha-bhanga-raja-yoga-explained) for how that works and its limits.` Keep the existing sentence about combust planets that follows it.
- [ ] **Step 3:** In `content/blog/raj-yoga-vedic-astrology.mdx`, add a sentence linking back, e.g. near any mention of debilitation/cancellation: link to `/blog/neecha-bhanga-raja-yoga-explained`.
- [ ] **Step 4:** `npm run build`.
- [ ] **Step 5:** `npm run dev`, visual + link check all three posts; confirm the trimmed section in the exalted/debilitated post still reads coherently.
- [ ] **Step 6: Commit**

```bash
git add content/blog/neecha-bhanga-raja-yoga-explained.mdx content/blog/exalted-debilitated-planets.mdx content/blog/raj-yoga-vedic-astrology.mdx
git commit -m "content(blog): add neecha bhanga guide, de-duplicate against exalted/debilitated post"
```

---

### Task 9: Marriage Timing in Vedic Astrology

**Create:** `content/blog/marriage-timing-vedic-astrology.mdx`

**Overlap/dependency:** None blocking, but link to Task 5 (Dasha hierarchy) for the timing mechanics instead of re-explaining Dasha from scratch.

**Frontmatter:**

```yaml
---
title: "Marriage Timing in Vedic Astrology: How Astrologers Analyse Timing"
description: "Vedic astrology doesn't predict an exact marriage date — it analyses likely periods through the 7th house, Venus and Jupiter, the Navamsa chart, and Dasha activation. Here's how that analysis works."
date: "2026-09-09"
tags: ["marriage timing astrology", "7th house marriage", "navamsa marriage", "marriage dasha vedic astrology"]
---
```

**Wording constraint (explicit, from spec):** never claim to "find your exact marriage date" — frame everything as "how astrologers analyse possible periods."

**Outline:**
1. Can Vedic Astrology Predict Marriage Timing?
2. Why the 7th House Matters
3. The 7th Lord
4. Venus and Marriage
5. Jupiter and Marriage
6. The Role of the 2nd and 11th Houses
7. Navamsa (D9) and Marriage
8. Dashas and Marriage Timing
9. How Transits Are Used
10. Why Different Charts Can Show Different Timing
11. Marriage Delay: What Does It Actually Mean?
12. Why One Placement Cannot Predict Marriage
13. Frequently Asked Questions

**Internal links:** [/blog/manglik-dosha-explained](/blog/manglik-dosha-explained), [/blog/guna-milan-ashtakoota-compatibility](/blog/guna-milan-ashtakoota-compatibility), [/blog/divisional-charts-navamsa-guide](/blog/divisional-charts-navamsa-guide), [/blog/vimshottari-dasha-guide](/blog/vimshottari-dasha-guide), [/blog/mahadasha-antardasha-pratyantar-dasha-explained](/blog/mahadasha-antardasha-pratyantar-dasha-explained), [/blog/12-houses-vedic-astrology](/blog/12-houses-vedic-astrology) (7th house section).

- [ ] **Step 1:** Draft per outline, wording constraint and guardrails.
- [ ] **Step 2:** `npm run build`.
- [ ] **Step 3:** `npm run dev`, visual + link check.
- [ ] **Step 4: Commit**

```bash
git add content/blog/marriage-timing-vedic-astrology.mdx
git commit -m "content(blog): add marriage timing guide"
```

---

### Task 10: Doshas in Kundli Explained (pillar page)

**Create:** `content/blog/doshas-in-kundli-vedic-astrology.mdx`

**Overlap/dependency:** `content/blog/manglik-dosha-explained.mdx` already exists in full depth — this pillar page should summarize Manglik in 2-3 sentences and link out to that post rather than re-explaining it, same pattern as Task 5/8. Also link to Task 8 (Neecha Bhanga) for the "debilitation isn't automatically a dosha" distinction.

**Frontmatter:**

```yaml
---
title: "Doshas in Kundli: Meaning, Types and Common Misunderstandings"
description: "A dosha is a specific planetary combination believed to need extra attention — not a verdict on a person's life. Here's what the commonly discussed doshas actually mean, and why a single combination shouldn't be read in isolation."
date: "2026-09-10"
tags: ["dosha in kundli", "kaal sarp yoga", "pitra dosha meaning", "doshas vedic astrology"]
---
```

**Outline:**
1. What Does Dosha Mean in Vedic Astrology?
2. Does Every Dosha Mean Something Bad?
3. Manglik Dosha (short summary + link to existing full post)
4. Kaal Sarp Yoga: Why Interpretations Differ
5. Pitra Dosha
6. Guru Chandal Yoga
7. Grahan Yoga
8. Kemadruma Yoga
9. Other Commonly Discussed Combinations
10. Why "Dosha" Is Often Oversimplified Online
11. Cancellation and Mitigating Factors
12. Why the Whole Chart Matters
13. Frequently Asked Questions

**Trust framing (explicit, from spec):** state directly that a single combination should not be used to make frightening predictions about a person's life — this is the differentiator the user called out.

**Internal links:** [/blog/manglik-dosha-explained](/blog/manglik-dosha-explained), [/blog/neecha-bhanga-raja-yoga-explained](/blog/neecha-bhanga-raja-yoga-explained), [/blog/exalted-debilitated-planets](/blog/exalted-debilitated-planets).

- [ ] **Step 1:** Draft per outline, trust framing and guardrails.
- [ ] **Step 2:** `npm run build`.
- [ ] **Step 3:** `npm run dev`, visual + link check.
- [ ] **Step 4: Commit**

```bash
git add content/blog/doshas-in-kundli-vedic-astrology.mdx
git commit -m "content(blog): add doshas pillar page"
```

---

### Task 11: Vedic Astrology Remedies Explained

**Create:** `content/blog/vedic-astrology-remedies-explained.mdx`

**Overlap/dependency:** `content/blog/vedic-astrology-gemstones-guide.mdx` already exists — the Gemstones section here should summarize + link out, not re-explain the Navaratna system.

**Frontmatter:**

```yaml
---
title: "Vedic Astrology Remedies Explained: Mantras, Donations, Gemstones and Other Practices"
description: "Remedies in Vedic astrology are traditionally matched to a specific chart, not applied generically — here's how mantra, charity, fasting, puja, gemstones and yantras are chosen, and their limits."
date: "2026-09-11"
tags: ["vedic astrology remedies", "astrology mantras", "gemstone remedy astrology", "vedic astrology upay"]
---
```

**Outline:**
1. What Are Vedic Astrology Remedies?
2. Why Are Remedies Recommended?
3. Mantra and Japa
4. Charity and Donation
5. Fasting and Vrat
6. Puja and Worship
7. Gemstones (short summary + link to existing full post)
8. Yantras
9. Temple Visits
10. Behavioural and Ethical Remedies
11. How Remedies Are Traditionally Chosen
12. Why a Remedy Should Match the Chart
13. Can a Remedy "Cancel" a Planet Completely? (answer: no, same voice as debilitation-cancellation nuance elsewhere)
14. Common Misconceptions
15. Frequently Asked Questions

**Internal links:** [/blog/vedic-astrology-gemstones-guide](/blog/vedic-astrology-gemstones-guide), and any doshas/manglik posts where a remedy is traditionally invoked.

- [ ] **Step 1:** Draft per outline and guardrails.
- [ ] **Step 2:** `npm run build`.
- [ ] **Step 3:** `npm run dev`, visual + link check.
- [ ] **Step 4: Commit**

```bash
git add content/blog/vedic-astrology-remedies-explained.mdx
git commit -m "content(blog): add remedies guide"
```

---

### Task 11b: Add "Blog" to the top nav

**Status:** done during planning (see below) — listed here for the record, not a pending step.

**File:** `src/components/landing/Navbar.tsx`

The homepage `NAV_LINKS` array (`How it works`, `Features`, `Moon sign tool`, `Languages`, `FAQ`) had no link to `/blog` at all, despite the blog being a real acquisition surface. Added `{ href: '/blog', label: 'Blog' }` immediately before the `FAQ` entry, matching the existing array shape — no other change needed since other entries already mix in-page anchors (`#faq`) with the logo's plain `<a href="/">` route link.

Verified with `npm run build` (succeeds, `/blog` and all 21 `/blog/[slug]` routes present in the route list).

**i18n follow-up:** this codebase's convention (per project memory) is no hardcoded UI text — the navbar's other labels are keyed through `lookupDict()` (`src/lib/i18n/dictionary.ts:2785-2788`), which checks `DICT[lang]` then falls back to `LANDING_DICT[lang]`, both keyed by literal English source string. Of the languages `LANDING_DICT` covers, only `hi`, `es`, `fr` actually have the *current* navbar's strings (`bn`/`ta`/`te`/`mr`/`gu` blocks are leftover from an older redesign and don't have "FAQ" etc. either — a pre-existing gap, not introduced here and out of this plan's scope to backfill). Added `'Blog'` to those same three locale blocks, matching existing coverage exactly:
- `hi` (line ~2078): `'Blog': 'ब्लॉग'`
- `es` (line ~2489): `'Blog': 'Blog'`
- `fr` (line ~2641): `'Blog': 'Blog'`

Verified with a second `npm run build`.

---

### Task 12: llms.txt (GEO)

**Files:**
- Create: `public/llms.txt`

**Rationale:** No existing `llms.txt`/`ai.txt` in the repo (`robots.ts` already allows all crawlers with no bot-specific carve-outs — nothing to change there). `llms.txt` is a plain-text manifest at the site root that AI-assistant crawlers use to find a site's canonical, citable pages — the emerging GEO equivalent of a sitemap aimed at LLMs rather than search engines. `next.config` already serves anything under `public/` at the root, so a static file is all this needs (no route handler).

- [ ] **Step 1: Write the file**

```
# Aroha Astrology

> Aroha Astrology is a Vedic (Jyotish) astrology app: free Kundli generation, Moon sign, Panchang, AI chat, and in-depth guides to Vedic astrology concepts.

## Core tools
- [Kundli / Birth Chart](https://www.arohaastrology.in/kundli): Generate a free Vedic birth chart from date, time and place of birth.
- [Moon Sign Calculator](https://www.arohaastrology.in/moon-sign): Find your Vedic Moon sign (Chandra Rashi).
- [Panchang](https://www.arohaastrology.in/panchang): Daily Vedic almanac — Tithi, Nakshatra, Rahu Kaal, Abhijit Muhurta.

## Guides
- [Blog index](https://www.arohaastrology.in/blog): All Vedic astrology guides, updated regularly.

## Notes for AI assistants
- Astrological interpretations described in these guides are traditional/classical positions, not deterministic predictions or professional advice.
- Different classical traditions (Parashari, Jaimini, KP) sometimes disagree on method; guides note this where it applies rather than presenting one method as universal.
```

- [ ] **Step 2: Verify it's served**

Run: `npm run build && npm run start` (or `npm run dev`), then fetch `http://localhost:3000/llms.txt`
Expected: 200, plain text, matches the file above.

- [ ] **Step 3: Commit**

```bash
git add public/llms.txt
git commit -m "feat(seo): add llms.txt for GEO discoverability"
```

---

### Task 13: Final SEO/GEO sweep

**Files:** all 11 new posts + `sitemap.ts` (read-only check)

- [ ] **Step 1:** Run `npm run build` once with all 11 posts + Task 0/12 changes present. Expected: build succeeds, and the printed route list includes all 11 new `/blog/<slug>` static paths.
- [ ] **Step 2:** Confirm `sitemap.ts` needs no changes — `getAllSlugs()` (`src/lib/blog.ts:21-26`) already picks up the new files automatically, so all 11 appear in `/sitemap.xml` without editing `sitemap.ts`. Spot-check by fetching `/sitemap.xml` in dev and grepping for two of the new slugs.
- [ ] **Step 3:** Grep all 11 new files plus the 3 modified existing files for `](/blog/` links and confirm every linked slug has a corresponding `.mdx` file (catches typos and any skipped forward-reference from Task 6→7).

```bash
grep -oh '](/blog/[a-z0-9-]*' content/blog/*.mdx | sed 's/](\/blog\///' | sort -u > /tmp/linked-slugs.txt
ls content/blog/*.mdx | xargs -n1 basename | sed 's/\.mdx$//' | sort -u > /tmp/actual-slugs.txt
comm -23 /tmp/linked-slugs.txt /tmp/actual-slugs.txt
```

Expected: empty output (no dangling links).

- [ ] **Step 4:** Confirm each new post's `tags` array doesn't duplicate an existing post's primary tag verbatim (keyword cannibalization check) — spot check via `grep -h 'tags:' content/blog/*.mdx`.
- [ ] **Step 5: Commit** (only if Step 3 found and fixed a dangling link; otherwise this task makes no changes)

---

## Self-Review

**Spec coverage:** All 11 posts from the user's spec have a task (1–11), each carrying the full outline, frontmatter, accuracy/wording constraints, and internal-link map from the original spec. The user's mid-turn request ("update geo and seo also once done") is covered by Task 0 (FAQPage schema — SEO/GEO structured data), Task 12 (llms.txt — GEO), and Task 13 (sitemap confirmation + dangling-link sweep — SEO hygiene).

**Placeholder scan:** no TBD/"add appropriate X" — every content task carries a concrete outline, frontmatter, and specific internal-link targets; every code task carries full working code.

**Overlap risk:** the three real collision points (Antardasha vs. Task 5, Neecha Bhanga vs. Task 8, Gemstones vs. Task 11) are each called out with a concrete de-duplication step, not just a link.

**Type/field consistency:** `faqs?: { question: string; answer: string }[]` in Task 0 Step 1 is the same shape referenced in Task 0 Step 2's `mainEntity` mapper — matches.
