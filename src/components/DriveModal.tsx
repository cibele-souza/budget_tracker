import type { BudgetTrackSnapshot } from '../types';

type DriveModalState =
   | { case: 'notConnected' }
   | { case: 'connecting' }
   | { case: 'noFile' }
   | { case: 'fileFound'; snapshot: BudgetTrackSnapshot };

interface DriveModalProps {
   state: DriveModalState;
   onConnect: () => void;
   onContinueLocally: () => void;
   onLoadFromDrive: (snapshot: BudgetTrackSnapshot) => void;
   onKeepLocal: () => void;
   onDismiss: () => void;
}

function formatFrenchDate(isoString: string): string {
   return new Date(isoString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
   });
}

export default function DriveModal({
   state,
   onConnect,
   onContinueLocally,
   onLoadFromDrive,
   onKeepLocal,
   onDismiss,
}: DriveModalProps) {
   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-2">
         {/* Backdrop */}
         <div className="absolute inset-0 bg-black/40" />

         {/* Modal card */}
         <div
            className="relative bg-white rounded-xl shadow-xl w-full p-8 text-center"
            style={{ maxWidth: '500px' }}
         >
            {/* Case 1: not connected to Drive */}
            {state.case === 'notConnected' && (
               <>
                  <h2 className="text-xl font-semibold mb-2">
                     Bienvenue dans votre Budget Tracker !
                  </h2>
                  <p className="text-sm text-my-gray px-6 py-4 mb-2">
                     Souhaitez-vous connecter votre Google Drive pour
                     synchroniser vos données sur tous vos appareils, ou
                     préférez-vous utiliser l'application en local ?
                  </p>
                  <div className="flex gap-6 justify-center">
                     <button
                        onClick={onConnect}
                        className="px-4 py-2 bg-my-blue text-white rounded hover:opacity-90 transition-opacity text-sm"
                     >
                        Connecter à Google Drive
                     </button>
                     <button
                        onClick={onContinueLocally}
                        className="px-4 py-2 border border-my-border-gray text-my-gray rounded hover:border-my-blue hover:text-my-blue transition-colors text-sm"
                     >
                        Utiliser en local
                     </button>
                  </div>
               </>
            )}

            {/* Case 2: connecting to Drive */}
            {state.case === 'connecting' && (
               <>
                  <div className="flex justify-center mb-4">
                     <svg
                        className="animate-spin w-8 h-8 text-my-blue"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                     >
                        <circle
                           className="opacity-25"
                           cx="12"
                           cy="12"
                           r="10"
                           stroke="currentColor"
                           strokeWidth="4"
                        />
                        <path
                           className="opacity-75"
                           fill="currentColor"
                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                     </svg>
                  </div>
                  <h2 className="text-lg font-semibold mb-2">
                     Connexion en cours…
                  </h2>
                  <p className="text-sm text-my-gray">
                     Connexion à Google Drive et recherche d'une sauvegarde
                     existante…
                  </p>
               </>
            )}

            {/* Case 3: connected but no file found */}
            {state.case === 'noFile' && (
               <>
                  <h2 className="text-lg font-semibold mb-2">
                     Aucune sauvegarde trouvée
                  </h2>
                  <p className="text-sm text-my-gray mb-6">
                     Aucune sauvegarde n'a été trouvée sur votre Google Drive.
                     Budget Tracker en créera une automatiquement au fur et à
                     mesure de votre utilisation.
                  </p>
                  <button
                     onClick={onDismiss}
                     className="px-4 py-2 bg-my-blue text-white rounded hover:opacity-90 transition-opacity text-sm mx-auto block"
                  >
                     OK
                  </button>
               </>
            )}

            {/* Case 4: file found */}
            {state.case === 'fileFound' && (
               <>
                  <h2 className="text-lg font-semibold mb-2">
                     Sauvegarde trouvée sur Google Drive
                  </h2>
                  <p className="text-sm text-my-gray mb-4">
                     Une sauvegarde a été trouvée sur votre Google Drive.
                     <br />
                     Souhaitez-vous la charger ou conserver vos données locales
                     ?
                  </p>
                  <ul className="text-sm text-my-gray space-y-1 mb-4 bg-my-bg-light-gray rounded-lg p-3 text-left">
                     <li>
                        Exportée le :{' '}
                        <span className="text-gray-900">
                           {formatFrenchDate(state.snapshot.meta.exportedAt)}
                        </span>
                     </li>
                     <li>
                        Transactions (nb de lignes) :{' '}
                        <span className="text-gray-900">
                           {state.snapshot.meta.counts.transactions}
                        </span>
                     </li>
                     <li>
                        Budgets (nb de catégories) :{' '}
                        <span className="text-gray-900">
                           {state.snapshot.meta.counts.budgets}
                        </span>
                     </li>
                     <li>
                        Importations bancaires (nb de fichiers importés) :{' '}
                        <span className="text-gray-900">
                           {state.snapshot.meta.counts.imports}
                        </span>
                     </li>
                  </ul>
                  <p className="text-sm text-my-red font-style: italic mb-4">
                     ⚠ Cela remplacera définitivement vos données locales.
                  </p>
                  <div className="flex gap-3 justify-center">
                     <button
                        onClick={() => onLoadFromDrive(state.snapshot)}
                        className="px-4 py-2 bg-my-blue text-white rounded hover:opacity-90 transition-opacity text-sm"
                     >
                        Importer depuis Google Drive
                     </button>
                     <button
                        onClick={onKeepLocal}
                        className="px-4 py-2 border border-my-border-gray text-my-gray rounded hover:border-my-blue hover:text-my-blue transition-colors text-sm"
                     >
                        Garder les données locales
                     </button>
                  </div>
               </>
            )}
         </div>
      </div>
   );
}
