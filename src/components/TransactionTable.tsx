import { useState } from 'react';
import { CATEGORIES } from '../types';
import type { Transaction, Category, Import } from '../types';

interface Props {
   transactions: Transaction[];
   imports: Import[];
   onCategoryChange: (id: string, newCategory: Category) => void;
}

export default function TransactionTable({
   transactions,
   imports,
   onCategoryChange,
}: Props) {
   const [showBankCategory, setShowBankCategory] = useState(false);
   const [showSourceFile, setShowSourceFile] = useState(false);

   // Build a lookup map from importId → filename
   const importMap = Object.fromEntries(
      imports.map((imp) => [imp.id, imp.filename]),
   );

   if (transactions.length === 0) {
      return (
         <p className="text-my-gray text-sm text-center mt-6">
            No transactions yet. Upload a file to get started.
         </p>
      );
   }

   return (
      <div>
         {/* Toggle */}
         <div className="flex flex-wrap justify-end gap-2 mb-2">
            <button
               onClick={() => setShowBankCategory((prev) => !prev)}
               className="text-xs text-my-gray border border-my-border-gray rounded px-3 py-1 hover:bg-my-bg-gray transition-colors"
            >
               {showBankCategory ? 'Hide' : 'Show'} bank category
            </button>
            <button
               onClick={() => setShowSourceFile((prev) => !prev)}
               className="text-xs text-my-gray border border-my-border-gray rounded px-3 py-1 hover:bg-my-bg-gray transition-colors"
            >
               {showSourceFile ? 'Hide' : 'Show'} source file
            </button>
         </div>

         <div className="overflow-x-auto w-full">
            <table className="min-w-175 w-full text-sm border-collapse">
               <thead>
                  <tr className="bg-my-bg-gray text-left text-my-gray uppercase text-xs tracking-wide">
                     <th className="px-2 py-2">Date</th>
                     <th className="px-2 py-2">Description</th>
                     <th className="px-2 py-2 text-right">Amount</th>
                     {showBankCategory && (
                        <th className="px-2 py-2">Bank Category</th>
                     )}
                     <th className="px-2 py-2 text-center">Category</th>
                     <th className="px-2 py-2">Bank</th>
                     {showSourceFile && (
                        <th className="px-2 py-2">Source file</th>
                     )}
                  </tr>
               </thead>
               <tbody>
                  {transactions.map((transaction) => {
                     const amountClass =
                        transaction.amount >= 0
                           ? 'text-my-green font-medium'
                           : 'text-my-red font-medium';

                     return (
                        <tr
                           key={transaction.id}
                           className="border-t border-my-border-gray hover:bg-my-bg-light-gray"
                        >
                           <td className="px-2 py-1 text-my-gray whitespace-nowrap">
                              {transaction.date}
                           </td>
                           <td className="px-2 py-1 text-gray-800">
                              {transaction.description}
                           </td>
                           <td className="px-2 py-1 text-right whitespace-nowrap">
                              <span className={amountClass}>
                                 {transaction.amount >= 0 ? '+' : ''}
                                 {transaction.amount.toFixed(2)} €
                              </span>
                           </td>
                           {showBankCategory && (
                              <td className="px-2 py-1 text-my-gray">
                                 {transaction.bankCategory || '—'}
                              </td>
                           )}
                           <td className="px-2 py-1 text-center">
                              <select
                                 value={transaction.category}
                                 onChange={(e) =>
                                    onCategoryChange(
                                       transaction.id,
                                       e.target.value as Category,
                                    )
                                 }
                                 className="text-sm border border-my-border-gray rounded px-2 py-1 bg-white text-my-gray hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-my-blue"
                              >
                                 {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                       {cat}
                                    </option>
                                 ))}
                              </select>
                           </td>
                           <td className="px-2 py-1 text-my-gray whitespace-nowrap">
                              {transaction.bankName}
                           </td>
                           {showSourceFile && (
                              <td className="px-2 py-1 text-my-gray text-xs whitespace-nowrap">
                                 {importMap[transaction.importId] ?? '—'}
                              </td>
                           )}
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </div>
   );
}
