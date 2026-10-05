import { AppCTA } from '@/components/ui/AppCTA';
import type { ArticlePrompt } from '@/lib/article-prompts';

/**
 * Sits under an article's heading block: one line written for that article
 * and the app picker (Android, Web, iOS coming soon) to act on it right away.
 */
export function ArticleTryBar({ prompt }: { prompt: ArticlePrompt }) {
  return (
    <aside
      aria-label="Try it in the Aroha app"
      className="mt-8 flex flex-col gap-4 rounded-2xl border border-accent/40 bg-accent-soft px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6"
    >
      <div className="min-w-0">
        <p className="font-display text-xl leading-snug text-ink sm:text-[22px]">{prompt.line}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{prompt.sub}</p>
      </div>
      <div className="shrink-0">
        <AppCTA variant="solid" align="right" location="article_try_bar">
          Open the app
        </AppCTA>
      </div>
    </aside>
  );
}
