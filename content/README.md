# Knowledge Hub content

Articles live in `content/blog/<slug>.mdx`. The slug is the URL
(`/blog/<slug>`); the category decides the hub (`/blog/astrology`,
`/blog/vastu`, `/blog/puja`) and the related Aroha product.

## Frontmatter

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | The H1 |
| `seoTitle` | no | Use when the best `<title>` differs from the H1 |
| `description` | yes | Meta description and the visible excerpt |
| `date` / `updated` | yes / no | `YYYY-MM-DD` |
| `category` | yes for new posts | `astrology`, `vastu` or `puja` (defaults to astrology) |
| `status` | yes for new posts | `review` or `published` (defaults to published) |
| `author` | yes for new posts | `Aroha Editorial Team`, or a real person |
| `reviewedBy` / `reviewedAt` | set on publish | Written by `npm run content:publish` |
| `tags` | yes | A few specific topics |
| `heroAlt` + `art` | yes | See `scripts/blog-art/README.md` |
| `related` | recommended | 3–4 hand-picked slugs |
| `features` | recommended | Keys from `src/lib/features.ts` |
| `faqs` | optional | Rendered visibly and as FAQPage schema |
| `sources` | optional | Classical texts or scholarship relied on |
| `featured` | optional | Surfaces the article on hubs and the homepage |

Available MDX components: `KeyTakeaway`, `Callout`, `Checklist`,
`RitualSteps`, `NakshatraWheel`, `DashaTimeline`, `VastuCompass`,
`FloorPlan`, `PanchangLimbs`, `Figure`. Markdown tables are supported.

## Review and publishing workflow

1. Write the article with `status: "review"` and generate its hero:
   `npm run blog:art -- <slug>`.
2. `npm run content:check` validates frontmatter, links and images.
3. Open a PR. Review articles render on the **Vercel preview deployment**
   (or locally with `npm run dev`) with an "In editorial review" banner and
   `noindex`; production builds exclude them from pages, listings, the
   sitemap and llms.txt.
4. A person reviews each article against the checklist at
   `/editorial-standards`.
5. `npm run content:publish -- --reviewer "Full Name" <slug> [...]`
   (or `--all`), then `npm run content:check && npm run build` and commit.

Internal links to an article that is still in review render as plain text
until it's published, so articles can be published in any order.
