import { CATEGORIES } from '../types/index';

interface CategoryFilterProps {
   selectedCategory: string | null;
   onChange: (category: string | null) => void;
}

export default function CategoryFilter({
   selectedCategory,
   onChange,
}: CategoryFilterProps) {
   return (
      <div className="flex items-center gap-2">
         <label className="text-sm text-gray-600 whitespace-nowrap">
            Category
         </label>
         <select
            value={selectedCategory ?? ''}
            onChange={(e) =>
               onChange(e.target.value === '' ? null : e.target.value)
            }
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
         >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
               <option key={cat} value={cat}>
                  {cat}
               </option>
            ))}
         </select>
      </div>
   );
}
