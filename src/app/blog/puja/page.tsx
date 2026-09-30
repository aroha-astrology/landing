import { CategoryHub, categoryMetadata } from '@/components/blog/CategoryHub';

export const metadata = categoryMetadata('puja');

export default function PujaArticlesPage() {
  return <CategoryHub category="puja" />;
}
