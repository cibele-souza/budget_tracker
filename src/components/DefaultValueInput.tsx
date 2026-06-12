interface DefaultValueInputProps {
   value: number;
   onChange: (value: number) => void;
}

export default function DefaultValueInput({
   value,
   onChange,
}: DefaultValueInputProps) {
   return (
      <input
         type="number"
         min={0}
         value={value === 0 ? '' : value}
         placeholder="0"
         onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
         className="w-16 text-xs border border-gray-200 rounded px-1 py-1 bg-white text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
      />
   );
}
