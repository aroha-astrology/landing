'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useStore } from '@/store/useStore';
import { lookupDict } from '@/lib/i18n/dictionary';

// Dictionary-only port of the production TranslationProvider.
// It walks the DOM, swapping translatable text nodes using DICT (keyed by the
// exact English source). Strings missing from the dictionary keep their English
// value — there is no /api/translate fallback in this standalone landing.

const SKIP_TAGS = new Set([
  'SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'SVG', 'PATH', 'CIRCLE', 'LINE', 'POLYLINE', 'RECT', 'TEXTAREA', 'INPUT',
]);

const NODE_ORIG = '__i18nOrig';
const NODE_LANG = '__i18nLang';

interface TaggedText extends Text {
  [NODE_ORIG]?: string;
  [NODE_LANG]?: string;
}

function inSkippedSubtree(node: Text): boolean {
  let p: Node | null = node.parentNode;
  while (p && p.nodeType === Node.ELEMENT_NODE) {
    const el = p as HTMLElement;
    if (SKIP_TAGS.has(el.tagName)) return true;
    if (el.hasAttribute('data-no-translate')) return true;
    if (el.getAttribute('contenteditable') === 'true') return true;
    p = el.parentNode;
  }
  return false;
}

function looksTranslatable(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 2) return false;
  return /[a-zA-Z]/.test(trimmed);
}

function collectTextNodes(root: HTMLElement): TaggedText[] {
  const out: TaggedText[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      const t = n as TaggedText;
      if (inSkippedSubtree(t)) return NodeFilter.FILTER_REJECT;
      if (t[NODE_ORIG] != null) return NodeFilter.FILTER_ACCEPT;
      return looksTranslatable(t.nodeValue ?? '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });
  let node = walker.nextNode();
  while (node) {
    out.push(node as TaggedText);
    node = walker.nextNode();
  }
  return out;
}

function applySingle(node: TaggedText, translated: string, lang: string) {
  const orig = node[NODE_ORIG] ?? node.nodeValue ?? '';
  const leading = orig.match(/^\s*/)?.[0] ?? '';
  const trailing = orig.match(/\s*$/)?.[0] ?? '';
  const next = leading + translated + trailing;
  if (node.nodeValue !== next) node.nodeValue = next;
  node[NODE_LANG] = lang;
}

function applyLanguage(lang: string) {
  if (typeof window === 'undefined') return;
  const root = document.body;
  if (!root) return;

  const nodes = collectTextNodes(root);

  for (const n of nodes) {
    if (n[NODE_ORIG] == null) {
      n[NODE_ORIG] = n.nodeValue ?? '';
      n[NODE_LANG] = 'en';
    }
  }

  // Restore English when switching back.
  if (lang === 'en') {
    for (const n of nodes) {
      if (n[NODE_LANG] !== 'en' && n[NODE_ORIG] != null) {
        if (n.nodeValue !== n[NODE_ORIG]) n.nodeValue = n[NODE_ORIG];
        n[NODE_LANG] = 'en';
      }
    }
    return;
  }

  // Apply dictionary instantly; leave English in place when no entry exists.
  for (const n of nodes) {
    if (n[NODE_LANG] === lang) continue;
    const orig = (n[NODE_ORIG] ?? '').trim();
    if (!orig) continue;

    const fromDict = lookupDict(orig, lang);
    if (fromDict) {
      applySingle(n, fromDict, lang);
    } else if (n[NODE_LANG] !== 'en' && n[NODE_ORIG] != null) {
      // Was translated to a different language; revert to English source.
      if (n.nodeValue !== n[NODE_ORIG]) n.nodeValue = n[NODE_ORIG];
      n[NODE_LANG] = 'en';
    }
  }
}

export function TranslationProvider({ children }: { children: ReactNode }) {
  const language = useStore((s) => s.language);

  useEffect(() => {
    document.documentElement.lang = language;
    document.cookie = `i18n-lang=${encodeURIComponent(language)}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

    const run = () => applyLanguage(language);
    const initial = setTimeout(run, 50);

    // Re-translate when React re-renders new text into the tree.
    let timer: ReturnType<typeof setTimeout> | null = null;
    const observer = new MutationObserver(() => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(run, 300);
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: false });

    return () => {
      clearTimeout(initial);
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, [language]);

  return <>{children}</>;
}
