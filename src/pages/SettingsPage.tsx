import { useRef, useState } from 'react';
import type {
   Budget,
   BudgetTrackSnapshot,
   ClassificationRule,
   Import,
   Transaction,
} from '../types';
import { exportSnapshot, parseSnapshotFile } from '../utils/snapshot';
import {
   connectToDrive,
   disconnectFromDrive,
   isConnectedToDrive,
} from '../utils/googleDrive';
import RulesManager from '../components/RulesManager';

interface SettingsPageProps {
   transactions: Transaction[];
   budgets: Budget[];
   imports: Import[];
   onRestore: (snapshot: BudgetTrackSnapshot) => void;
   lastSyncedAt: string | null;
   onManualSave: () => Promise<void>;
   rules: ClassificationRule[];
   onRulesChange: (rules: ClassificationRule[]) => void;
}

type ImportState =
   | { status: 'idle' }
   | { status: 'preview'; snapshot: BudgetTrackSnapshot }
   | { status: 'error'; message: string }
   | { status: 'success' };

export default function SettingsPage({
   transactions,
   budgets,
   imports,
   onRestore,
   lastSyncedAt,
   onManualSave,
   rules,
   onRulesChange,
}: SettingsPageProps) {
   const [exportSuccess, setExportSuccess] = useState(false);
   const [importState, setImportState] = useState<ImportState>({
      status: 'idle',
   });
   const [driveConnected, setDriveConnected] = useState(isConnectedToDrive());
   const [driveError, setDriveError] = useState<string | null>(null);
   const [driveSaveSuccess, setDriveSaveSuccess] = useState(false);
   const [showRulesManager, setShowRulesManager] = useState(false);

   const fileInputRef = useRef<HTMLInputElement>(null);

   function handleExport() {
      exportSnapshot(transactions, budgets, imports, rules);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
   }

   async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
         const snapshot = await parseSnapshotFile(file);
         setImportState({ status: 'preview', snapshot });
      } catch (err) {
         setImportState({
            status: 'error',
            message: err instanceof Error ? err.message : 'Unknown error.',
         });
      }

      // Reset file input so the same file can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
   }

   function handleConfirmRestore() {
      if (importState.status !== 'preview') return;
      onRestore(importState.snapshot);
      setImportState({ status: 'success' });
      setTimeout(() => setImportState({ status: 'idle' }), 4000);
   }

   function handleCancelRestore() {
      setImportState({ status: 'idle' });
   }

   // Handler functions that manages Google Drive connection
   async function handleConnectDrive() {
      setDriveError(null);
      try {
         await connectToDrive();
         setDriveConnected(true);
      } catch (err) {
         setDriveError(
            err instanceof Error
               ? err.message
               : 'Failed to connect to Google Drive.',
         );
      }
   }

   function handleDisconnectDrive() {
      disconnectFromDrive();
      setDriveConnected(false);
   }

   async function handleManualSave() {
      setDriveError(null);
      try {
         await onManualSave();
         setDriveSaveSuccess(true);
         setTimeout(() => setDriveSaveSuccess(false), 3000);
      } catch (err) {
         setDriveError(
            err instanceof Error
               ? err.message
               : 'Échec de la sauvegarde sur Google Drive.',
         );
      }
   }

   if (showRulesManager) {
      return (
         <RulesManager
            rules={rules}
            onSave={(updatedRules) => {
               onRulesChange(updatedRules);
               setShowRulesManager(false);
            }}
            onBack={() => setShowRulesManager(false)}
         />
      );
   }

   return (
      <div className="max-w-2xl mx-auto px-4 py-8">
         <h1 className="text-2xl font-semibold mb-8">Configurations</h1>

         {/* Google Drive sync section */}
         <section className="mb-10">
            <h2 className="text-lg font-medium mb-2">Connexion Google Drive</h2>
            <p className="text-sm text-my-gray mb-4">
               Connectez-vous sur Google Drive pour enregistrer vos données
               automatiquement et pouvoir les accéder depuis n'importe quel
               appareil.
            </p>

            {driveConnected ? (
               <div>
                  <p className="text-sm text-my-green mb-2">
                     ✓ Connecté à Google Drive
                  </p>
                  {lastSyncedAt && (
                     <p className="text-sm text-my-gray mb-4">
                        Dernière sauvegarde:{' '}
                        {new Date(lastSyncedAt).toLocaleString()}
                     </p>
                  )}
                  <div className="flex gap-3">
                     <button
                        onClick={handleManualSave}
                        className="px-4 py-2 bg-gray-600 opacity-80 text-white rounded hover:opacity-100 transition-opacity text-sm"
                     >
                        Sauvegarder to Google Drive
                     </button>
                     <button
                        onClick={handleDisconnectDrive}
                        className="px-4 py-2 border border-my-border-gray text-my-gray rounded hover:border-my-red hover:text-my-red transition-colors text-sm"
                     >
                        Déconnecter
                     </button>
                     {driveSaveSuccess && (
                        <p className="mt-3 text-sm text-my-green">
                           ✓ Sauvegarde réussie.
                        </p>
                     )}
                  </div>
               </div>
            ) : (
               <div>
                  <button
                     onClick={handleConnectDrive}
                     className="px-4 py-2 bg-my-blue text-white rounded hover:opacity-90 transition-opacity text-sm"
                  >
                     Connecter à Google Drive
                  </button>
                  {driveError && (
                     <p className="mt-3 text-sm text-my-red">✗ {driveError}</p>
                  )}
               </div>
            )}
         </section>

         <div className="border-t border-my-border-gray mb-4" />

         {/* Export section */}
         <section className="mb-10">
            <h2 className="text-lg font-medium mb-2">Exporter les données</h2>
            <p className="text-sm text-my-gray mb-2">
               Exporter une sauvegarde complète de vos transactions, budgets et
               imports en format JSON.
            </p>
            <p className="text-sm text-my-gray mb-4 italic">
               (Sauvegarde indépendante de Google Drive).
            </p>
            <button
               onClick={handleExport}
               className="px-4 py-2 bg-gray-600 opacity-80 text-white rounded hover:opacity-100 transition-opacity text-sm"
            >
               Exporter une sauvegarde manuelle
            </button>
            {exportSuccess && (
               <p className="mt-3 text-sm text-my-green">
                  ✓ Exportation réussie.
               </p>
            )}
         </section>

         <div className="border-t border-my-border-gray mb-4" />

         {/* Import section */}
         <section className="mb-10">
            <h2 className="text-lg font-medium mb-2">
               Restaurer à partir d'une sauvegarde
            </h2>
            <p className="text-sm text-my-gray mb-4">
               Remplacez toutes les données actuelles par une sauvegarde
               précédemment exportée.
            </p>

            {/* File picker — only show when idle or error */}
            {(importState.status === 'idle' ||
               importState.status === 'error') && (
               <>
                  <button
                     onClick={() => fileInputRef.current?.click()}
                     className="px-4 py-2 bg-gray-600 opacity-80 text-white rounded hover:opacity-100 transition-opacity text-sm"
                  >
                     Choisir le fichier de sauvegarde
                  </button>
                  <input
                     ref={fileInputRef}
                     type="file"
                     accept=".json"
                     className="hidden"
                     onChange={handleFileChange}
                  />
                  {importState.status === 'error' && (
                     <p className="mt-3 text-sm text-my-red">
                        ✗ {importState.message}
                     </p>
                  )}
               </>
            )}

            {/* Preview card */}
            {importState.status === 'preview' && (
               <div className="border border-my-border-gray rounded-lg p-4 bg-my-bg-light-gray">
                  <p className="text-sm font-medium mb-3">
                     Vérifiez avant de restaurer :
                  </p>
                  <ul className="text-sm text-my-gray space-y-1 mb-4">
                     <li>
                        Exportée le :{' '}
                        <span className="text-gray-900">
                           {new Date(
                              importState.snapshot.meta.exportedAt,
                           ).toLocaleString()}
                        </span>
                     </li>
                     <li>
                        Transactions (nb de lignes) :{' '}
                        <span className="text-gray-900">
                           {importState.snapshot.meta.counts.transactions}
                        </span>
                     </li>
                     <li>
                        Budgets (nb de catégories) :{' '}
                        <span className="text-gray-900">
                           {importState.snapshot.meta.counts.budgets}
                        </span>
                     </li>
                     <li>
                        Importations bancaires (nb de fichiers importés) :{' '}
                        <span className="text-gray-900">
                           {importState.snapshot.meta.counts.imports}
                        </span>
                     </li>
                  </ul>
                  <p className="text-sm text-my-red mb-4">
                     ⚠ Cela remplacera définitivement toutes vos données
                     actuelles.
                  </p>
                  <div className="flex gap-3">
                     <button
                        onClick={handleConfirmRestore}
                        className="px-4 py-2 bg-my-blue text-white rounded hover:opacity-90 transition-opacity text-sm"
                     >
                        OK
                     </button>
                     <button
                        onClick={handleCancelRestore}
                        className="px-4 py-2 border border-my-border-gray text-my-gray rounded hover:border-my-blue hover:text-my-blue transition-colors text-sm"
                     >
                        Annuler
                     </button>
                  </div>
               </div>
            )}

            {/* Success message */}
            {importState.status === 'success' && (
               <p className="text-sm text-my-green">
                  ✓ Données restaurées avec succès
               </p>
            )}
         </section>

         <div className="border-t border-my-border-gray mb-4" />

         {/* Classification rules section */}
         <section className="mb-10">
            <h2 className="text-lg font-medium mb-2">
               Règles de classification
            </h2>
            <p className="text-sm text-my-gray mb-4">
               Gérez les règles utilisées pour classifier automatiquement vos
               transactions lors de l'importation.
            </p>
            <button
               onClick={() => setShowRulesManager(true)}
               className="px-4 py-2 bg-gray-600 opacity-80 text-white rounded hover:opacity-100 transition-opacity text-sm"
            >
               Gérer les règles de classification
            </button>
         </section>

         <div className="border-t border-my-border-gray" />
      </div>
   );
}
