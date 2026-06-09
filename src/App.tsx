import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopNav from './components/TopNav';
import UploadPage from './pages/UploadPage';
import TransactionsPage from './pages/TransactionsPage';
import BudgetPage from './pages/BudgetPage';
import DashboardPage from './pages/DashboardPage';
import type { Transaction, Import } from './types';

export default function App() {
   const [transactions, setTransactions] = useState<Transaction[]>([]);
   const [imports, setImports] = useState<Import[]>([]);

   return (
      <BrowserRouter>
         <div className="min-h-screen bg-gray-50">
            <TopNav />
            <main className="max-w-5xl mx-auto py-8 px-4">
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
                  <Route path="/budget" element={<BudgetPage />} />
                  <Route path="/" element={<DashboardPage />} />
               </Routes>
            </main>
         </div>
      </BrowserRouter>
   );
}
