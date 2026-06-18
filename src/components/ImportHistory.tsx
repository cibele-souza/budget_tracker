import type { Import } from '../types';

interface ImportHistoryProps {
   imports: Import[];
}

function formatDate(isoString: string): string {
   return new Date(isoString).toLocaleString();
}

export default function ImportHistory({ imports }: ImportHistoryProps) {
   if (imports.length === 0) {
      return (
         <div className="w-full max-w-lg mx-auto mt-8 text-center">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">
               Import History
            </p>
            <p className="text-gray-400 text-sm">
               No imports yet. Upload a file above to get started.
            </p>
         </div>
      );
   }

   return (
      <div className="w-full max-w-lg mx-auto mt-8">
         <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Import History
         </h2>
         <ul className="space-y-2">
            {imports.map((imp) => (
               <li
                  key={imp.id}
                  className="flex flex-col gap-1 bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm"
               >
                  <div className="flex justify-between items-center">
                     <span className="font-medium text-gray-800">
                        {imp.filename}
                     </span>
                     <span className="text-gray-400 text-xs">
                        {formatDate(imp.uploadedAt)}
                     </span>
                  </div>
                  <div className="flex gap-4 text-gray-500 text-xs">
                     <span>{imp.bankName}</span>
                     <span>{imp.transactionCount} transactions</span>
                     <span>
                        {imp.initialDate} → {imp.finalDate}
                     </span>
                  </div>
               </li>
            ))}
         </ul>
      </div>
   );
}
