import { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopNav from './components/TopNav';
import DriveModal from './components/DriveModal';
import UploadPage from './pages/UploadPage';
import TransactionsPage from './pages/TransactionsPage';
import BudgetPage from './pages/BudgetPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import type {
   Transaction,
   Import,
   Budget,
   BudgetTrackSnapshot,
   Category,
   ClassificationRule,
} from './types';
import {
   loadTransactions,
   loadBudgets,
   loadImports,
   loadRules,
   saveTransactions,
   saveBudgets,
   saveImports,
   saveRules,
   checkStorageHealth,
} from './utils/storage';
import {
   isConnectedToDrive,
   connectToDrive,
   loadSnapshotFromDrive,
   saveSnapshotToDrive,
} from './utils/googleDrive';
import { DEFAULT_RULES } from './utils/classificationRules';

type DriveModalState =
   | { case: 'notConnected' }
   | { case: 'noFile' }
   | { case: 'fileFound'; snapshot: BudgetTrackSnapshot }
   | null;

export default function App() {
   const [transactions, setTransactions] =
      useState<Transaction[]>(loadTransactions);
   const [budgets, setBudgets] = useState<Budget[]>(loadBudgets);
   const [imports, setImports] = useState<Import[]>(loadImports);
   const [driveModalState, setDriveModalState] =
      useState<DriveModalState>(null);
   const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
   const [txYears, setTxYears] = useState<string[]>([]);
   const [txMonths, setTxMonths] = useState<number[]>([]);
   const [txCategories, setTxCategories] = useState<Category[]>([]);
   const [txSearch, setTxSearch] = useState('');
   const [rules, setRules] = useState<ClassificationRule[]>(loadRules);

   const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

   // localStorage sync
   useEffect(() => {
      saveTransactions(transactions);
   }, [transactions]);
   useEffect(() => {
      saveBudgets(budgets);
   }, [budgets]);
   useEffect(() => {
      saveImports(imports);
   }, [imports]);
   useEffect(() => {
      saveRules(rules);
   }, [rules]);

   // Drive auto-save
   const saveToDrive = useCallback(() => {
      if (!isConnectedToDrive()) return;

      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(async () => {
         try {
            const snapshot: BudgetTrackSnapshot = {
               meta: {
                  schemaVersion: 1,
                  source: 'budgettrack',
                  exportedAt: new Date().toISOString(),
                  counts: {
                     transactions: transactions.length,
                     budgets: budgets.length,
                     imports: imports.length,
                     rules: rules.length,
                  },
               },
               data: { transactions, budgets, imports, rules },
            };
            await saveSnapshotToDrive(snapshot);
            setLastSyncedAt(new Date().toISOString());
         } catch (err) {
            console.error('Drive auto-save failed:', err);
         }
      }, 2000);
   }, [transactions, budgets, imports]);

   useEffect(() => {
      saveToDrive();
   }, [saveToDrive]);

   // On app load: check Drive status
   useEffect(() => {
      if (!isConnectedToDrive()) {
         setDriveModalState({ case: 'notConnected' });
         return;
      }
      checkDriveForBackup();
   }, []);

   async function checkDriveForBackup() {
      try {
         const snapshot = await loadSnapshotFromDrive();
         if (!snapshot) {
            setDriveModalState({ case: 'noFile' });
         } else {
            setDriveModalState({ case: 'fileFound', snapshot });
         }
      } catch (err) {
         console.error('Failed to check Drive for backup:', err);
         setDriveModalState(null);
      }
   }

   async function handleModalConnect() {
      try {
         await connectToDrive();
         await checkDriveForBackup();
      } catch (err) {
         console.error('Failed to connect to Drive:', err);
         setDriveModalState(null);
      }
   }

   function handleRestore(snapshot: BudgetTrackSnapshot) {
      setTransactions(snapshot.data.transactions);
      setBudgets(snapshot.data.budgets);
      setImports(snapshot.data.imports);
      setRules(snapshot.data.rules ?? DEFAULT_RULES);
   }

   function handleLoadFromDrive(snapshot: BudgetTrackSnapshot) {
      handleRestore(snapshot);
      setDriveModalState(null);
   }

   const storageError = checkStorageHealth();

   async function handleManualSave(): Promise<void> {
      const snapshot: BudgetTrackSnapshot = {
         meta: {
            schemaVersion: 1,
            source: 'budgettrack',
            exportedAt: new Date().toISOString(),
            counts: {
               transactions: transactions.length,
               budgets: budgets.length,
               imports: imports.length,
               rules: rules.length,
            },
         },
         data: { transactions, budgets, imports, rules },
      };
      await saveSnapshotToDrive(snapshot);
      setLastSyncedAt(new Date().toISOString());
   }

   function handleDeleteTransaction(id: string) {
      const transaction = transactions.find((t) => t.id === id);
      if (!transaction) return;

      setTransactions((prev) => prev.filter((t) => t.id !== id));

      if (transaction.importId !== 'manual') {
         setImports((prev) =>
            prev.map((imp) =>
               imp.id === transaction.importId
                  ? {
                       ...imp,
                       transactionCount: Math.max(0, imp.transactionCount - 1),
                    }
                  : imp,
            ),
         );
      }
   }

   function handleEditTransaction(id: string, updated: Partial<Transaction>) {
      setTransactions((prev) =>
         prev.map((t) =>
            t.id === id ? { ...t, ...updated, edited: true } : t,
         ),
      );
   }

   function handleAddTransaction(transaction: Transaction) {
      setTransactions((prev) => [{ ...transaction, edited: true }, ...prev]);
   }

   return (
      <BrowserRouter>
         <div className="min-h-screen bg-my-bg-light-gray">
            <TopNav />
            <main className="max-w-7xl mx-auto py-8 px-6">
               {storageError && (
                  <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                     {storageError}
                  </div>
               )}
               <Routes>
                  <Route
                     path="/upload"
                     element={
                        <UploadPage
                           imports={imports}
                           onImportComplete={(newTransactions, newImport) => {
                              setTransactions((prev) => [
                                 ...prev,
                                 ...newTransactions,
                              ]);
                              setImports((prev) => [...prev, newImport]);
                           }}
                           rules={rules}
                        />
                     }
                  />
                  <Route
                     path="/transactions"
                     element={
                        <TransactionsPage
                           transactions={transactions}
                           imports={imports}
                           onTransactionsChange={setTransactions}
                           onDeleteTransaction={handleDeleteTransaction}
                           onEditTransaction={handleEditTransaction}
                           onAddTransaction={handleAddTransaction}
                           txYears={txYears}
                           txMonths={txMonths}
                           txCategories={txCategories}
                           txSearch={txSearch}
                           onTxYearsChange={setTxYears}
                           onTxMonthsChange={setTxMonths}
                           onTxCategoriesChange={setTxCategories}
                           onTxSearchChange={setTxSearch}
                        />
                     }
                  />
                  <Route
                     path="/budget"
                     element={
                        <BudgetPage
                           budgets={budgets}
                           transactions={transactions}
                           onBudgetsChange={setBudgets}
                        />
                     }
                  />
                  <Route
                     path="/"
                     element={
                        <DashboardPage
                           transactions={transactions}
                           budgets={budgets}
                        />
                     }
                  />
                  <Route
                     path="/settings"
                     element={
                        <SettingsPage
                           transactions={transactions}
                           budgets={budgets}
                           imports={imports}
                           onRestore={handleRestore}
                           lastSyncedAt={lastSyncedAt}
                           onManualSave={handleManualSave}
                           rules={rules}
                           onRulesChange={setRules}
                        />
                     }
                  />
               </Routes>
            </main>

            {driveModalState && (
               <DriveModal
                  state={driveModalState}
                  onConnect={handleModalConnect}
                  onContinueLocally={() => setDriveModalState(null)}
                  onLoadFromDrive={handleLoadFromDrive}
                  onKeepLocal={() => setDriveModalState(null)}
                  onDismiss={() => setDriveModalState(null)}
               />
            )}
         </div>
      </BrowserRouter>
   );
}
