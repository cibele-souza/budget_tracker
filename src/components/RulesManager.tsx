import { useState } from 'react';
import { CATEGORIES } from '../types';
import type { Category, ClassificationRule } from '../types';
import { DEFAULT_RULES } from '../utils/classificationRules';
import UnsavedChangesModal from './UnsavedChangesModal';

interface RulesManagerProps {
   rules: ClassificationRule[];
   onSave: (rules: ClassificationRule[]) => void;
   onBack: () => void;
}

interface RuleDraft {
   keyword: string;
   category: Category;
   matchField: 'description' | 'bankCategory';
}

interface RuleErrors {
   keyword?: string;
}

function validateRuleDraft(draft: RuleDraft): RuleErrors {
   const errors: RuleErrors = {};
   if (!draft.keyword.trim()) errors.keyword = 'Required';
   return errors;
}

export default function RulesManager({
   rules,
   onSave,
   onBack,
}: RulesManagerProps) {
   const [draft, setDraft] = useState<ClassificationRule[]>(rules);
   const [editingId, setEditingId] = useState<string | null>(null);
   const [editDraft, setEditDraft] = useState<RuleDraft | null>(null);
   const [editErrors, setEditErrors] = useState<RuleErrors>({});
   const [isAddingNew, setIsAddingNew] = useState(false);
   const [newDraft, setNewDraft] = useState<RuleDraft>({
      keyword: '',
      category: 'Non classé',
      matchField: 'description',
   });
   const [newErrors, setNewErrors] = useState<RuleErrors>({});
   const [showUnsavedModal, setShowUnsavedModal] = useState(false);

   const hasChanges = JSON.stringify(draft) !== JSON.stringify(rules);

   // ── Edit helpers ──────────────────────────────────────────────────────────

   function trySaveCurrentEdit(): boolean {
      if (!editingId || !editDraft) return true;
      const errors = validateRuleDraft(editDraft);
      if (Object.keys(errors).length > 0) {
         setEditErrors(errors);
         return false;
      }
      setDraft((prev) =>
         prev.map((r) =>
            r.id === editingId
               ? { ...r, ...editDraft, keyword: editDraft.keyword.trim() }
               : r,
         ),
      );
      setEditingId(null);
      setEditDraft(null);
      setEditErrors({});
      return true;
   }

   function startEdit(rule: ClassificationRule) {
      // If adding new row, try to save it first
      if (isAddingNew) {
         const errors = validateRuleDraft(newDraft);
         if (newDraft.keyword.trim() && Object.keys(errors).length > 0) {
            setNewErrors(errors);
            return;
         }
         if (newDraft.keyword.trim()) {
            saveNewRow();
         } else {
            setIsAddingNew(false);
            setNewDraft({
               keyword: '',
               category: 'Non classé',
               matchField: 'description',
            });
            setNewErrors({});
         }
      }
      // If another row is being edited, try to auto-save it
      if (editingId && editingId !== rule.id) {
         if (!trySaveCurrentEdit()) return;
      }
      setEditingId(rule.id);
      setEditDraft({
         keyword: rule.keyword,
         category: rule.category,
         matchField: rule.matchField,
      });
      setEditErrors({});
   }

   function handleCancelEdit() {
      setEditingId(null);
      setEditDraft(null);
      setEditErrors({});
   }

   // ── New row helpers ───────────────────────────────────────────────────────

   function saveNewRow() {
      const errors = validateRuleDraft(newDraft);
      if (Object.keys(errors).length > 0) {
         setNewErrors(errors);
         return;
      }
      setDraft((prev) => [
         {
            id: crypto.randomUUID(),
            keyword: newDraft.keyword.trim(),
            category: newDraft.category,
            matchField: newDraft.matchField,
            isDefault: false,
         },
         ...prev,
      ]);
      setIsAddingNew(false);
      setNewDraft({
         keyword: '',
         category: 'Non classé',
         matchField: 'description',
      });
      setNewErrors({});
   }

   function handleCancelNewRow() {
      setIsAddingNew(false);
      setNewDraft({
         keyword: '',
         category: 'Non classé',
         matchField: 'description',
      });
      setNewErrors({});
   }

   function handleAddNewClick() {
      if (editingId) {
         if (!trySaveCurrentEdit()) return;
      }
      setIsAddingNew(true);
   }

   // ── Delete ────────────────────────────────────────────────────────────────

   function handleDelete(id: string) {
      setDraft((prev) => prev.filter((r) => r.id !== id));
      if (editingId === id) {
         setEditingId(null);
         setEditDraft(null);
         setEditErrors({});
      }
   }

   // ── Reset to defaults ─────────────────────────────────────────────────────

   function handleResetToDefaults() {
      setDraft(DEFAULT_RULES);
      setEditingId(null);
      setEditDraft(null);
      setEditErrors({});
      setIsAddingNew(false);
   }

   // ── Save ──────────────────────────────────────────────────────────────────

   function handleSave() {
      if (editingId) {
         if (!trySaveCurrentEdit()) return;
      }
      if (isAddingNew && newDraft.keyword.trim()) {
         saveNewRow();
      }
      onSave(draft);
   }

   // ── Back ─────────────────────────────────────────────────────────────────

   function handleBack() {
      if (hasChanges) {
         setShowUnsavedModal(true);
      } else {
         onBack();
      }
   }

   // ── Shared input classes ──────────────────────────────────────────────────

   const inputClass = (error?: string) =>
      `text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-my-blue ${
         error ? 'border-my-red' : 'border-my-border-gray'
      }`;

   return (
      <div className="max-w-4xl mx-auto px-4 py-8">
         {/* Header */}
         <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
               <button
                  onClick={handleBack}
                  className="text-my-gray hover:text-my-blue transition-colors"
                  title="Back to settings"
               >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     className="w-5 h-5"
                     fill="none"
                     viewBox="0 0 24 24"
                     strokeWidth={1.5}
                     stroke="currentColor"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5L8.25 12l7.5-7.5"
                     />
                  </svg>
               </button>
               <h1 className="text-2xl font-semibold">Classification Rules</h1>
            </div>
            <div className="flex gap-3">
               <button
                  onClick={handleResetToDefaults}
                  className="px-4 py-2 border border-my-border-gray text-my-gray rounded hover:border-my-red hover:text-my-red transition-colors text-sm"
               >
                  Reset to defaults
               </button>
               <button
                  onClick={handleSave}
                  className={`px-4 py-2 text-white rounded text-sm transition-opacity ${
                     hasChanges
                        ? 'bg-my-blue hover:opacity-90'
                        : 'bg-gray-300 cursor-not-allowed'
                  }`}
                  disabled={!hasChanges}
               >
                  Save rules
               </button>
            </div>
         </div>

         {/* Add rule button */}
         <div className="flex justify-end mb-3">
            <button
               onClick={handleAddNewClick}
               className="px-3 py-1.5 bg-my-blue text-white text-sm rounded hover:opacity-90 transition-opacity"
            >
               + Add rule
            </button>
         </div>

         {/* Rules count */}
         <p className="text-xs text-my-gray mb-3">{draft.length} rules</p>

         {/* Table */}
         <div className="overflow-x-auto w-full">
            <table className="w-full text-sm border-collapse">
               <thead>
                  <tr className="bg-my-bg-gray text-left text-my-gray uppercase text-xs tracking-wide">
                     <th className="px-2 py-2">Match field</th>
                     <th className="px-2 py-2">Keyword</th>
                     <th className="px-2 py-2">Category</th>
                     <th className="px-2 py-2 text-center">Default</th>
                     <th className="px-2 py-2"></th>
                  </tr>
               </thead>
               <tbody>
                  {/* New row */}
                  {isAddingNew && (
                     <tr className="border-t border-my-border-gray bg-my-bg-light-gray">
                        {/* Match field */}
                        <td className="px-2 py-1">
                           <select
                              value={newDraft.matchField}
                              onChange={(e) =>
                                 setNewDraft((d) => ({
                                    ...d,
                                    matchField: e.target.value as
                                       | 'description'
                                       | 'bankCategory',
                                 }))
                              }
                              className={inputClass()}
                           >
                              <option value="description">Description</option>
                              <option value="bankCategory">
                                 Bank category
                              </option>
                           </select>
                        </td>
                        {/* Keyword */}
                        <td className="px-2 py-1">
                           <div className="flex flex-col">
                              <input
                                 type="text"
                                 value={newDraft.keyword}
                                 onChange={(e) => {
                                    setNewDraft((d) => ({
                                       ...d,
                                       keyword: e.target.value,
                                    }));
                                    setNewErrors((err) => ({
                                       ...err,
                                       keyword: undefined,
                                    }));
                                 }}
                                 placeholder="e.g. netflix"
                                 className={inputClass(newErrors.keyword)}
                              />
                              {newErrors.keyword && (
                                 <span className="text-xs text-my-red mt-0.5">
                                    {newErrors.keyword}
                                 </span>
                              )}
                           </div>
                        </td>
                        {/* Category */}
                        <td className="px-2 py-1">
                           <select
                              value={newDraft.category}
                              onChange={(e) =>
                                 setNewDraft((d) => ({
                                    ...d,
                                    category: e.target.value as Category,
                                 }))
                              }
                              className={inputClass()}
                           >
                              {CATEGORIES.map((cat) => (
                                 <option key={cat} value={cat}>
                                    {cat}
                                 </option>
                              ))}
                           </select>
                        </td>
                        {/* Default badge — empty for new rules */}
                        <td className="px-2 py-1 text-center">—</td>
                        {/* Actions */}
                        <td className="px-2 py-1 whitespace-nowrap">
                           <div className="flex items-center justify-end gap-1">
                              <button
                                 onClick={saveNewRow}
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
                              <button
                                 onClick={handleCancelNewRow}
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

                  {/* Existing rows */}
                  {draft.map((rule) => {
                     const isEditing = editingId === rule.id;

                     if (isEditing && editDraft) {
                        return (
                           <tr
                              key={rule.id}
                              className="border-t border-my-border-gray bg-my-bg-light-gray"
                           >
                              {/* Match field */}
                              <td className="px-2 py-1">
                                 <select
                                    value={editDraft.matchField}
                                    onChange={(e) =>
                                       setEditDraft((d) =>
                                          d
                                             ? {
                                                  ...d,
                                                  matchField: e.target.value as
                                                     | 'description'
                                                     | 'bankCategory',
                                               }
                                             : d,
                                       )
                                    }
                                    className={inputClass()}
                                 >
                                    <option value="description">
                                       Description
                                    </option>
                                    <option value="bankCategory">
                                       Bank category
                                    </option>
                                 </select>
                              </td>
                              {/* Keyword */}
                              <td className="px-2 py-1">
                                 <div className="flex flex-col">
                                    <input
                                       type="text"
                                       value={editDraft.keyword}
                                       onChange={(e) => {
                                          setEditDraft((d) =>
                                             d
                                                ? {
                                                     ...d,
                                                     keyword: e.target.value,
                                                  }
                                                : d,
                                          );
                                          setEditErrors((err) => ({
                                             ...err,
                                             keyword: undefined,
                                          }));
                                       }}
                                       className={inputClass(
                                          editErrors.keyword,
                                       )}
                                    />
                                    {editErrors.keyword && (
                                       <span className="text-xs text-my-red mt-0.5">
                                          {editErrors.keyword}
                                       </span>
                                    )}
                                 </div>
                              </td>
                              {/* Category */}
                              <td className="px-2 py-1">
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
                                    className={inputClass()}
                                 >
                                    {CATEGORIES.map((cat) => (
                                       <option key={cat} value={cat}>
                                          {cat}
                                       </option>
                                    ))}
                                 </select>
                              </td>
                              {/* Default badge */}
                              <td className="px-2 py-1 text-center">
                                 {rule.isDefault && (
                                    <span
                                       className="text-xs text-my-gray"
                                       title="Default rule"
                                    >
                                       ⚙
                                    </span>
                                 )}
                              </td>
                              {/* Actions */}
                              <td className="px-2 py-1 whitespace-nowrap">
                                 <div className="flex items-center justify-end gap-1">
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

                     // Display row
                     return (
                        <tr
                           key={rule.id}
                           className="border-t border-my-border-gray hover:bg-my-bg-light-gray"
                        >
                           <td className="px-2 py-1">
                              <span
                                 className={`text-xs px-2 py-0.5 rounded-full ${
                                    rule.matchField === 'description'
                                       ? 'bg-blue-50 text-my-blue'
                                       : 'bg-gray-100 text-my-gray'
                                 }`}
                              >
                                 {rule.matchField === 'description'
                                    ? 'Description'
                                    : 'Bank category'}
                              </span>
                           </td>
                           <td className="px-2 py-1 text-gray-800">
                              {rule.keyword}
                           </td>
                           <td className="px-2 py-1 text-my-gray">
                              {rule.category}
                           </td>
                           <td className="px-2 py-1 text-center">
                              {rule.isDefault && (
                                 <span
                                    className="text-xs text-my-gray"
                                    title="Default rule"
                                 >
                                    ⚙
                                 </span>
                              )}
                           </td>
                           <td className="px-2 py-1 whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1">
                                 <button
                                    onClick={() => startEdit(rule)}
                                    className="text-my-gray hover:text-my-blue transition-colors p-1 rounded"
                                    title="Edit rule"
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
                                 <button
                                    onClick={() => handleDelete(rule.id)}
                                    className="text-my-gray hover:text-my-red transition-colors p-1 rounded"
                                    title="Delete rule"
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
                              </div>
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
         {showUnsavedModal && (
            <UnsavedChangesModal
               onSaveAndBack={() => {
                  onSave(draft);
                  onBack();
               }}
               onDiscardAndBack={() => {
                  onBack();
               }}
               onDismiss={() => setShowUnsavedModal(false)}
            />
         )}
      </div>
   );
}
