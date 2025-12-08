import { Button } from '@heroui/react';
import type { Category } from '../types';

interface CategoryPillsProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function CategoryPills({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <Button
        size="sm"
        variant={selectedCategory === null ? 'solid' : 'flat'}
        className={`
          flex-shrink-0 px-4 h-9 rounded-full font-medium transition-all
          ${selectedCategory === null
            ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/25'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }
        `}
        onPress={() => onSelectCategory(null)}
      >
        Alle produkter
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          size="sm"
          variant={selectedCategory === category.name ? 'solid' : 'flat'}
          className={`
            flex-shrink-0 px-4 h-9 rounded-full font-medium transition-all
            ${selectedCategory === category.name
              ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/25'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
          onPress={() => onSelectCategory(category.name)}
        >
          <span className="mr-1.5">{category.icon}</span>
          {category.name}
        </Button>
      ))}
    </div>
  );
}
