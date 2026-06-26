interface UnsavedChangesModalProps {
   onSaveAndBack: () => void;
   onDiscardAndBack: () => void;
   onDismiss: () => void;
}

export default function UnsavedChangesModal({
   onSaveAndBack,
   onDiscardAndBack,
   onDismiss,
}: UnsavedChangesModalProps) {
   return (
      <>
         {/* Backdrop */}
         <div className="fixed inset-0 bg-black/40 z-30" onClick={onDismiss} />
         {/* Modal card */}
         <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm pointer-events-auto">
               <h2 className="text-lg font-semibold mb-2">Unsaved changes</h2>
               <p className="text-sm text-my-gray mb-6">
                  You have unsaved changes to your classification rules. What
                  would you like to do?
               </p>
               <div className="flex gap-3 justify-end">
                  <button
                     onClick={onDiscardAndBack}
                     className="px-4 py-2 border border-my-border-gray text-my-gray rounded hover:border-my-red hover:text-my-red transition-colors text-sm"
                  >
                     Discard and go back
                  </button>
                  <button
                     onClick={onSaveAndBack}
                     className="px-4 py-2 bg-my-blue text-white rounded hover:opacity-90 transition-opacity text-sm"
                  >
                     Save and go back
                  </button>
               </div>
            </div>
         </div>
      </>
   );
}
