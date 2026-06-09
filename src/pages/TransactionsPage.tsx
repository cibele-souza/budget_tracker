import TransactionTable from '../components/TransactionTable';
import type { Transaction, Category, Import } from '../types';

interface TransactionsPageProps {
   transactions: Transaction[];
   imports: Import[];
   onTransactionsChange: (updated: Transaction[]) => void;
}

export default function TransactionsPage({
   transactions,
   imports,
   onTransactionsChange,
}: TransactionsPageProps) {
   function handleCategoryChange(id: string, newCategory: Category) {
      onTransactionsChange(
         transactions.map((t) =>
            t.id === id ? { ...t, category: newCategory } : t,
         ),
      );
   }

   return (
      <div>
         <h1 className="text-2xl font-semibold mb-6">Transactions</h1>
         <TransactionTable
            transactions={transactions}
            imports={imports}
            onCategoryChange={handleCategoryChange}
         />
      </div>
   );
}
