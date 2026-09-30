import { CategoryHub, categoryMetadata } from '@/components/blog/CategoryHub';

export const metadata = categoryMetadata('vastu');

export default function VastuArticlesPage() {
  return <CategoryHub category="vastu" />;
}
