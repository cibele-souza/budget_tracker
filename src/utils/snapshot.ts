import type {
   Budget,
   BudgetTrackSnapshot,
   Import,
   Transaction,
   ClassificationRule,
} from '../types';

const SCHEMA_VERSION = 1;

export function exportSnapshot(
   transactions: Transaction[],
   budgets: Budget[],
   imports: Import[],
   rules: ClassificationRule[],
): void {
   const snapshot: BudgetTrackSnapshot = {
      meta: {
         schemaVersion: SCHEMA_VERSION,
         source: 'budgettrack',
         exportedAt: new Date().toISOString(),
         counts: {
            transactions: transactions.length,
            budgets: budgets.length,
            imports: imports.length,
            rules: rules.length,
         },
      },
      data: { transactions, budgets, imports, rules },
   };

   const json = JSON.stringify(snapshot, null, 2);
   const blob = new Blob([json], { type: 'application/json' });
   const url = URL.createObjectURL(blob);

   const date = new Date().toISOString().slice(0, 10);
   const filename = `budgettrack-${date}.json`;

   const anchor = document.createElement('a');
   anchor.href = url;
   anchor.download = filename;
   anchor.click();

   URL.revokeObjectURL(url);
}

export function validateSnapshot(json: unknown): BudgetTrackSnapshot {
   // Check 1: basic object shape
   if (typeof json !== 'object' || json === null) {
      throw new Error('Invalid file: not a JSON object.');
   }

   const snapshot = json as Record<string, unknown>;

   // Check 2: source identifier
   const meta = snapshot.meta as Record<string, unknown> | undefined;
   if (!meta || meta.source !== 'budgettrack') {
      throw new Error(
         "Invalid file: this doesn't appear to be a BudgetTrack backup.",
      );
   }

   // Check 3: schema version
   if (meta.schemaVersion !== SCHEMA_VERSION) {
      throw new Error(
         `Incompatible version: expected schema v${SCHEMA_VERSION}, got v${meta.schemaVersion}.`,
      );
   }

   // Check 4: data arrays exist
   const data = snapshot.data as Record<string, unknown> | undefined;
   if (
      !data ||
      !Array.isArray(data.transactions) ||
      !Array.isArray(data.budgets) ||
      !Array.isArray(data.imports)
   ) {
      throw new Error('Invalid file: missing or corrupted data arrays.');
   }

   // rules array is optional — older snapshots won't have it (seeded from defaults on restore)
   if (data.rules !== undefined && !Array.isArray(data.rules)) {
      throw new Error('Invalid file: corrupted rules data.');
   }

   // Check 5: counts match actual array lengths
   const counts = meta.counts as Record<string, number> | undefined;
   if (
      !counts ||
      counts.transactions !== data.transactions.length ||
      counts.budgets !== data.budgets.length ||
      counts.imports !== data.imports.length
   ) {
      throw new Error(
         "Invalid file: data counts don't match declared counts. File may be corrupted.",
      );
   }

   return json as BudgetTrackSnapshot;
}

export function parseSnapshotFile(file: File): Promise<BudgetTrackSnapshot> {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
         try {
            const json = JSON.parse(e.target?.result as string);
            const snapshot = validateSnapshot(json);
            resolve(snapshot);
         } catch (err) {
            reject(
               err instanceof Error ? err : new Error('Failed to parse file.'),
            );
         }
      };

      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.readAsText(file);
   });
}
