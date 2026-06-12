interface SummaryCardsProps {
   totalSpent: number;
   totalBudget: number;
   overBudgetCount: number;
}

function Card({
   label,
   value,
   highlight,
}: {
   label: string;
   value: string;
   highlight?: 'red' | 'green' | 'neutral';
}) {
   const valueColor =
      highlight === 'red'
         ? 'text-red-600'
         : highlight === 'green'
           ? 'text-green-600'
           : 'text-gray-800';

   return (
      <div className="bg-white border border-gray-200 rounded-xl px-6 py-4 flex flex-col gap-1 shadow-sm">
         <span className="text-xs text-gray-500 uppercase tracking-wide">
            {label}
         </span>
         <span className={`text-2xl font-semibold ${valueColor}`}>{value}</span>
      </div>
   );
}

export default function SummaryCards({
   totalSpent,
   totalBudget,
   overBudgetCount,
}: SummaryCardsProps) {
   const remaining = totalBudget - totalSpent;
   const isOverall = remaining < 0;

   return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         <Card
            label="Total Spent"
            value={`${totalSpent.toFixed(2)} €`}
            highlight="neutral"
         />
         <Card
            label="Total Budget"
            value={`${totalBudget.toFixed(2)} €`}
            highlight="neutral"
         />
         <Card
            label="Remaining"
            value={`${remaining.toFixed(2)} €`}
            highlight={isOverall ? 'red' : 'green'}
         />
         <Card
            label="Over-budget Categories"
            value={String(overBudgetCount)}
            highlight={overBudgetCount > 0 ? 'red' : 'green'}
         />
      </div>
   );
}
