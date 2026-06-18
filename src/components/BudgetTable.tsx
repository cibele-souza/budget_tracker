import type { Budget } from '../types';
import BudgetRow from './BudgetRow';

interface BudgetTableProps {
   budgets: Budget[];
   selectedYear: number;
   onChange: (updated: Budget) => void;
}

const MONTHS = [
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

export default function BudgetTable({
   budgets,
   selectedYear,
   onChange,
}: BudgetTableProps) {
   return (
      <div className="overflow-x-auto">
         <table className="w-full text-sm border-collapse">
            <thead>
               <tr className="bg-gray-100 text-left text-gray-600 uppercase text-xs tracking-wide">
                  <th className="px-2 py-2 whitespace-nowrap">Category</th>
                  <th className="px-2 py-2 whitespace-nowrap">Default</th>
                  <th className="px-2 py-2"></th>
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
                  />
               ))}
            </tbody>
         </table>
      </div>
   );
}
