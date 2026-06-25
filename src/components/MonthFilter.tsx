import { useState } from 'react';
import { MONTH_NAMES } from '../utils/constants';

interface MonthFilterProps {
   selectedMonths: number[]; // empty = all months
   onMonthsChange: (months: number[]) => void;
}

export default function MonthFilter({
   selectedMonths,
   onMonthsChange,
}: MonthFilterProps) {
   const [isOpen, setIsOpen] = useState(false);

   function toggleMonth(month: number) {
      if (selectedMonths.includes(month)) {
         onMonthsChange(selectedMonths.filter((m) => m !== month));
      } else {
         onMonthsChange(
            [...selectedMonths]
               .sort((a, b) => a - b)
               .concat(month)
               .sort((a, b) => a - b),
         );
      }
   }

   function clearAll() {
      onMonthsChange([]);
      setIsOpen(false);
   }

   const label =
      selectedMonths.length === 0
         ? 'Tous les mois'
         : selectedMonths.length === 1
           ? MONTH_NAMES[selectedMonths[0] - 1]
           : `${selectedMonths.length} months`;

   return (
      <div className="relative">
         <div className="flex items-center gap-2">
            <label className="text-sm text-my-gray font-medium">Mois</label>
            <button
               onClick={() => setIsOpen((prev) => !prev)}
               className="text-sm border border-my-border-gray rounded px-2 py-1 bg-white text-my-gray hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-my-blue min-w-32 text-left flex justify-between items-center gap-2"
            >
               <span>{label}</span>
               <span className="text-my-gray text-xs">
                  {isOpen ? '▲' : '▼'}
               </span>
            </button>
         </div>

         {isOpen && (
            <div className="absolute right-0 mt-1 bg-white border border-my-border-gray rounded-lg shadow-lg z-20 min-w-32 py-1 max-h-72 overflow-y-auto">
               {/* Clear button */}
               <button
                  onClick={clearAll}
                  className="w-full text-left px-3 py-1.5 text-xs text-my-gray hover:bg-my-bg-light-gray border-b border-my-border-gray"
               >
                  Tous les mois
               </button>

               {/* Month checkboxes */}
               {MONTH_NAMES.map((name, i) => {
                  const month = i + 1;
                  const checked = selectedMonths.includes(month);
                  return (
                     <label
                        key={month}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-my-gray hover:bg-my-bg-light-gray cursor-pointer"
                     >
                        <input
                           type="checkbox"
                           checked={checked}
                           onChange={(e) => {
                              e.stopPropagation();
                              toggleMonth(month);
                           }}
                           className="accent-my-blue"
                        />
                        {name}
                     </label>
                  );
               })}
            </div>
         )}

         {/* Click outside to close */}
         {isOpen && (
            <div
               className="fixed inset-0 z-10"
               onClick={() => setIsOpen(false)}
            />
         )}
      </div>
   );
}
