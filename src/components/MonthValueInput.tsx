interface MonthValueInputProps {
   monthKey: string;
   defaultValue: number;
   overrideValue: number | undefined;
   onChange: (monthKey: string, value: number | undefined) => void;
   rowIndex: number;
   colIndex: number;
   totalCols: number;
   totalRows: number;
}

export default function MonthValueInput({
   monthKey,
   defaultValue,
   overrideValue,
   onChange,
   rowIndex,
   colIndex,
   totalCols,
   totalRows,
}: MonthValueInputProps) {
   const hasOverride = overrideValue !== undefined;

   function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      if (
         !['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(
            e.key,
         )
      )
         return;
      e.preventDefault();

      let targetRow = rowIndex;
      let targetCol = colIndex;

      if (e.key === 'ArrowDown')
         targetRow = Math.min(rowIndex + 1, totalRows - 1);
      if (e.key === 'ArrowUp') targetRow = Math.max(rowIndex - 1, 0);
      if (e.key === 'ArrowRight' || e.key === 'Enter')
         targetCol = Math.min(colIndex + 1, totalCols - 1);
      if (e.key === 'ArrowLeft') targetCol = Math.max(colIndex - 1, 0);

      const target = document.querySelector<HTMLInputElement>(
         `input[data-row="${targetRow}"][data-col="${targetCol}"]`,
      );
      target?.focus();
   }

   return (
      <input
         type="number"
         min={0}
         value={hasOverride ? overrideValue : ''}
         placeholder={defaultValue > 0 ? String(defaultValue) : '0'}
         data-row={rowIndex}
         data-col={colIndex}
         onKeyDown={handleKeyDown}
         onChange={(e) => {
            const raw = e.target.value;
            onChange(monthKey, raw === '' ? undefined : parseFloat(raw) || 0);
         }}
         className={`
        w-12 text-xs border rounded px-1 py-1 bg-white text-right
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${
           hasOverride
              ? 'border-blue-300 text-blue-700'
              : 'border-gray-200 text-gray-400 hover:border-gray-400'
        }
      `}
      />
   );
}
