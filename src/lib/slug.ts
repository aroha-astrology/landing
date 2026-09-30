/**
 * Anchor ids for headings. The MDX heading components (MdxComponents.tsx)
 * run the same function over the rendered text, so TOC links and ids
 * always agree.
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[`*_~]/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/&/g, ' and ')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

