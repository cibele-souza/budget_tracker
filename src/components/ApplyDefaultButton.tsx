interface ApplyDefaultButtonProps {
   onClick: () => void;
}

export default function ApplyDefaultButton({
   onClick,
}: ApplyDefaultButtonProps) {
   return (
      <button
         onClick={onClick}
         title="Fill empty months with default value"
         className="text-xs text-gray-500 border border-gray-300 rounded px-1 py-1 hover:bg-gray-100 transition-colors whitespace-nowrap"
      >
         Apply
      </button>
   );
}
