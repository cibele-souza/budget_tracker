import Papa from 'papaparse';
import type { Budget, Transaction } from '../types';
import { MONTH_NAMES } from './constants';

function triggerDownload(csv: string, filename: string): void {
   const BOM = '\uFEFF';
   const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
   const url = URL.createObjectURL(blob);

   const anchor = document.createElement('a');
   anchor.href = url;
   anchor.download = filename;
   anchor.click();

   URL.revokeObjectURL(url);
}

export function exportTransactionsToCsv(transactions: Transaction[]): void {
   const rows = transactions.map((t) => ({
      Date: t.date,
      Description: t.description,
      Amount: t.amount,
      Category: t.category,
      'Bank Category': t.bankCategory ?? '',
      Bank: t.bankName,
      Edited: t.edited ? 'Yes' : 'No',
   }));

   const csv = Papa.unparse(rows);
   const date = new Date().toISOString().slice(0, 10);
   triggerDownload(csv, `transactions-${date}.csv`);
}

export function exportBudgetToCsv(budgets: Budget[], year: number): void {
   const rows = budgets.map((b) => {
      const row: Record<string, string | number> = {
         Category: b.category,
         Default: b.defaultValue,
      };

      MONTH_NAMES.forEach((monthName, i) => {
         const monthKey = `${year}-${String(i + 1).padStart(2, '0')}`;
         row[monthName] = b.monthlyOverrides[monthKey] ?? b.defaultValue;
      });

      return row;
   });

   const csv = Papa.unparse(rows);
   triggerDownload(csv, `budget-${year}.csv`);
}
