import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopNav from './components/TopNav';
import UploadPage from './pages/UploadPage';
import TransactionsPage from './pages/TransactionsPage';
import BudgetPage from './pages/BudgetPage';
import DashboardPage from './pages/DashboardPage';
import type { Transaction, Import, Budget } from './types';
import {
   loadTransactions,
   loadBudgets,
   loadImports,
   saveTransactions,
   saveBudgets,
   saveImports,
   checkStorageHealth,
} from './utils/storage';

export default function App() {
   const [transactions, setTransactions] =
      useState<Transaction[]>(loadTransactions);
   const [budgets, setBudgets] = useState<Budget[]>(loadBudgets);
   const [imports, setImports] = useState<Import[]>(loadImports);

   useEffect(() => {
      saveTransactions(transactions);
   }, [transactions]);
   useEffect(() => {
      saveBudgets(budgets);
   }, [budgets]);
   useEffect(() => {
      saveImports(imports);
   }, [imports]);

   const storageError = checkStorageHealth();

   return (
      <BrowserRouter>
         <div className="min-h-screen bg-gray-50">
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
               </Routes>
            </main>
         </div>
      </BrowserRouter>
   );
}
