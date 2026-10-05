'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';

/**
 * Swaps in the translated blog when the visitor's saved language is not English: the article page
 * (title, description, body, contents list, FAQ) and every article card. English is always the
 * server-rendered default, so SEO and the English experience do not change; switching back
 * restores the original text. Translations are static JSON under /blog-i18n/<lang>/.
 */

type Article = {
  title: string;
  description: string;
  heroAlt: string;
  faqs: { question: string; answer: string }[];
  headings: { depth: number; text: string; id: string }[];
  html: string;
};
type Index = Record<string, { title: string; description: string }>;

const jsonCache = new Map<string, Promise<unknown>>();
function getJson<T>(url: string): Promise<T | null> {
  let p = jsonCache.get(url);
  if (!p) {
    p = fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);
    jsonCache.set(url, p);
    p.then((v) => v == null && jsonCache.delete(url));
  }
  return p as Promise<T | null>;
}

const originals = new WeakMap<Node, string>();

function textNodeOf(el: Element): Text | null {
  for (const n of Array.from(el.childNodes)) if (n.nodeType === Node.TEXT_NODE && (n.nodeValue ?? '').trim()) return n as Text;
  return null;
}

/** Sets an element's text without replacing its node (React keeps owning it); null restores English. */
function setText(el: Element | null, value: string | null) {
  if (!el) return;
  const node = textNodeOf(el);
  if (!node) return;
  if (!originals.has(node)) originals.set(node, node.nodeValue ?? '');
  const next = value ?? originals.get(node) ?? '';
  if (node.nodeValue !== next) node.nodeValue = next;
}

const bodyOriginal = new WeakMap<Element, string>();
const titleOriginal = new Map<string, string>();

function restoreArticle() {
  const body = document.getElementById('article-body');
  if (body && bodyOriginal.has(body)) {
    body.innerHTML = bodyOriginal.get(body)!;
    bodyOriginal.delete(body);
    delete body.dataset.i18nLang;
  }
  setText(document.querySelector('[data-i18n="title"]'), null);
  setText(document.querySelector('[data-i18n="desc"]'), null);
  setText(document.querySelector('[data-i18n="crumb"]'), null);
  document.querySelectorAll('[data-i18n-toc] a').forEach((a) => {
    setText(a, null);
    const h = (a as HTMLElement).dataset.origHref;
    if (h) a.setAttribute('href', h);
  });
  const img = document.querySelector('[data-i18n="hero"] img');
  if (img && (img as HTMLElement).dataset.origAlt != null) img.setAttribute('alt', (img as HTMLElement).dataset.origAlt!);
  const faq = document.getElementById('faq-list');
  if (faq) {
    faq.querySelectorAll('h3 button').forEach((b) => setText(b, null));
    faq.querySelectorAll('[role="region"] p').forEach((p) => setText(p, null));
  }
  if (titleOriginal.has('doc')) {
    document.title = titleOriginal.get('doc')!;
    titleOriginal.delete('doc');
  }
}

function applyArticle(a: Article, lang: string) {
  const body = document.getElementById('article-body');
  if (!body) return;
  if (!bodyOriginal.has(body)) bodyOriginal.set(body, body.innerHTML);
  body.innerHTML = a.html;
  body.dataset.i18nLang = lang;
  setText(document.querySelector('[data-i18n="title"]'), a.title);
  setText(document.querySelector('[data-i18n="desc"]'), a.description);
  setText(document.querySelector('[data-i18n="crumb"]'), a.title);
  const h2 = a.headings.filter((h) => h.depth === 2);
  document.querySelectorAll('[data-i18n-toc]').forEach((wrap) => {
    wrap.querySelectorAll('a').forEach((link, i) => {
      const h = h2[i];
      if (!h) return;
      const el = link as HTMLElement;
      if (el.dataset.origHref == null) el.dataset.origHref = link.getAttribute('href') ?? '';
      setText(link, h.text);
      link.setAttribute('href', `#${h.id}`);
    });
  });
  const img = document.querySelector('[data-i18n="hero"] img') as HTMLElement | null;
  if (img && a.heroAlt) {
    if (img.dataset.origAlt == null) img.dataset.origAlt = img.getAttribute('alt') ?? '';
    img.setAttribute('alt', a.heroAlt);
  }
  const faq = document.getElementById('faq-list');
  if (faq && a.faqs.length) {
    faq.querySelectorAll('h3 button').forEach((b, i) => a.faqs[i] && setText(b, a.faqs[i].question));
    faq.querySelectorAll('[role="region"] p').forEach((p, i) => a.faqs[i] && setText(p, a.faqs[i].answer));
  }
  if (!titleOriginal.has('doc')) titleOriginal.set('doc', document.title);
  document.title = `${a.title} | Aroha`;
}

function applyCards(index: Index | null) {
  document.querySelectorAll('[data-article]').forEach((card) => {
    const slug = (card as HTMLElement).dataset.article!;
    const t = index?.[slug];
    setText(card.querySelector('[data-i18n-card="title"]'), t ? t.title : null);
    setText(card.querySelector('[data-i18n-card="desc"]'), t ? t.description : null);
  });
}

export function BlogTranslator() {
  const language = useStore((s) => s.language);
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    const current = () => !cancelled && useStore.getState().language === language;

    const run = async () => {
      if (language === 'en') {
        restoreArticle();
        applyCards(null);
        return;
      }
      const body = document.getElementById('article-body');
      const slug = body?.dataset.slug;
      if (slug && body!.dataset.i18nLang !== language) {
        const a = await getJson<Article>(`/blog-i18n/${language}/${slug}`);
        if (a && current()) applyArticle(a, language);
      }
      if (document.querySelector('[data-article]')) {
        const idx = await getJson<Index>(`/blog-i18n/${language}/all.json`);
        if (idx && current()) applyCards(idx);
      }
    };

    const first = setTimeout(run, 0);
    let timer: ReturnType<typeof setTimeout> | null = null;
    // Cards come and go with the topic filter and search box on the knowledge hub.
    const observer = new MutationObserver(() => {
      if (language === 'en') return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(run, 200);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      cancelled = true;
      clearTimeout(first);
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, [language, pathname]);

  return null;
}
