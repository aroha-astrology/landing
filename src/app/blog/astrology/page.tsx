import { CategoryHub, categoryMetadata } from '@/components/blog/CategoryHub';

export const metadata = categoryMetadata('astrology');

export default function AstrologyArticlesPage() {
  return <CategoryHub category="astrology" />;
}
