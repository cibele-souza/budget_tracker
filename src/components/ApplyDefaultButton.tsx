interface ApplyDefaultButtonProps {
   onClick: () => void;
}

export default function ApplyDefaultButton({
   onClick,
}: ApplyDefaultButtonProps) {
   return (
      <button
         onClick={onClick}
         title="Appliquer la valeur par défaut aux mois non remplis"
         className="text-xs text-my-gray border border-gray-300 rounded px-2 py-1 hover:bg-gray-100 transition-colors whitespace-nowrap"
      >
         ✓
      </button>
   );
}
