interface DefaultValueInputProps {
   value: number;
   onChange: (value: number) => void;
   rowIndex: number;
   totalRows: number;
}

export default function DefaultValueInput({
   value,
   onChange,
   rowIndex,
   totalRows,
}: DefaultValueInputProps) {
   function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      if (!['ArrowDown', 'ArrowUp'].includes(e.key)) return;
      e.preventDefault();

      const targetRow =
         e.key === 'ArrowDown'
            ? Math.min(rowIndex + 1, totalRows - 1)
            : Math.max(rowIndex - 1, 0);

      const target = document.querySelector<HTMLInputElement>(
         `input[data-default-row="${targetRow}"]`,
      );
      target?.focus();
   }

   return (
      <input
         type="number"
         min={0}
         value={value === 0 ? '' : value}
         placeholder="0"
         data-default-row={rowIndex}
         onKeyDown={handleKeyDown}
         onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
         className="w-14 text-xs border border-my-border-gray rounded px-1 py-1 bg-white text-my-gray hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-my-blue text-right"
      />
   );
}
