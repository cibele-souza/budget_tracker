import { useState } from 'react';

interface TxYearFilterProps {
   years: string[];
   selectedYears: string[];
   onChange: (years: string[]) => void;
}

export default function TxYearFilter({
   years,
   selectedYears,
   onChange,
}: TxYearFilterProps) {
   const [isOpen, setIsOpen] = useState(false);

   function toggleYear(year: string) {
      if (selectedYears.includes(year)) {
         onChange(selectedYears.filter((y) => y !== year));
      } else {
         onChange([...selectedYears, year].sort((a, b) => b.localeCompare(a)));
      }
   }

   function clearAll() {
      onChange([]);
      setIsOpen(false);
   }

   const label =
      selectedYears.length === 0
         ? 'Toutes les années'
         : selectedYears.length === 1
           ? selectedYears[0]
           : `${selectedYears.length} years`;

   return (
      <div className="relative">
         <div className="flex items-center gap-2">
            <label className="text-sm text-my-gray font-medium">Année</label>
            <button
               onClick={() => setIsOpen((prev) => !prev)}
               className="text-sm border border-my-border-gray rounded px-2 py-1 bg-white text-my-gray hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-my-blue text-left flex justify-between items-center gap-2 min-w-36"
            >
               <span>{label}</span>
               <span className="text-my-gray text-xs">
                  {isOpen ? '▲' : '▼'}
               </span>
            </button>
         </div>

         {isOpen && (
            <div className="absolute right-0 mt-1 bg-white border border-my-border-gray rounded-lg shadow-lg z-20 min-w-36 py-1 max-h-72 overflow-y-auto content-end">
               <button
                  onClick={clearAll}
                  className="w-full text-left px-3 py-1.5 text-xs text-my-gray hover:bg-my-bg-light-gray border-b border-my-border-gray "
               >
                  Toutes les années
               </button>
               {years.map((year) => {
                  const checked = selectedYears.includes(year);
                  return (
                     <label
                        key={year}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-my-gray hover:bg-my-bg-light-gray cursor-pointer"
                     >
                        <input
                           type="checkbox"
                           checked={checked}
                           onChange={() => toggleYear(year)}
                           className="accent-my-blue"
                        />
                        {year}
                     </label>
                  );
               })}
            </div>
         )}

         {isOpen && (
            <div
               className="fixed inset-0 z-10"
               onClick={() => setIsOpen(false)}
            />
         )}
      </div>
   );
}
