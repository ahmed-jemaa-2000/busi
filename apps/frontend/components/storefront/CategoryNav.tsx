import type { Category } from '@busi/types';

interface CategoryNavProps {
  categories: Category[];
}

export default function CategoryNav({ categories }: CategoryNavProps) {
  if (categories.length === 0) return null;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-8 overflow-x-auto py-4">
          <a
            href="/"
            className="text-sm font-medium text-gray-700 hover:text-primary whitespace-nowrap transition"
          >
            All Products
          </a>
          {categories.map((category) => (
            <a
              key={category.id}
              href={`/category/${category.slug}`}
              className="text-sm font-medium text-gray-700 hover:text-primary whitespace-nowrap transition"
            >
              {category.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
