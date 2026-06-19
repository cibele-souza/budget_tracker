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

interface CategoryBreakdownChartProps {
   transactions: Transaction[];
   budgets: Budget[];
   selectedYear: number;
   selectedMonths: number[]; // empty = all months
   selectedCategory: string | null;
}

export default function CategoryBreakdownChart({
   transactions,
   budgets,
   selectedYear,
   selectedMonths,
   selectedCategory,
}: CategoryBreakdownChartProps) {
   const summary = aggregatePeriod(
      transactions,
      budgets,
      selectedYear,
      selectedMonths,
   );

   const data = summary.categories
      .filter(
         (c) => selectedCategory === null || c.category === selectedCategory,
      )
      .filter((c) => c.spent > 0 || c.budget > 0)
      .map((c) => ({
         category: c.category,
         Spent: parseFloat(c.spent.toFixed(2)),
         Budget: parseFloat(c.budget.toFixed(2)),
      }));

   if (data.length === 0) {
      return (
         <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center justify-center h-64 text-my-gray text-sm">
            Aucune donnée disponible pour la période sélectionnée.
         </div>
      );
   }

   // Dynamically size the chart height so bars don't get cramped
   const chartHeight = Math.max(data.length * 56, 200);

   return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
         <h2 className="text-sm font-medium text-my-gray uppercase tracking-wide mb-4">
            Dépenses par Categorie
         </h2>
         <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
               layout="vertical"
               data={data}
               margin={{ top: 4, right: 24, left: 8, bottom: 0 }}
            >
               <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  horizontal={false}
               />
               <XAxis type="number" tick={{ fontSize: 12 }} unit=" €" />
               <YAxis
                  type="category"
                  dataKey="category"
                  width={140}
                  tick={({ x, y, payload }) => (
                     <text
                        x={x}
                        y={y}
                        dy={4}
                        textAnchor="end"
                        fontSize={12}
                        fill="#374151"
                     >
                        {payload.value.length > 18
                           ? `${payload.value.slice(0, 18)}…`
                           : payload.value}
                     </text>
                  )}
               />
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
                  radius={[0, 4, 4, 0]}
               />
               <Bar
                  dataKey="Budget"
                  fill="var(--color-my-chart-gray)"
                  radius={[0, 4, 4, 0]}
               />
            </BarChart>
         </ResponsiveContainer>
      </div>
   );
}
