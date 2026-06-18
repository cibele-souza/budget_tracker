import { useState } from 'react';
import { CATEGORIES } from '../types/index';

interface CategoryFilterProps {
   selectedCategory: string | null;
   onChange: (category: string | null) => void;
}

export default function CategoryFilter({
   selectedCategory,
   onChange,
}: CategoryFilterProps) {
   const [isOpen, setIsOpen] = useState(false);

   function handleSelect(category: string | null) {
      onChange(category);
      setIsOpen(false);
   }

   const label = selectedCategory ?? 'All Categories';

   return (
      <div className="relative">
         <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 font-medium">
               Category
            </label>
            <button
               onClick={() => setIsOpen((prev) => !prev)}
               className="text-sm border border-gray-200 rounded px-2 py-1 bg-white text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-36 text-left flex justify-between items-center gap-2"
            >
               <span>{label}</span>
               <span className="text-gray-400 text-xs">
                  {isOpen ? '▲' : '▼'}
               </span>
            </button>
         </div>

         {isOpen && (
            <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-44 py-1">
               {/* All Categories — styled like MonthFilter's Clear option */}
               <button
                  onClick={() => handleSelect(null)}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-400 hover:bg-gray-50 border-b border-gray-100"
               >
                  All Categories
               </button>

               {/* Category list */}
               {CATEGORIES.map((cat) => (
                  <button
                     key={cat}
                     onClick={() => handleSelect(cat)}
                     className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 ${
                        selectedCategory === cat
                           ? 'text-indigo-700 font-medium'
                           : 'text-gray-700'
                     }`}
                  >
                     {cat}
                  </button>
               ))}
            </div>
         )}

         {/* Click outside to close */}
         {isOpen && (
            <div
               className="fixed inset-0 z-0"
               onClick={() => setIsOpen(false)}
            />
         )}
      </div>
   );
}
