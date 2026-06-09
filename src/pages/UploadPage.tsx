import { v4 as uuidv4 } from 'uuid';
import type { Transaction, Import } from '../types';
import { parseFile } from '../utils/parseFile';
import { normaliseBourso, normaliseHelloBank } from '../utils/normalise';
import DropZone from '../components/DropZone';
import ImportHistory from '../components/ImportHistory';

interface UploadPageProps {
   imports: Import[];
   onImportComplete: (transactions: Transaction[], newImport: Import) => void;
}

export default function UploadPage({
   imports,
   onImportComplete,
}: UploadPageProps) {
   async function handleFileParsed(file: File) {
      const importId = uuidv4();
      const { rows, bankName } = await parseFile(file);

      // Pick the right normaliser based on detected bank
      const transactions =
         bankName === 'BoursoBank'
            ? normaliseBourso(rows, importId)
            : normaliseHelloBank(rows, importId);

      if (transactions.length === 0) {
         throw new Error('No valid transactions found in this file.');
      }

      // Sort dates to find the range
      const dates = transactions.map((t) => t.date).sort();

      const newImport: Import = {
         id: importId,
         filename: file.name,
         uploadedAt: new Date().toISOString(),
         transactionCount: transactions.length,
         initialDate: dates[0],
         finalDate: dates[dates.length - 1],
         bankName,
      };

      onImportComplete(transactions, newImport);
   }

   return (
      <div className="flex flex-col items-center pt-6">
         <h1 className="text-2xl font-semibold mb-8">Upload</h1>
         <DropZone onFileParsed={handleFileParsed} />
         <ImportHistory imports={imports} />
      </div>
   );
}
