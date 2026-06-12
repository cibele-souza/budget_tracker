import { useState } from 'react';
import type { Transaction, Budget } from '../types';
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
   const [selectedYear, setSelectedYear] = useState<number>(
      years[years.length - 1],
   );
   const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
   const [selectedCategory, setSelectedCategory] = useState<string | null>(
      null,
   );

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
      selectedCategory !== null
         ? {
              ...summary,
              categories: summary.categories.filter(
                 (c) => c.category === selectedCategory,
              ),
              totalSpent: summary.categories
                 .filter((c) => c.category === selectedCategory)
                 .reduce((sum, c) => sum + c.spent, 0),
              totalBudget: summary.categories
                 .filter((c) => c.category === selectedCategory)
                 .reduce((sum, c) => sum + c.budget, 0),
              overBudgetCount: summary.categories.filter(
                 (c) => c.category === selectedCategory && c.isOverBudget,
              ).length,
           }
         : summary;

   return (
      <div>
         <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <div className="flex items-center gap-4">
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
                  selectedCategory={selectedCategory}
                  onChange={setSelectedCategory}
               />
            </div>
         </div>
         <SummaryCards
            totalSpent={filteredSummary.totalSpent}
            totalBudget={filteredSummary.totalBudget}
            overBudgetCount={filteredSummary.overBudgetCount}
         />
         <CategoryBreakdownTable
            categories={filteredSummary.categories}
            selectedYear={selectedYear}
            selectedMonths={selectedMonths}
         />
         <SpendingOverTimeChart
            transactions={transactions}
            budgets={budgets}
            selectedYear={selectedYear}
            selectedMonths={selectedMonths}
            selectedCategory={selectedCategory}
         />
         <CategoryBreakdownChart
            transactions={transactions}
            budgets={budgets}
            selectedYear={selectedYear}
            selectedMonths={selectedMonths}
            selectedCategory={selectedCategory}
         />
      </div>
   );
}
