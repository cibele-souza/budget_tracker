import { v4 as uuidv4 } from 'uuid';
import type { Transaction } from '../types';
import type { RawRow } from './parseFile';
import { classifyTransaction } from './classify';

// ── Helpers ──────────────────────────────────────────────────────────────────

// Parses "30/04/2026" or "18-05-2026" → "2026-04-30"
function parseDate(raw: string): string {
   const cleaned = raw.trim();
   const parts = cleaned.replace(/-/g, '/').split('/');
   if (parts.length !== 3) return cleaned;
   const [day, month, year] = parts;
   return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Parses "-141,2" (FR) or "-3000.00" (EN) → -141.2
function parseAmount(raw: string | number): number {
   if (typeof raw === 'number') return raw;
   return parseFloat(raw.trim().replace(/\s/g, '').replace(',', '.'));
}

// ── Boursobank CSV normaliser ─────────────────────────────────────────────────

export function normaliseBourso(
   rows: RawRow[],
   importId: string,
): Transaction[] {
   return rows
      .filter((row) => row['dateOp'] && row['amount'])
      .map((row) => ({
         id: uuidv4(),
         date: parseDate(String(row['dateOp'])),
         description: String(row['label'] ?? '').trim(),
         amount: parseAmount(row['amount'] as string),
         category: classifyTransaction(
            String(row['label'] ?? '').trim(),
            String(row['category'] ?? '').trim(),
         ),
         bankCategory: String(row['category'] ?? '').trim(),
         bankName: 'BoursoBank',
         importId,
      }));
}

// ── Hello Bank XLS normaliser ────────────────────────────────────────────────

export function normaliseHelloBank(
   rows: RawRow[],
   importId: string,
): Transaction[] {
   return rows
      .filter((row) => row['Date operation'] && row['Montant operation'])
      .map((row) => ({
         id: uuidv4(),
         date: parseDate(String(row['Date operation'])),
         description: String(row['Libelle operation'] ?? '').trim(),
         amount: parseAmount(row['Montant operation'] as string | number),
         category: classifyTransaction(
            String(row['Libelle operation'] ?? '').trim(),
            String(row['Sous Categorie operation'] ?? '').trim(),
         ),
         bankCategory: String(row['Sous Categorie operation'] ?? '').trim(),
         bankName: 'Hello Bank',
         importId,
      }));
}
