import type { Budget } from '../types';
import DefaultValueInput from './DefaultValueInput';
import ApplyDefaultButton from './ApplyDefaultButton';
import MonthValueInput from './MonthValueInput';
import { MONTHS } from '../utils/constants';

interface BudgetRowProps {
   budget: Budget;
   selectedYear: number;
   onChange: (updated: Budget) => void;
   rowIndex: number;
   totalRows: number;
}

export default function BudgetRow({
   budget,
   selectedYear,
   onChange,
   rowIndex,
   totalRows,
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
         <td className="px-2 py-1 text-sm font-medium text-my-gray whitespace-nowrap">
            {budget.category}
         </td>

         {/* Default value + Apply button */}
         <td className="px-2 py-1 text-center" colSpan={1}>
            <div className="flex items-center justify-center gap-2">
               <DefaultValueInput
                  value={budget.defaultValue}
                  onChange={handleDefaultChange}
                  rowIndex={rowIndex}
                  totalRows={totalRows}
               />
               <ApplyDefaultButton onClick={handleApplyDefault} />
            </div>
         </td>

         {/* 12 month inputs */}
         {MONTHS.map((_, i) => {
            const monthKey = `${selectedYear}-${String(i + 1).padStart(2, '0')}`;
            return (
               <td key={monthKey} className="px-0 py-1 text-center">
                  <MonthValueInput
                     monthKey={monthKey}
                     defaultValue={budget.defaultValue}
                     overrideValue={budget.monthlyOverrides[monthKey]}
                     onChange={handleMonthChange}
                     rowIndex={rowIndex}
                     colIndex={i}
                     totalCols={12}
                     totalRows={totalRows}
                  />
               </td>
            );
         })}
      </tr>
   );
}
