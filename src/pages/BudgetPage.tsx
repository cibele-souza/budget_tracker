import { useState } from 'react';
import type { Budget, Transaction } from '../types';
import { getAvailableYears } from '../utils/dates';
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
   const [selectedYear, setSelectedYear] = useState<number>(
      years[years.length - 1],
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
            <YearFilter
               years={years}
               selectedYear={selectedYear}
               onYearChange={setSelectedYear}
            />
         </div>
         <BudgetTable
            budgets={budgets}
            selectedYear={selectedYear}
            onChange={handleBudgetChange}
         />
      </div>
   );
}
