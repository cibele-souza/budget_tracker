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
         <label className="text-sm text-my-gray font-medium">Year</label>
         <div className="relative">
            <select
               value={selectedYear}
               onChange={(e) => onYearChange(parseInt(e.target.value))}
               className="text-sm border border-my-border-gray rounded px-2 py-1 pr-6 bg-white text-my-gray hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-my-blue appearance-none"
            >
               {years.map((year) => (
                  <option key={year} value={year}>
                     {year}
                  </option>
               ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-my-gray text-xs">
               ▼
            </span>
         </div>
      </div>
   );
}
