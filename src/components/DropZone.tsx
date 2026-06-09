import { useState, useRef } from 'react';

interface DropZoneProps {
   onFileParsed: (file: File) => Promise<void>;
}

export default function DropZone({ onFileParsed }: DropZoneProps) {
   const [isDragging, setIsDragging] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [success, setSuccess] = useState<string | null>(null);
   const inputRef = useRef<HTMLInputElement>(null);

   const ACCEPTED = ['.csv', '.xls', '.xlsx'];

   function validateFile(file: File): string | null {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!ACCEPTED.includes(ext)) {
         return `Unsupported file type: ${ext}. Please upload a CSV or XLS file.`;
      }
      return null;
   }

   async function handleFile(file: File) {
      setError(null);
      setSuccess(null);

      const validationError = validateFile(file);
      if (validationError) {
         setError(validationError);
         return;
      }

      setIsLoading(true);
      try {
         await onFileParsed(file);
         setSuccess(`"${file.name}" imported successfully.`);
      } catch (err) {
         setError(`Failed to import "${file.name}": ${err}`);
      } finally {
         setIsLoading(false);
         // Reset the file input so the same file can be re-uploaded if needed
         if (inputRef.current) inputRef.current.value = '';
      }
   }

   function onDragOver(e: React.DragEvent) {
      e.preventDefault();
      setIsDragging(true);
   }

   function onDragLeave() {
      setIsDragging(false);
   }

   function onDrop(e: React.DragEvent) {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
   }

   function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
   }

   return (
      <div className="w-full max-w-lg mx-auto">
         <div
            onClick={() => inputRef.current?.click()}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`
          border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-colors duration-200
          ${
             isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
          ${isLoading ? 'pointer-events-none opacity-60' : ''}
        `}
         >
            <input
               ref={inputRef}
               type="file"
               accept=".csv,.xls,.xlsx"
               onChange={onInputChange}
               className="hidden"
            />

            {isLoading ? (
               <p className="text-gray-500 text-sm">Importing...</p>
            ) : (
               <>
                  <p className="text-gray-600 font-medium">
                     Drop your bank export here
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                     or click to browse — CSV, XLS, XLSX
                  </p>
               </>
            )}
         </div>

         {error && (
            <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
         )}
         {success && (
            <p className="mt-3 text-sm text-green-600 text-center">{success}</p>
         )}
      </div>
   );
}
