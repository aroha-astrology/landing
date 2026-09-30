# Aroha — public website

Marketing site and Knowledge Hub for the Aroha ecosystem:
**Aroha Astrology** (available now), **Aroha Vastu** and **Aroha Puja** (coming soon).
Standalone Next.js 15 (App Router), no auth.

```bash
npm ci
npm run dev            # http://localhost:3000 (articles in review are visible in dev)
npm run build          # production build (review articles excluded)
npm run content:check  # validate Knowledge Hub articles
npm run blog:art       # regenerate article hero images
```

- Brand and product status: `src/lib/brand.ts` (single source for pages, schema, footer, `/llms.txt`)
- Knowledge Hub content and workflow: `content/README.md`
- Hero art generator: `scripts/blog-art/README.md`
- Asset licences: `public/assets/LICENSES.md`
- Architecture and decisions: `docs/aroha-ecosystem-plan.md`
