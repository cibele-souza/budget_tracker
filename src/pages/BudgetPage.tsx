import { useState } from 'react';
import type { Budget, Transaction } from '../types';
import { getAvailableYears } from '../utils/dates';
import YearFilter from '../components/YearFilter';
import BudgetTable from '../components/BudgetTable';
import { exportBudgetToCsv } from '../utils/exportCsv';

interface BudgetPageProps {
   budgets: Budget[];
   transactions: Transaction[];
   onBudgetsChange: (updated: Budget[]) => void;
}

export default function BudgetPage({
   budgets,
   transactions,
   onBudgetsChange,
}: BudgetPageProps) {
   const years = getAvailableYears(transactions.map((t) => t.date));
   const currentYear = new Date().getFullYear();
   const [selectedYear, setSelectedYear] = useState<number>(
      years.includes(currentYear) ? currentYear : years[years.length - 1],
   );

   function handleBudgetChange(updated: Budget) {
      onBudgetsChange(
         budgets.map((b) => (b.category === updated.category ? updated : b)),
      );
   }

   return (
      <div>
         <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Budget</h1>
            <div className="flex items-center gap-3">
               <button
                  onClick={() => exportBudgetToCsv(budgets, selectedYear)}
                  className="text-my-gray border border-my-border-gray rounded p-1 hover:border-my-blue hover:text-my-blue transition-colors"
                  title="Exporter fichier CSV"
               >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     className="w-3.5 h-3.5"
                     fill="none"
                     viewBox="0 0 24 24"
                     strokeWidth={1.5}
                     stroke="currentColor"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                     />
                  </svg>
               </button>
               <YearFilter
                  years={years}
                  selectedYear={selectedYear}
                  onYearChange={setSelectedYear}
               />
            </div>
         </div>
         <BudgetTable
            budgets={budgets}
            selectedYear={selectedYear}
            onChange={handleBudgetChange}
         />
      </div>
   );
}
