import type { CategorySummary } from '../utils/aggregate';

interface CategoryBreakdownTableProps {
   categories: CategorySummary[];
   selectedYear: number;
   selectedMonths: number[]; // empty = all months
}

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

export default function CategoryBreakdownTable({
   categories,
   selectedYear,
   selectedMonths,
}: CategoryBreakdownTableProps) {
   const active = categories.filter((c) => c.spent > 0 || c.budget > 0);

   if (active.length === 0) {
      return (
         <p className="text-gray-400 text-sm text-center mt-6">
            No data for the selected period.
         </p>
      );
   }

   // Which months to display
   const monthsToShow =
      selectedMonths.length > 0
         ? selectedMonths.map((m) => m - 1)
         : Array.from({ length: 12 }, (_, i) => i);

   return (
      <div className="overflow-x-auto">
         <table className="w-full text-sm border-collapse">
            <thead>
               {/* Month header row */}
               <tr className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wide">
                  <th className="px-3 py-2 text-left" rowSpan={2}>
                     Category
                  </th>
                  {monthsToShow.map((m) => (
                     <th
                        key={m}
                        colSpan={2}
                        className="px-3 py-2 text-center border-l border-gray-200"
                     >
                        {MONTH_NAMES[m]}{' '}
                        {selectedMonths === null ? '' : selectedYear}
                     </th>
                  ))}
               </tr>
               {/* Spent / Budget sub-header row */}
               <tr className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
                  {monthsToShow.map((m) => (
                     <>
                        <th
                           key={`${m}-spent`}
                           className="px-3 py-1 text-right border-l border-gray-200"
                        >
                           Spent
                        </th>
                        <th
                           key={`${m}-budget`}
                           className="px-3 py-1 text-right"
                        >
                           Budget
                        </th>
                     </>
                  ))}
               </tr>
            </thead>
            <tbody>
               {active.map((c) => (
                  <tr
                     key={c.category}
                     className="border-t border-gray-200 hover:bg-gray-50"
                  >
                     <td className="px-3 py-2 font-medium text-gray-700 whitespace-nowrap">
                        {c.category}
                     </td>
                     {monthsToShow.map((m) => {
                        const monthKey = `${selectedYear}-${String(m + 1).padStart(2, '0')}`;
                        const spent = c.monthlyData?.[monthKey]?.spent ?? 0;
                        const budget = c.monthlyData?.[monthKey]?.budget ?? 0;
                        const isOver = budget > 0 && spent > budget;

                        return (
                           <>
                              <td
                                 key={`${c.category}-${monthKey}-spent`}
                                 className={`px-3 py-2 text-right border-l border-gray-200 whitespace-nowrap font-medium
                        ${isOver ? 'text-red-600' : spent > 0 ? 'text-gray-800' : 'text-gray-300'}`}
                              >
                                 {spent > 0 ? `${spent.toFixed(2)} €` : '-'}
                              </td>
                              <td
                                 key={`${c.category}-${monthKey}-budget`}
                                 className="px-3 py-2 text-right whitespace-nowrap text-gray-500"
                              >
                                 {budget > 0 ? `${budget.toFixed(2)} €` : '-'}
                              </td>
                           </>
                        );
                     })}
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}
