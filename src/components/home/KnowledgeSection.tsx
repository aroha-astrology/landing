import { toSummary } from '@/components/blog/ArticleCard';
import { TrackedLink } from '@/components/ui/TrackedLink';
import { getFeaturedPosts } from '@/lib/blog';
import { CATEGORIES, CATEGORY_ORDER } from '@/lib/categories';
import { KnowledgeTabs } from './KnowledgeTabs';

/** Three featured articles per path; the full library lives at /blog. */
export function KnowledgeSection() {
  const tabs = CATEGORY_ORDER.map((c) => ({
    key: c,
    label: CATEGORIES[c].name,
    articles: getFeaturedPosts(c, 3).map(toSummary),
    empty: `Our first ${CATEGORIES[c].name} guides are in editorial review and will appear here soon.`,
  }));
  return (
    <section id="knowledge" aria-labelledby="knowledge-title" className="scroll-mt-20 bg-paper px-[clamp(20px,4vw,56px)] py-[clamp(72px,9vw,128px)]">
      <div className="mx-auto max-w-[1280px]">
        <div className="reveal mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <p className="j-eyebrow text-[13px]">Knowledge Hub</p>
            <h2 id="knowledge-title" className="font-display mt-3 text-[clamp(34px,4.6vw,56px)] font-medium leading-[1.05] text-balance">
              Read about the traditions behind Aroha
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">
              Clear guides to Vedic astrology, Vastu Shastra and puja: what the traditions say, and where they differ.
            </p>
          </div>
          <TrackedLink
            href="/blog"
            cta="home_knowledge_hub"
            location="knowledge"
            className="inline-flex items-center gap-2 self-start rounded-full border border-ink/25 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent-text lg:self-end"
          >
            Explore the Knowledge Hub <span aria-hidden>→</span>
          </TrackedLink>
        </div>
        <KnowledgeTabs tabs={tabs} />
      </div>
    </section>
  );
}
