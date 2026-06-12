interface MonthValueInputProps {
   monthKey: string; // e.g. "2025-01"
   defaultValue: number;
   overrideValue: number | undefined;
   onChange: (monthKey: string, value: number | undefined) => void;
}

export default function MonthValueInput({
   monthKey,
   defaultValue,
   overrideValue,
   onChange,
}: MonthValueInputProps) {
   const hasOverride = overrideValue !== undefined;

   return (
      <input
         type="number"
         min={0}
         value={hasOverride ? overrideValue : ''}
         placeholder={defaultValue > 0 ? String(defaultValue) : '0'}
         onChange={(e) => {
            const raw = e.target.value;
            // If the user clears the input, remove the override entirely
            onChange(monthKey, raw === '' ? undefined : parseFloat(raw) || 0);
         }}
         className={`
        w-14 text-xs border rounded px-1 py-1 bg-white text-right
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
