import { useState } from 'react';
import type { Transaction, Budget, Category } from '../types';
import { getAvailableYears } from '../utils/dates';
import { aggregatePeriod } from '../utils/aggregate';
import YearFilter from '../components/YearFilter';
import MonthFilter from '../components/MonthFilter';
import CategoryFilter from '../components/CategoryFilter';
import SummaryCards from '../components/SummaryCards';
import CategoryBreakdownTable from '../components/CategoryBreakdownTable';
import SpendingOverTimeChart from '../components/SpendingOverTimeChart';
import CategoryBreakdownChart from '../components/CategoryBreakdownChart';

interface DashboardPageProps {
   transactions: Transaction[];
   budgets: Budget[];
}

export default function DashboardPage({
   transactions,
   budgets,
}: DashboardPageProps) {
   const years = getAvailableYears(transactions.map((t) => t.date));
   const currentYear = new Date().getFullYear();
   const [selectedYear, setSelectedYear] = useState<number>(
      years.includes(currentYear) ? currentYear : years[years.length - 1],
   );
   const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
   const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

   function handleYearChange(year: number) {
      setSelectedYear(year);
      setSelectedMonths([]); // reset month filter when year changes
   }

   const summary = aggregatePeriod(
      transactions,
      budgets,
      selectedYear,
      selectedMonths,
   );

   const filteredSummary =
      selectedCategories.length > 0
         ? {
              ...summary,
              categories: summary.categories.filter((c) =>
                 selectedCategories.includes(c.category),
              ),
              totalSpent: summary.categories
                 .filter((c) => selectedCategories.includes(c.category))
                 .reduce((sum, c) => sum + c.spent, 0),
              totalBudget: summary.categories
                 .filter((c) => selectedCategories.includes(c.category))
                 .reduce((sum, c) => sum + c.budget, 0),
              overBudgetCount: summary.categories.filter(
                 (c) =>
                    selectedCategories.includes(c.category) && c.isOverBudget,
              ).length,
           }
         : summary;

   const hasTransactions = transactions.length > 0;

   return (
      <div>
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-semibold">Tableau de Bord</h1>
            <div className="flex flex-wrap items-center gap-4">
               <YearFilter
                  years={years}
                  selectedYear={selectedYear}
                  onYearChange={handleYearChange}
               />
               <MonthFilter
                  selectedMonths={selectedMonths}
                  onMonthsChange={setSelectedMonths}
               />
               <CategoryFilter
                  selectedCategories={selectedCategories}
                  onChange={setSelectedCategories}
               />
            </div>
         </div>
         <SummaryCards
            totalSpent={filteredSummary.totalSpent}
            totalBudget={filteredSummary.totalBudget}
            overBudgetCount={filteredSummary.overBudgetCount}
         />
         <div className="mt-12">
            <CategoryBreakdownTable
               categories={filteredSummary.categories}
               selectedYear={selectedYear}
               selectedMonths={selectedMonths}
            />
         </div>
         {hasTransactions ? (
            <div className="flex flex-col gap-12 mt-12">
               <SpendingOverTimeChart
                  transactions={transactions}
                  budgets={budgets}
                  selectedYear={selectedYear}
                  selectedMonths={selectedMonths}
                  selectedCategories={selectedCategories}
               />
               <CategoryBreakdownChart
                  transactions={transactions}
                  budgets={budgets}
                  selectedYear={selectedYear}
                  selectedMonths={selectedMonths}
                  selectedCategories={selectedCategories}
               />
            </div>
         ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
               <svg
                  className="w-10 h-10 text-gray-300 mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                  />
               </svg>
               <p className="text-gray-500 font-medium mb-1">
                  Aucune donnée disponible.
               </p>
               <p className="text-gray-400 text-sm">
                  Importez un export bancaire et définissez vos budgets pour
                  consulter votre tableau de bord.
               </p>
            </div>
         )}
      </div>
   );
}
