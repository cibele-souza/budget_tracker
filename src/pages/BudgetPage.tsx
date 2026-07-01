import { useState } from 'react';
import type { Budget, Transaction } from '../types';
import { getAvailableYears } from '../utils/dates';
import { exportBudgetToCsv } from '../utils/exportCsv';
import YearFilter from '../components/YearFilter';
import BudgetTable from '../components/BudgetTable';

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
   const [pendingClearAll, setPendingClearAll] = useState(false);

   function handleBudgetChange(updated: Budget) {
      onBudgetsChange(
         budgets.map((b) => (b.category === updated.category ? updated : b)),
      );
   }

   function handleClearAll() {
      const yearPrefix = `${selectedYear}-`;
      onBudgetsChange(
         budgets.map((b) => {
            const filteredOverrides = Object.fromEntries(
               Object.entries(b.monthlyOverrides).filter(
                  ([key]) => !key.startsWith(yearPrefix),
               ),
            );
            return { ...b, monthlyOverrides: filteredOverrides };
         }),
      );
      setPendingClearAll(false);
   }

   return (
      <div>
         <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Budget</h1>
            <div className="flex items-center gap-3">
               {/* Clear All button + popover */}
               <div className="relative">
                  <button
                     onClick={() => setPendingClearAll((prev) => !prev)}
                     className="text-my-gray border border-my-border-gray rounded p-1 hover:border-my-red hover:text-my-red transition-colors"
                     title="Rétablir les valeurs par défault"
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
                           d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                        />
                     </svg>
                  </button>

                  {pendingClearAll && (
                     <div className="absolute text-center right-0 top-7 bg-white border border-my-border-gray rounded-lg shadow-lg z-20 p-3 w-48">
                        <p className="text-sm text-gray-700 mb-3">
                           Rétablir les valeurs par défault pour {selectedYear}{' '}
                           ?
                        </p>
                        <div className="flex gap-2">
                           <button
                              onClick={handleClearAll}
                              className="flex-1 px-2 py-1 bg-my-red text-white text-xs rounded hover:opacity-90 transition-opacity"
                           >
                              Confirmer
                           </button>
                           <button
                              onClick={() => setPendingClearAll(false)}
                              className="flex-1 px-2 py-1 border border-my-border-gray text-my-gray text-xs rounded hover:border-gray-400 transition-colors"
                           >
                              Annuler
                           </button>
                        </div>
                     </div>
                  )}
               </div>

               {/* Export CSV button */}
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
