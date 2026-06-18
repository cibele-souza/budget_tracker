import {
   BarChart,
   Bar,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   Legend,
   ResponsiveContainer,
} from 'recharts';
import type { Transaction, Budget } from '../types/index';
import { aggregatePeriod } from '../utils/aggregate';
import { MONTHS } from '../utils/constants';

interface SpendingOverTimeChartProps {
   transactions: Transaction[];
   budgets: Budget[];
   selectedYear: number;
   selectedMonths: number[]; // empty = all months
   selectedCategory: string | null;
}

export default function SpendingOverTimeChart({
   transactions,
   budgets,
   selectedYear,
   selectedMonths,
   selectedCategory,
}: SpendingOverTimeChartProps) {
   const monthsToShow =
      selectedMonths.length > 0
         ? selectedMonths
         : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

   const data = monthsToShow.map((month) => {
      const summary = aggregatePeriod(transactions, budgets, selectedYear, [
         month,
      ]);

      let spent = 0;
      let budget = 0;

      if (selectedCategory !== null) {
         const row = summary.categories.find(
            (c) => c.category === selectedCategory,
         );
         spent = row ? row.spent : 0;
         budget = row ? row.budget : 0;
      } else {
         spent = summary.totalSpent;
         budget = summary.totalBudget;
      }

      return {
         month: MONTHS[month - 1],
         Spent: parseFloat(spent.toFixed(2)),
         Budget: parseFloat(budget.toFixed(2)),
      };
   });

   const hasData = data.some((d) => d.Spent > 0 || d.Budget > 0);

   if (!hasData) {
      return (
         <div className="bg-white border border-my-border-gray rounded-xl p-6 shadow-sm flex items-center justify-center h-64 text-my-gray text-sm">
            No data for the selected period.
         </div>
      );
   }

   return (
      <div className="bg-white border border-my-border-gray rounded-xl p-6 shadow-sm">
         <h2 className="text-sm font-medium text-my-gray uppercase tracking-wide mb-4">
            Spending Over Time
         </h2>
         <ResponsiveContainer width="100%" height={300}>
            <BarChart
               data={data}
               margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
            >
               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
               <XAxis dataKey="month" tick={{ fontSize: 12 }} />
               <YAxis tick={{ fontSize: 12 }} unit=" €" width={70} />
               <Tooltip
                  formatter={(value, name) => {
                     if (typeof value !== 'number' || value === 0) return null;
                     return [`${value.toFixed(2)} €`, name];
                  }}
                  cursor={{ fill: 'rgba(0,0,0,0.04)' }}
               />
               <Legend />
               <Bar
                  dataKey="Spent"
                  fill="var(--color-my-red)"
                  radius={[4, 4, 0, 0]}
               />
               <Bar
                  dataKey="Budget"
                  fill="var(--color-my-chart-gray)"
                  radius={[4, 4, 0, 0]}
               />
            </BarChart>
         </ResponsiveContainer>
      </div>
   );
}
