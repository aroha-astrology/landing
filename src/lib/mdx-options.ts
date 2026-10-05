import remarkGfm from 'remark-gfm';

// Articles are our own reviewed files, so plain JS expressions in MDX props
// (e.g. <Checklist items={[...]} />) are allowed; blockDangerousJS still
// strips eval/Function-style constructs. Shared by the English article page
// and the translated-article route so both compile identically.
export const MDX_OPTIONS = { blockJS: false, blockDangerousJS: true, mdxOptions: { remarkPlugins: [remarkGfm] } };
