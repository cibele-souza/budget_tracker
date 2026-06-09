// ── Categories ──────────────────────────────────────────────────────────────

export const CATEGORIES = [
   'Revenu',
   'Logement',
   'Electricité',
   'Internet',
   'Ménage Mnt',
   'Mobile',
   'Véhicule',
   'Supermarché',
   'Restaurant',
   'Cantine',
   'Transport',
   'Santé',
   'Coaching Psy',
   'Achat',
   'Loisir Voyage',
   'Sport',
   'Education',
   'Chien',
   'Administratif',
   'Retrait',
   'Rendement',
   'Emprunt',
   'Intercompte',
   'Impôt',
   'Real BR',
   'Non classé',
] as const;

export type Category = (typeof CATEGORIES)[number];

// ── Transaction ──────────────────────────────────────────────────────────────

export interface Transaction {
   id: string;
   date: string; // ISO format: "2025-03-14"
   description: string;
   amount: number; // positive = income, negative = expense
   category: Category;
   bankCategory: string; // raw category string from the bank file
   bankName: string; // e.g. "BoursoBank", "Hello Bank"
   importId: string;
}

// ── Import ───────────────────────────────────────────────────────────────────

export interface Import {
   id: string;
   filename: string;
   uploadedAt: string; // ISO format
   transactionCount: number;
   initialDate: string; // ISO format
   finalDate: string; // ISO format
   bankName: string; // bank name
}

// ── Budget ───────────────────────────────────────────────────────────────────

export interface Budget {
   category: Category;
   defaultValue: number;
   monthlyOverrides: Record<string, number>; // e.g. { "2025-01": 1200 }
}
