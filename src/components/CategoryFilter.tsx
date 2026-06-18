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
            <label className="text-sm text-my-gray font-medium">Category</label>
            <button
               onClick={() => setIsOpen((prev) => !prev)}
               className="text-sm border border-my-border-gray rounded px-2 py-1 bg-white text-my-gray hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-my-blue min-w-36 text-left flex justify-between items-center gap-2"
            >
               <span>{label}</span>
               <span className="text-my-gray text-xs">
                  {isOpen ? '▲' : '▼'}
               </span>
            </button>
         </div>

         {isOpen && (
            <div className="absolute right-0 mt-1 bg-white border border-my-border-gray rounded-lg shadow-lg z-10 min-w-44 py-1">
               {/* All Categories — styled like MonthFilter's Clear option */}
               <button
                  onClick={() => handleSelect(null)}
                  className="w-full text-left px-3 py-1.5 text-xs text-my-gray hover:bg-my-bg-light-gray border-b border-my-border-gray"
               >
                  All Categories
               </button>

               {/* Category list */}
               {CATEGORIES.map((cat) => (
                  <button
                     key={cat}
                     onClick={() => handleSelect(cat)}
                     className={`w-full text-left px-3 py-1.5 text-sm hover:bg-my-bg-light-gray ${
                        selectedCategory === cat
                           ? 'text-my-blue font-medium'
                           : 'text-my-gray'
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
