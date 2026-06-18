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
         className="w-14 text-xs border border-my-border-gray rounded px-1 py-1 bg-white text-my-gray hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-my-blue text-right"
      />
   );
}
