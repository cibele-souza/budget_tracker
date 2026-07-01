import type { Budget } from '../types';
import BudgetRow from './BudgetRow';
import { MONTHS } from '../utils/constants';

interface BudgetTableProps {
   budgets: Budget[];
   selectedYear: number;
   onChange: (updated: Budget) => void;
}

export default function BudgetTable({
   budgets,
   selectedYear,
   onChange,
}: BudgetTableProps) {
   return (
      <div className="overflow-x-auto">
         <table className="w-full text-sm border-collapse">
            <thead>
               <tr className="bg-gray-100 text-left text-my-gray uppercase text-xs tracking-wide">
                  <th className="px-2 py-2 whitespace-nowrap" rowSpan={2}>
                     Catégorie
                  </th>
                  <th className="px-2 py-2 text-center whitespace-nowrap w-px">
                     Valeur par Défaut
                  </th>
                  {MONTHS.map((month) => (
                     <th
                        key={month}
                        className="px-1 py-2 text-center whitespace-nowrap"
                     >
                        {month}
                     </th>
                  ))}
               </tr>
            </thead>
            <tbody>
               {budgets.map((budget, index) => (
                  <BudgetRow
                     key={budget.category}
                     budget={budget}
                     selectedYear={selectedYear}
                     onChange={onChange}
                     rowIndex={index}
                     totalRows={budgets.length}
                  />
               ))}
            </tbody>
         </table>
      </div>
   );
}
