interface YearFilterProps {
   years: number[];
   selectedYear: number;
   onYearChange: (year: number) => void;
}

export default function YearFilter({
   years,
   selectedYear,
   onYearChange,
}: YearFilterProps) {
   return (
      <div className="flex items-center gap-2">
         <label className="text-sm text-gray-600 font-medium">Year</label>
         <div className="relative">
            <select
               value={selectedYear}
               onChange={(e) => onYearChange(parseInt(e.target.value))}
               className="text-sm border border-gray-200 rounded px-2 py-1 pr-6 bg-white text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
               {years.map((year) => (
                  <option key={year} value={year}>
                     {year}
                  </option>
               ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
               ▼
            </span>
         </div>
      </div>
   );
}
