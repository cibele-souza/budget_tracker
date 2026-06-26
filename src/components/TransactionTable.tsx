import { useState, useEffect } from 'react';
import { CATEGORIES } from '../types';
import type { Transaction, Category, Import } from '../types';

interface Props {
   transactions: Transaction[];
   imports: Import[];
   onCategoryChange: (id: string, newCategory: Category) => void;
   onDeleteTransaction: (id: string) => void;
   onEditTransaction: (id: string, updated: Partial<Transaction>) => void;
   onAddTransaction: (transaction: Transaction) => void;
   onCancelAdd: () => void;
   isAddingNew: boolean;
}

interface EditDraft {
   date: string;
   description: string;
   amount: string;
   category: Category;
}

interface EditErrors {
   date?: string;
   amount?: string;
}

function validateDraft(draft: EditDraft): EditErrors {
   const errors: EditErrors = {};
   if (!draft.date) errors.date = 'Required';
   if (!draft.amount || isNaN(parseFloat(draft.amount)))
      errors.amount = 'Must be a number';
   return errors;
}

export default function TransactionTable({
   transactions,
   imports,
   onCategoryChange,
   onDeleteTransaction,
   onEditTransaction,
   onAddTransaction,
   onCancelAdd,
   isAddingNew,
}: Props) {
   const [showBankCategory, setShowBankCategory] = useState(false);
   const [showSourceFile, setShowSourceFile] = useState(false);
   const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
   const [editingId, setEditingId] = useState<string | null>(null);
   const [editDraft, setEditDraft] = useState<EditDraft | null>(null);
   const [editErrors, setEditErrors] = useState<EditErrors>({});

   useEffect(() => {
      if (isAddingNew) {
         setEditDraft({
            date: '',
            description: '',
            amount: '',
            category: 'Non classé',
         });
         setEditErrors({});
      }
   }, [isAddingNew]);

   const importMap = Object.fromEntries(
      imports.map((imp) => [imp.id, imp.filename]),
   );

   // If another row is being edited, try to auto-save it first
   function startEdit(transaction: Transaction) {
      if (isAddingNew) {
         if (editDraft && (editDraft.date || editDraft.amount)) {
            // Draft has data — validate and try to save
            const errors = validateDraft(editDraft);
            if (Object.keys(errors).length > 0) {
               setEditErrors(errors);
               return;
            }
            // Valid — save the new row
            onAddTransaction({
               id: crypto.randomUUID(),
               date: editDraft.date,
               description: editDraft.description,
               amount: parseFloat(editDraft.amount),
               category: editDraft.category,
               importId: 'manual',
               bankName: '',
               bankCategory: '',
            });
         }
         // Whether saved or empty — close the new row
         setEditDraft(null);
         setEditErrors({});
         onCancelAdd();
      }

      if (editingId && editingId !== transaction.id) {
         if (!trySaveCurrentEdit()) return;
      }

      setPendingDeleteId(null);
      setEditingId(transaction.id);
      setEditDraft({
         date: transaction.date,
         description: transaction.description,
         amount: String(transaction.amount),
         category: transaction.category,
      });
      setEditErrors({});
   }

   function trySaveCurrentEdit(): boolean {
      if (!editingId || !editDraft) return true;
      const errors = validateDraft(editDraft);
      if (Object.keys(errors).length > 0) {
         setEditErrors(errors);
         return false;
      }
      onEditTransaction(editingId, {
         date: editDraft.date,
         description: editDraft.description,
         amount: parseFloat(editDraft.amount),
         category: editDraft.category,
      });
      setEditingId(null);
      setEditDraft(null);
      setEditErrors({});
      return true;
   }

   if (transactions.length === 0) {
      return (
         <p className="text-my-gray text-sm text-center mt-6">
            Aucune transaction pour le moment.
         </p>
      );
   }

   function handleConfirmDelete(id: string) {
      onDeleteTransaction(id);
      setPendingDeleteId(null);
   }

   function handleCancelEdit() {
      setEditingId(null);
      setEditDraft(null);
      setEditErrors({});
   }

   return (
      <div>
         {/* Toggles */}
         <div className="flex flex-wrap justify-end gap-2 mb-2">
            <button
               onClick={() => setShowBankCategory((prev) => !prev)}
               className="text-xs text-my-gray border border-my-border-gray rounded px-3 py-1 hover:bg-my-bg-gray transition-colors"
            >
               {showBankCategory ? 'Masquer' : 'Afficher'} catégorie d'origine
            </button>
            <button
               onClick={() => setShowSourceFile((prev) => !prev)}
               className="text-xs text-my-gray border border-my-border-gray rounded px-3 py-1 hover:bg-my-bg-gray transition-colors"
            >
               {showSourceFile ? 'Masquer' : 'Afficher'} fichier d'origine
            </button>
         </div>

         <div className="overflow-x-auto w-full">
            <table className="min-w-175 w-full text-sm border-collapse">
               <thead>
                  <tr className="bg-my-bg-gray text-left text-my-gray uppercase text-xs tracking-wide">
                     <th className="px-2 py-2">Date</th>
                     <th className="px-2 py-2">Description</th>
                     <th className="px-2 py-2 text-right">Montant</th>
                     {showBankCategory && (
                        <th className="px-2 py-2">Catégorie d'origine</th>
                     )}
                     <th className="px-2 py-2 text-center">Catégorie</th>
                     <th className="px-2 py-2">Banque</th>
                     {showSourceFile && (
                        <th className="px-2 py-2">Fichier d'origine</th>
                     )}
                     <th className="px-2 py-2"></th>
                  </tr>
               </thead>
               <tbody>
                  {/* New row */}
                  {/* New row */}
                  {isAddingNew && editDraft && (
                     <tr className="border-t border-my-border-gray bg-my-bg-light-gray">
                        {/* Date */}
                        <td className="px-2 py-1">
                           <div className="flex flex-col">
                              <input
                                 type="date"
                                 value={editDraft.date}
                                 onChange={(e) => {
                                    setEditDraft((d) =>
                                       d ? { ...d, date: e.target.value } : d,
                                    );
                                    setEditErrors((err) => ({
                                       ...err,
                                       date: undefined,
                                    }));
                                 }}
                                 className={`text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-my-blue w-36 ${
                                    editErrors.date
                                       ? 'border-my-red'
                                       : 'border-my-border-gray'
                                 }`}
                              />
                              {editErrors.date && (
                                 <span className="text-xs text-my-red mt-0.5">
                                    {editErrors.date}
                                 </span>
                              )}
                           </div>
                        </td>
                        {/* Description */}
                        <td className="px-2 py-1">
                           <input
                              type="text"
                              value={editDraft.description}
                              onChange={(e) =>
                                 setEditDraft((d) =>
                                    d
                                       ? { ...d, description: e.target.value }
                                       : d,
                                 )
                              }
                              placeholder="Description"
                              className="text-sm border border-my-border-gray rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-my-blue w-full"
                           />
                        </td>
                        {/* Amount */}
                        <td className="px-2 py-1">
                           <div className="flex flex-col items-end">
                              <input
                                 type="number"
                                 value={editDraft.amount}
                                 onChange={(e) => {
                                    setEditDraft((d) =>
                                       d ? { ...d, amount: e.target.value } : d,
                                    );
                                    setEditErrors((err) => ({
                                       ...err,
                                       amount: undefined,
                                    }));
                                 }}
                                 placeholder="0.00"
                                 className={`text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-my-blue w-28 text-right ${
                                    editErrors.amount
                                       ? 'border-my-red'
                                       : 'border-my-border-gray'
                                 }`}
                              />
                              {editErrors.amount && (
                                 <span className="text-xs text-my-red mt-0.5">
                                    {editErrors.amount}
                                 </span>
                              )}
                           </div>
                        </td>
                        {/* Bank category — empty for manual */}
                        {showBankCategory && (
                           <td className="px-2 py-1 text-my-gray">—</td>
                        )}
                        {/* Category */}
                        <td className="px-2 py-1 text-center">
                           <select
                              value={editDraft.category}
                              onChange={(e) =>
                                 setEditDraft((d) =>
                                    d
                                       ? {
                                            ...d,
                                            category: e.target
                                               .value as Category,
                                         }
                                       : d,
                                 )
                              }
                              className="text-sm border border-my-border-gray rounded px-2 py-1 bg-white text-my-gray focus:outline-none focus:ring-2 focus:ring-my-blue"
                           >
                              {CATEGORIES.map((cat) => (
                                 <option key={cat} value={cat}>
                                    {cat}
                                 </option>
                              ))}
                           </select>
                        </td>
                        {/* Bank name — empty for manual */}
                        <td className="px-2 py-1 text-my-gray">—</td>
                        {/* Source file — empty for manual */}
                        {showSourceFile && (
                           <td className="px-2 py-1 text-my-gray text-xs">—</td>
                        )}
                        {/* Actions */}
                        <td className="px-2 py-1 whitespace-nowrap">
                           <div className="flex items-center justify-end gap-1">
                              {/* Save */}
                              <button
                                 onClick={() => {
                                    const errors = validateDraft(editDraft);
                                    if (Object.keys(errors).length > 0) {
                                       setEditErrors(errors);
                                       return;
                                    }
                                    onAddTransaction({
                                       id: crypto.randomUUID(),
                                       date: editDraft.date,
                                       description: editDraft.description,
                                       amount: parseFloat(editDraft.amount),
                                       category: editDraft.category,
                                       importId: 'manual',
                                       bankName: '',
                                       bankCategory: '',
                                    });
                                    setEditDraft(null);
                                    setEditErrors({});
                                 }}
                                 className="text-my-green hover:opacity-70 transition-opacity p-1 rounded"
                                 title="Save"
                              >
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       d="M4.5 12.75l6 6 9-13.5"
                                    />
                                 </svg>
                              </button>
                              {/* Cancel */}
                              <button
                                 onClick={() => {
                                    setEditDraft(null);
                                    setEditErrors({});
                                    onCancelAdd();
                                 }}
                                 className="text-my-gray hover:text-my-red transition-colors p-1 rounded"
                                 title="Cancel"
                              >
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       d="M6 18L18 6M6 6l12 12"
                                    />
                                 </svg>
                              </button>
                           </div>
                        </td>
                     </tr>
                  )}
                  {transactions.map((transaction) => {
                     const isEditing = editingId === transaction.id;
                     const isDeleting = pendingDeleteId === transaction.id;
                     const amountClass =
                        transaction.amount >= 0
                           ? 'text-my-green font-medium'
                           : 'text-my-red font-medium';

                     if (isEditing && editDraft) {
                        // ── Edit row ──
                        return (
                           <tr
                              key={transaction.id}
                              className="border-t border-my-border-gray bg-my-bg-light-gray"
                           >
                              {/* Date */}
                              <td className="px-2 py-1">
                                 <div className="flex flex-col">
                                    <input
                                       type="date"
                                       value={editDraft.date}
                                       onChange={(e) => {
                                          setEditDraft((d) =>
                                             d
                                                ? {
                                                     ...d,
                                                     date: e.target.value,
                                                  }
                                                : d,
                                          );
                                          setEditErrors((err) => ({
                                             ...err,
                                             date: undefined,
                                          }));
                                       }}
                                       className={`text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-my-blue w-36 ${
                                          editErrors.date
                                             ? 'border-my-red'
                                             : 'border-my-border-gray'
                                       }`}
                                    />
                                    {editErrors.date && (
                                       <span className="text-xs text-my-red mt-0.5">
                                          {editErrors.date}
                                       </span>
                                    )}
                                 </div>
                              </td>
                              {/* Description */}
                              <td className="px-2 py-1">
                                 <input
                                    type="text"
                                    value={editDraft.description}
                                    onChange={(e) =>
                                       setEditDraft((d) =>
                                          d
                                             ? {
                                                  ...d,
                                                  description: e.target.value,
                                               }
                                             : d,
                                       )
                                    }
                                    className="text-sm border border-my-border-gray rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-my-blue w-full"
                                 />
                              </td>
                              {/* Amount */}
                              <td className="px-2 py-1">
                                 <div className="flex flex-col items-end">
                                    <input
                                       type="number"
                                       value={editDraft.amount}
                                       onChange={(e) => {
                                          setEditDraft((d) =>
                                             d
                                                ? {
                                                     ...d,
                                                     amount: e.target.value,
                                                  }
                                                : d,
                                          );
                                          setEditErrors((err) => ({
                                             ...err,
                                             amount: undefined,
                                          }));
                                       }}
                                       className={`text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-my-blue w-28 text-right ${
                                          editErrors.amount
                                             ? 'border-my-red'
                                             : 'border-my-border-gray'
                                       }`}
                                    />
                                    {editErrors.amount && (
                                       <span className="text-xs text-my-red mt-0.5">
                                          {editErrors.amount}
                                       </span>
                                    )}
                                 </div>
                              </td>
                              {/* Bank category — read only */}
                              {showBankCategory && (
                                 <td className="px-2 py-1 text-my-gray">
                                    {transaction.bankCategory || '—'}
                                 </td>
                              )}
                              {/* Category */}
                              <td className="px-2 py-1 text-center">
                                 <select
                                    value={editDraft.category}
                                    onChange={(e) =>
                                       setEditDraft((d) =>
                                          d
                                             ? {
                                                  ...d,
                                                  category: e.target
                                                     .value as Category,
                                               }
                                             : d,
                                       )
                                    }
                                    className="text-sm border border-my-border-gray rounded px-2 py-1 bg-white text-my-gray focus:outline-none focus:ring-2 focus:ring-my-blue"
                                 >
                                    {CATEGORIES.map((cat) => (
                                       <option key={cat} value={cat}>
                                          {cat}
                                       </option>
                                    ))}
                                 </select>
                              </td>
                              {/* Bank name — read only */}
                              <td className="px-2 py-1 text-my-gray whitespace-nowrap">
                                 {transaction.bankName}
                              </td>
                              {/* Source file — read only */}
                              {showSourceFile && (
                                 <td className="px-2 py-1 text-my-gray text-xs whitespace-nowrap">
                                    {importMap[transaction.importId] ?? '—'}
                                 </td>
                              )}
                              {/* Actions */}
                              <td className="px-2 py-1 whitespace-nowrap">
                                 <div className="flex items-center justify-end gap-1">
                                    {/* Save */}
                                    <button
                                       onClick={trySaveCurrentEdit}
                                       className="text-my-green hover:opacity-70 transition-opacity p-1 rounded"
                                       title="Save"
                                    >
                                       <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="w-4 h-4"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth={2}
                                          stroke="currentColor"
                                       >
                                          <path
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             d="M4.5 12.75l6 6 9-13.5"
                                          />
                                       </svg>
                                    </button>
                                    {/* Cancel */}
                                    <button
                                       onClick={handleCancelEdit}
                                       className="text-my-gray hover:text-my-red transition-colors p-1 rounded"
                                       title="Cancel"
                                    >
                                       <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="w-4 h-4"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth={2}
                                          stroke="currentColor"
                                       >
                                          <path
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             d="M6 18L18 6M6 6l12 12"
                                          />
                                       </svg>
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        );
                     }

                     // ── Display row ──
                     return (
                        <tr
                           key={transaction.id}
                           className="border-t border-my-border-gray hover:bg-my-bg-light-gray"
                        >
                           <td className="px-2 py-1 text-my-gray whitespace-nowrap">
                              {transaction.date}
                              {transaction.edited && (
                                 <span
                                    className="ml-1 text-my-blue"
                                    title="Edited"
                                 >
                                    ✎
                                 </span>
                              )}
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
                           {/* Actions */}
                           <td className="px-2 py-1 whitespace-nowrap">
                              <div className="relative flex items-center justify-end gap-1">
                                 {/* Edit icon */}
                                 <button
                                    onClick={() => startEdit(transaction)}
                                    className="text-my-gray hover:text-my-blue transition-colors p-1 rounded"
                                    title="Edit transaction"
                                 >
                                    <svg
                                       xmlns="http://www.w3.org/2000/svg"
                                       className="w-4 h-4"
                                       fill="none"
                                       viewBox="0 0 24 24"
                                       strokeWidth={1.5}
                                       stroke="currentColor"
                                    >
                                       <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
                                       />
                                    </svg>
                                 </button>
                                 {/* Delete icon */}
                                 <button
                                    onClick={() =>
                                       setPendingDeleteId(
                                          isDeleting ? null : transaction.id,
                                       )
                                    }
                                    className="text-my-gray hover:text-my-red transition-colors p-1 rounded"
                                    title="Delete transaction"
                                 >
                                    <svg
                                       xmlns="http://www.w3.org/2000/svg"
                                       className="w-4 h-4"
                                       fill="none"
                                       viewBox="0 0 24 24"
                                       strokeWidth={1.5}
                                       stroke="currentColor"
                                    >
                                       <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                       />
                                    </svg>
                                 </button>
                                 {/* Delete popover */}
                                 {isDeleting && (
                                    <div className="absolute right-0 top-7 bg-white border border-my-border-gray rounded-lg shadow-lg z-20 p-3 w-48">
                                       <p className="text-sm text-gray-700 mb-3">
                                          Delete this transaction?
                                       </p>
                                       <div className="flex gap-2">
                                          <button
                                             onClick={() =>
                                                handleConfirmDelete(
                                                   transaction.id,
                                                )
                                             }
                                             className="flex-1 px-2 py-1 bg-my-red text-white text-xs rounded hover:opacity-90 transition-opacity"
                                          >
                                             Confirm
                                          </button>
                                          <button
                                             onClick={() =>
                                                setPendingDeleteId(null)
                                             }
                                             className="flex-1 px-2 py-1 border border-my-border-gray text-my-gray text-xs rounded hover:border-gray-400 transition-colors"
                                          >
                                             Cancel
                                          </button>
                                       </div>
                                    </div>
                                 )}
                              </div>
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </div>
   );
}
