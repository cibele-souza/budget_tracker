import { Fragment } from 'react';
import type { CategorySummary } from '../utils/aggregate';
import { MONTHS } from '../utils/constants';

interface CategoryBreakdownTableProps {
   categories: CategorySummary[];
   selectedYear: number;
   selectedMonths: number[];
}

export default function CategoryBreakdownTable({
   categories,
   selectedYear,
   selectedMonths,
}: CategoryBreakdownTableProps) {
   const active = categories.filter((c) => c.spent > 0 || c.budget > 0);

   if (active.length === 0) {
      return (
         <p className="text-my-gray text-sm text-center mt-6">
            No data for the selected period.
         </p>
      );
   }

   const monthsToShow =
      selectedMonths.length > 0
         ? selectedMonths.map((m) => m - 1)
         : Array.from({ length: 12 }, (_, i) => i);

   return (
      <div className="overflow-x-auto">
         <table className="w-full text-sm border-collapse">
            <thead>
               <tr className="bg-my-bg-gray text-my-gray uppercase text-xs tracking-wide">
                  <th className="px-3 py-2 text-left" rowSpan={2}>
                     Category
                  </th>
                  {monthsToShow.map((m) => (
                     <th
                        key={m}
                        colSpan={2}
                        className="px-3 py-2 text-center border-l border-my-border-gray"
                     >
                        {MONTHS[m]} {selectedYear}
                     </th>
                  ))}
               </tr>
               <tr className="bg-my-bg-light-gray text-my-gray uppercase text-xs tracking-wide">
                  {monthsToShow.map((m) => (
                     <Fragment key={m}>
                        <th className="px-3 py-1 text-right border-l border-my-border-gray">
                           Spent
                        </th>
                        <th className="px-3 py-1 text-right">Budget</th>
                     </Fragment>
                  ))}
               </tr>
            </thead>
            <tbody>
               {active.map((c) => (
                  <tr
                     key={c.category}
                     className="border-t border-my-border-gray hover:bg-my-bg-light-gray"
                  >
                     <td className="px-3 py-2 font-medium text-my-gray whitespace-nowrap">
                        {c.category}
                     </td>
                     {monthsToShow.map((m) => {
                        const monthKey = `${selectedYear}-${String(m + 1).padStart(2, '0')}`;
                        const spent = c.monthlyData?.[monthKey]?.spent ?? 0;
                        const budget = c.monthlyData?.[monthKey]?.budget ?? 0;
                        const isOver = budget > 0 && spent > budget;

                        return (
                           <Fragment key={monthKey}>
                              <td
                                 className={`px-3 py-2 text-right border-l border-my-border-gray whitespace-nowrap font-medium
                      ${isOver ? 'text-my-red' : spent > 0 ? 'text-my-green' : 'text-gray-300'}`}
                              >
                                 {spent > 0 ? `${spent.toFixed(2)} €` : '-'}
                              </td>
                              <td className="px-3 py-2 text-right whitespace-nowrap text-my-gray">
                                 {budget > 0 ? `${budget.toFixed(2)} €` : '-'}
                              </td>
                           </Fragment>
                        );
                     })}
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}
