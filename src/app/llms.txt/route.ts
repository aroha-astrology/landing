import { getPublishedPosts } from '@/lib/blog';
import { CATEGORIES, CATEGORY_ORDER } from '@/lib/categories';
import { BRAND, PRODUCTS, PRODUCT_ORDER, statusLabel } from '@/lib/brand';
import { PLAY_STORE_URL, SITE_URL } from '@/lib/links';

export const dynamic = 'force-static';

/**
 * /llms.txt — a plain, factual map of Aroha for language-model tools that
 * read it (https://llmstxt.org). Generated from the same brand registry and
 * article list as the site, so product status and article lists can't
 * drift. It contains descriptions only: no instructions to models, and no
 * claim that it affects ranking or inclusion anywhere.
 */
export function GET() {
  const posts = getPublishedPosts();
  const lines: string[] = [];
  lines.push(`# ${BRAND.name}`, '');
  lines.push(`> ${BRAND.description}`, '');
  lines.push(`Tagline: ${BRAND.tagline} Founded by ${BRAND.founder}, ${BRAND.city}, India. Website: ${SITE_URL}`, '');

  lines.push('## Products', '');
  for (const k of PRODUCT_ORDER) {
    const p = PRODUCTS[k];
    lines.push(`- [${p.name}](${SITE_URL}${p.path}) — ${statusLabel(p.status)}. ${p.summary}`);
  }
  lines.push(`- [${PRODUCTS.astrology.name} on Google Play](${PLAY_STORE_URL}) — Android app. iOS: coming soon.`, '');

  lines.push('## Free tools', '');
  lines.push(`- [Free Kundli](${SITE_URL}/kundli): Vedic birth chart (Lagna, houses, planets) from date, time and place of birth.`);
  lines.push(`- [Moon sign calculator](${SITE_URL}/moon-sign): Vedic Moon sign (Chandra Rashi) and Nakshatra.`);
  lines.push(`- [Panchang](${SITE_URL}/panchang): today’s Tithi, Nakshatra, Yoga, Karana, sunrise, sunset and Rahu Kaal.`, '');

  for (const c of CATEGORY_ORDER) {
    const list = posts.filter((p) => p.category === c);
    if (!list.length) continue;
    lines.push(`## Knowledge Hub: ${CATEGORIES[c].name} (${PRODUCTS[c].name})`, '');
    lines.push(`${CATEGORIES[c].description} Index: ${SITE_URL}/blog/${c}`, '');
    for (const p of list) lines.push(`- [${p.frontmatter.title}](${SITE_URL}/blog/${p.slug}): ${p.frontmatter.description}`);
    lines.push('');
  }

  lines.push('## About and policies', '');
  lines.push(`- [About Aroha](${SITE_URL}/about): what Aroha is, how readings are generated (Swiss Ephemeris computation; AI-written explanations grounded in classical texts) and responsible use of AI.`);
  lines.push(`- [Editorial standards](${SITE_URL}/editorial-standards): how articles are researched, reviewed and corrected.`);
  lines.push(`- [Support and contact](${SITE_URL}/support)`, '');

  lines.push('## Notes', '');
  lines.push('- Vedic astrology is a traditional system of interpretation; Vastu Shastra is a traditional system of architecture and spatial design; puja practice varies by region and community. Aroha presents them as traditions, not as scientific fact or prediction.');
  lines.push('- Aroha Astrology and Aroha Vastu are available on Android (Aroha Vastu inside the Aroha Astrology app); iOS and a 3D version of Aroha Vastu are coming soon. Aroha Puja is not yet available.');

  return new Response(lines.join('\n') + '\n', {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=3600' },
  });
}
