import { useMemo } from 'react';
import TransactionTable from '../components/TransactionTable';
import TxYearFilter from '../components/TxYearFilter';
import MonthFilter from '../components/MonthFilter';
import CategoryFilter from '../components/CategoryFilter';
import type { Transaction, Category, Import } from '../types';

interface TransactionsPageProps {
   transactions: Transaction[];
   imports: Import[];
   onTransactionsChange: (updated: Transaction[]) => void;
   onDeleteTransaction: (id: string) => void;
   onEditTransaction: (id: string, updated: Partial<Transaction>) => void;
   txYears: string[];
   txMonths: number[];
   txCategories: Category[];
   txSearch: string;
   onTxYearsChange: (years: string[]) => void;
   onTxMonthsChange: (months: number[]) => void;
   onTxCategoriesChange: (categories: Category[]) => void;
   onTxSearchChange: (search: string) => void;
}

export default function TransactionsPage({
   transactions,
   imports,
   onTransactionsChange,
   onDeleteTransaction,
   onEditTransaction,
   txYears,
   txMonths,
   txCategories,
   txSearch,
   onTxYearsChange,
   onTxMonthsChange,
   onTxCategoriesChange,
   onTxSearchChange,
}: TransactionsPageProps) {
   const availableYears = useMemo(() => {
      const years = [...new Set(transactions.map((t) => t.date.slice(0, 4)))];
      return years.sort((a, b) => b.localeCompare(a));
   }, [transactions]);

   const filtered = useMemo(() => {
      return transactions.filter((t) => {
         if (txYears.length > 0 && !txYears.includes(t.date.slice(0, 4)))
            return false;
         if (
            txMonths.length > 0 &&
            !txMonths.includes(parseInt(t.date.slice(5, 7)))
         )
            return false;
         if (txCategories.length > 0 && !txCategories.includes(t.category))
            return false;
         if (
            txSearch &&
            !t.description.toLowerCase().includes(txSearch.toLowerCase())
         )
            return false;
         return true;
      });
   }, [transactions, txYears, txMonths, txCategories, txSearch]);

   function handleCategoryChange(id: string, newCategory: Category) {
      onTransactionsChange(
         transactions.map((t) =>
            t.id === id ? { ...t, category: newCategory } : t,
         ),
      );
   }

   function handleReset() {
      onTxYearsChange([]);
      onTxMonthsChange([]);
      onTxCategoriesChange([]);
      onTxSearchChange('');
   }

   const hasActiveFilters =
      txYears.length > 0 ||
      txMonths.length > 0 ||
      txCategories.length > 0 ||
      txSearch !== '';

   return (
      <div className="overflow-visible">
         <h1 className="text-2xl font-semibold mb-6">Transactions</h1>

         {/* Filters */}
         <div className="flex flex-wrap gap-3 mb-4 items-end">
            <TxYearFilter
               years={availableYears}
               selectedYears={txYears}
               onChange={onTxYearsChange}
            />
            <MonthFilter
               selectedMonths={txMonths}
               onMonthsChange={onTxMonthsChange}
            />
            <CategoryFilter
               selectedCategories={txCategories}
               onChange={onTxCategoriesChange}
            />
            <div className="flex flex-col gap-1">
               <label className="text-sm text-my-gray font-medium">
                  Search
               </label>
               <input
                  type="text"
                  value={txSearch}
                  onChange={(e) => onTxSearchChange(e.target.value)}
                  placeholder="Search description..."
                  className="text-sm border border-my-border-gray rounded px-2 py-1 bg-white text-my-gray focus:outline-none focus:ring-2 focus:ring-my-blue w-52"
               />
            </div>
            {hasActiveFilters && (
               <button
                  onClick={handleReset}
                  className="text-sm text-my-gray border border-my-border-gray rounded px-3 py-1.5 hover:border-my-red hover:text-my-red transition-colors self-end"
               >
                  Reset filters
               </button>
            )}
         </div>

         {/* Row count */}
         <p className="text-xs text-my-gray mb-3">
            Showing {filtered.length} of {transactions.length} transactions
         </p>

         {transactions.length === 0 ? (
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
                     d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                  />
               </svg>
               <p className="text-gray-500 font-medium mb-1">
                  No transactions yet
               </p>
               <p className="text-gray-400 text-sm">
                  Upload a bank export to get started.
               </p>
            </div>
         ) : filtered.length === 0 ? (
            <p className="text-my-gray text-sm text-center mt-6">
               No transactions match the current filters.
            </p>
         ) : (
            <TransactionTable
               transactions={filtered}
               imports={imports}
               onCategoryChange={handleCategoryChange}
               onDeleteTransaction={onDeleteTransaction}
               onEditTransaction={onEditTransaction}
            />
         )}
      </div>
   );
}
