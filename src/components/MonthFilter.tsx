import { useState } from 'react';

const MONTH_NAMES = [
   'Jan',
   'Feb',
   'Mar',
   'Apr',
   'May',
   'Jun',
   'Jul',
   'Aug',
   'Sep',
   'Oct',
   'Nov',
   'Dec',
];

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
         ? 'All months'
         : selectedMonths.length === 1
           ? MONTH_NAMES[selectedMonths[0] - 1]
           : `${selectedMonths.length} months`;

   return (
      <div className="relative">
         <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 font-medium">Month</label>
            <button
               onClick={() => setIsOpen((prev) => !prev)}
               className="text-sm border border-gray-200 rounded px-2 py-1 bg-white text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-32 text-left flex justify-between items-center gap-2"
            >
               <span>{label}</span>
               <span className="text-gray-400 text-xs">
                  {isOpen ? '▲' : '▼'}
               </span>
            </button>
         </div>

         {isOpen && (
            <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-40 py-1">
               {/* Clear button */}
               <button
                  onClick={clearAll}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-400 hover:bg-gray-50 border-b border-gray-100"
               >
                  Clear (show all)
               </button>

               {/* Month checkboxes */}
               {MONTH_NAMES.map((name, i) => {
                  const month = i + 1;
                  const checked = selectedMonths.includes(month);
                  return (
                     <label
                        key={month}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                     >
                        <input
                           type="checkbox"
                           checked={checked}
                           onChange={() => toggleMonth(month)}
                           className="accent-blue-500"
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
               className="fixed inset-0 z-0"
               onClick={() => setIsOpen(false)}
            />
         )}
      </div>
   );
}
