import type { Budget } from '../types';
import DefaultValueInput from './DefaultValueInput';
import ApplyDefaultButton from './ApplyDefaultButton';
import MonthValueInput from './MonthValueInput';

interface BudgetRowProps {
   budget: Budget;
   selectedYear: number;
   onChange: (updated: Budget) => void;
   rowIndex: number;
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

export default function BudgetRow({
   budget,
   selectedYear,
   onChange,
   rowIndex,
}: BudgetRowProps) {
   function handleDefaultChange(value: number) {
      onChange({ ...budget, defaultValue: value });
   }

   function handleMonthChange(monthKey: string, value: number | undefined) {
      const updatedOverrides = { ...budget.monthlyOverrides };
      if (value === undefined) {
         delete updatedOverrides[monthKey];
      } else {
         updatedOverrides[monthKey] = value;
      }
      onChange({ ...budget, monthlyOverrides: updatedOverrides });
   }

   function handleApplyDefault() {
      const updatedOverrides = { ...budget.monthlyOverrides };
      MONTHS.forEach((_, i) => {
         const monthKey = `${selectedYear}-${String(i + 1).padStart(2, '0')}`;
         // Only fill months that don't already have an override
         if (updatedOverrides[monthKey] === undefined) {
            updatedOverrides[monthKey] = budget.defaultValue;
         }
      });
      onChange({ ...budget, monthlyOverrides: updatedOverrides });
   }

   return (
      <tr className="border-t border-gray-200 hover:bg-gray-50">
         {/* Category name */}
         <td className="px-2 py-1 text-sm font-medium text-gray-700 whitespace-nowrap">
            {budget.category}
         </td>

         {/* Default value */}
         <td className="pl-2 pr-1 py-1">
            <DefaultValueInput
               value={budget.defaultValue}
               onChange={handleDefaultChange}
            />
         </td>

         {/* Apply default button */}
         <td className="pl-1 pr-2 py-1">
            <ApplyDefaultButton onClick={handleApplyDefault} />
         </td>

         {/* 12 month inputs */}
         {MONTHS.map((_, i) => {
            const monthKey = `${selectedYear}-${String(i + 1).padStart(2, '0')}`;
            return (
               <td key={monthKey} className="px-0 py-1">
                  <MonthValueInput
                     monthKey={monthKey}
                     defaultValue={budget.defaultValue}
                     overrideValue={budget.monthlyOverrides[monthKey]}
                     onChange={handleMonthChange}
                     rowIndex={rowIndex}
                     colIndex={i}
                     totalCols={12}
                     totalRows={26}
                  />
               </td>
            );
         })}
      </tr>
   );
}
